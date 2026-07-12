create or replace function public.request_delivery_label(
  p_location_name text,
  p_address_label text,
  p_section_name text
) returns text language sql immutable as $$
  select coalesce(nullif(trim(p_section_name), ''), nullif(trim(p_address_label), ''), nullif(trim(p_location_name), ''), 'Sem local');
$$;
