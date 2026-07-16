# Legado

Esta pasta guarda artefatos historicos preservados para consulta. Eles nao sao a fonte de verdade da aplicacao em producao.

## Banco

- `docs/legacy/database/schema.sql`: modelo SQL inicial usado antes da consolidacao em migracoes Supabase.
- `docs/legacy/database/carga-dados-teste.sql`: carga de teste historica.

Para desenvolvimento, entrega e manutencao do produto, use `supabase/migrations/` como fonte oficial de schema, RLS, RPCs e evolucoes do banco.
