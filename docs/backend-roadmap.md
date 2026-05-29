# Backend Roadmap — IGNIS Orbital

**FIAP Global Solution 2026**
Elias Sales de Freitas · RM561257
João Vitor Bernardo · RM566427

> Este documento descreve a arquitetura planejada para o backend do IGNIS Orbital.
> O frontend atual é um protótipo totalmente autônomo com dados mockados.
> O backend será desenvolvido em etapa posterior, após a entrega acadêmica do frontend.

---

## 1. Objetivo do Backend

Substituir os dados mockados do frontend por uma API real que:

- Gerencie autenticação e controle de acesso por perfil de usuário.
- Persista e sirva dados de áreas protegidas com geometria real (PostGIS).
- Registre e processe denúncias públicas com geolocalização.
- Gerencie incidentes, equipes, recursos e missões operacionais.
- Produza relatórios ESG e logs de auditoria.
- Integre dados orbitais externos (INPE, MODIS) via importação periódica.
- Exponha uma API REST consumida pelo frontend React existente.

---

## 2. Stack Recomendada

| Camada | Tecnologia | Justificativa |
|---|---|---|
| Framework Web | **FastAPI** (Python 3.12) | Async, tipado, OpenAPI automático, ecosistema Python de geodados |
| Banco de Dados | **PostgreSQL 16** | Padrão de mercado, extensível com PostGIS |
| Extensão Geodados | **PostGIS 3.4** | Operações espaciais nativas (ST_Within, ST_Distance, ST_AsGeoJSON) |
| ORM | **SQLModel** (SQLAlchemy + Pydantic) | Tipagem nativa, integração direta com FastAPI |
| Migrations | **Alembic** | Controle de versão do schema |
| Autenticação | **JWT** (python-jose + passlib) | Stateless, compatível com frontend SPA |
| Validação | **Pydantic v2** | Schemas request/response, já usado no SQLModel |
| Containerização | **Docker + Docker Compose** | Dev local, consistência de ambiente |
| Deploy | **Railway** ou **VPS (Ubuntu + Nginx)** | Railway para prototipagem; VPS para produção futura |
| Importação Geo | **GeoPandas + Fiona** | Leitura de Shapefile/KML/GeoJSON do IBGE/SEMACE |

---

## 3. Módulos Previstos

### 3.1 Auth e Usuários
- Login com email + senha (JWT access token + refresh token)
- Perfis: admin, gestor, analista/orgao, campo, publico
- Middleware de autorização por role em cada endpoint
- Cadastro e gestão de usuários (somente admin)

### 3.2 Áreas Protegidas
- CRUD de áreas (RPPN, APA, PARNA, ESEC) com metadados e geometria
- Importação inicial a partir de GeoJSON/Shapefile oficial (SEMACE/ICMBio)
- Endpoints de consulta geoespacial (áreas dentro de bbox, por estado, por risco)

### 3.3 Geodados e Importação Orbital
- Tabela de focos de calor (MODIS/VIIRS via INPE)
- Job periódico (Celery ou APScheduler) para importar dados INPE
- Cálculo de risco por área baseado em histórico de focos

### 3.4 Denúncias Públicas
- Criação de denúncia com geolocalização (coords) e tipo de ocorrência
- Protocolo único gerado no backend (UUID ou hash)
- Status workflow: em-triagem → validada → em-campo → convertida-incidente | descartada
- Endpoint de consulta pública por protocolo (sem autenticação)

### 3.5 Incidentes
- Criação automática a partir de denúncia validada ou detecção orbital
- Timeline de eventos (append-only, auditável)
- Evidências (URLs de imagens, documentos)
- Dados meteorológicos associados (temperatura, umidade, vento)
- Integração com equipes e recursos

### 3.6 Central Tática (War Room)
- Endpoint de estado agregado: incidentes ativos + equipes mobilizadas + alertas
- SSE (Server-Sent Events) ou WebSocket para atualizações em tempo real

### 3.7 Equipes e Recursos
- CRUD de brigadas, viaturas, aeronaves, equipamentos
- Endpoint de mobilização (mudar status de equipe/recurso)
- Associação de equipe a incidente

### 3.8 Aurora IA (mock → integração futura)
- Endpoint `/aurora/query` que recebe texto e retorna resposta
- Fase 1: resposta mockada (como hoje no frontend)
- Fase 2: integração com API de LLM (prompt estruturado com contexto do incidente)

### 3.9 Relatórios Técnico / ESG
- Endpoint de relatório ESG por período (mensal, trimestral, anual)
- Métricas: áreas monitoradas, incidentes detectados/prevenidos, ha protegidos, tempo médio de resposta
- Exportação futura para PDF (WeasyPrint) ou CSV

### 3.10 Auditoria
- Log automático de toda ação de escrita (POST, PUT, PATCH, DELETE)
- Campos: usuário, timestamp, entidade, id_entidade, ação, payload anterior
- Endpoint de consulta de logs (somente admin)

---

## 4. Entidades Principais

```
User            — id, name, email, hashed_password, role, active, created_at
ProtectedArea   — id, name, type, state, hectares, risk_level, geometry(GEOMETRY), source, data_quality
HotFocus        — id, area_id, detected_at, lat, lng, confidence, source, raw_data
PublicReport    — id, protocol, occurrence_type, area_id, coords(POINT), description, urgency, status, reporter_*, submitted_at
Incident        — id, area_id, type, status, risk_level, detected_at, affected_hectares, source
IncidentEvent   — id, incident_id, timestamp, type, description, author
Evidence        — id, incident_id, type, url, caption, source
FieldTeam       — id, name, type, status, members, contact
Resource        — id, name, type, status, location
Mission         — id, title, type, status, incident_id, team_id, started_at
AuditLog        — id, user_id, action, entity, entity_id, payload, timestamp
```

---

## 5. Endpoints REST Previstos

### Auth
```
POST   /auth/login          — email + senha → JWT
POST   /auth/refresh        — refresh token → novo access token
POST   /auth/logout         — invalida token
```

### Usuários (admin)
```
GET    /users               — lista usuários
POST   /users               — cria usuário
PATCH  /users/{id}          — atualiza usuário
DELETE /users/{id}          — desativa usuário
```

### Áreas Protegidas
```
GET    /areas               — lista áreas (suporta ?state=CE&risk=critical)
GET    /areas/{id}          — detalhe de área + geometria GeoJSON
POST   /areas               — cria área (admin/gestor)
PATCH  /areas/{id}/risk     — atualiza nível de risco
GET    /areas/{id}/incidents — incidentes da área
```

### Denúncias
```
POST   /reports             — cria denúncia (público, sem auth)
GET    /reports/{protocol}  — status por protocolo (público, sem auth)
GET    /reports             — lista denúncias (gestor+)
PATCH  /reports/{id}/status — atualiza status (gestor+)
```

### Incidentes
```
GET    /incidents           — lista incidentes ativos
GET    /incidents/{id}      — detalhe com timeline e evidências
POST   /incidents           — cria incidente (gestor+)
POST   /incidents/{id}/events — adiciona evento à timeline
PATCH  /incidents/{id}/status — atualiza status
```

### Equipes e Recursos
```
GET    /teams               — lista equipes
PATCH  /teams/{id}/status   — mobiliza/libera equipe
GET    /resources           — lista recursos
PATCH  /resources/{id}/status — aloca/libera recurso
```

### Relatórios
```
GET    /reports/esg?period=2026-Q2 — relatório ESG por período
GET    /reports/audit              — log de auditoria (admin)
```

### Aurora
```
POST   /aurora/query        — consulta ao assistente (mock → LLM)
```

---

## 6. Estratégia de Banco e PostGIS

```sql
-- Exemplo: buscar áreas dentro de bounding box
SELECT id, name, risk_level
FROM protected_areas
WHERE ST_Within(
  geometry,
  ST_MakeEnvelope(-41.0, -5.5, -37.0, -2.5, 4326)
);

-- Exemplo: distância entre denúncia e área mais próxima
SELECT a.name, ST_Distance(a.geometry::geography, r.coords::geography) AS dist_m
FROM public_reports r, protected_areas a
WHERE r.id = :report_id
ORDER BY dist_m
LIMIT 1;
```

- SRID 4326 (WGS84) para coordenadas geográficas.
- Índices GiST em todas as colunas de geometria.
- Geometrias armazenadas como `GEOMETRY(MULTIPOLYGON, 4326)` para áreas e `GEOMETRY(POINT, 4326)` para pontos.

---

## 7. Estratégia de Importação de Geodados

```
Fonte oficial → Shapefile/KML/GeoJSON (SEMACE, ICMBio, IBGE)
      ↓
GeoPandas.read_file() → normalização de colunas
      ↓
Reprojeção para SRID 4326 se necessário (geopandas.to_crs)
      ↓
Inserção via SQLModel + ST_GeomFromGeoJSON
      ↓
Validação de geometria (ST_IsValid) + correção (ST_MakeValid)
```

Script de importação: `scripts/import_areas.py`
Job de atualização INPE (focos): `scripts/sync_inpe_hotfoci.py` (cron diário)

---

## 8. Segurança e LGPD Básica

| Ponto | Medida |
|---|---|
| Senhas | bcrypt via passlib — nunca armazenadas em plain text |
| Tokens JWT | Expiry curto (15min access / 7d refresh), revogação via blacklist Redis |
| Dados pessoais (denúncias) | reporterName e reporterContact são opcionais; anonimização disponível |
| Endpoints públicos | Apenas leitura de status por protocolo e criação de denúncia |
| CORS | Restrito às origens do frontend (ignis-fire-watch-main.vercel.app) |
| Rate limiting | FastAPI + slowapi: 10 req/min para endpoints públicos |
| HTTPS | Obrigatório em produção (Vercel já garante no frontend; backend via Railway/Nginx+Let's Encrypt) |
| Logs de auditoria | Imutáveis — append only, sem DELETE |

---

## 9. Ordem Sugerida de Implementação

```
Fase 1 — Fundação (setup + auth)
  1. Setup: FastAPI + Docker Compose + PostgreSQL + PostGIS + Alembic
  2. Modelo User + endpoint de auth (login/refresh/logout)
  3. Middleware de autorização por role
  4. Endpoint básico de health check

Fase 2 — Áreas e Geodados
  5. Modelo ProtectedArea com geometria PostGIS
  6. Script de importação GeoJSON das áreas (substituir mock)
  7. Endpoints GET /areas e GET /areas/{id}

Fase 3 — Denúncias
  8. Modelo PublicReport com coords POINT
  9. POST /reports (público, sem auth)
  10. GET /reports/{protocol} (público)
  11. GET /reports (gestor+) + PATCH status

Fase 4 — Incidentes e Operações
  12. Modelo Incident + IncidentEvent
  13. Endpoints CRUD de incidentes
  14. Modelos FieldTeam + Resource + Mission
  15. Endpoints de mobilização

Fase 5 — Relatórios e Auditoria
  16. Endpoint ESG
  17. AuditLog automático via middleware/evento SQLAlchemy
  18. Endpoint /reports/audit (admin)

Fase 6 — Integrações
  19. Job INPE (focos de calor)
  20. Aurora: endpoint /aurora/query (mock → LLM)
  21. WebSocket/SSE para War Room em tempo real
```

---

## 10. Integração com o Frontend Atual

O frontend React já está preparado para receber dados de API:

- Todos os dados mockados estão centralizados em `src/data/` — a substituição é arquivo a arquivo.
- `@tanstack/react-query` já está instalado e configurado no `App.tsx` — basta criar hooks `useQuery` para cada endpoint.
- As interfaces TypeScript em `src/types/domain.ts` já espelham as entidades do banco.

**Estratégia de migração:**
```
1. Manter mock data funcionando enquanto a API não está pronta.
2. Criar src/api/ com funções de fetch tipadas (ex: fetchAreas(), fetchIncidents()).
3. Substituir imports diretos de src/data/ pelos hooks useQuery correspondentes.
4. Adicionar loading states e error boundaries nos componentes.
5. Configurar variável de ambiente VITE_API_URL para apontar para o backend.
```

---

*IGNIS Orbital — Backend Roadmap*
*FIAP Global Solution 2026 · Elias Sales de Freitas RM561257 · João Vitor Bernardo RM566427*
