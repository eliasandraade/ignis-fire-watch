# Plano de Integração de Dados Orbitais

**Branch alvo:** `feature/orbital-data-integrations`  
**Depende de:** `feature/real-data-sources` (já mergeada)  
**Data de elaboração:** 2026-05-31  
**Status:** Planejamento — não iniciado

---

## Contexto

O sistema IGNIS Orbital monitora áreas de proteção ambiental em risco de incêndio. Atualmente, os alertas de focos de calor, histórico de queimadas e cobertura vegetal são dados **simulados/demonstrativos**. Esta branch tem como objetivo integrar fontes de dados reais da economia espacial de forma segura, com cache no backend, sem chamadas diretas do frontend a APIs externas.

---

## Princípios arquiteturais

1. **Backend-first:** o frontend nunca chama APIs externas diretamente. Todo dado orbital passa pelo backend FastAPI antes de chegar ao cliente.
2. **Cache no banco:** dados de fontes externas são armazenados no PostgreSQL (Railway) com `fetched_at` e TTL. Não há chamada a cada request do usuário.
3. **Feature flag:** `ORBITAL_ALERTS_ENABLED` controla a ativação por ambiente. Frontend usa `VITE_ORBITAL_ALERTS=true/false`.
4. **Fallback sempre presente:** toda rota orbital tem dados demonstrativos de fallback idênticos ao padrão atual.
5. **Rastreabilidade:** todo alerta orbital tem campos `source`, `confidence`, `detected_at`, `raw_data_ref`.
6. **Sem regressão:** as integrações orbitais são aditivas — não alteram endpoints existentes.

---

## Fases de implementação

### Fase 1 — NASA FIRMS (Focos de calor)

**Objetivo:** Trazer focos de calor ativos das últimas 24h detectados por satélites MODIS/VIIRS.

**API externa:** `https://firms.modaps.eosdis.nasa.gov/api/area/csv/<KEY>/VIIRS_SNPP_NRT/<bbox>/1/<date>`

**Backend (FastAPI):**
- Novo endpoint: `GET /api/v1/orbital-alerts?type=heat_spot&state=CE`
- Tabela PostgreSQL: `orbital_alerts (id, type, lat, lng, confidence, source, detected_at, area_id_ref, raw_data_ref, fetched_at)`
- Cron Railway (`cron.py`): atualização a cada 3h via `APScheduler` ou Railway cron job
- Normalização: converter CSV FIRMS → JSON padronizado → inserção idempotente (deduplicação por `source + detected_at + lat/lng`)
- Cruzamento PostGIS: `ST_Within(point, area.geometry)` para associar focos a áreas protegidas

**Frontend (hooks/páginas):**
- `useOrbitalAlerts(type?, areaId?)` — hook seguindo padrão `DataSourceMeta`
- `FALLBACK_ORBITAL_ALERTS` em `src/data/fallback`
- Badge de fonte: `source: 'NASA FIRMS'`, `confidence: <valor 0-100>`
- `OrbitalMapPage` exibe camada de focos de calor com cor por confiança

**Endpoints novos:**
```
GET /api/v1/orbital-alerts
GET /api/v1/orbital-alerts/:id
POST /api/v1/orbital-alerts/:id/convert   (alerta → incidente)
```

---

### Fase 2 — INPE Queimadas (Histórico de queimadas)

**Objetivo:** Integrar histórico de queimadas confirmadas do INPE para contextualizar risco histórico por área.

**API externa:** `https://queimadas.dgi.inpe.br/queimadas/bdqueimadas/` (API REST pública do INPE)

**Backend:**
- Endpoint: `GET /api/v1/burn-history?areaId=<id>&year=<ano>`
- Tabela: `burn_history (id, area_id, year, month, hectares_burned, source, fetched_at)`
- Atualização mensal (dados históricos não mudam com frequência)
- Fallback: dados dos últimos 5 anos para CE já existem como seed de demonstração

**Frontend:**
- `useBurnHistory(areaId)` — hook com DataSourceMeta
- `GestorAreaDetailPage` exibe gráfico de histórico de queimadas (anos anteriores)
- `ESGReportPage` usa dados reais de área queimada no cálculo ESG

---

### Fase 3 — MapBiomas (Cobertura vegetal)

**Objetivo:** Exibir cobertura vegetal atual por área protegida para cálculo de risco e relatórios ESG.

**API externa:** MapBiomas API (GraphQL) — requer token de acesso institucional

**Backend:**
- Endpoint: `GET /api/v1/vegetation-coverage?areaId=<id>&year=<ano>`
- Tabela: `vegetation_coverage (id, area_id, year, coverage_type, percentage, source, fetched_at)`
- Atualização anual (dados MapBiomas têm resolução temporal de 1 ano)
- Normalização: classificação LULC → categorias internas (`floresta_nativa`, `campo`, `agropecuaria`, `area_degradada`)

**Frontend:**
- `useVegetationCoverage(areaId)` — hook com DataSourceMeta
- `GestorAreaDetailPage` exibe gráfico de cobertura (pizza ou barras horizontais)
- `ESGReportPage` usa porcentagem de floresta nativa para métricas ESG

---

### Fase 4 — Imagens orbitais (Sentinel-2 / Landsat — fase posterior)

**Objetivo:** Exibir miniatura de imagem de satélite da área protegida na página de detalhes.

**Infraestrutura necessária:** Storage externo (S3/R2) para thumbnails geradas. Custo e complexidade elevados.

**Status:** Planejado mas **fora do escopo desta branch**. Requer aprovação separada de infraestrutura.

**API candidatas:**
- Copernicus Data Space (Sentinel-2): gratuito, requer registro institucional
- USGS EarthExplorer (Landsat): gratuito, requer autenticação
- Google Earth Engine: requer projeto GCP

---

### Fase 5 — Schema de alertas orbitais (backend)

**Objetivo:** Unificar focos de calor, queimadas históricas e futuras fontes em um schema coerente de alertas orbitais.

**Tabela unificada (proposta):**
```sql
CREATE TABLE orbital_alerts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type        TEXT NOT NULL,           -- 'heat_spot' | 'burn_confirmed' | 'deforestation'
  lat         DOUBLE PRECISION,
  lng         DOUBLE PRECISION,
  area_id     UUID REFERENCES protected_areas(id),
  confidence  INTEGER,                 -- 0-100
  source      TEXT NOT NULL,           -- 'NASA_FIRMS' | 'INPE' | 'MAPBIOMAS'
  detected_at TIMESTAMPTZ NOT NULL,
  fetched_at  TIMESTAMPTZ DEFAULT now(),
  raw_data    JSONB,
  converted_to_incident_id UUID REFERENCES incidents(id)
);

CREATE INDEX idx_orbital_alerts_area_id ON orbital_alerts(area_id);
CREATE INDEX idx_orbital_alerts_detected_at ON orbital_alerts(detected_at DESC);
```

**Índice espacial:**
```sql
ALTER TABLE orbital_alerts ADD COLUMN geom geometry(Point, 4326);
UPDATE orbital_alerts SET geom = ST_SetSRID(ST_MakePoint(lng, lat), 4326);
CREATE INDEX idx_orbital_alerts_geom ON orbital_alerts USING GIST(geom);
```

---

### Fase 6 — Algoritmo de score de risco espacial

**Objetivo:** Calcular automaticamente o `risk` de cada área protegida com base em dados orbitais, histórico de queimadas e cobertura vegetal.

**Fórmula proposta:**
```
risk_score = (
  weight_heat_spots * normalized_heat_spots_count +
  weight_burn_history * normalized_recent_burns +
  weight_vegetation_loss * vegetation_loss_pct +
  weight_drought_index * drought_severity
) / total_weight
```

**Backend:**
- Função `calculate_risk_score(area_id)` executada no cron de atualização de alertas
- Resultado persiste em `protected_areas.computed_risk_score` e `protected_areas.risk` (derivado)
- Endpoint: `GET /api/v1/risk-scores` (lista todos) e `GET /api/v1/risk-scores/:areaId`

**Frontend:**
- `useRiskScores()` — hook com DataSourceMeta
- `OrbitalMapPage` usa score real para colorir polígonos (substituindo risco estático)

---

### Fase 7 — Conversão automática de alerta orbital em incidente

**Objetivo:** Permitir que gestor converta um alerta orbital confirmado em incidente formal no sistema.

**Backend:**
- `POST /api/v1/orbital-alerts/:id/convert`
- Cria registro em `incidents` com `source_alert_id` vinculado
- Marca `orbital_alerts.converted_to_incident_id`

**Frontend:**
- `OrbitalMapPage`: botão "Converter em Incidente" em popup de foco de calor de alta confiança
- Usa `useMutation` + invalidação de `['incidents']` e `['orbital-alerts']`
- Gating: visível apenas para role `gestor`

---

## Riscos e mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|---|---|---|---|
| NASA FIRMS API fora do ar | Média | Alto | Cache de 24h no banco; fallback de dados da semana anterior |
| MapBiomas exige token institucional | Alta | Médio | Dados demo para protótipo; token solicitado separadamente |
| Volume de focos de calor > 10k/dia | Baixa | Alto | Filtro por bbox (CE/PI/MA) antes de inserir no banco |
| Custos de cron Railway | Baixa | Médio | Cron a cada 3h (8x/dia); dados leves em CSV |
| Latência PostGIS ST_Within | Baixa | Médio | Índice GIST + bbox pre-filter antes do ST_Within |
| Frontend chama API externa diretamente | Alta | Crítico | Revisão de código obrigatória; CORS policy no backend |

---

## Contrato de API (frontend)

```typescript
// Tipos esperados pelo frontend
interface OrbitalAlert {
  id: string;
  type: 'heat_spot' | 'burn_confirmed' | 'deforestation';
  lat: number;
  lng: number;
  areaId: string | null;
  confidence: number;       // 0-100
  source: string;           // 'NASA FIRMS' | 'INPE' | 'MapBiomas'
  detectedAt: string;       // ISO 8601
}

interface RiskScore {
  areaId: string;
  score: number;            // 0-100
  level: RiskLevel;         // 'low' | 'medium' | 'high' | 'critical'
  components: {
    heatSpots: number;
    burnHistory: number;
    vegetationLoss: number;
  };
  computedAt: string;       // ISO 8601
}
```

---

## Ordem de execução recomendada

```
Fase 5 (schema) → Fase 1 (NASA FIRMS) → Fase 6 (risk score) →
Fase 7 (conversão) → Fase 2 (INPE) → Fase 3 (MapBiomas) →
Fase 4 (imagens — escopo separado)
```

Fase 5 antes das outras porque o schema de `orbital_alerts` é base para todas as integrações.

---

## Variáveis de ambiente novas

```env
# Backend (.env Railway)
NASA_FIRMS_API_KEY=<chave da equipe>
ORBITAL_ALERTS_ENABLED=true
ORBITAL_CRON_INTERVAL_HOURS=3

# Frontend (.env.local)
VITE_ORBITAL_ALERTS=true
```

---

## Critérios de aceite da branch

- [ ] `GET /api/v1/orbital-alerts` retorna dados reais da NASA FIRMS com cache de ≤ 3h
- [ ] Focos de calor aparecem no `OrbitalMapPage` como camada separada, habilitável por `VITE_ORBITAL_ALERTS`
- [ ] Fallback demo sempre presente quando `VITE_ORBITAL_ALERTS=false`
- [ ] Dados orbitais têm `source`, `confidence`, `detected_at` visíveis na UI
- [ ] Nenhuma chamada a API externa feita diretamente pelo frontend (validado por revisão de código)
- [ ] TypeScript 0 erros · Build limpo
- [ ] Sem regressão nas rotas existentes (smoke test manual das 21 rotas)
- [ ] PR documentado com exemplos de payload real vs. fallback
