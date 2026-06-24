create table public.consolidation_documents (
  id uuid primary key default gen_random_uuid(),
  consolidation_id uuid not null references public.consolidations(id) on delete cascade,
  document_type text not null check (document_type in ('nota_fiscal')),
  storage_path text not null unique,
  original_name text not null,
  mime_type text not null default 'application/pdf',
  size_bytes bigint not null check (size_bytes > 0 and size_bytes <= 10485760),
  uploaded_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now()
);

create index consolidation_documents_consolidation_idx
  on public.consolidation_documents(consolidation_id, created_at desc);

alter table public.consolidation_documents enable row level security;

create policy "read permitted consolidation documents"
on public.consolidation_documents for select to authenticated
using (public.can_access_consolidation(consolidation_id));

create policy "supplier uploads permitted documents"
on public.consolidation_documents for insert to authenticated
with check (
  uploaded_by = (select auth.uid())
  and public.can_access_consolidation(consolidation_id)
);

create policy "uploader or admin removes documents"
on public.consolidation_documents for delete to authenticated
using (uploaded_by = (select auth.uid()) or public.is_admin());

grant select, insert, delete on public.consolidation_documents to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'supplier-documents',
  'supplier-documents',
  false,
  10485760,
  array['application/pdf']
)
on conflict (id) do update
set public = false,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

create policy "suppliers upload own document files"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'supplier-documents'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

create policy "suppliers and admins read document files"
on storage.objects for select to authenticated
using (
  bucket_id = 'supplier-documents'
  and (
    public.is_admin()
    or (storage.foldername(name))[1] = (select auth.uid())::text
  )
);

create policy "suppliers remove own document files"
on storage.objects for delete to authenticated
using (
  bucket_id = 'supplier-documents'
  and (
    public.is_admin()
    or (storage.foldername(name))[1] = (select auth.uid())::text
  )
);

create or replace function public.log_supplier_romaneio(
  p_consolidation_id uuid
) returns void language plpgsql security definer set search_path = '' as $$
begin
  if not public.can_access_consolidation(p_consolidation_id) then
    raise exception 'Usuario nao autorizado';
  end if;

  insert into public.audit_log (actor_id, action, entity, entity_id, payload)
  values (
    (select auth.uid()),
    'Romaneio de entrega gerado',
    'consolidacao',
    p_consolidation_id,
    jsonb_build_object('document_type', 'romaneio')
  );
end;
$$;

create or replace function public.audit_consolidation_document()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.audit_log (actor_id, action, entity, entity_id, payload)
  values (
    new.uploaded_by,
    'Nota fiscal anexada',
    'consolidacao',
    new.consolidation_id,
    jsonb_build_object('document_id', new.id, 'file_name', new.original_name)
  );
  return new;
end;
$$;

create trigger consolidation_documents_audit
after insert on public.consolidation_documents
for each row execute function public.audit_consolidation_document();

create or replace function public.confirm_supplier_step(
  p_consolidation_id uuid, p_step text, p_metadata jsonb default '{}'::jsonb
) returns void language plpgsql security definer set search_path = '' as $$
declare v_status text; v_supplier uuid;
begin
  select status, supplier_id into v_status, v_supplier
  from public.consolidations where id = p_consolidation_id for update;
  if not found then raise exception 'Consolidacao nao encontrada'; end if;
  if v_supplier <> (select auth.uid()) and not public.is_admin() then
    raise exception 'Usuario nao autorizado';
  end if;
  if not (
    (v_status = 'enviado' and p_step = 'confirmado')
    or (v_status = 'confirmado' and p_step = 'producao')
    or (v_status = 'producao' and p_step = 'saiu_entrega')
    or (v_status = 'saiu_entrega' and p_step = 'entregue')
  ) then raise exception 'Transicao de status invalida'; end if;

  insert into public.supplier_confirmations
    (consolidation_id, step, confirmed_by, metadata)
  values
    (p_consolidation_id, p_step, (select auth.uid()), coalesce(p_metadata, '{}'::jsonb))
  on conflict (consolidation_id, step) do nothing;
  update public.consolidations set status = p_step where id = p_consolidation_id;

  if p_step = 'entregue' then
    update public.meal_requests mr
    set status = 'entregue', updated_by = (select auth.uid())
    where exists (
      select 1 from public.consolidation_items ci
      where ci.consolidation_id = p_consolidation_id
        and ci.meal_request_id = mr.id
    );
  end if;

  insert into public.audit_log (actor_id, action, entity, entity_id, payload)
  values (
    (select auth.uid()), 'Fornecedor registrou etapa', 'consolidacao',
    p_consolidation_id, jsonb_build_object('step', p_step)
  );
end;
$$;

revoke all on function public.log_supplier_romaneio(uuid) from public;
grant execute on function public.log_supplier_romaneio(uuid) to authenticated;

do $$
begin
  alter publication supabase_realtime add table public.consolidation_documents;
exception when duplicate_object then null;
end $$;
