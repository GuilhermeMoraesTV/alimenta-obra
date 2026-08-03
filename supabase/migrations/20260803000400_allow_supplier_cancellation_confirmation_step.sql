begin;

alter table public.supplier_confirmations
  drop constraint if exists supplier_confirmations_step_check;

alter table public.supplier_confirmations
  add constraint supplier_confirmations_step_check
  check (step in (
    'confirmado',
    'producao',
    'saiu_entrega',
    'entregue',
    'cancelado_confirmado'
  ));

commit;
