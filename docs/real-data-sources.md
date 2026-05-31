# Real Data Sources — Arquitetura e Auditoria Completa

**Branch:** `feature/real-data-sources`  
**Última atualização:** 2026-05-31  
**Status:** ✅ TypeScript 0 erros · Build limpo · PR aberto para revisão

---

## Resumo do que mudou nesta branch

Antes: todos os dados do frontend vinham de arrays locais em `src/data/` sem distinção entre dado real e simulado.

Depois: API real é a fonte primária quando `VITE_USE_API=true`. Mocks são fallback explícito e rastreável via `DataSourceMeta`. A UI exibe um badge visual indicando a origem dos dados.

---

## Distinção de fontes

| Tipo | Significado | Badge | Quando ocorre |
|---|---|---|---|
| **API real** (`api`) | Dado veio da API Railway em tempo real | 🟢 "API ao vivo" | `VITE_USE_API=true` + query bem-sucedida |
| **Fallback demo** (`demo`) | Dado vem dos arrays locais em modo demo | 🔵 "Demo" | `VITE_USE_API=false` |
| **Fallback emergência** (`fallback`) | API habilitada mas query falhou | 🟡 "Fallback" | API ativa + erro de rede/Railway |
| **Parcial** (`partial`) | API respondeu mas retornou array vazio | 🟠 "Parcial" | API ativa + 0 registros |
| **Misto** (`mixed`) | Parte dos dados veio da API, parte do fallback | 🟣 "Misto" | Uso futuro / combinações |
| **Dado simulado** | Fixo no código, sem endpoint correspondente | — | PROTOCOL_INCENDIO, ESG histórico demo |
| **Integração prevista** | Existe a intenção mas API externa ainda não integrada | — | NASA FIRMS, INPE, MapBiomas |

---

## Infraestrutura criada

| Arquivo | Propósito |
|---|---|
| `src/services/dataSource.ts` | Tipos `DataSourceMeta/Mode/Status` + `isApiMode()`, `createDataSourceMeta()`, `getDataSourceLabel()` |
| `src/data/fallback/index.ts` | Barrel re-exportando todos os arrays mock como `FALLBACK_*` |
| `src/components/shared/DataSourceBadge.tsx` | Badge pill visual — 5 variantes, inline styles + CSS tokens |
| `src/hooks/useArea.ts` | Lookup de área individual via `GET /api/v1/protected-areas/:id` |
| `docs/real-data-sources.md` | Este arquivo |

---

## Hooks alterados

| Hook | Mudança principal | Fallback |
|---|---|---|
| `useProtectedAreas` | + `dataSource`; fix empty-array | `FALLBACK_AREAS` |
| `useIncidents` | + `dataSource`; fix empty-array | `FALLBACK_INCIDENTS` |
| `useActiveIncidents` | + `dataSource`; usa `getFallbackActiveIncidents()` | derivado |
| `useCriticalIncident` | + `dataSource`; usa `getFallbackCriticalIncident()` | derivado |
| `useIncidentDetail` | + `dataSource`; usa `getFallbackIncidentById()` | `@/data/fallback` |
| `useArea` *(novo)* | Lookup por ID via API + fallback | `getFallbackAreaById()` |
| `useTeams` | + `dataSource`; fix empty-array | `FALLBACK_TEAMS` |
| `useResources` | + `dataSource`; fix empty-array | `FALLBACK_RESOURCES` |
| `useMissions` | + `dataSource`; fix empty-array | `FALLBACK_MISSIONS` |
| `useInternalReports` | + `dataSource`; fix empty-array; fallback via `@/data/fallback` | `FALLBACK_REPORTS` |
| `useInternalReportDetail` | + `dataSource`; usa `getFallbackReportById()` | `@/data/fallback` |
| `useESGReports` | + `dataSource`; fix empty-array | `FALLBACK_ESG_DATA` |
| `useWarRoom` | + `dataSource`; usa `getFallbackCriticalIncident/AreaById` | `@/data/fallback` |

**Bug corrigido em todos os hooks:** `query.isSuccess && data.length > 0 ? apiData : mock` → `query.isSuccess ? apiData : mock`

---

## Páginas alteradas

| Página | Mudança |
|---|---|
| `GestorTopbar` | `getCriticalIncident()` mock → `useCriticalIncident()` hook |
| `OrbitalMapPage` | 3 imports diretos → `useProtectedAreas`, `useActiveIncidents`, `useTeams` |
| `MobilizationPage` | `TEAMS/RESOURCES` → hooks; mobilize chama `PATCH /api/v1/teams/:id` quando API ativa |
| `PublicDashboardPage` | `getActiveIncidents()` → `useActiveIncidents()` |
| `GestorDashboardPage` | `TEAMS` → `useTeams()`, `ESG_DATA` → `useESGReports().latest` |
| `AdminPanelPage` | `MOCK_USERS/AUDIT_LOG` → `FALLBACK_USERS/FALLBACK_AUDIT_LOG` |
| `ReportStatusPage` | `getReportById` → `getFallbackReportById` de `@/data/fallback` |
| `ActiveIncidentPage` | `getAreaById` → `useArea(incident?.areaId)` |
| `FieldOperationPage` | `getAreaById` → `useArea(incident?.areaId)` |
| `ReportValidationPage` | `getAreaById` → `useArea(report?.areaId)` |
| `GestorAreaDetailPage` | `getAreaById/getIncidentsByArea` → `useArea` + `useIncidents().filter()` |
| `ESGReportPage` | Badge substituiu texto `fromApi`; `dataSource` exposto |

### Componentes migrados

| Componente | Mudança |
|---|---|
| `IncidentCard` | `getAreaById` → `useArea()` hook |
| `ReportTable` | `getAreaById` → `useProtectedAreas()` + `areas.find()` |
| `ESGCharts` | `ESG_DATA` importado → `useESGReports().latest` |

---

## Auditoria final — mocks remanescentes

| Arquivo | Uso encontrado | Status | Decisão |
|---|---|---|---|
| `src/data/fallback/index.ts` | Importa de `@/data/*` | ✅ resolvido | É o próprio barrel de fallback |
| `src/pages/gestor/WarRoomPage.tsx` | `PROTOCOL_INCENDIO` de `@/data/operations` | ⚪ aceitável | Dado estático de configuração — não é mock de API |
| `src/hooks/useAdminStats.ts` | Retorna query bruta sem fallback interno | ⚠ documentado | `AdminPanelPage` trata o fallback; aceitável no curto prazo |
| Todos os `@/data/*.ts` (arquivos-fonte) | Arrays de dados demo | ✅ fallback explícito | Consumidos apenas via `@/data/fallback` ou hooks |

### O que ainda não tem endpoint de API

| Dado | Motivo | Próxima fase |
|---|---|---|
| `PROTOCOL_INCENDIO` (checklist) | Configuração estática, sem CRUD previsto | Opcional — fase futura |
| Focos de calor orbital (NASA FIRMS) | API externa não integrada | `feature/orbital-data-integrations` fase 1 |
| Histórico de queimadas (INPE) | API externa não integrada | `feature/orbital-data-integrations` fase 2 |
| Cobertura vegetal (MapBiomas) | API externa não integrada | `feature/orbital-data-integrations` fase 3 |
| Imagens satelitais (Sentinel/Landsat) | Infraestrutura complexa, fase posterior | `feature/orbital-data-integrations` fase 4 |
| ESG histórico semanal/mensal | `esgAdapter` normaliza; dados demo ok para protótipo | Pode melhorar no backend |

---

## Endpoints da API em uso

```
GET  /api/v1/protected-areas?page=1&size=50&state=CE
GET  /api/v1/protected-areas/:id
GET  /api/v1/incidents?page=1&size=50
GET  /api/v1/incidents/:id
GET  /api/v1/incidents/:id/timeline
GET  /api/v1/reports          (internal — gestor)
GET  /api/v1/reports/:id
GET  /api/v1/teams
GET  /api/v1/teams/:id
PATCH /api/v1/teams/:id       { status: 'mobilizado' }
GET  /api/v1/resources
GET  /api/v1/missions
GET  /api/v1/war-room
GET  /api/v1/esg
GET  /api/v1/auth/me          (session restore)
POST /api/v1/auth/login
GET  /api/v1/aurora/analyze
POST /api/v1/aurora/chat
PUT  /api/v1/reports/:id/validate
PUT  /api/v1/reports/:id/discard
POST /api/v1/reports/:id/convert
POST /api/v1/incidents/:id/activate-protocol
GET  /api/v1/admin/users
GET  /api/v1/admin/audit-logs
GET  /health
GET  /ready
```

---

## Endpoints faltantes / desejados

| Endpoint | Necessidade | Prioridade |
|---|---|---|
| `GET /api/v1/admin/users` + `PATCH` | Admin pode editar usuários | Média |
| `GET /api/v1/public/reports/:protocol` | Consulta de denúncia pública por protocolo | Alta — já existe `lookupReport` |
| `GET /api/v1/orbital-alerts` | Focos de calor NASA/INPE normalizados | `feature/orbital-data-integrations` |
| `GET /api/v1/risk-scores` | Score de risco espacial por área | `feature/orbital-data-integrations` |
| `POST /api/v1/orbital-alerts/:id/convert` | Alerta orbital → incidente | `feature/orbital-data-integrations` |
| `GET /api/v1/teams` (com paginação) | Atualmente retorna array flat | Baixa |

---

## Padrão de hook — referência

```typescript
export function useXxx() {
  const apiEnabled = isApiEnabled();

  const query = useQuery({
    queryKey: ['xxx'],
    queryFn: async () => {
      const data = await fetchXxx();
      return data.map(adaptXxx);
    },
    enabled: apiEnabled,
    staleTime: 60 * 1000,
    retry: 1,
  });

  // API desabilitada → fallback demo imediato
  if (!apiEnabled) {
    return {
      items: FALLBACK_XXX,
      loading: false,
      fromApi: false,
      dataSource: createDataSourceMeta(false, false),
    };
  }

  // API habilitada: usa resultado ou fallback
  const items = query.isSuccess ? query.data : FALLBACK_XXX;
  const dataSource = createDataSourceMeta(
    query.isSuccess,
    (query.data ?? []).length > 0,
  );

  return { items, loading: query.isLoading, fromApi: query.isSuccess, dataSource };
}
```

---

## Próxima fase recomendada: `feature/orbital-data-integrations`

Ver plano completo em [`docs/orbital-data-integrations-plan.md`](./orbital-data-integrations-plan.md).

Objetivo: integrar fontes reais da economia espacial — NASA FIRMS (focos de calor), INPE Queimadas, MapBiomas — com cache no backend, cruzamento PostGIS e geração de alertas orbitais automáticos.

**Estratégia segura:**
1. Implementar no backend (FastAPI), nunca chamar API externa direto do frontend
2. Cache no banco + atualização periódica (cron Railway)
3. Feature flag `ORBITAL_ALERTS_ENABLED` para habilitar gradualmente
4. Fallback para dados demonstrativos sempre presente
5. Dados orbitais marcados com `source`, `confidence`, `detected_at`

---

## Variáveis de ambiente

```env
# .env.local (não commitado)
VITE_USE_API=true
VITE_API_URL=https://ignis-api-production.up.railway.app

# Demo/desenvolvimento sem rede
VITE_USE_API=false
```
