# IGNIS Orbital — Chaveamento para API de Produção

## Visão Geral

O frontend IGNIS Orbital suporta dois modos de operação controlados por variáveis de ambiente Vite:

| Variável | Valor padrão | Produção |
|---|---|---|
| `VITE_USE_API` | `false` | `true` |
| `VITE_API_URL` | `http://localhost:8000` | domínio público da API no mesmo ambiente Railway |

Quando `VITE_USE_API=false`, todas as páginas funcionam com dados mock estáticos do diretório `src/data/`. Quando `true`, os hooks de dados usam `isApiEnabled()` para rotear chamadas para a API real na Railway.

## Hospedagem (Railway)

Desde 03/11/2026 o frontend roda **exclusivamente no Railway** (serviço `web`, ambientes staging e production). A antiga hospedagem na Vercel e a API em `ignis-api-production.up.railway.app` estão desativadas.

| Variável (serviço `web`) | staging / production |
|---|---|
| `VITE_USE_API` | `true` |
| `VITE_API_URL` | `https://${{api.RAILWAY_PUBLIC_DOMAIN}}` (domínio da API **do mesmo ambiente**) |

O Railway passa essas variáveis como *build args* do `Dockerfile`. Por isso, **qualquer mudança exige um novo build**: o Railway redeploya sozinho quando a variável muda. Se a URL estiver vazia, sem HTTPS ou com caminho, o build falha (`deploy/build-env.mjs`). A origem da API também entra no `connect-src` da CSP.

## Configuração local

Crie ou edite `.env.local` (fica no `.gitignore` e não é versionado):

```env
VITE_API_URL=http://localhost:8000
VITE_USE_API=true
```

## Voltar ao modo demonstrativo

Se a API ficar instável, a primeira opção é o *Redeploy* da versão anterior da API no Railway (RAILWAY-DEPLOYMENT §9).

Só com **decisão do proprietário**, colocar `VITE_USE_API=false` no serviço `web`. Remover também `VITE_API_URL`, porque o build recusa a URL sem o modo API. O frontend volta aos dados de `src/data/`, identificados como demonstrativos pelo banner e pelas tags, e não faz nenhuma chamada à API.

## Fluxos validados com API real (histórico, Railway antigo)


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
