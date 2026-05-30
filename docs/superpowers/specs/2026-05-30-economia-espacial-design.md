# Design Spec — Economia Espacial

**Data:** 2026-05-30  
**Projeto:** IGNIS Orbital — FIAP Global Solution 2026  
**Rota:** `/gestor/economia-espacial`  
**Autores:** Elias Sales de Freitas (RM561257) · João Vitor Bernardo (RM566427)

---

## Objetivo

Tornar explícita a relação do IGNIS Orbital com a economia espacial para avaliadores acadêmicos. A página demonstra que o sistema transforma infraestrutura orbital (satélites, sensoriamento remoto, dados orbitais) em valor ambiental, econômico e institucional — posicionando o app como camada de aplicação da indústria espacial.

---

## Decisões de Design

| Decisão | Escolha | Razão |
|---|---|---|
| Gráfico (Bloco 5) | RadarChart — "Maturidade de uso espacial" | Mais visual/espacial; 6 eixos evocam sensores orbitais |
| Cadeia de valor (Bloco 2) | Timeline vertical com gradiente de cor | Mostra texto completo por etapa + liga cada passo a uma feature do app |
| Estrutura de arquivos | Híbrida (página + 2 componentes) | Balance entre simplicidade e separação de responsabilidades |
| Dados | Hooks reais + complemento estático | Bloco 4 usa `useProtectedAreas`, `useIncidents`, `useInternalReports` |
| Linguagem | "simulado", "demonstrativo", "fonte potencial" | Não afirmar integração real com NASA/INPE/Copernicus |

---

## Arquitetura de Arquivos

```
src/pages/gestor/EconomiaEspacialPage.tsx          ← página principal (orquestra os 8 blocos)
src/components/space-economy/SpaceValueChain.tsx   ← Bloco 2: timeline vertical 7 etapas
src/components/space-economy/SpaceImpactChart.tsx  ← Bloco 5: RadarChart + lista de eixos
```

Arquivos alterados:
```
src/router/index.tsx         ← nova rota lazy-loaded dentro de RequireGestorAccess > GestorLayout
src/components/shared/GestorSidebar.tsx  ← nova entrada NAV_ITEMS com ícone 🛰
```

Docs criados/atualizados:
```
docs/entrega/README-ENTREGA.md
docs/entrega/SLIDES-CONTEUDO.md
docs/entrega/ROTEIRO-PITCH-3MIN.md
```

---

## Bloco 1 — Hero

Componente inline na página. Sem lógica.

- **Título:** "Economia Espacial aplicada à proteção ambiental"
- **Subtítulo:** copy exato do brief
- **Badges (6):** Observação da Terra · Sensoriamento Remoto · Dados Orbitais · Geointeligência · Resposta Ambiental · ESG
- **Badge de canto direito:** "dados simulados · demonstração acadêmica FIAP GS 2026"
- **Altura estimada:** ~130px

---

## Bloco 2 — Cadeia de Valor Espacial (`SpaceValueChain.tsx`)

Timeline vertical. Array de 7 objetos `{ step, title, description, tag, color }`.

Gradiente de cor do conector: `#1d4ed8 → #3b82f6 → #22c55e → #15803d` (azul espacial → verde ambiental).

| # | Título | Tag |
|---|--------|-----|
| 1 | Satélites e Sensores | Obs. da Terra |
| 2 | Coleta Orbital | Sens. Remoto |
| 3 | Processamento Geoespacial | PostGIS · GeoJSON |
| 4 | Detecção de Risco | Aurora IA |
| 5 | Decisão Operacional | War Room |
| 6 | Resposta em Campo | Mobilização |
| 7 | Impacto Econômico / Ambiental | ESG |

Cada etapa: dot colorido + card `{ background: var(--bg-surface), border: 1px solid var(--bg-raised) }` com título, descrição e tag inline.

---

## Bloco 3 — Fontes Orbitais

Grid 3 colunas, 6 cards inline. Array estático.

| Fonte | Tipo | Uso no IGNIS | Status |
|---|---|---|---|
| NASA FIRMS | Focos de calor | Alertas de incêndio preventivos | Fonte pública potencial |
| Sentinel/Copernicus | Multiespectral | Perda vegetal e umidade | Integração prevista |
| Landsat | Histórico | Cobertura e uso do solo | Fonte pública potencial |
| INPE Queimadas | Focos BR | Base nacional de referência | Integração prevista |
| MapBiomas | Cobertura | Zoneamento e biomas | Fonte pública potencial |
| NOAA | Clima/atmosfera | Correlação com risco ambiental | Fonte pública potencial |

Status badge: cor `#f97316` (planejado), `#3b82f6` (fonte pública), `#22c55e` (pronto para integração).

---

## Bloco 4 — Métricas de Economia Espacial

Usa `MetricCard` existente. Dois grupos de 4 cards (linha 1: área/alertas/tempo/custo; linha 2: incidentes/equipes/evidências/ESG).

**Valores dinâmicos (via hooks):**
- Área monitorada: `sum(protectedAreas.area_ha)` formatado em "k ha"
- Incidentes com suporte: `incidents.length`
- Equipes mobilizadas: derivado de `useTeams` se disponível

**Valores estáticos demonstrativos:**
- Alertas orbitais simulados: 37
- Tempo economizado: "até 42%"
- Custo evitado estimado: "R$ 184 mil"

Nota de rodapé: `"métricas simuladas para demonstração acadêmica — IGNIS Orbital · FIAP GS 2026"`.

**Fallback:** se `isApiEnabled() === false`, todos os valores são estáticos demonstrativos.

---

## Bloco 5 — Gráfico (`SpaceImpactChart.tsx`)

Layout 2 colunas: RadarChart à esquerda (300×300) + lista de eixos com mini-progress bar à direita.

Recharts `<RadarChart>` com `<PolarGrid>`, `<PolarAngleAxis>`, `<Radar>`.

**Dados estáticos:**
```ts
const data = [
  { axis: 'Dados Orbitais',    value: 72 },
  { axis: 'Geodados',          value: 88 },
  { axis: 'IA Operacional',    value: 65 },
  { axis: 'Resposta em Campo', value: 80 },
  { axis: 'Rastreabilidade',   value: 58 },
  { axis: 'ESG',               value: 75 },
];
```

Cor de fill: `oklch(60% 0.18 220)` com opacidade 0.35 (consistente com ESGCharts).

**Quirk de responsividade do RadarChart:** envolver em `<div style={{ width: '100%', height: 300 }}>` com `<ResponsiveContainer width="100%" height={300}>`. Testar build — se labels saírem do SVG, aplicar `outerRadius={90}`.

---

## Bloco 6 — Casos de Uso

Grid 3 colunas, 6 cards inline. Cada card: ícone emoji + título + frase "dado espacial → decisão → impacto".

| Caso | Dado → Decisão → Impacto |
|---|---|
| Queimadas em APs | Foco de calor → abertura de protocolo → resposta preventiva |
| Desmatamento | Perda vegetal → alerta de supressão → fiscalização |
| Zonas de amortecimento | Anomalia orbital → monitoramento intensificado → proteção |
| Apoio à Defesa Civil | Dado climático → coordenação de equipes → evacuação planejada |
| Relatórios ESG | Incidentes + área → indicadores → política pública |
| Fiscalização ambiental | Ranking de risco orbital → priorização → maior eficiência |

---

## Bloco 7 — Modelo Econômico

Seção em prosa + quadro visual de 4 camadas.

**Quadro (4 items, estilo pipeline vertical):**

| Camada | Conteúdo |
|---|---|
| 🛰 Infraestrutura Espacial | Satélites · sensores · dados orbitais · missões |
| 🖥 Camada Digital | APIs · PostGIS · processamento · Aurora IA |
| ⚡ Camada Operacional | War Room · denúncias · equipes · recursos · evidências |
| 🌿 Valor Gerado | Prevenção · resposta rápida · economia · ESG · governança |

---

## Bloco 8 — Roadmap

5 cards horizontais (ou empilhados em mobile). Fase 1 com destaque `border-color: var(--orbital)` e badge "ATIVO".

| Fase | Título | Status |
|---|---|---|
| 1 | Dados demonstrativos e geointeligência operacional | ATIVO |
| 2 | Importação GeoJSON/Shapefile/KML de bases oficiais | Planejado |
| 3 | Integração focos de calor e dados orbitais públicos | Planejado |
| 4 | Modelos preditivos de risco ambiental | Futuro |
| 5 | Marketplace/API de inteligência ambiental | Visão |

---

## Roteamento

```tsx
// router/index.tsx — dentro do bloco RequireGestorAccess > GestorLayout
const EconomiaEspacialPage = React.lazy(() => import('@/pages/gestor/EconomiaEspacialPage'));

// Na lista de children do GestorLayout:
{ path: '/gestor/economia-espacial', element: withSuspense(<EconomiaEspacialPage />) },
```

---

## Sidebar

```tsx
// GestorSidebar.tsx — adicionar ao NAV_ITEMS após /gestor/esg:
{ to: '/gestor/economia-espacial', label: 'Economia Espacial', icon: '🛰', end: false },
```

---

## Restrições

- Não mencionar Claude, ChatGPT, Lovable, ou ferramentas de IA como autoras
- Não afirmar integração real com NASA/INPE/Copernicus — usar "fonte potencial", "integração prevista", "demonstrativo"
- Não alterar autenticação, guards, mocks existentes
- Não alterar backend
- TypeScript: 0 erros após implementação
- Build: limpo

---

## Docs de entrega

Criar `docs/entrega/` com 3 arquivos:
- `README-ENTREGA.md` — visão geral, links, autoria, stack, economia espacial
- `SLIDES-CONTEUDO.md` — estrutura de slides + conteúdo por slide
- `ROTEIRO-PITCH-3MIN.md` — roteiro de fala com tempo por seção, frase de economia espacial

Sugestão de fala para o pitch:

> "O IGNIS Orbital não é apenas um sistema ambiental. Ele é uma aplicação da economia espacial: pega dados gerados por infraestrutura orbital — como satélites de observação da Terra — e transforma esses dados em protocolos, alertas, relatórios ESG e decisões operacionais. Estamos na camada de aplicação da indústria espacial."
