# Real Data Sources — Arquitetura de Fontes de Dados

## Visão Geral

O IGNIS Orbital suporta dois modos de operação controlados pela variável de ambiente `VITE_USE_API`:

| Variável | Comportamento |
|---|---|
| `VITE_USE_API=false` (padrão) | Mocks/fallback — modo demo, sem rede |
| `VITE_USE_API=true` | API real como fonte primária, fallback silencioso em caso de erro |

---

## DataSourceMeta

Arquivo: `src/services/dataSource.ts`

```typescript
export type DataSourceMode   = 'api' | 'fallback';
export type DataSourceStatus = 'api' | 'demo' | 'fallback' | 'mixed' | 'partial';

export interface DataSourceMeta {
  mode:       DataSourceMode;
  status:     DataSourceStatus;
  label:      string;        // pt-BR label
  isApi:      boolean;
  isFallback: boolean;
}
```

### createDataSourceMeta(isApiSuccess, hasData)

Função central que decide o status baseado em três dimensões:

| isApiMode() | isApiSuccess | hasData | Resultado |
|---|---|---|---|
| false | qualquer | qualquer | `demo` |
| true | true | true | `api` |
| true | true | false | `partial` |
| true | false | qualquer | `fallback` |

---

## DataSourceBadge

Componente visual: `src/components/shared/DataSourceBadge.tsx`

Exibe um badge pill com cor e label para indicar a origem dos dados na UI:

- `api` → verde — "API ao vivo"
- `demo` → azul — "Demo"
- `fallback` → amarelo — "Fallback"
- `mixed` → roxo — "Misto"
- `partial` → laranja — "Parcial"

Exemplo de uso:

```tsx
const { incidents, dataSource } = useActiveIncidents();
// ...
<DataSourceBadge status={dataSource.status} />
```

---

## Fallback Barrel

Arquivo: `src/data/fallback/index.ts`

Re-exporta todos os arrays de mock com nomes explícitos `FALLBACK_*` para que
os imports deixem claro que estão usando dados de fallback:

```typescript
import { FALLBACK_AREAS, FALLBACK_INCIDENTS, FALLBACK_TEAMS } from '@/data/fallback';
```

Ao invés de:
```typescript
import { PROTECTED_AREAS } from '@/data/areas';   // ❌ ambíguo
```

---

## Padrão de Hook

Todos os hooks de dados seguem o mesmo contrato:

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

  // API desabilitada: retorna fallback imediatamente
  if (!apiEnabled) {
    const dataSource = createDataSourceMeta(false, false);
    return { items: FALLBACK_XXX, loading: false, fromApi: false, dataSource };
  }

  // API habilitada: usa dados da API ou fallback em caso de erro
  const items = query.isSuccess ? query.data : FALLBACK_XXX;
  const dataSource = createDataSourceMeta(query.isSuccess, (query.data ?? []).length > 0);

  return {
    items,
    loading: query.isLoading,
    fromApi: query.isSuccess,
    dataSource,
  };
}
```

### Bug corrigido: empty-array fallback

**Antes (bug):** `query.isSuccess && query.data.length > 0 ? query.data : MOCK_DATA`
- API retornando array vazio silenciosamente exibia dados mock como se fossem reais

**Depois (correto):** `query.isSuccess ? query.data : FALLBACK_DATA`
- Array vazio da API é um resultado válido; `dataSource.status` será `partial` indicando a situação

---

## Hooks disponíveis e suas fontes

| Hook | Endpoint API | Fallback |
|---|---|---|
| `useProtectedAreas` | `GET /api/v1/protected-areas` | `FALLBACK_AREAS` |
| `useIncidents` | `GET /api/v1/incidents` | `FALLBACK_INCIDENTS` |
| `useActiveIncidents` | derivado de useIncidents | `getFallbackActiveIncidents()` |
| `useCriticalIncident` | derivado de useIncidents | `getFallbackCriticalIncident()` |
| `useIncidentDetail` | `GET /api/v1/incidents/:id` | `getFallbackIncidentById()` |
| `useArea` | `GET /api/v1/protected-areas/:id` | `getFallbackAreaById()` |
| `useTeams` | `GET /api/v1/teams` | `FALLBACK_TEAMS` |
| `useResources` | `GET /api/v1/resources` | `FALLBACK_RESOURCES` |
| `useMissions` | `GET /api/v1/missions` | `FALLBACK_MISSIONS` |
| `useInternalReports` | `GET /api/v1/reports` | `FALLBACK_REPORTS` |
| `useESGReports` | `GET /api/v1/esg` | `FALLBACK_ESG_DATA` |
| `useWarRoom` | `GET /api/v1/war-room` | `getFallbackCriticalIncident()` |

---

## Variáveis de ambiente

```env
# .env.local (não commitado)
VITE_USE_API=true
VITE_API_URL=https://ignis-api-production.up.railway.app

# Demo local
VITE_USE_API=false
```

---

## Mutações com API

Quando `VITE_USE_API=true`, mutações chamam a API real:

- **Mobilizar equipe:** `PATCH /api/v1/teams/:id` com `{ status: 'mobilizado' }`  
- **Validar denúncia:** `PUT /api/v1/reports/:id/validate`  
- **Descartar denúncia:** `PUT /api/v1/reports/:id/discard`  
- **Converter em incidente:** `POST /api/v1/reports/:id/convert`  
- **Ativar protocolo:** `POST /api/v1/incidents/:id/activate-protocol`  

Em modo demo (`VITE_USE_API=false`), mutações operam em estado local com
feedback visual adequado.
