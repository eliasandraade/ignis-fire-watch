# IGNIS Orbital — Slides: Copiar e Colar

**FIAP GS 2026 · Elias Sales de Freitas RM561257 · João Vitor Bernardo RM566427**

> Este arquivo contém o texto exato de cada slide para copiar e colar no PowerPoint / Google Slides / Canva.  
> Use o arquivo `SLIDES-CONTEUDO.md` para instruções visuais e sugestões de design.

---

## SLIDE 1 — CAPA

**[TÍTULO]**
IGNIS Orbital

**[SUBTÍTULO]**
Plataforma de Inteligência Espacial Ambiental

**[RODAPÉ]**
FIAP · Global Solution 2026 · Elias Sales de Freitas RM561257 · João Vitor Bernardo RM566427

---

## SLIDE 2 — O PROBLEMA

**[TÍTULO]**
Proteção ambiental ainda é reativa

**[BULLETS]**
• O Brasil tem 2.300 áreas protegidas — 12% do território nacional
• Monitoramento depende de denúncias e fiscalização presencial
• Quando a notícia de um incêndio ou desmatamento chega, o dano já ocorreu
• Gestores públicos não têm ferramentas integradas de triagem e resposta

**[FRASE IMPACTO]**
"O sistema atual é reativo. O dano acontece antes da resposta."

---

## SLIDE 3 — A SOLUÇÃO

**[TÍTULO]**
IGNIS Orbital transforma dados em resposta

**[O QUE ENTREGA]**
• Plataforma de monitoramento com dados geoespaciais reais (PostGIS/MULTIPOLYGON)
• API completa com FastAPI + PostgreSQL + PostGIS no Railway
• War Room para coordenação de incidentes críticos
• Aurora IA para análise e priorização rule-based
• Relatórios ESG automáticos e auditáveis
• Seção dedicada à Economia Espacial

**[LINK]**
ignis-fire-watch.vercel.app

---

## SLIDE 4 — ECONOMIA ESPACIAL ⭐

**[TÍTULO]**
IGNIS Orbital é uma aplicação da economia espacial

**[FRASE CENTRAL]**
"O IGNIS Orbital atua na camada de aplicação da economia espacial:
transforma infraestrutura orbital em inteligência ambiental e resposta operacional."

**[CADEIA DE VALOR]**
Satélite → dado orbital → geointeligência → alerta → protocolo → equipe → impacto econômico e ambiental

**[FONTES ORBITAIS POTENCIAIS]**
NASA FIRMS · Sentinel/Copernicus · Landsat · INPE · MapBiomas · NOAA

**[NOTA]**
* arquitetura preparada para integração futura — dados demonstrativos nesta versão

---

## SLIDE 5 — STACK TÉCNICA

**[TÍTULO]**
Stack completa em produção

**[FRONTEND — VERCEL]**
React 18 + TypeScript + Vite
22 rotas lazy-loaded · Chunk inicial: 105 kB
TailwindCSS · shadcn/ui · Recharts · Leaflet · Framer Motion

**[BACKEND — RAILWAY]**
FastAPI + Python 3.12
PostgreSQL 16 + PostGIS 3.4
SQLAlchemy 2 Async · PyJWT HS256
74 testes pytest · Ruff clean

**[INTEGRAÇÃO]**
VITE_USE_API=true → Railway API real
Fallback automático para mocks se API indisponível
CORS configurado · Sessão persistente via /auth/me

---

## SLIDE 6 — MÉTRICAS

**[TÍTULO]**
Indicadores do projeto

**[TABELA]**
Área monitorada (orbital) | 128k ha *
Alertas orbitais simulados | 37 *
Redução no tempo de triagem | até 42% *
Custo de resposta evitado | R$ 184 mil *
Fontes orbitais potenciais | 6
Fases de integração espacial | 5
Áreas protegidas (API real) | 8
Incidentes ativos (API real) | 6

* métricas simuladas para demonstração acadêmica

---

## SLIDE 7 — ROADMAP ESPACIAL

**[TÍTULO]**
5 fases de integração espacial

**[FASES]**
F1 — Geointeligência demonstrativa ✅ ATIVO
F2 — Importação de bases geoespaciais oficiais (GeoJSON/Shapefile/KML)
F3 — Focos de calor NASA FIRMS e INPE via API
F4 — Modelos preditivos de risco ambiental
F5 — Marketplace de inteligência ambiental

---

## SLIDE 8 — ODS E IMPACTO

**[TÍTULO]**
Objetivos de Desenvolvimento Sustentável

**[ODS]**
ODS 9 · ODS 11 · ODS 13 · ODS 15

**[IMPACTO ESPERADO]**
• Proteção ambiental mais rápida, baseada em dados orbitais
• Redução de custo de monitoramento com infraestrutura espacial existente
• Rastreabilidade de ações ambientais — ESG auditável
• Acesso de gestores públicos a dados que antes eram exclusivos de agências espaciais

---

## SLIDE 9 — DEMO AO VIVO (OPCIONAL)

**[TÍTULO]**
Demo ao vivo

**[ROTEIRO]**
1. Abrir ignis-fire-watch.vercel.app (30s)
2. Login como gestor → Dashboard (20s)
3. Navegar para 🛰 Economia Espacial no sidebar (30s)
4. Mostrar frase-chave + cadeia de valor + RadarChart (40s)

**[CREDENCIAIS VISÍVEIS NA TELA]**
gestor@semace.ce.gov.br / gestor@123

---

## SLIDE 10 — ENCERRAMENTO

**[TÍTULO]**
IGNIS Orbital

**[FRASE FINAL]**
"Infraestrutura espacial não é só para agências espaciais.
Com o IGNIS Orbital, qualquer gestor ambiental pode usar dados de satélite
para tomar decisões mais rápidas, reduzir custos e gerar evidência ESG."

**[LINKS]**
ignis-fire-watch.vercel.app
ignis-api-production.up.railway.app/docs
github.com/eliasandraade/ignis-fire-watch

**[AUTORIA]**
Elias Sales de Freitas RM561257 · João Vitor Bernardo RM566427 · FIAP GS 2026

---

## FRASES DE RESERVA (para perguntas da banca)

**"Como vocês usam dados de satélite?"**
→ "A arquitetura está preparada para receber dados de NASA FIRMS, Sentinel e INPE. A integração real é a Fase 3 do roadmap. Nesta versão, os dados são demonstrativos e a base está documentada."

**"Qual é o diferencial técnico?"**
→ "PostGIS com geometrias reais de áreas protegidas em MULTIPOLYGON, adaptador WKT→GeoJSON no frontend, War Room com timeline de incidentes, Aurora IA rule-based sem dependência de LLM externo."

**"Por que economia espacial?"**
→ "Porque o modelo de negócio do IGNIS é ser intermediário entre infraestrutura orbital pública e gestores que não têm capacidade técnica para usar esses dados diretamente. É exatamente o que a economia espacial chama de downstream services."

**"Os dados são reais?"**
→ "Áreas protegidas e incidentes vêm da API Railway — dados reais. Métricas de custo e alertas orbitais são simulados e marcados com asterisco. Nunca afirmamos integração em tempo real com NASA ou INPE."

---

*FIAP · Análise e Desenvolvimento de Sistemas · Global Solution 2026*
