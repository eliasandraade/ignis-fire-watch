# IGNIS Orbital — Plataforma Inteligente de Combate a Incêndios Florestais

**FIAP — Global Solution 2026 · Turma 1TDSPH**
Elias Sales de Freitas · RM561257

---

## Sobre o Projeto

IGNIS Orbital é um protótipo frontend de plataforma de inteligência territorial para detecção, monitoramento e resposta a incêndios florestais em Áreas de Proteção Ambiental do Ceará.

O sistema integra dados orbitais simulados (INPE/MODIS), geolocalização de áreas protegidas, gestão de incidentes, mobilização de brigadas e relatórios ESG — tudo em uma interface espacial projetada para uso em vídeo de pitch e apresentação acadêmica.

> **A RPPN Elias Andrade é usada como caso demonstrativo. Dados territoriais, coordenadas e métricas exibidas no protótipo são estimados/simulados até validação por base oficial.**

---

## Stack Técnica

| Camada | Tecnologia |
|---|---|
| Framework | React 18.3 + TypeScript 5.5 |
| Build | Vite 5.4 (SWC) |
| Estilo | TailwindCSS 3.4 + CSS Variables (OKLCH) |
| Componentes | shadcn/ui |
| Roteamento | React Router DOM 6.26 |
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
| `/gestor/aurora` | Aurora IA — chat de apoio à decisão |
| `/gestor/esg` | Relatório ESG (ODS 2/8/9/11/13/15) |

### Módulo Admin
| Rota | Tela |
|---|---|
| `/admin` | Painel administrativo — usuários e auditoria |

---

## Avisos de Protótipo

- **Aurora IA**: todas as respostas são simuladas e incluem o aviso *"Resposta simulada — protótipo demonstrativo"*. Não há integração real com nenhum modelo de linguagem.
- **Dados**: todas as áreas protegidas, incidentes, coordenadas e métricas são dados estimados/simulados para fins acadêmicos. Não representam dados oficiais de nenhum órgão governamental (SEMACE, IBAMA, ICMBio, Defesa Civil).
- **Autenticação**: o sistema aceita qualquer credencial — não há validação real de usuário ou senha.
- **AuroraChat**: disclaimer obrigatório em todas as respostas: "Sistema de IA demonstrativo — respostas simuladas para fins acadêmicos. Não representa integração real com modelos de linguagem. FIAP GS 2026."

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
│   └── ui/          # shadcn/ui (48 componentes, não modificados)
├── context/         # UserContext — perfil de acesso
├── data/            # Mock data centralizada (areas, incidents, reports…)
├── lib/             # Utilitários (geo.ts, utils.ts)
├── pages/
│   ├── admin/       # AdminPanelPage
│   ├── gestor/      # 13 telas do módulo gestor
│   ├── public/      # 4 telas públicas
│   └── shared/      # Splash, Login, SelectProfile, NotFound
├── router/          # createBrowserRouter (21 rotas)
└── types/           # domain.ts — todos os tipos TypeScript
```

---

## Deploy

**URL de produção:** https://ignis-fire-watch-main.vercel.app

Hospedado na Vercel com SPA rewrite via `vercel.json` — todas as 21 rotas respondem HTTP 200 em produção.

| Rota | Status produção |
|---|---|
| `/` | ✅ 200 |
| `/public` | ✅ 200 |
| `/public/map` | ✅ 200 |
| `/public/report` | ✅ 200 |
| `/gestor` | ✅ 200 |
| `/gestor/war-room` | ✅ 200 |
| `/gestor/aurora` | ✅ 200 |
| `/gestor/esg` | ✅ 200 |
| `/admin` | ✅ 200 |
| `/rota-inexistente` | ✅ 200 (React 404) |

---

*IGNIS Orbital — Conectando dados, salvando vidas.*
*FIAP Global Solution 2026 · Elias Sales de Freitas RM561257*
