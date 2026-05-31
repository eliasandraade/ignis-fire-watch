# IGNIS Orbital — Links e Credenciais

**FIAP · Análise e Desenvolvimento de Sistemas · Global Solution 2026**  
**Elias Sales de Freitas RM561257 · João Vitor Bernardo RM566427**

---

## URLs de Produção

| Artefato | URL |
|---|---|
| **Frontend (principal)** | https://ignis-fire-watch.vercel.app |
| **Frontend (alternativa)** | https://ignis-fire-watch-main.vercel.app |
| **API Railway** | https://ignis-api-production.up.railway.app |
| **API Swagger UI** | https://ignis-api-production.up.railway.app/docs |
| **API Health** | https://ignis-api-production.up.railway.app/health |

---

## Repositórios

| Repositório | URL |
|---|---|
| **Frontend** | https://github.com/eliasandraade/ignis-fire-watch |
| **Backend** | https://github.com/eliasandraade/ignis-orbital-api |

---

## Credenciais de Demonstração

| Perfil | E-mail | Senha | Acesso |
|---|---|---|---|
| **Gestor Ambiental** | gestor@semace.ce.gov.br | gestor@123 | Dashboard gestor, Economia Espacial, War Room, Relatório ESG, Aurora IA |
| **Administrador** | admin@ignis-orbital.com | admin@123 | Tudo do gestor + painel admin + auditoria |

> **Nota:** Os perfis de "Agente de Campo" e "Órgão Público" podem ser criados via painel admin, mas não possuem seed pré-carregado na base demonstrativa.

---

## Variáveis de Ambiente (Vercel — produção)

```
VITE_USE_API=true
VITE_API_URL=https://ignis-api-production.up.railway.app
```

---

## Variáveis de Ambiente (Railway — backend)

| Variável | Valor |
|---|---|
| `DATABASE_URL` | postgresql+asyncpg://... (Railway internal) |
| `SECRET_KEY` | (gerado automaticamente no deploy) |
| `CORS_ORIGINS` | `["https://ignis-fire-watch.vercel.app","https://ignis-fire-watch-main.vercel.app","http://localhost:5173","http://localhost:8080"]` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | 480 |

---

## Rotas Notáveis para Demo

| Rota | Descrição |
|---|---|
| `/` | Splash / landing page |
| `/select-profile` | Seleção de perfil |
| `/public` | Dashboard público (sem login) |
| `/map` | Mapa público com áreas protegidas |
| `/register-report` | Envio de denúncia pública |
| `/report-status` | Consulta de protocolo |
| `/login` | Login gestor/admin |
| `/gestor` | Dashboard gestor |
| `/gestor/economia-espacial` | **🛰 Página Economia Espacial** |
| `/gestor/war-room` | War Room — incidentes críticos |
| `/gestor/aurora` | Aurora IA |
| `/gestor/esg` | Relatório ESG |
| `/admin` | Painel de administração |

---

*FIAP · Análise e Desenvolvimento de Sistemas · Global Solution 2026*  
*Elias Sales de Freitas RM561257 · João Vitor Bernardo RM566427*
