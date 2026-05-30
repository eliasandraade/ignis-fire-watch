# IGNIS Orbital — Documentação de Entrega

**FIAP · Análise e Desenvolvimento de Sistemas · Global Solution 2026**

| | |
|---|---|
| **Aluno 1** | Elias Sales de Freitas — RM561257 |
| **Aluno 2** | João Vitor Bernardo — RM566427 |
| **Turma** | ADS — FIAP GS 2026 |
| **Data** | 2026-05-30 |

---

## Links de Entrega

| Artefato | URL |
|---|---|
| **Frontend (Produção)** | https://ignis-fire-watch.vercel.app |
| **API (Railway)** | https://ignis-api-production.up.railway.app |
| **Repositório Frontend** | https://github.com/eliasandraade/ignis-fire-watch |
| **Repositório Backend** | https://github.com/eliasandraade/ignis-orbital-api |
| **Documentação API** | https://ignis-api-production.up.railway.app/docs |

---

## Credenciais de Demonstração

| Perfil | E-mail | Senha |
|---|---|---|
| Gestor Ambiental | gestor@semace.ce.gov.br | gestor@123 |
| Administrador | admin@ignis-orbital.com | admin@123 |

---

## O que é o IGNIS Orbital?

O **IGNIS Orbital** é uma plataforma de inteligência espacial ambiental que transforma dados geoespaciais e orbitais em decisão operacional para proteção de áreas ambientais protegidas.

### Conexão com a Economia Espacial

O projeto se posiciona como **camada de aplicação da economia espacial**:

1. **Infraestrutura orbital** (satélites de observação da Terra, sensoriamento remoto) gera dados ambientais em escala global.
2. **Camada digital** (PostGIS, APIs geoespaciais, processamento de dados orbitais) transforma dados brutos em informação estruturada.
3. **Camada operacional** (War Room, denúncias, equipes, recursos) converte informação em decisão e ação.
4. **Valor gerado** (prevenção de danos, resposta rápida, redução de custos, relatórios ESG) fecha o ciclo da economia espacial.

O IGNIS Orbital não é apenas um sistema ambiental — é uma demonstração de como a infraestrutura espacial pode ser acessada como serviço para gerar valor público e ambiental.

---

## Stack Técnica

### Frontend
| Camada | Tecnologia |
|---|---|
| Framework | React 18.3 + TypeScript 5.5 |
| Build | Vite 5.4 (SWC) |
| Estilo | TailwindCSS 3.4 + CSS Variables (OKLCH) |
| Componentes | shadcn/ui (Radix) |
| Roteamento | React Router DOM 6 — lazy loading |
| Mapas | react-leaflet 4 + Leaflet |
| Gráficos | Recharts 2.12 |
| Animações | Framer Motion |
| Deploy | Vercel |

### Backend
| Camada | Tecnologia |
|---|---|
| Framework | FastAPI + Python 3.12 |
| Banco de dados | PostgreSQL 16 + PostGIS 3.4 |
| ORM | SQLAlchemy 2 Async |
| Autenticação | PyJWT (JWT HS256) |
| Deploy | Railway |
| Documentação | Swagger UI (/docs) |

---

## Funcionalidades Principais

### Público
- Dashboard ambiental com áreas protegidas, alertas e dados geoespaciais
- Mapa orbital com visualização de áreas protegidas (GeoJSON/PostGIS)
- Envio de denúncias ambientais com protocolo automático
- Consulta de protocolo de denúncia

### Gestor Ambiental
- Dashboard com métricas em tempo real (API Railway)
- Central de Denúncias com validação e conversão em incidente
- War Room — sala de situação para incidentes críticos
- Mapa Orbital com dados reais de áreas protegidas
- Mobilização — gestão de equipes, recursos e missões
- Ranking de Risco por área protegida
- Aurora IA — análise rule-based e chat ambiental
- Relatório ESG com gráficos de incidentes e focos de calor
- **🛰 Economia Espacial** — cadeia de valor orbital, fontes, métricas e roadmap de integração

### Administrador
- Painel de usuários e auditoria
- Gestão de acessos

---

## Economia Espacial — Seção Dedicada

A rota `/gestor/economia-espacial` contém 8 blocos que evidenciam explicitamente como o projeto se conecta à economia espacial:

1. **Hero** — posicionamento do IGNIS como aplicação da economia espacial
2. **Cadeia de valor** — 7 etapas do dado orbital à resposta em campo
3. **Fontes orbitais** — NASA FIRMS, Sentinel, Landsat, INPE, MapBiomas, NOAA
4. **Métricas** — área monitorada, alertas, tempo economizado, custo evitado
5. **Maturidade** — RadarChart com 6 dimensões de capacidade espacial
6. **Casos de uso** — queimadas, desmatamento, defesa civil, ESG, fiscalização
7. **Modelo econômico** — as 4 camadas que geram valor
8. **Roadmap** — 5 fases de integração espacial planejadas

> Todos os dados marcados com asterisco (*) são simulados para fins acadêmicos. Áreas protegidas e incidentes usam dados reais da API quando disponíveis.

---

## Arquitetura de Integração Frontend/Backend

```
Vercel (React SPA)
  │
  ├── VITE_USE_API=true
  ├── VITE_API_URL=https://ignis-api-production.up.railway.app
  │
  └── API calls com JWT Bearer Token
        │
        └── Railway (FastAPI + PostgreSQL/PostGIS)
              ├── /api/v1/protected-areas  (PostGIS MULTIPOLYGON)
              ├── /api/v1/reports          (denúncias públicas)
              ├── /api/v1/incidents        (incidentes e timeline)
              ├── /api/v1/war-room         (sala de situação)
              ├── /api/v1/auth             (JWT login/me)
              ├── /api/v1/teams            (equipes de campo)
              ├── /api/v1/resources        (recursos operacionais)
              ├── /api/v1/aurora           (IA rule-based)
              ├── /api/v1/esg-reports      (relatórios ESG)
              └── /api/v1/admin            (usuários e auditoria)
```

---

## Variáveis de Ambiente (Produção)

```env
VITE_USE_API=true
VITE_API_URL=https://ignis-api-production.up.railway.app
```

---

*Projeto acadêmico — dados demonstrativos — fonte: "base demonstrativa acadêmica"*
*Não afirmamos integração em tempo real com NASA, INPE, ESA ou qualquer órgão oficial.*
