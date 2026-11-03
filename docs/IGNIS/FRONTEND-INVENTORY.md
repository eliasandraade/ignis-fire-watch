# IGNIS — Inventário do Frontend (`ignis-fire-watch`)

Data: 03/11/2026.

- **Revisão auditada:** `master` `e56d02f`. A branch padrão `main` (`02df1fb`) é um snapshot Lovable antigo, ver AUDIT-REPORT X-01.
- **Revisão corrigida:** branch `audit/ignis-sprint-0`.
- **Documentação geral:** [ignis-orbital-api/docs/IGNIS](https://github.com/eliasandraade/ignis-orbital-api/tree/audit/ignis-sprint-0/docs/IGNIS). Os IDs `F-xx` remetem ao AUDIT-REPORT.

## 1. Modos de execução

| Variável (build-time) | Efeito |
|---|---|
| `VITE_USE_API=false` (padrão do `.env.example`) | **Modo demonstrativo**: todos os dados vêm de `src/data/*.ts`; `/select-profile` permite escolher papel sem login; ações sem backend são **simulações rotuladas** |
| `VITE_USE_API=true` + `VITE_API_URL` | **Modo API**: dados do backend (que hoje contém o seed demonstrativo); login obrigatório; ações sem backend ficam **desabilitadas** |

A faixa global `DataIntegrityBanner` (fixa no rodapé, em todas as rotas) diz qual é o caso:
- "MODO DEMONSTRATIVO";
- "PROTÓTIPO NÃO OPERACIONAL";
- "API indisponível em N consultas…".

## 2. Rotas (`src/router/index.tsx`)

| Rota | Página | Guard | Observação pós-Sprint 0 |
|---|---|---|---|
| `/` | SplashPage | — | redireciona para `/login` |
| `/login` | LoginPage | — | modo demo aceita qualquer credencial (rotulado) |
| `/select-profile` | SelectProfilePage | — | **só modo demo**; em modo API redireciona para `/login` (F-08) |
| `/public`, `/public/map` | PublicDashboardPage, PublicMapPage | — | métricas hardcoded removidas (n/d) |
| `/public/report` | RegisterReportPage | — | aviso 193/199; tipos válidos; simulação explícita em modo demo |
| `/public/report/status/:id` | ReportStatusPage | — | "protocolo não encontrado" em vez de "Recebida" |
| `/gestor/war-room`, `/gestor/field` | WarRoomPage, FieldOperationPage | `RequireAuthenticatedAccess` | o backend exige `gestor` nessas APIs; um usuário `campo` real recebe 403 (pendente) |
| `/gestor/*` (11 rotas) | Dashboard, Reports, ReportValidation, ActiveIncident, OrbitalMap, Mobilization, AreaDetail, RiskRanking, Aurora, ESG, EconomiaEspacial | `RequireGestorAccess` | guard redireciona para `/login` em modo API |
| `/admin` | AdminPanelPage | `RequireAdminAccess` | — |

Os guards são só do cliente. A autorização efetiva está no backend (`require_role`).

## 3. Matriz de rastreabilidade de dados

Legenda:
- **API**: backend (persistido; hoje com dados do seed).
- **ext**: provedor externo via backend.
- **mock**: `src/data`.
- **hard**: fixo no componente.
- **regra**: texto ou valor por regra fixa.
- **—**: removido ou indisponível.

| Página | Elemento | Antes (`e56d02f`) | Depois (Sprint 0) | Sinalização |
|---|---|---|---|---|
| Dashboard gestor | Banner "INCIDENTE CRÍTICO ATIVO" | API; **mock em qualquer erro** | API; em erro, **nada** (sem alarme falso) | Badge + faixa global |
| Dashboard gestor | Áreas Monitoradas | **hard = 8** | contagem de `useProtectedAreas` | "Áreas Cadastradas" |
| Dashboard gestor | Incidentes ativos / críticos | API; mock em erro | API; vazio em erro | Badge |
| Dashboard gestor | Equipes mobilizadas | **sempre mock** (contrato `Page`) | API (contrato corrigido) | — |
| Dashboard gestor | Tempo Médio Resposta | **hard = 18 min** | n/d | "não medido nesta versão" |
| Dashboard gestor | Risco meteorológico | ext; **score 35 inventado** se indisponível | ext; "—" se indisponível | ponto de referência + horário de obtenção |
| Dashboard gestor | Alertas orbitais | ext; **3 focos falsos "NASA"** em erro | ext; "sem dados"/"demo"/"NASA FIRMS · consultado em …" | "anomalias térmicas — não confirmam incêndio" |
| Dashboard gestor | Geocodificação "ativo" | **hard** | "não usada nesta tela" | — |
| Dashboard gestor | Gráfico semanal (Jan–Mai 2026) | API (ESG) / mock | sem mudança | título com período fixo (pendente) |
| Dashboard gestor | Aurora Insight | regra | sem mudança | "Análise rule-based demonstrativa" |
| Sala de Crise | Incidente, timeline | API; mock em erro | sem mudança no hook de war room | Badge + faixa global |
| Sala de Crise | Telemetria T/UR/vento | **28 °C / 50 % / 10 NE inventados** se nulos | "—" se nulos | — |
| Sala de Crise | Equipes / recursos | **sempre mock** | API | — |
| Sala de Crise | Checklist do protocolo | mock local; "Notificação de autoridades" **concluída por Sistema IGNIS** | mock local, nada concluído automaticamente; desabilitado em modo API | `ActionStateTag` |
| Sala de Crise | Mapa: foco | círculo no **centro da área** | sem mudança (F-11, Fase 1) | legenda "Foco estimado" |
| Mapa Orbital | Polígonos / incidentes / equipes | API→mock; equipes em **posição inventada** | sem mudança (Fase 1) | painel com "dados estimados" |
| Mapa Orbital | Detecções FIRMS | **não plotadas** | não plotadas (Fase 1 P0-07) | — |
| Ranking de Risco | Ordenação por risco | `risk='low'` fixo em modo API | sem mudança | aviso explícito na tela |
| Mobilização | Equipes / recursos | sempre mock | API | "Dados da API · alterar status não aciona equipes reais" |
| Denúncias (gestor) | Lista | API→mock | sem mudança | rótulo de fonte |
| Portal público | Áreas, nível de alerta, tempo de resposta | **hard** (8, "Crítico", 18) | contagem real, n/d, n/d | disclaimer existente |
| Portal público | Alertas ativos | API exige gestor; mock para o cidadão | vazio sem login (B-15, Fase 1) | faixa global |
| Economia Espacial | "API real ativa", "Railway", nome da branch | **hard** | "integração disponível"; sem detalhes de infraestrutura | — |
| Admin | Usuários, auditoria | API→mock | sem mudança; mocks sem alegação de notificação | Badge (usuários) |
| AURORA | Chat | API (regra) → resposta canned | sem mudança | "Resposta simulada" |

## 4. Ações operacionais

Estados (`src/lib/actionState.ts`):
- **funcional**;
- **demonstrativo** (simulação local);
- **indisponível**;
- **não implementado**;
- **erro**;
- **aguardando confirmação**.

| Tela | Ação | Antes | Depois |
|---|---|---|---|
| Sala de Crise | Reforçar / Registrar ativação de protocolo | API; **em erro mostrava "✓ Protocolo Ativado"** | Confirmação prévia (`window.confirm`); "aguardando confirmação"; ✓ só após 2xx; erro explícito; texto "não aciona Bombeiros/Defesa Civil" |
| Sala de Crise | Checklist | toggle local sem rótulo | demonstrativo (demo) / não implementado (API) |
| Mobilização | Mobilizar | demo: toast de sucesso; API: **422** | demo: "Simulação — nenhuma equipe foi acionada"; API: `mobilized`, "status registrado no IGNIS, nenhuma equipe real acionada" |
| Denúncias | Validar (tabela) | **só toast** | link para a tela de validação (API) |
| Validação | Validar / Descartar / Converter | API funcional; demo com toast de sucesso; converter abria o 1º incidente crítico | demo: "Simulação — nada foi …"; erro: "NÃO foi …"; converter abre **o incidente criado** |
| Campo | Cheguei ao local / Enviar relatório | **só estado local**, "✓ Relatório Enviado" | demo: simulação rotulada; API: desabilitado (não implementado) |
| Público | Registrar denúncia | API funcional com 5/10 tipos → **422**; demo: protocolo local mostrado como "Recebida" | tipos válidos; demo: "SIMULAÇÃO — NÃO enviada"; erro: "NÃO foi enviada… ligue 193" |
| Sidebar | Trocar perfil (logout) | **não apagava o token** | `clearSession()` |

Busca negativa (não existem no código): ordenar evacuação, abrigos, comunicação à população, contatar equipes, redirecionar viaturas, criar incidente manual, gerar/exportar relatório, manutenção, atualizar mapa.
**Nenhuma dessas ações deve ser criada sem integração e autorização oficiais** (ver ROADMAP).

## 5. Indicadores "ao vivo"

| Indicador | Antes | Depois |
|---|---|---|
| Badge "API ao vivo" | `DataSourceBadge.tsx:9` | "API" |
| "Dados em tempo real" | `dataSource.ts:20`, `MobilizationPage.tsx:73` | "Dados da API" / rótulo do hook |
| Relógio HH:MM:SS na Sala de Crise | hora local | sem mudança (é relógio, não "última atualização") |
| Pulsos e animações orbitais | decorativos | sem mudança (decorativos; disparam também para incidente mock em modo demo) |

Teste: `src/lib/sprint0.test.ts` garante que nenhum rótulo de fonte contém "tempo real", "ao vivo" ou "live".

## 6. Mapa

- Leaflet + react-leaflet, tiles `tile.openstreetmap.org`, Web Mercator. **Cartografia real** em 9 telas.
- `lib/geo.ts` só inverte `[lng,lat]` para `[lat,lng]` e usa apenas o primeiro anel de MultiPolygon.
- **Problemas** (Fase 1):
  - foco no centro da área;
  - equipes em `centro + idx·0,01°`;
  - FIRMS não plotado;
  - geometrias sem WKT viram quadrados de ±0,08°;
  - provedor de tiles inadequado para produção institucional.
- Recomendação: ARCHITECTURE §4 e PHASE-1-BACKLOG P0-07/P1-01.

## 7. Autenticação no cliente

- Token em `localStorage` (`ignis_token`), sem CSP (F-13, pendente).
- **Sprint 0:**
  - 401 em requisição autenticada limpa a sessão e emite `ignis:session-expired` (`services/api/client.ts`);
  - o `UserContext` zera o perfil;
  - os guards levam a `/login` em modo API;
  - o logout apaga o token.

## 8. Verificação

| Comando | Resultado (branch `audit/ignis-sprint-0`) |
|---|---|
| `npm ci` | OK |
| `npm run typecheck` | 0 erros (baseline: 6) |
| `npm run lint` | 0 erros, 10 warnings (baseline: crash) |
| `npm test` | 24/24 (baseline: sem testes) |
| `npm run build` | OK |
| Navegador, modo demo | faixa demo; "Registrar Ativação" → "Simulação — nenhum protocolo foi ativado" |
| Navegador, modo API (API local + PostGIS isolado) | `/select-profile` → `/login`; dashboard com equipes da API; FIRMS "desativada (chave não configurada)"; mobilização persistida (`mobilized`); com a API derrubada, faixa "API indisponível em 2 consultas" |
