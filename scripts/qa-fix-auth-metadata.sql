begin;

update auth.users
set raw_user_meta_data = jsonb_build_object(
      'sub', id::text,
      'email', email,
      'email_verified', true,
      'phone_verified', false,
      'name', coalesce(raw_user_meta_data ->> 'name', email),
      'team', raw_user_meta_data ->> 'team'
    ),
    raw_app_meta_data = jsonb_build_object(
      'provider', 'email',
      'providers', jsonb_build_array('email')
    ),
    aud = 'authenticated',
    role = 'authenticated',
    email_confirmed_at = coalesce(email_confirmed_at, now()),
    updated_at = now()
where email in (
  'admin@admin.com',
  'encarregado.campo@teste.com',
  'encarregado.canteiro@teste.com',
  'encarregado.escritorio@teste.com',
  'encarregado.noite@teste.com',
  'fornecedor.marmita@teste.com',
  'fornecedor.buffet@teste.com',
  'fornecedor.janta@teste.com'
);

update auth.identities i
set identity_data = jsonb_build_object(
      'sub', u.id::text,
      'email', u.email,
      'email_verified', false,
      'phone_verified', false,
      'name', coalesce(u.raw_user_meta_data ->> 'name', u.email),
      'team', u.raw_user_meta_data ->> 'team'
    ),
    provider_id = u.id::text,
    provider = 'email',
    updated_at = now()
from auth.users u
where i.user_id = u.id
  and u.email in (
    'admin@admin.com',
    'encarregado.campo@teste.com',
    'encarregado.canteiro@teste.com',
    'encarregado.escritorio@teste.com',
    'encarregado.noite@teste.com',
    'fornecedor.marmita@teste.com',
    'fornecedor.buffet@teste.com',
    'fornecedor.janta@teste.com'
  );

commit;
