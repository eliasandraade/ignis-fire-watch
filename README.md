# IGNIS Orbital — interface web

**IGNIS Orbital by Andrade Systems.** Interface da plataforma de monitoramento de focos de calor por
satélite e apoio à gestão de ocorrências ambientais. Backend:
[ignis-orbital-api](https://github.com/eliasandraade/ignis-orbital-api).

A interface **sempre** usa a API. Não há modo demonstrativo nem dados locais de exemplo: quando a
API não responde, as telas dizem que o serviço está temporariamente indisponível, nunca mostram
números substitutos. Os estados possíveis de qualquer dado são: dado real, sem registros, fonte não
configurada, serviço temporariamente indisponível ou funcionalidade não implementada.

---

## Áreas e navegação

| Área | Rotas | Quem acessa |
|---|---|---|
| Portal público | `/public`, `/public/map`, `/public/report`, `/public/report/status/:id` | qualquer pessoa |
| Operação | `/gestor` (painel), `/gestor/map`, `/gestor/reports`, `/gestor/mobilization`, `/gestor/incident/:id`, `/gestor/area/:id` | gestor, órgão, administrador |
| Resposta | `/gestor/war-room` (sala de crise), `/gestor/field` (operação de campo) | equipe de campo e acima |
| Admin Cockpit | `/admin`, `/admin/users`, `/admin/permissions`, `/admin/sources`, `/admin/jobs`, `/admin/api`, `/admin/audit`, `/admin/settings` | administrador |
| Conta | `/login`, `/conta/senha` | — / qualquer conta |

Os guards de rota só organizam a navegação: **cada endpoint da API verifica o papel no servidor**.
Contas com senha provisória são levadas a `/conta/senha` antes de qualquer outra tela (a API também
bloqueia tudo exceto `/auth/me` e `/auth/change-password`).

Fora da navegação operacional (código preservado, não empacotado): assistente "Aurora", relatório
ESG, economia espacial e ranking de risco — não têm fonte de dados ou metodologia validada. Ver
[docs/IGNIS/PRODUCT-PROFESSIONALIZATION.md](docs/IGNIS/PRODUCT-PROFESSIONALIZATION.md).

Horários são exibidos no fuso de Fortaleza (UTC−3); a API trabalha em UTC.

---

## Stack

React 18 + TypeScript, Vite, React Router 6 (lazy routes), TanStack Query, react-hook-form + zod,
Leaflet, lucide-react. Testes: Vitest (unidade) e Playwright (E2E contra a pilha real).

## Desenvolvimento

```bash
npm ci --ignore-scripts
cp .env.example .env    # VITE_API_URL=http://localhost:8000
npm run dev             # http://localhost:8080
```

Verificações:

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

E2E (pilha local FastAPI + PostGIS + build nginx, sem dados fictícios): rode
`deploy/local/validate.sh up` e `deploy/local/validate.sh e2e` no repositório da API.

## Deploy

Hospedagem exclusiva no **Railway** (serviço `web`, ambientes staging e production):

- `Dockerfile`: build Vite (Node 22) → nginx-unprivileged; escuta no `PORT` injetado pelo Railway.
- Build arg obrigatório `VITE_API_URL` (domínio público da API do mesmo ambiente). URL ausente,
  inválida, sem HTTPS ou não resolvida **falha o build** (`deploy/build-env.mjs`).
- `deploy/nginx/default.conf.template`: `/healthz`, fallback SPA, assets com hash em cache longo,
  CSP e headers de segurança.

```bash
docker build -t ignis-web --build-arg VITE_API_URL=http://localhost:8000 .
docker run --rm -p 8080:8080 ignis-web
```

Branches: [docs/IGNIS/BRANCH-STRATEGY.md](docs/IGNIS/BRANCH-STRATEGY.md).

---

© Andrade Systems. Os termos de licenciamento são definidos pelo proprietário.
