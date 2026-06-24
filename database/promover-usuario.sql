-- Execute no SQL Editor depois de criar os usuarios em Authentication > Users.
-- Troque os e-mails antes de executar.

update public.profiles
set role = 'admin'
where email = 'admin@seudominio.com';

update public.profiles
set role = 'fornecedor'
where email = 'fornecedor@seudominio.com';

select id, name, email, role, active
from public.profiles
order by role, name;
