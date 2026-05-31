# IGNIS Orbital — Resumo Executivo

**FIAP · Análise e Desenvolvimento de Sistemas · Global Solution 2026**

| | |
|---|---|
| **Aluno 1** | Elias Sales de Freitas — RM561257 |
| **Aluno 2** | João Vitor Bernardo — RM566427 |
| **Data** | 2026-05-31 |

---

## O Problema

O Brasil possui 2.300 áreas protegidas. O monitoramento ambiental ainda depende majoritariamente de denúncias de cidadãos e fiscalização presencial — sistemas reativos por natureza. Quando a notícia de um incêndio ou desmatamento chega por canais tradicionais, o dano já ocorreu. Gestores públicos carecem de ferramentas integradas para triagem, priorização e resposta coordenada.

---

## A Solução

O **IGNIS Orbital** é uma plataforma de inteligência espacial ambiental que atua na **camada de aplicação da economia espacial**: transforma infraestrutura orbital (satélites de observação da Terra) em inteligência ambiental e resposta operacional.

**Frase central:**
> "Satélite → dado orbital → geointeligência → alerta → protocolo → equipe → impacto econômico e ambiental."

---

## Conexão com Economia Espacial

A economia espacial engloba toda a cadeia de valor gerada por infraestrutura espacial — da manufatura de satélites a serviços downstream de dados. O IGNIS Orbital posiciona-se na **camada downstream**:

1. **Infraestrutura orbital** (NASA FIRMS, Sentinel/Copernicus, INPE, Landsat, MapBiomas, NOAA) gera dados ambientais em escala global.
2. **Camada digital** (PostGIS, APIs geoespaciais, Aurora IA) processa dados brutos em informação estruturada.
3. **Camada operacional** (War Room, denúncias, equipes, evidências) converte informação em decisão e ação.
4. **Valor gerado** (prevenção, ESG auditável, redução de custo, governança) fecha o ciclo.

Dados orbitais públicos reduzem radicalmente o custo marginal de monitoramento — o que antes exigia sobrevoos e inspeções terrestres pode ser coberto por satélite em minutos.

---

## Funcionalidades Entregues

### Módulo Público
- Dashboard ambiental com dados geoespaciais reais
- Mapa com áreas protegidas (geometrias PostGIS/MULTIPOLYGON → GeoJSON)
- Envio de denúncias com protocolo automático (`RP-{YYYYMMDD}-{XXXX}`)
- Consulta de protocolo em tempo real

### Módulo Gestor
- Dashboard com métricas da API Railway
- Central de Denúncias com validação e conversão em incidente
- War Room — sala de situação para incidentes críticos
- Mobilização — gestão de equipes, recursos e missões
- Ranking de Risco por área protegida
- Aurora IA — análise e chat rule-based (sem LLM externo)
- Relatório ESG automático
- **🛰 Economia Espacial** — cadeia de valor orbital, fontes, métricas, maturidade e roadmap

### Módulo Administrador
- Painel de usuários e gestão de perfis
- Logs de auditoria

---

## Stack Técnica

| Camada | Tecnologia |
|---|---|
| Frontend | React 18.3 + TypeScript 5.5 + Vite 5.4 (SWC) |
| Estilo | TailwindCSS 3.4 + CSS Variables (OKLCH) |
| Deploy | Vercel (SPA) — 22 rotas lazy-loaded |
| Backend | FastAPI + Python 3.12 |
| Banco | PostgreSQL 16 + PostGIS 3.4 |
| ORM | SQLAlchemy 2 Async + GeoAlchemy2 |
| Autenticação | PyJWT HS256 — sessão persistente |
| Deploy | Railway |

---

## Números

| Indicador | Valor |
|---|---|
| Chunk inicial | 105 kB (vs 1.2 MB sem code splitting) |
| Rotas lazy-loaded | 22 |
| TypeScript errors | 0 |
| Testes pytest | 74 passando |
| Áreas protegidas (API) | 8 (geometrias reais PostGIS) |
| Incidentes ativos (API) | 6 |
| Fontes orbitais mapeadas | 6 |
| Fases de roadmap espacial | 5 |

---

## Limitações e Transparência Acadêmica

- Integração real com NASA FIRMS, Sentinel, INPE **não** está implementada — a arquitetura está preparada (fases 3–5 do roadmap).
- Dados de alertas orbitais e métricas de custo/tempo são simulados para fins acadêmicos.
- Áreas protegidas e incidentes usam dados reais da API Railway.
- Seeds marcados com `source="base demonstrativa acadêmica"` e `data_quality="estimated"`.

---

## Links

| Artefato | URL |
|---|---|
| Frontend | https://ignis-fire-watch.vercel.app |
| API | https://ignis-api-production.up.railway.app |
| Swagger | https://ignis-api-production.up.railway.app/docs |
| Repositório frontend | https://github.com/eliasandraade/ignis-fire-watch |
| Repositório backend | https://github.com/eliasandraade/ignis-orbital-api |

---

*FIAP · Análise e Desenvolvimento de Sistemas · Global Solution 2026*  
*Elias Sales de Freitas RM561257 · João Vitor Bernardo RM566427*
