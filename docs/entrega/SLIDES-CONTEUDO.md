# IGNIS Orbital — Conteúdo para Slides

**FIAP GS 2026 · Elias Sales de Freitas RM561257 · João Vitor Bernardo RM566427**

---

## Slide 1 — Capa

**Título:** IGNIS Orbital  
**Subtítulo:** Plataforma de Inteligência Espacial Ambiental  
**Visual:** logo IGNIS + fundo escuro com gradiente orbital (azul → verde)  
**Rodapé:** FIAP · GS 2026 · RM561257 · RM566427

---

## Slide 2 — O Problema

**Título:** Proteção ambiental ainda é reativa

**Pontos:**
- Áreas protegidas cobrem 12% do território nacional
- Monitoramento depende de denúncias e fiscalização presencial
- Resposta a queimadas e desmatamento costuma chegar tarde
- Gestores públicos não têm ferramentas integradas de triagem e priorização

**Visual:** mapa do Ceará com áreas protegidas destacadas

---

## Slide 3 — A Solução

**Título:** IGNIS Orbital transforma dados em resposta

**O que entrega:**
- Plataforma de monitoramento ambiental com dados geoespaciais reais
- API completa com PostGIS — geometria de áreas protegidas, incidentes, denúncias
- War Room para coordenação de incidentes críticos
- Aurora IA para análise e priorização rule-based
- Relatórios ESG automáticos
- Seção dedicada à economia espacial

**Visual:** screenshot do dashboard gestor ou War Room

---

## Slide 4 — Conexão com Economia Espacial ⭐

**Título:** IGNIS é uma aplicação da economia espacial

**Frase central:**
> "O IGNIS Orbital pega dados gerados por infraestrutura orbital — satélites de observação da Terra — e transforma esses dados em protocolos, alertas, relatórios ESG e decisões operacionais."

**A cadeia de valor:**
```
Satélites → Coleta → Processamento → Detecção → Decisão → Campo → Impacto ESG
```

**Fontes orbitais potenciais:**
- NASA FIRMS · Sentinel/Copernicus · Landsat · INPE · MapBiomas · NOAA

**Visual:** screenshot da página /gestor/economia-espacial (cadeia de valor ou RadarChart)

---

## Slide 5 — Demonstração Técnica

**Título:** Stack completa em produção

**Frontend (Vercel):**
- React 18 + TypeScript + Vite
- 22 rotas lazy-loaded
- Chunk inicial: 105 kB

**Backend (Railway):**
- FastAPI + PostgreSQL 16 + PostGIS 3.4
- SQLAlchemy 2 Async
- JWT HS256
- 12+ endpoints em produção

**Integração:**
- VITE_USE_API=true → Railway API real
- Fallback automático para mocks se API indisponível

**Visual:** diagrama de arquitetura ou screenshot de /docs (Swagger)

---

## Slide 6 — Economia Espacial em Números

**Título:** Métricas demonstrativas

| Indicador | Valor |
|---|---|
| Área monitorada (orbital) | 128k ha |
| Alertas orbitais simulados | 37 |
| Redução estimada no tempo de triagem | até 42% |
| Custo de resposta evitado (estimado) | R$ 184 mil |
| Fontes orbitais potenciais mapeadas | 6 |
| Fases de integração espacial planejadas | 5 |

*valores simulados para demonstração acadêmica*

**Visual:** MetricCards da página /gestor/economia-espacial

---

## Slide 7 — Roadmap de Integração Espacial

**Título:** Visão de produto — 5 fases

| Fase | Conteúdo | Status |
|---|---|---|
| F1 | Dados demonstrativos e geointeligência operacional | ✅ ATIVO |
| F2 | Importação GeoJSON/Shapefile/KML de bases oficiais | Planejado |
| F3 | Focos de calor NASA FIRMS e INPE via API | Planejado |
| F4 | Modelos preditivos de risco ambiental | Futuro |
| F5 | Marketplace de inteligência ambiental | Visão |

**Visual:** cards do roadmap da página /gestor/economia-espacial

---

## Slide 8 — ODS e Impacto

**Título:** Objetivos de Desenvolvimento Sustentável

**ODS relacionados:** 9 · 11 · 13 · 15  
(Indústria e Inovação · Cidades Sustentáveis · Ação Climática · Vida Terrestre)

**Impacto esperado:**
- Proteção ambiental mais rápida e baseada em dados
- Redução de custos de monitoramento com dados orbitais
- Rastreabilidade de ações ambientais (ESG auditável)
- Capacitação de gestores públicos com tecnologia espacial

---

## Slide 9 — Demo ao Vivo (se presencial)

**Roteiro de 2 minutos:**

1. Abrir https://ignis-fire-watch.vercel.app (30s)
2. Login como gestor (email/senha) → Dashboard (20s)
3. Navegar para Economia Espacial no sidebar (30s)
4. Mostrar cadeia de valor + RadarChart (40s)

**Alternativa (remoto):** prints de tela dos 8 blocos

---

## Slide 10 — Encerramento

**Título:** IGNIS Orbital

**Frase final:**
> "Infraestrutura espacial não é só para agências espaciais. Com o IGNIS Orbital, qualquer gestor ambiental pode usar dados de satélite para tomar decisões mais rápidas, reduzir custos e gerar evidência ESG."

**Links:**
- 🌐 ignis-fire-watch.vercel.app
- 🔌 ignis-api-production.up.railway.app/docs
- 💻 github.com/eliasandraade/ignis-fire-watch

**Autoria:** Elias Sales de Freitas RM561257 · João Vitor Bernardo RM566427 · FIAP GS 2026
