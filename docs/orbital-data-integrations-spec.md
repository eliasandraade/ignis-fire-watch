# Especificação Técnica — Integrações de Dados Orbitais

**Branch:** `feature/orbital-data-integrations`  
**Depende de:** `feature/real-data-sources` (mergeada em master em 2026-05-31)  
**Elaborado em:** 2026-05-31  
**Autores:** Elias Sales de Freitas RM561257 · João Vitor Bernardo RM566427  
**Status:** Especificação — sem implementação iniciada

> **ESCOPO DESTE DOCUMENTO:** Apenas especificação arquitetural e de contrato.
> Nenhuma migração, nenhuma chamada a API externa, nenhuma alteração de banco de dados
> e nenhuma linha de código de integração deve ser iniciada antes da aprovação deste documento.

---

## Índice

1. [Fontes de dados orbitais candidatas](#1-fontes-de-dados-orbitais-candidatas)
2. [Chaves de API e credenciais necessárias](#2-chaves-de-api-e-credenciais-necessárias)
3. [Schemas de dados orbitais no banco](#3-schemas-de-dados-orbitais-no-banco)
4. [Endpoints do backend](#4-endpoints-do-backend)
5. [Estratégia de join espacial com PostGIS](#5-estratégia-de-join-espacial-com-postgis)
6. [Algoritmo de score de risco espacial](#6-algoritmo-de-score-de-risco-espacial)
7. [Conversão de alerta orbital em incidente](#7-conversão-de-alerta-orbital-em-incidente)
8. [Exibição no frontend](#8-exibição-no-frontend)
9. [Riscos operacionais](#9-riscos-operacionais)
10. [Plano de implementação faseado](#10-plano-de-implementação-faseado)
11. [Princípios arquiteturais](#11-princípios-arquiteturais)
12. [Variáveis de ambiente](#12-variáveis-de-ambiente)
13. [Critérios de aceite](#13-critérios-de-aceite)

---

## 1. Fontes de dados orbitais candidatas

### 1.1 NASA FIRMS — Focos de calor ativos (Fase 1, prioridade alta)

| Atributo | Detalhe |
|---|---|
| **Origem** | NASA Fire Information for Resource Management System |
| **Sensores** | VIIRS SNPP NRT (375m), MODIS NRT (1km) |
| **Cobertura temporal** | Últimas 24h, atualizado a cada passe orbital (~3h) |
| **Cobertura espacial** | Global; filtro por bbox antes da ingestão |
| **Formato de entrega** | CSV (campos: latitude, longitude, bright_ti4, scan, track, acq_date, acq_time, satellite, instrument, confidence, version, bright_ti5, frp, daynight) |
| **URL padrão** | `https://firms.modaps.eosdis.nasa.gov/api/area/csv/<KEY>/VIIRS_SNPP_NRT/<BBOX>/1/<YYYY-MM-DD>` |
| **Autenticação** | MAP_KEY pessoal — cadastro gratuito em firms.modaps.eosdis.nasa.gov |
| **Custo** | Gratuito |
| **Limitações** | Nuvens bloqueiam detecção; confiança baixa (<30%) = possível falso positivo |
| **SLA de disponibilidade** | Sem garantia formal; histórico ~99% uptime |

**Campos relevantes para normalização:**

```
latitude, longitude → geom (PostGIS Point)
confidence          → confidence INTEGER (0-100)
acq_date + acq_time → detected_at TIMESTAMPTZ
frp                 → raw_data JSONB (fire radiative power, MW)
satellite           → raw_data JSONB
```

---

### 1.2 INPE Queimadas — Histórico confirmado (Fase 2, prioridade média)

| Atributo | Detalhe |
|---|---|
| **Origem** | INPE — Instituto Nacional de Pesquisas Espaciais |
| **Portal** | queimadas.dgi.inpe.br |
| **Dados disponíveis** | Focos confirmados por UF, município e bioma; séries históricas desde 1998 |
| **Formato de entrega** | REST JSON (BDQueimadas API) ou download CSV mensal |
| **Autenticação** | API pública (sem chave); sujeita a rate-limit implícito |
| **Custo** | Gratuito |
| **Resolução temporal** | Mensal (dados do mês corrente liberados com ~48h de atraso) |
| **Casos de uso IGNIS** | Contextualizar risco histórico por área, alimentar ESG |

**Endpoint de interesse:**

```
GET https://queimadas.dgi.inpe.br/queimadas/bdqueimadas/firespots/
    ?dataset=focos_mensal_br_AAAAMM
    &estado=CE
```

---

### 1.3 MapBiomas — Cobertura e uso do solo (Fase 3, prioridade média)

| Atributo | Detalhe |
|---|---|
| **Origem** | MapBiomas — Plataforma brasileira de mapeamento anual da cobertura |
| **API** | GraphQL (`https://plataforma.alerta.mapbiomas.org/api/graphql`) |
| **Dados disponíveis** | Cobertura LULC por classe (floresta, campo, agropecuária, área degradada, etc.) |
| **Resolução temporal** | Anual (coleção liberada com ~6 meses de atraso) |
| **Autenticação** | Token institucional — requer cadastro em mapbiomas.org |
| **Custo** | Gratuito para uso acadêmico/pesquisa |
| **Limitações** | Token não disponível ainda; dados demo serão usados como seed |

**Classes LULC relevantes para IGNIS:**

| Código MapBiomas | Classe original | Categoria interna |
|---|---|---|
| 3 | Formação Florestal | `floresta_nativa` |
| 12 | Campo Alagado e Área Pantanosa | `campo` |
| 15 | Pastagem | `agropecuaria` |
| 24 | Área Urbana | `area_urbanizada` |
| 33 | Rio, Lago e Oceano | `corpo_dagua` |
| 25 | Outras Áreas não Vegetadas | `area_degradada` |

---

### 1.4 Sentinel-2 / Landsat — Imagens orbitais (Fase 4, fora do escopo desta branch)

| Atributo | Detalhe |
|---|---|
| **Origem candidata A** | Copernicus Data Space Ecosystem (Sentinel-2, 10m/pixel) |
| **Origem candidata B** | USGS EarthExplorer (Landsat-8/9, 30m/pixel) |
| **Origem candidata C** | Google Earth Engine (requer projeto GCP) |
| **Uso pretendido** | Miniatura de satélite da área na página GestorAreaDetailPage |
| **Infraestrutura necessária** | Object storage (S3/R2) para thumbnails geradas; pipeline de recorte de banda |
| **Status** | **Fora do escopo desta branch** — requer aprovação de infraestrutura separada |
| **Custo estimado** | Storage ~R$15/mês para thumbnails 512×512 de 10 áreas; processamento mínimo |

---

### 1.5 OpenWeather / INMET — Dados de seca e vento (Fase 5+, especulativo)

| Atributo | Detalhe |
|---|---|
| **Uso pretendido** | Drought index para o algoritmo de score de risco |
| **API candidata** | OpenWeather One Call 3.0 (pago) ou INMET API (gratuito, cobertura BR) |
| **Status** | Especulativo — não priorizado nesta branch |

---

## 2. Chaves de API e credenciais necessárias

### 2.1 Resumo de credenciais por fase

| Fonte | Variável de ambiente | Como obter | Prazo estimado |
|---|---|---|---|
| NASA FIRMS | `NASA_FIRMS_API_KEY` | Cadastro em firms.modaps.eosdis.nasa.gov | Imediato (aprovação automática) |
| INPE Queimadas | *(sem chave)* | API pública | — |
| MapBiomas | `MAPBIOMAS_TOKEN` | Cadastro institucional em mapbiomas.org | 5-15 dias úteis |
| Sentinel-2 Copernicus | `COPERNICUS_CLIENT_ID` + `COPERNICUS_SECRET` | Registro em identity.dataspace.copernicus.eu | 1-3 dias |
| Landsat USGS | `USGS_USERNAME` + `USGS_PASSWORD` | earthexplorer.usgs.gov | Imediato |

### 2.2 Regras de segurança para credenciais

- Nenhuma chave de API deve aparecer no código-fonte ou em commits.
- Todas as variáveis listadas acima são exclusivas do backend (Railway). O frontend **não recebe nenhuma chave**.
- O frontend usa apenas `VITE_ORBITAL_ALERTS=true/false` para habilitar a camada visual.
- Credenciais em `.env.local` devem estar em `.gitignore` (já configurado).
- Em produção: variáveis definidas no painel Railway > ignis-backend > Variables.

### 2.3 Rotação e expiração

- `NASA_FIRMS_API_KEY`: sem expiração, mas pode ser revogada. Renovar anualmente por precaução.
- `MAPBIOMAS_TOKEN`: OAuth2 com validade de 1 hora. O cron de ingestão deve usar refresh_token.
- `COPERNICUS_CLIENT_ID/SECRET`: OAuth2 client credentials. Válido até revogação.

---

## 3. Schemas de dados orbitais no banco

> ⚠️ **Nenhuma migration deve ser executada antes da aprovação do PR desta branch.**
> Os schemas abaixo são especificação de design, não código executável.

### 3.1 Tabela `orbital_alerts` (Fase 1 — NASA FIRMS + Fase 2 — INPE)

```sql
CREATE TABLE orbital_alerts (
  id                        UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  type                      TEXT          NOT NULL,
  -- Valores válidos: 'heat_spot' | 'burn_confirmed' | 'deforestation' | 'anomaly'

  lat                       DOUBLE PRECISION NOT NULL,
  lng                       DOUBLE PRECISION NOT NULL,
  geom                      geometry(Point, 4326),
  -- Gerado automaticamente: ST_SetSRID(ST_MakePoint(lng, lat), 4326)

  area_id                   UUID          REFERENCES protected_areas(id) ON DELETE SET NULL,
  -- Preenchido pelo join espacial ST_Within no cron de ingestão

  confidence                INTEGER       CHECK (confidence >= 0 AND confidence <= 100),
  source                    TEXT          NOT NULL,
  -- Valores válidos: 'NASA_FIRMS_VIIRS' | 'NASA_FIRMS_MODIS' | 'INPE_BDQUEIMADAS'

  detected_at               TIMESTAMPTZ   NOT NULL,
  fetched_at                TIMESTAMPTZ   NOT NULL DEFAULT now(),

  raw_data                  JSONB,
  -- Payload original da fonte (para rastreabilidade e re-processamento)

  converted_to_incident_id  UUID          REFERENCES incidents(id) ON DELETE SET NULL,
  -- Preenchido quando gestor converte este alerta em incidente formal
  -- NULL = ainda não convertido

  CONSTRAINT uq_orbital_alert_source_detected_coords
    UNIQUE (source, detected_at, lat, lng)
  -- Chave de deduplicação idempotente para reingestão segura
);

-- Índice temporal (queries de "últimas 24h")
CREATE INDEX idx_orbital_alerts_detected_at
  ON orbital_alerts(detected_at DESC);

-- Índice por área (queries de "alertas desta área")
CREATE INDEX idx_orbital_alerts_area_id
  ON orbital_alerts(area_id);

-- Índice espacial GIST (queries ST_Within, ST_DWithin)
CREATE INDEX idx_orbital_alerts_geom
  ON orbital_alerts USING GIST(geom);

-- Índice de alertas não convertidos (dashboard de pendências)
CREATE INDEX idx_orbital_alerts_unconverted
  ON orbital_alerts(detected_at DESC)
  WHERE converted_to_incident_id IS NULL;
```

**Trigger para geom automático:**

```sql
CREATE OR REPLACE FUNCTION trg_set_orbital_alert_geom()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.geom := ST_SetSRID(ST_MakePoint(NEW.lng, NEW.lat), 4326);
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_orbital_alert_geom_on_insert
  BEFORE INSERT OR UPDATE OF lat, lng ON orbital_alerts
  FOR EACH ROW EXECUTE FUNCTION trg_set_orbital_alert_geom();
```

---

### 3.2 Tabela `orbital_sources` (registro de fontes configuradas)

```sql
CREATE TABLE orbital_sources (
  id            UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT    NOT NULL UNIQUE,
  -- Ex: 'NASA_FIRMS_VIIRS', 'INPE_BDQUEIMADAS', 'MAPBIOMAS'

  enabled       BOOLEAN NOT NULL DEFAULT false,
  fetch_url     TEXT    NOT NULL,
  -- URL base da API (sem chave)

  cron_interval TEXT    NOT NULL DEFAULT '3h',
  -- Formato: '3h', '24h', 'monthly'

  last_fetched_at   TIMESTAMPTZ,
  last_status       TEXT,
  -- 'ok' | 'error' | 'rate_limited' | 'partial'

  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

---

### 3.3 Tabela `ingestion_runs` (log de execuções do cron)

```sql
CREATE TABLE ingestion_runs (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  source_name     TEXT        NOT NULL REFERENCES orbital_sources(name),
  started_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  finished_at     TIMESTAMPTZ,
  status          TEXT        NOT NULL DEFAULT 'running',
  -- 'running' | 'ok' | 'error' | 'partial' | 'skipped'

  records_fetched INTEGER     DEFAULT 0,
  records_inserted INTEGER    DEFAULT 0,
  records_skipped  INTEGER    DEFAULT 0,
  -- Deduplicated

  error_message   TEXT,
  -- Preenchido apenas quando status = 'error'

  bbox_used       TEXT,
  -- Ex: '-45.0,-12.0,-34.5,2.5' (CE/PI/MA/TO/MA)

  raw_response_size_bytes INTEGER
  -- Para monitorar crescimento de volume
);

CREATE INDEX idx_ingestion_runs_source_started
  ON ingestion_runs(source_name, started_at DESC);
```

---

### 3.4 Coluna adicional em `protected_areas`

```sql
-- Adicionar à tabela existente (migration separada, Fase 6)
ALTER TABLE protected_areas
  ADD COLUMN IF NOT EXISTS computed_risk_score  NUMERIC(5,2),
  ADD COLUMN IF NOT EXISTS risk_computed_at     TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS risk_components      JSONB;
  -- { "heat_spots": 0.4, "burn_history": 0.3, "vegetation_loss": 0.2, "drought": 0.1 }
```

---

### 3.5 Tabela `burn_history` (Fase 2 — INPE histórico)

```sql
CREATE TABLE burn_history (
  id              UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  area_id         UUID    NOT NULL REFERENCES protected_areas(id) ON DELETE CASCADE,
  year            INTEGER NOT NULL CHECK (year >= 1998),
  month           INTEGER CHECK (month >= 1 AND month <= 12),
  -- NULL = dado anual agregado

  hectares_burned NUMERIC(10,2),
  fire_count      INTEGER,
  source          TEXT    NOT NULL DEFAULT 'INPE_BDQUEIMADAS',
  fetched_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT uq_burn_history_area_year_month UNIQUE (area_id, year, month)
);

CREATE INDEX idx_burn_history_area_id ON burn_history(area_id);
CREATE INDEX idx_burn_history_year    ON burn_history(year DESC);
```

---

### 3.6 Tabela `vegetation_coverage` (Fase 3 — MapBiomas)

```sql
CREATE TABLE vegetation_coverage (
  id              UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  area_id         UUID    NOT NULL REFERENCES protected_areas(id) ON DELETE CASCADE,
  year            INTEGER NOT NULL,
  coverage_type   TEXT    NOT NULL,
  -- 'floresta_nativa' | 'campo' | 'agropecuaria' | 'area_degradada' | 'area_urbanizada' | 'corpo_dagua'

  percentage      NUMERIC(5,2) NOT NULL CHECK (percentage >= 0 AND percentage <= 100),
  source          TEXT    NOT NULL DEFAULT 'MAPBIOMAS',
  fetched_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT uq_vegetation_area_year_type UNIQUE (area_id, year, coverage_type)
);

CREATE INDEX idx_vegetation_coverage_area_id ON vegetation_coverage(area_id);
```

---

## 4. Endpoints do backend

> Todos os endpoints seguem o prefixo `/api/v1/`. Nenhum endpoint abaixo existe ainda.
> São especificação de contrato para implementação futura.

### 4.1 Alertas orbitais

```
GET  /api/v1/orbital-alerts
     Query params:
       type=heat_spot|burn_confirmed|deforestation   (opcional)
       state=CE|PI|MA                                (opcional, filtra por UF)
       area_id=<uuid>                                (opcional)
       since=<ISO 8601>                              (padrão: últimas 24h)
       limit=<int>                                   (padrão: 100, máx: 500)
     Requer: autenticação Bearer (gestor ou admin)
     Cache: dados do banco, TTL = 3h (cron de atualização)

GET  /api/v1/orbital-alerts/:id
     Retorna 404 se não encontrado
     Requer: autenticação Bearer

POST /api/v1/orbital-alerts/:id/convert
     Body: { "priority": "alta" | "media" | "baixa", "notes": "..." }
     Cria registro em incidents com source_alert_id
     Marca orbital_alerts.converted_to_incident_id
     Requer: role gestor ou admin
     Retorna: { "incident_id": "<uuid>", "orbital_alert_id": "<uuid>" }
```

**Contrato de resposta `GET /api/v1/orbital-alerts`:**

```json
{
  "items": [
    {
      "id": "uuid",
      "type": "heat_spot",
      "lat": -4.123,
      "lng": -38.456,
      "areaId": "uuid | null",
      "confidence": 85,
      "source": "NASA_FIRMS_VIIRS",
      "detectedAt": "2026-05-31T14:30:00Z",
      "fetchedAt": "2026-05-31T15:00:00Z",
      "convertedToIncidentId": null
    }
  ],
  "total": 42,
  "since": "2026-05-30T15:00:00Z",
  "cachedAt": "2026-05-31T15:00:00Z"
}
```

---

### 4.2 Histórico de queimadas

```
GET /api/v1/burn-history
    Query params:
      area_id=<uuid>   (obrigatório)
      year=<int>       (opcional; sem filtro = últimos 5 anos)
    Requer: autenticação Bearer
    Cache: dados históricos; atualização mensal

GET /api/v1/burn-history/summary?state=CE
    Retorna total de hectares queimados por ano, para toda a UF
    Usado em ESGReportPage
```

---

### 4.3 Cobertura vegetal

```
GET /api/v1/vegetation-coverage?area_id=<uuid>&year=<int>
    Requer: autenticação Bearer
    Cache: dados anuais; atualização anual
```

---

### 4.4 Score de risco calculado

```
GET /api/v1/risk-scores
    Retorna score de risco de todas as áreas monitoradas
    Calculado pelo cron (não calculado on-the-fly)

GET /api/v1/risk-scores/:area_id
    Score individual com breakdown de componentes
```

**Contrato de resposta:**

```json
{
  "areaId": "uuid",
  "score": 72,
  "level": "high",
  "components": {
    "heatSpots": 85,
    "burnHistory": 60,
    "vegetationLoss": 70,
    "drought": 45
  },
  "computedAt": "2026-05-31T12:00:00Z"
}
```

---

### 4.5 Fontes e status de ingestão (admin)

```
GET  /api/v1/orbital-sources
     Lista fontes configuradas com last_status e last_fetched_at
     Requer: role admin

GET  /api/v1/ingestion-runs?source=<name>&limit=20
     Histórico de execuções de ingestão
     Requer: role admin

POST /api/v1/ingestion-runs/trigger
     Dispara ingestão manual de uma fonte específica
     Body: { "source": "NASA_FIRMS_VIIRS" }
     Requer: role admin
```

---

## 5. Estratégia de join espacial com PostGIS

### 5.1 Problema

Os focos de calor da NASA FIRMS chegam como coordenadas (lat, lng). O IGNIS precisa associar cada foco à área protegida correta (se dentro de uma).

### 5.2 Abordagem — ST_Within com pre-filter de bbox

```sql
-- Passo 1: pre-filter por bbox da UF (evita scan completo)
WITH candidates AS (
  SELECT id, geom
  FROM protected_areas
  WHERE geom && ST_MakeEnvelope(-45.0, -12.0, -34.5, 2.5, 4326)
  -- bbox CE/PI/MA/TO — ajustar conforme estados monitorados
)
-- Passo 2: join espacial preciso
SELECT
  oa.id           AS alert_id,
  pa.id           AS area_id
FROM orbital_alerts oa
JOIN candidates pa ON ST_Within(oa.geom, pa.geom)
WHERE oa.area_id IS NULL
  AND oa.detected_at > now() - INTERVAL '24 hours';
```

### 5.3 Índices requeridos

| Tabela | Índice | Tipo |
|---|---|---|
| `orbital_alerts` | `idx_orbital_alerts_geom` | GIST |
| `protected_areas` | `idx_protected_areas_geom` (já existente) | GIST |
| `orbital_alerts` | `idx_orbital_alerts_area_null` (partial) | B-tree |

**Índice partial para alertas não associados:**

```sql
CREATE INDEX idx_orbital_alerts_area_null
  ON orbital_alerts(detected_at DESC)
  WHERE area_id IS NULL;
```

### 5.4 Execução no cron de ingestão

1. Ingerir focos → `orbital_alerts` (com `area_id = NULL`)
2. Executar join espacial → `UPDATE orbital_alerts SET area_id = ...`
3. Calcular novo `risk_score` para as áreas afetadas → `UPDATE protected_areas`

O join espacial só processa focos com `area_id IS NULL` inseridos nas últimas 24h.
Tempo esperado: < 2s para 500 focos × 10 áreas.

### 5.5 Fallback sem PostGIS (desenvolvimento local)

Em ambiente local sem PostGIS ativado, o backend pode usar distância euclidiana aproximada:

```python
from math import sqrt

def nearest_area_fallback(lat, lng, areas):
    def dist(a):
        return sqrt((a.centroid_lat - lat)**2 + (a.centroid_lng - lng)**2)
    nearest = min(areas, key=dist)
    if dist(nearest) < 0.5:  # ~55km em graus decimais
        return nearest.id
    return None
```

Esta função é apenas para desenvolvimento — produção usa exclusivamente PostGIS.

---

## 6. Algoritmo de score de risco espacial

### 6.1 Fórmula

```
risk_score = (
  w_heat   × normalize(heat_spots_24h, max=50)     +
  w_burn   × normalize(burned_ha_12mo, max=5000)   +
  w_veg    × normalize(vegetation_loss_pct, max=30) +
  w_drought × normalize(drought_severity, max=4)
) × 100
```

Onde:
- `normalize(x, max)` = min(x / max, 1.0) — normaliza para [0, 1]
- Pesos iniciais (ajustáveis): `w_heat=0.40`, `w_burn=0.25`, `w_veg=0.25`, `w_drought=0.10`
- Resultado final: INTEGER em [0, 100]

### 6.2 Derivação do nível de risco (`risk_level`)

| Score | Nível |
|---|---|
| 0–24 | `low` |
| 25–49 | `medium` |
| 50–74 | `high` |
| 75–100 | `critical` |

### 6.3 Inputs por componente

| Componente | Fonte de dados | Quando atualizar |
|---|---|---|
| `heat_spots_24h` | `orbital_alerts` (COUNT, últimas 24h, area_id=X) | A cada ingestão NASA FIRMS |
| `burned_ha_12mo` | `burn_history` (SUM hectares_burned, últimos 12 meses) | A cada ingestão INPE |
| `vegetation_loss_pct` | `vegetation_coverage` (delta ano atual – 5 anos atrás) | Anual (MapBiomas) |
| `drought_severity` | `external_weather` (INMET ou OpenWeather) — **fase futura** | Fallback: 0 até integrado |

### 6.4 Função Python no backend (pseudocódigo)

```python
def calculate_risk_score(area_id: str, db: Session) -> dict:
    heat = db.query("SELECT COUNT(*) FROM orbital_alerts WHERE area_id=:id AND detected_at > now()-'24h'::interval", id=area_id).scalar()
    burn = db.query("SELECT COALESCE(SUM(hectares_burned),0) FROM burn_history WHERE area_id=:id AND year >= extract(year FROM now())-1", id=area_id).scalar()
    veg_loss = db.query("SELECT ... FROM vegetation_coverage ...").scalar() or 0
    drought = 0  # fase futura

    score = (
        0.40 * min(heat / 50, 1.0) +
        0.25 * min(burn / 5000, 1.0) +
        0.25 * min(veg_loss / 30, 1.0) +
        0.10 * min(drought / 4, 1.0)
    ) * 100

    level = 'low' if score < 25 else 'medium' if score < 50 else 'high' if score < 75 else 'critical'

    return {
        "area_id": area_id,
        "score": round(score),
        "level": level,
        "components": {
            "heat_spots": heat,
            "burn_history": round(burn),
            "vegetation_loss": round(veg_loss, 1),
            "drought": drought
        },
        "computed_at": datetime.utcnow().isoformat() + "Z"
    }
```

### 6.5 Persistência

O score calculado é persistido em:
```sql
UPDATE protected_areas
SET
  computed_risk_score = :score,
  risk                = :level,    -- 'low' | 'medium' | 'high' | 'critical'
  risk_computed_at    = now(),
  risk_components     = :components::jsonb
WHERE id = :area_id;
```

O campo `risk` existente na tabela continua sendo usado pelo frontend — passa a ser alimentado automaticamente pelo cron em vez de ser configurado manualmente.

---

## 7. Conversão de alerta orbital em incidente

### 7.1 Fluxo de negócio

```
Alerta orbital (orbital_alerts)
    │
    │  Gestor visualiza na OrbitalMapPage
    │  Confiança ≥ 50% E tipo = heat_spot
    │
    ▼
[Botão "Converter em Incidente"]
    │
    ▼
POST /api/v1/orbital-alerts/:id/convert
    │
    ├── Cria registro em incidents
    │     source_alert_id = orbital_alerts.id
    │     status          = 'ativo'
    │     risk            = derived from alert.confidence
    │     lat/lng         = from alert
    │     area_id         = from alert
    │
    └── UPDATE orbital_alerts
          SET converted_to_incident_id = new_incident.id
```

### 7.2 Contrato da mutation no frontend

```typescript
// Hook a implementar em src/hooks/useOrbitalAlerts.ts
const convertMutation = useMutation({
  mutationFn: ({ alertId, priority, notes }: ConvertPayload) =>
    fetch(`/api/v1/orbital-alerts/${alertId}/convert`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ priority, notes }),
    }).then(r => r.json()),
  onSuccess: () => {
    qc.invalidateQueries({ queryKey: ['incidents'] });
    qc.invalidateQueries({ queryKey: ['orbital-alerts'] });
    toast({ title: 'Incidente criado a partir do alerta orbital' });
  },
});
```

### 7.3 Regras de negócio

- Apenas alertas com `confidence >= 50` podem ser convertidos (validação no backend).
- Apenas usuários com role `gestor` ou `admin` podem executar a conversão.
- Um alerta já convertido (`converted_to_incident_id IS NOT NULL`) não pode ser convertido novamente (400 Bad Request).
- O incidente criado herda: `lat`, `lng`, `area_id`, `detected_at` do alerta.
- O campo `source` do incidente recebe o valor `"orbital_alert:NASA_FIRMS_VIIRS"` para rastreabilidade.

### 7.4 Rollback

Não há rollback automático. Se o gestor criou um incidente por engano, ele usa o fluxo normal de encerramento de incidentes (status → `extinto`).

---

## 8. Exibição no frontend

> Nenhum componente descrito abaixo existe ainda. Esta seção especifica o que deve ser criado.

### 8.1 Hook `useOrbitalAlerts`

**Arquivo:** `src/hooks/useOrbitalAlerts.ts`

```typescript
interface OrbitalAlert {
  id: string;
  type: 'heat_spot' | 'burn_confirmed' | 'deforestation';
  lat: number;
  lng: number;
  areaId: string | null;
  confidence: number;         // 0-100
  source: string;             // 'NASA_FIRMS_VIIRS' | 'INPE_BDQUEIMADAS'
  detectedAt: string;         // ISO 8601
  fetchedAt: string;
  convertedToIncidentId: string | null;
}

// Padrão DataSourceMeta obrigatório (igual aos outros hooks)
export function useOrbitalAlerts(params?: { type?: string; areaId?: string }) {
  // ...
  // Fallback: FALLBACK_ORBITAL_ALERTS em src/data/fallback/
  // Habilitado apenas quando VITE_ORBITAL_ALERTS=true E isApiEnabled()
}
```

### 8.2 Hook `useRiskScores`

**Arquivo:** `src/hooks/useRiskScores.ts`

```typescript
interface RiskScore {
  areaId: string;
  score: number;              // 0-100
  level: 'low' | 'medium' | 'high' | 'critical';
  components: {
    heatSpots: number;
    burnHistory: number;
    vegetationLoss: number;
    drought: number;
  };
  computedAt: string;
}

export function useRiskScores() { /* ... */ }
export function useRiskScore(areaId: string) { /* ... */ }
```

### 8.3 Modificações em `OrbitalMapPage`

- Nova camada de focos de calor (círculos vermelhos/laranja por confiança).
- Toggle para ligar/desligar a camada de alertas orbitais (controlado por `VITE_ORBITAL_ALERTS`).
- Popup de foco: exibe `confidence`, `source`, `detectedAt`.
- Botão "Converter em Incidente" visível apenas para role `gestor`, confiança ≥ 50%.
- Badge de fonte no canto: "NASA FIRMS" com ícone de satélite.

### 8.4 Modificações em `GestorAreaDetailPage`

- Gráfico de burn history (barras horizontais, últimos 5 anos).
- Gráfico de vegetação (pizza: floresta_nativa / campo / agropecuária / degradada).
- Score de risco calculado com breakdown (substitui o risco estático).

### 8.5 Modificações em `ESGReportPage`

- Métrica "Hectares queimados" derivada de `burn_history` real (em vez de dado fixo).
- Porcentagem de floresta nativa de `vegetation_coverage` real.
- DataSourceBadge já presente — fonte passará a mostrar "API ao vivo" quando os dados existirem.

### 8.6 Dados de fallback obrigatórios

Antes de qualquer implementação, criar em `src/data/fallback/`:

```typescript
// src/data/fallback/orbitalAlerts.ts
export const FALLBACK_ORBITAL_ALERTS: OrbitalAlert[] = [
  {
    id: 'demo-alert-001',
    type: 'heat_spot',
    lat: -4.2,
    lng: -38.5,
    areaId: 'demo-area-001',
    confidence: 75,
    source: 'NASA_FIRMS_VIIRS',
    detectedAt: '2026-05-31T10:00:00Z',
    fetchedAt: '2026-05-31T12:00:00Z',
    convertedToIncidentId: null,
  },
  // ... 4-5 exemplos variados
];
```

### 8.7 Feature flag

O frontend lê `import.meta.env.VITE_ORBITAL_ALERTS` para controlar toda a camada orbital:
- `false` (default em desenvolvimento): sem chamadas a `/api/v1/orbital-alerts`, dados de fallback visíveis.
- `true` (produção após fase 1): camada habilitada, hook chama API.

---

## 9. Riscos operacionais

### 9.1 Tabela de riscos

| Risco | Probabilidade | Impacto | Mitigação |
|---|---|---|---|
| NASA FIRMS API fora do ar | Média | Alto | Cache de 24h no banco; fallback dos últimos 2 dias |
| FIRMS retorna > 10.000 focos no bbox | Baixa | Alto | Pre-filter por bbox restrito (CE/PI/MA); máx 500 por ingestão |
| MapBiomas exige token não disponível | Alta (fase 3) | Médio | Dados demo como seed; token solicitado separadamente |
| CORS: frontend chamando API externa | Alta (erro humano) | Crítico | Revisão de código obrigatória; lint rule para fetch de domínio externo |
| Volume de dados cresce muito rápido | Média | Médio | Particionamento de `orbital_alerts` por `detected_at` (mensal) |
| Latência de ST_Within sem GIST | Baixa | Médio | GIST index criado antes da primeira ingestão; bbox pre-filter |
| Falso positivo de alta confiança | Média | Médio | Threshold de conversão: confidence ≥ 50; gestor valida antes de converter |
| Custo Railway excede quota free | Baixa | Médio | Cron a cada 3h (8x/dia); CSV NASA FIRMS ~50KB/request; monitorar uso |
| Token MapBiomas expirado em produção | Média | Baixo | Refresh automático via OAuth2 refresh_token no cron |
| PostGIS não ativado no banco Railway | Média | Alto | Verificar `CREATE EXTENSION IF NOT EXISTS postgis;` antes de qualquer migration |

### 9.2 Limites de taxa (rate limits)

| Fonte | Limite conhecido | Estratégia |
|---|---|---|
| NASA FIRMS | 500 requests/10min por MAP_KEY | 1 request a cada 3h = 8/dia; dentro do limite |
| INPE Queimadas | Sem SLA público; implícito ~100/h | 1 request/mês; sem problema |
| MapBiomas GraphQL | Sem SLA público | 1 request/área/ano; sem problema |
| OpenWeather One Call | 1.000/dia (free tier) | 10 áreas × 4x/dia = 40/dia; dentro do limite |

### 9.3 Precisão e falsos positivos

- VIIRS confiança "low" (< 30%): excluir da ingestão ou marcar como `tentative`.
- VIIRS confiança "nominal" (30-80%): ingerir, não permitir conversão automática em incidente.
- VIIRS confiança "high" (> 80%): ingerir, permitir conversão manual pelo gestor.

### 9.4 Disponibilidade do serviço

O IGNIS deve funcionar plenamente mesmo com todas as fontes orbitais offline:
- `VITE_ORBITAL_ALERTS=false` → sem chamadas, sem erros, dados demo.
- `VITE_ORBITAL_ALERTS=true` + fonte offline → `DataSourceBadge` mostra "Fallback", últimos dados cacheados exibidos.

---

## 10. Plano de implementação faseado

### Fase 0 — Pré-requisito (antes de qualquer código)

- [ ] Verificar se PostGIS está habilitado no banco Railway (`SELECT PostGIS_Version();`)
- [ ] Obter `NASA_FIRMS_API_KEY` (cadastro em firms.modaps.eosdis.nasa.gov)
- [ ] Solicitar token MapBiomas (para Fase 3)
- [ ] Definir bbox definitivo das áreas monitoradas (CE/PI/MA ou mais estados)
- [ ] Confirmar que `protected_areas` tem coluna `geom` com dados preenchidos

### Fase 1 — Schema + NASA FIRMS (focos de calor)

**Duração estimada:** 3-4 dias de desenvolvimento

1. Migration: criar `orbital_alerts`, `orbital_sources`, `ingestion_runs` (Schema §3.1–3.3)
2. Migration: adicionar colunas em `protected_areas` (Schema §3.4)
3. Backend: `GET /api/v1/orbital-alerts` com cache
4. Backend: cron APScheduler para NASA FIRMS (a cada 3h)
5. Backend: normalização CSV → JSON + deduplicação + join PostGIS
6. Frontend: `FALLBACK_ORBITAL_ALERTS` em `src/data/fallback/`
7. Frontend: `useOrbitalAlerts` hook (padrão DataSourceMeta)
8. Frontend: camada de focos em `OrbitalMapPage` (feature flag `VITE_ORBITAL_ALERTS`)

### Fase 2 — Conversão alerta → incidente

**Duração estimada:** 1 dia

1. Backend: `POST /api/v1/orbital-alerts/:id/convert`
2. Frontend: botão "Converter em Incidente" em OrbitalMapPage

### Fase 3 — Score de risco calculado

**Duração estimada:** 2 dias

1. Backend: função `calculate_risk_score` (Python)
2. Backend: `GET /api/v1/risk-scores`
3. Frontend: `useRiskScores` hook
4. Frontend: polígonos coloridos por score real em `OrbitalMapPage`

### Fase 4 — INPE histórico de queimadas

**Duração estimada:** 2 dias

1. Migration: criar `burn_history` (Schema §3.5)
2. Backend: ingestão INPE mensal + `GET /api/v1/burn-history`
3. Frontend: gráfico de burn history em `GestorAreaDetailPage` e `ESGReportPage`

### Fase 5 — MapBiomas cobertura vegetal

**Duração estimada:** 2 dias (após obtenção do token)

1. Migration: criar `vegetation_coverage` (Schema §3.6)
2. Backend: ingestão MapBiomas anual + `GET /api/v1/vegetation-coverage`
3. Frontend: gráfico de cobertura em `GestorAreaDetailPage` e `ESGReportPage`

### Fase 6 — Imagens orbitais Sentinel/Landsat

**Status:** Fora do escopo desta branch — requer aprovação separada de infraestrutura (storage S3/R2).

### Ordem de execução recomendada

```
Fase 0 (pré-requisitos)
  → Fase 1 (schema + NASA FIRMS)
  → Fase 2 (conversão alerta→incidente)
  → Fase 3 (score de risco)
  → Fase 4 (INPE burn history)
  → Fase 5 (MapBiomas vegetação)
  → Fase 6 (imagens orbitais — escopo separado)
```

---

## 11. Princípios arquiteturais

### 11.1 Backend-first

O frontend **nunca** chama APIs externas diretamente (NASA, INPE, MapBiomas).
Todo dado orbital passa pelo backend FastAPI antes de chegar ao cliente.

Verificação: revisão de código obrigatória antes de qualquer PR de integração.
Regra de lint sugerida: proibir `fetch('https://firms.modaps...')` no código frontend.

### 11.2 Cache no banco

Dados de fontes externas são armazenados em PostgreSQL com `fetched_at`.
Não há chamada a API externa a cada request do usuário.

Benefícios:
- Independência de SLA externo após a ingestão.
- Dados disponíveis mesmo com API externa offline.
- Histórico auditável de ingestões (`ingestion_runs`).

### 11.3 Feature flag rigoroso

`ORBITAL_ALERTS_ENABLED` (Railway backend) e `VITE_ORBITAL_ALERTS` (Vercel frontend):
- `false` por padrão em desenvolvimento e staging.
- Habilitado em produção apenas após validação completa da Fase 1.

### 11.4 Fallback sempre presente

Todo hook orbital (`useOrbitalAlerts`, `useRiskScores`, etc.) tem dados de demonstração.
O fallback é idêntico em estrutura aos dados reais — troca transparente para o frontend.
Comportamento quando API offline: `DataSourceBadge` mostra "Fallback" (amarelo), dados demo exibidos.

### 11.5 Rastreabilidade

Todo alerta orbital tem campos: `source`, `confidence`, `detected_at`, `raw_data`.
Todo incidente convertido de alerta tem `source_alert_id` vinculado.
Toda ingestão tem registro em `ingestion_runs` com contadores de registros.

### 11.6 Sem regressão

As integrações orbitais são **aditivas** — não alteram endpoints existentes.
Os 21 endpoints documentados em `docs/real-data-sources.md` não são modificados.
Smoke test das rotas existentes obrigatório antes de qualquer merge de feature orbital.

---

## 12. Variáveis de ambiente

### 12.1 Backend (Railway)

```env
# Fase 1 — NASA FIRMS
NASA_FIRMS_API_KEY=<chave da equipe — cadastro em firms.modaps.eosdis.nasa.gov>
ORBITAL_ALERTS_ENABLED=true

# Fase 1 — Cron
ORBITAL_CRON_INTERVAL_HOURS=3
ORBITAL_BBOX="-45.0,-12.0,-34.5,2.5"
# bbox formato: "lng_min,lat_min,lng_max,lat_max" — cobre CE/PI/MA/TO

# Fase 3 — MapBiomas (quando disponível)
MAPBIOMAS_TOKEN=<token OAuth2>
MAPBIOMAS_REFRESH_TOKEN=<refresh token>

# Fase 5 — Imagens (quando aprovado)
COPERNICUS_CLIENT_ID=<client id>
COPERNICUS_CLIENT_SECRET=<client secret>
```

### 12.2 Frontend (Vercel)

```env
# Controla a camada visual de alertas orbitais no frontend
VITE_ORBITAL_ALERTS=true
# false = fallback demo, sem chamadas a /api/v1/orbital-alerts
# true  = camada habilitada, hook chama API

# Já existente — não alterar
VITE_USE_API=true
VITE_API_URL=https://<railway-backend-url>
```

### 12.3 Desenvolvimento local

```env
# .env.local (gitignored)
VITE_ORBITAL_ALERTS=false
# Manter false localmente até a Fase 1 completa
```

---

## 13. Critérios de aceite

### 13.1 Fase 1 completa (NASA FIRMS)

- [ ] `GET /api/v1/orbital-alerts` retorna dados reais com cache de ≤ 3h
- [ ] Focos de calor aparecem como camada separada em `OrbitalMapPage`
- [ ] Camada ativável via `VITE_ORBITAL_ALERTS=true/false` sem rebuild
- [ ] Cada foco exibe: `source`, `confidence`, `detectedAt` no popup
- [ ] Fallback demo sempre presente quando `VITE_ORBITAL_ALERTS=false`
- [ ] Deduplicação idempotente: reingestão não cria duplicatas
- [ ] Nenhuma chamada a API externa diretamente pelo frontend (validado em code review)

### 13.2 Conversão alerta → incidente (Fase 2)

- [ ] Botão "Converter em Incidente" visível apenas para role `gestor`
- [ ] Botão visível apenas para `confidence >= 50`
- [ ] Incidente criado herda lat/lng/area_id do alerta
- [ ] `orbital_alerts.converted_to_incident_id` preenchido após conversão
- [ ] Alerta já convertido: botão desabilitado, status "Convertido"
- [ ] Query `['incidents']` invalidada após conversão (dashboard atualiza)

### 13.3 Score de risco (Fase 3)

- [ ] `GET /api/v1/risk-scores` retorna scores para todas as áreas
- [ ] `OrbitalMapPage` colore polígonos por score real (substituindo valor estático)
- [ ] Score calculado automaticamente no cron de ingestão
- [ ] `GestorAreaDetailPage` exibe breakdown de componentes do score

### 13.4 Histórico de queimadas (Fase 4)

- [ ] `GET /api/v1/burn-history?area_id=<id>` retorna dados INPE
- [ ] `GestorAreaDetailPage` exibe gráfico de burn history (5 anos)
- [ ] `ESGReportPage` usa hectares reais no cálculo ESG

### 13.5 Cobertura vegetal (Fase 5)

- [ ] `GET /api/v1/vegetation-coverage?area_id=<id>` retorna dados MapBiomas
- [ ] `GestorAreaDetailPage` exibe gráfico de cobertura (pizza)
- [ ] `ESGReportPage` usa % floresta nativa real nas métricas ESG

### 13.6 Qualidade transversal (todas as fases)

- [ ] TypeScript 0 erros em cada PR
- [ ] Build limpo (Vite sem warnings críticos)
- [ ] Sem regressão nas 21 rotas documentadas em `docs/real-data-sources.md`
- [ ] PR documentado com: payload real de exemplo + payload fallback de exemplo
- [ ] Variáveis de ambiente novas documentadas neste arquivo antes da implementação

---

*Documento elaborado por Elias Sales de Freitas RM561257 · João Vitor Bernardo RM566427.*  
*FIAP — Global Solution 2026 — IGNIS Orbital Fire Watch System.*
