# IGNIS Orbital — Plataforma Inteligente de Combate a Incêndios Florestais

**FIAP — Global Solution 2026 · Turma 1TDSPH**
Elias Sales de Freitas · RM561257
João Vitor Bernardo · RM566427

---

## Sobre o Projeto

IGNIS Orbital é um protótipo frontend de plataforma de inteligência territorial para detecção, monitoramento e resposta a incêndios florestais em Áreas de Proteção Ambiental do Ceará.

O sistema integra dados orbitais simulados (INPE/MODIS), geolocalização de áreas protegidas, gestão de incidentes, mobilização de brigadas e relatórios ESG — tudo em uma interface espacial projetada para uso em vídeo de pitch e apresentação acadêmica.

> **A RPPN Elias Andrade é usada como caso demonstrativo. Dados territoriais, coordenadas e métricas exibidas no protótipo são estimados/simulados até validação por base oficial.**

---

## Avisos de Protótipo

- **Dados simulados:** todas as áreas protegidas, incidentes, coordenadas e métricas são dados estimados/simulados para fins acadêmicos. Não representam dados oficiais de nenhum órgão governamental (SEMACE, IBAMA, ICMBio, Defesa Civil).
- **Autenticação:** o sistema aceita qualquer credencial — não há validação real de usuário ou senha.
- **Aurora IA:** todas as respostas são simuladas com aviso obrigatório *"Sistema de IA demonstrativo — respostas simuladas para fins acadêmicos."* Não há integração real com nenhum modelo de linguagem.
- **Banco de dados:** não há persistência real. Dados são mantidos em memória (React state) e/ou sessionStorage durante a sessão do navegador.
- **Integrações externas:** nenhuma integração com APIs governamentais (INPE, CEMADEN, SEMACE) ou serviços externos está ativa em produção.

---

## Stack Técnica

| Camada | Tecnologia |
|---|---|
| Framework | React 18.3 + TypeScript 5.5 |
| Build | Vite 5.4 (SWC) |
| Estilo | TailwindCSS 3.4 + CSS Variables (OKLCH) |
| Componentes | shadcn/ui (Radix UI) |
| Roteamento | React Router DOM 6 (lazy loading + guards de perfil) |
| Mapas | react-leaflet 4 + Leaflet |
| Gráficos | Recharts 2.12 |
| Animações | Framer Motion |
| Deploy | Vercel |

---

## Telas Implementadas (21 screens)

### Fluxo Público
| Rota | Tela |
|---|---|
| `/` | Splash — animação de entrada IGNIS |
| `/login` | Login — aceita qualquer credencial |
| `/select-profile` | Seleção de perfil de acesso |
| `/public` | Dashboard público — alertas e status |
| `/public/map` | Mapa público de incêndios ativos |
| `/public/report` | Formulário de denúncia cidadã |
| `/public/report/status/:id` | Acompanhamento de denúncia |

### Módulo Gestor / Operacional
| Rota | Tela |
|---|---|
| `/gestor` | Dashboard do gestor |
| `/gestor/map` | Mapa Orbital (Leaflet, dark tiles) |
| `/gestor/incident/:id` | Incidente ativo — timeline e evidências |
| `/gestor/reports` | Central de denúncias |
| `/gestor/reports/:id` | Validação individual de denúncia |
| `/gestor/war-room` | War Room — tela fullscreen de crise |
| `/gestor/mobilization` | Mobilização de equipes e recursos |
| `/gestor/field` | Operação de campo (mobile-first 390px) |
| `/gestor/area/:id` | Detalhe de área protegida |
| `/gestor/ranking` | Ranking de risco das áreas |
| `/gestor/aurora` | Aurora — chat de apoio à decisão |
| `/gestor/esg` | Relatório ESG (ODS 2/8/9/11/13/15) |

### Módulo Admin
| Rota | Tela |
|---|---|
| `/admin` | Painel administrativo — usuários e auditoria |

---

## Controle de Acesso (Protótipo)

O sistema implementa guards de rota leves para simular controle de acesso:

| Perfil | Acesso |
|---|---|
| Admin | Total — todas as rotas |
| Gestor | Painel gestor completo |
| Analista / Órgão | Painel gestor completo |
| Campo | Operação em Campo e War Room |
| Público | Portal público de denúncias |

Sem perfil selecionado, o sistema redireciona para `/select-profile`.

---

## Como Rodar Localmente

```bash
npm install
npm run dev
# Acesse http://localhost:8080
```

```bash
npm run build   # build de produção
npm run preview # preview do build
```

---

## Estrutura do Projeto

```
src/
├── components/
│   ├── gestor/      # Componentes do módulo gestor
│   ├── layouts/     # GestorLayout, PublicLayout
│   ├── shared/      # OrbitalMap, AuroraChat, StatusBadge, etc.
│   └── ui/          # shadcn/ui (Radix UI)
├── context/         # UserContext — perfil e helpers de permissão
├── data/            # Mock data centralizada (areas, incidents, reports…)
├── lib/             # Utilitários (geo.ts, utils.ts)
├── pages/
│   ├── admin/       # AdminPanelPage
│   ├── gestor/      # 13 telas do módulo gestor
│   ├── public/      # 4 telas públicas
│   └── shared/      # Splash, Login, SelectProfile, NotFound
├── router/          # createBrowserRouter (21 rotas) + guards de perfil
└── types/           # domain.ts — todos os tipos TypeScript
docs/
└── backend-roadmap.md  # Arquitetura planejada para o backend
```

---

## Deploy

**URL de produção:** https://ignis-fire-watch-main.vercel.app

Hospedado na Vercel com SPA rewrite via `vercel.json` — todas as rotas respondem HTTP 200 em produção.

---

## Roadmap Backend

Ver [`docs/backend-roadmap.md`](docs/backend-roadmap.md) para a arquitetura planejada do backend (FastAPI + PostgreSQL + PostGIS).

---

*IGNIS Orbital — Conectando dados, salvando vidas.*
*FIAP Global Solution 2026 · Elias Sales de Freitas RM561257 · João Vitor Bernardo RM566427*
