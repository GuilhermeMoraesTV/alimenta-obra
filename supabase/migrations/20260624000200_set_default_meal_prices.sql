update public.meal_types
set unit_price = case name
  when 'Marmita Campo' then 18.50
  when 'Buffer Almoco' then 22.00
  when 'Jantar' then 20.00
  else unit_price
end
where unit_price = 0;
