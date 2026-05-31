# IGNIS Orbital — Checklist de Demo e Entrega

**FIAP · Análise e Desenvolvimento de Sistemas · Global Solution 2026**  
**Elias Sales de Freitas RM561257 · João Vitor Bernardo RM566427**

---

## Pré-Requisitos (verificar antes da apresentação)

- [ ] Internet disponível (demo usa produção Vercel + Railway)
- [ ] Navegador Chrome ou Firefox aberto em `https://ignis-fire-watch.vercel.app`
- [ ] Resolução mínima 1280×768
- [ ] Credenciais em mãos (ver LINKS-E-CREDENCIAIS.md)
- [ ] API Railway respondendo: `https://ignis-api-production.up.railway.app/health`

---

## Fluxo 1 — Público (sem login)

| Passo | URL | O que mostrar | Status |
|---|---|---|---|
| 1 | `/` | Splash IGNIS Orbital, título + autores | [ ] |
| 2 | `/select-profile` | Seleção de perfil (público, gestor, admin) | [ ] |
| 3 | `/public` | Dashboard público: alertas, áreas, status | [ ] |
| 4 | `/map` | Mapa Leaflet com áreas protegidas (PostGIS → GeoJSON) | [ ] |
| 5 | `/register-report` | Formulário de denúncia com campo de coords | [ ] |
| 5a | — | Preencher e submeter denúncia | [ ] |
| 5b | — | Protocolo gerado automaticamente (ex: RP-20260531-XXXX) | [ ] |
| 6 | `/report-status` | Consultar protocolo gerado | [ ] |

---

## Fluxo 2 — Gestor Ambiental

| Passo | URL | O que mostrar | Status |
|---|---|---|---|
| 7 | `/login` | Login com `gestor@semace.ce.gov.br` / `gestor@123` | [ ] |
| 8 | `/gestor` | Dashboard gestor: métricas reais da API | [ ] |
| 8a | — | Recarregar (F5) e confirmar que sessão persiste | [ ] |
| 9 | `/gestor/reports` | Central de denúncias: lista, filtro, validação | [ ] |
| 10 | `/gestor/map` | Mapa orbital com dados reais (áreas + incidentes) | [ ] |
| 11 | `/gestor/mobilization` | Equipes, recursos e missões | [ ] |
| 12 | `/gestor/ranking` | Ranking de risco por área protegida | [ ] |
| 13 | `/gestor/aurora` | Aurora IA — análise rule-based + chat | [ ] |
| 14 | `/gestor/esg` | Relatório ESG com gráficos de incidentes | [ ] |
| 15 | `/gestor/economia-espacial` | **Página central da economia espacial** | [ ] |
| 15a | — | Mostrar: central message (frase-chave) | [ ] |
| 15b | — | Mostrar: cadeia de valor (7 etapas) | [ ] |
| 15c | — | Mostrar: fontes orbitais (NASA/Sentinel/INPE...) | [ ] |
| 15d | — | Mostrar: RadarChart de maturidade espacial | [ ] |
| 15e | — | Mostrar: roadmap 5 fases | [ ] |

---

## Fluxo 3 — War Room (destaque técnico)

| Passo | URL | O que mostrar | Status |
|---|---|---|---|
| 16 | `/gestor/incidents` | Lista de incidentes ativos | [ ] |
| 17 | `/gestor/incidents/:id` | Detalhe: timeline + área + severidade | [ ] |
| 18 | `/gestor/war-room` | War Room — sala de situação crítica | [ ] |

---

## Fluxo 4 — Administrador

| Passo | URL | O que mostrar | Status |
|---|---|---|---|
| 19 | Logout → `/login` | Login como `admin@ignis-orbital.com` / `admin@123` | [ ] |
| 20 | `/admin` | Painel de usuários | [ ] |
| 21 | `/admin/audit` | Logs de auditoria | [ ] |

---

## Pontos de Fala — Economia Espacial (bloco de destaque)

Ao abrir `/gestor/economia-espacial`, dizer:

> "O IGNIS Orbital não é apenas um sistema ambiental — é uma aplicação da **economia espacial**."

> "Ele atua na camada de aplicação: transforma infraestrutura orbital em inteligência ambiental e resposta operacional."

> "A cadeia completa: Satélite → dado orbital → geointeligência → alerta → protocolo → equipe → impacto econômico e ambiental."

Mostrar:
- A frase-chave destacada no hero (borda orbital azul)
- A cadeia de valor de 7 etapas
- As 6 fontes orbitais (NASA FIRMS, Sentinel, INPE, etc.)
- O RadarChart com 6 dimensões de maturidade

---

## Evidências Técnicas para Mencionar

- **PostGIS MULTIPOLYGON** — geometrias reais de áreas protegidas no banco
- **Adaptador WKT→GeoJSON** — converte geometria PostGIS para o Leaflet renderizar
- **JWT HS256** — autenticação stateless, sessão restaurada via GET /auth/me
- **22 rotas lazy-loaded** — chunk inicial 105 kB (vs 1.2 MB sem code splitting)
- **74 testes pytest passando** no backend
- **CORS configurado** para ambas as URLs Vercel
- **Aurora IA rule-based** — sem dependência de LLM externo

---

## Checklist Final Antes de Submeter

- [ ] Frontend acessível: `https://ignis-fire-watch.vercel.app`
- [ ] API respondendo: `https://ignis-api-production.up.railway.app/health`
- [ ] Swagger UI acessível: `https://ignis-api-production.up.railway.app/docs`
- [ ] Repositório frontend público: `https://github.com/eliasandraade/ignis-fire-watch`
- [ ] Repositório backend público: `https://github.com/eliasandraade/ignis-orbital-api`
- [ ] Autoria correta em: index.html, README, SplashPage, LoginPage
- [ ] SLIDES-CONTEUDO.md e ROTEIRO-PITCH-3MIN.md finalizados
- [ ] SLIDES-COPIAR-COLAR.md disponível para importação rápida

---

*FIAP · Análise e Desenvolvimento de Sistemas · Global Solution 2026*  
*Elias Sales de Freitas RM561257 · João Vitor Bernardo RM566427*
