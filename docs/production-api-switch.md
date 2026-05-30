# IGNIS Orbital — Chaveamento para API de Produção

## Visão Geral

O frontend IGNIS Orbital suporta dois modos de operação controlados por variáveis de ambiente Vite:

| Variável | Valor padrão | Produção |
|---|---|---|
| `VITE_USE_API` | `false` | `true` |
| `VITE_API_URL` | *(vazio)* | `https://ignis-api-production.up.railway.app` |

Quando `VITE_USE_API=false`, todas as páginas funcionam com dados mock estáticos do diretório `src/data/`. Quando `true`, os hooks de dados usam `isApiEnabled()` para rotear chamadas para a API real na Railway.

## Estado Atual de Produção

- **Frontend (Vercel):** https://ignis-fire-watch.vercel.app
- **Backend (Railway):** https://ignis-api-production.up.railway.app
- **`VITE_USE_API`:** `true`
- **`VITE_API_URL`:** `https://ignis-api-production.up.railway.app`

## Configuração Local

Crie ou edite `ignis-fire-watch-main/.env.local`:

```env
VITE_API_URL=https://ignis-api-production.up.railway.app
VITE_USE_API=true
```

O arquivo `.env.local` está no `.gitignore` e não é versionado.

## Configuração no Vercel

As variáveis estão definidas como **Environment Variables** no projeto `ignis-fire-watch` para o ambiente `Production`. Para atualizar:

```bash
vercel env rm VITE_USE_API production
echo "true" | vercel env add VITE_USE_API production

vercel env rm VITE_API_URL production
echo "https://ignis-api-production.up.railway.app" | vercel env add VITE_API_URL production
```

Após alterar variáveis, é necessário redeployar:

```bash
vercel --prod
```

## Rollback para Mock

Caso a API de produção fique instável:

1. Altere `VITE_USE_API` para `false` no Vercel:
   ```bash
   vercel env rm VITE_USE_API production
   echo "false" | vercel env add VITE_USE_API production
   vercel --prod
   ```
2. O frontend voltará a usar dados mock. Nenhuma chamada à Railway será feita.
3. Localmente, basta alterar `.env.local` e reiniciar o servidor de desenvolvimento.

## Fluxos Validados com API Real

Os seguintes fluxos foram testados com `VITE_USE_API=true` apontando para Railway:

| Fluxo | Endpoint | Status |
|---|---|---|
| Submissão de denúncia pública | `POST /api/v1/reports` | ✓ 201 |
| Consulta de protocolo | `GET /api/v1/reports/lookup?protocol=...` | ✓ 200 |
| Login gestor | `POST /api/v1/auth/login` | ✓ 200 |
| Dashboard gestor (áreas + incidentes) | `GET /api/v1/protected-areas` + `GET /api/v1/incidents` | ✓ 200 |
| Central de denúncias | `GET /api/v1/reports` | ✓ 200 |
| Validar denúncia | `PATCH /api/v1/reports/:id/validate` | ✓ 200 |
| Converter em incidente | `POST /api/v1/reports/:id/convert-to-incident` | ✓ 201 |
| War Room (incidente crítico + área + timeline) | `GET /api/v1/war-room` + `/protected-areas/:id` + `/incidents/:id/timeline` | ✓ 200 |
| Mobilização (equipes + recursos) | `GET /api/v1/teams` + `GET /api/v1/resources` | ✓ 200 |
| Painel Admin (usuários + auditoria) | `GET /api/v1/admin/users` + `GET /api/v1/admin/audit-logs` | ✓ 200 |
| Login admin | `POST /api/v1/auth/login` (admin@ignis-orbital.com) | ✓ 200 |

## Arquitetura de Chaveamento

O ponto central é `src/services/api/client.ts`:

```typescript
export function isApiEnabled(): boolean {
  return import.meta.env.VITE_USE_API === 'true';
}
```

Cada hook de dados (ex: `useIncidents`, `useWarRoom`, `useProtectedAreas`) verifica `isApiEnabled()` para decidir entre chamada real e dado mock. O adapter correspondente normaliza a resposta da API para o tipo de domínio (`src/types/domain.ts`).

## Observações

- O JWT de autenticação é salvo em `localStorage` sob as chaves `ignis_token` e `ignis_user`.
- O estado de perfil do usuário é mantido apenas em memória React (`useState`); um reload de página requer novo login.
- Dados de áreas protegidas na War Room são buscados diretamente da API (`GET /api/v1/protected-areas/:id`) quando em modo API, pois os IDs UUID da Railway não coincidem com os IDs mock.
