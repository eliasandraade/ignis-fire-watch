# IGNIS Orbital — Roteiro de Pitch (3 minutos)

**FIAP GS 2026 · Elias Sales de Freitas RM561257 · João Vitor Bernardo RM566427**

---

## Estrutura de Tempo

| Bloco | Duração | Conteúdo |
|---|---|---|
| Abertura / Problema | 0:00 – 0:30 | gancho + problema real |
| Solução + Demo | 0:30 – 1:30 | o que é + mostrar app |
| Economia Espacial | 1:30 – 2:15 | diferencial estratégico |
| Stack + Evidências | 2:15 – 2:45 | técnica + números |
| Encerramento | 2:45 – 3:00 | frase de impacto + links |

---

## Roteiro de Fala

---

### [0:00 – 0:30] Abertura

> "O Brasil tem 2.300 áreas protegidas. Todas elas dependem, ainda hoje, de denúncias de cidadãos e fiscalização presencial para detectar queimadas e desmatamento. Quando a notícia chega, o dano já aconteceu."

> "O IGNIS Orbital existe para mudar isso."

---

### [0:30 – 1:00] O que é

> "O IGNIS Orbital é uma plataforma de inteligência espacial ambiental. Ela integra dados geoespaciais reais, processados com PostGIS, com uma interface operacional completa para gestores ambientais."

> "Aqui no app — que está em produção no Vercel, conectado a uma API real no Railway — o gestor pode ver denúncias em tempo real, ativar uma War Room para incidentes críticos, mobilizar equipes e gerar relatórios ESG automaticamente."

*[navegar pelo app rapidamente ou mostrar print do dashboard]*

---

### [1:00 – 1:30] Demo rápida (se presencial)

*[Mostrar: Dashboard → sidebar → clicar em Economia Espacial]*

> "E aqui está o que diferencia o IGNIS de um sistema ambiental comum."

---

### [1:30 – 2:15] Economia Espacial ⭐ (ponto central)

> "O IGNIS Orbital não é apenas um sistema ambiental. Ele é uma **aplicação da economia espacial**."

> "A ideia é simples: satélites de observação da Terra — como os da NASA, do INPE e do programa Copernicus — geram dados ambientais em escala global, a custo cada vez menor. Esses dados podem detectar focos de calor, perda de vegetação, variações de umidade, tudo isso antes de qualquer denúncia chegar."

> "O IGNIS atua na camada de aplicação dessa infraestrutura orbital: pega esses dados, processa com geointeligência, e entrega para o gestor como alerta, como protocolo de resposta, como evidência para relatório ESG."

> "É a cadeia de valor espacial completa: do satélite à decisão em campo."

*[mostrar a cadeia de valor na tela ou slide]*

---

### [2:15 – 2:45] Evidências técnicas

> "Tecnicamente: React 18 com TypeScript, API FastAPI com PostgreSQL e PostGIS — banco de dados com suporte a geometrias reais de áreas protegidas em MULTIPOLYGON. Tudo em produção, com JWT, 22 rotas lazy-loaded, CORS configurado, sessão persistente."

> "Os dados de áreas protegidas e incidentes que você vê aqui são reais — vindos da API Railway, processados pelo adaptador geoespacial do nosso frontend."

---

### [2:45 – 3:00] Encerramento

> "Infraestrutura espacial não é mais só para agências espaciais. Com o IGNIS Orbital, qualquer gestor ambiental brasileiro pode usar dados de satélite para responder mais rápido, gastar menos, e provar impacto com dados auditáveis."

> "IGNIS Orbital. Da órbita à proteção ambiental."

**Mostrar no slide ou tela:**
- 🌐 ignis-fire-watch.vercel.app
- Elias Sales de Freitas RM561257 · João Vitor Bernardo RM566427

---

## Frases de Reserva (se houver perguntas)

**"Como vocês usam dados de satélite?"**
> "Por enquanto, a arquitetura está preparada para receber dados orbitais públicos — NASA FIRMS, Sentinel, INPE. As fontes estão mapeadas na página de Economia Espacial. A integração real seria a fase 3 do roadmap."

**"Qual é o diferencial técnico?"**
> "PostGIS com geometrias reais de áreas protegidas em formato MULTIPOLYGON, adaptador WKT→GeoJSON no frontend, War Room com timeline de incidentes, e Aurora IA rule-based sem dependência de LLM externo."

**"Por que economia espacial?"**
> "Porque o modelo de negócio do IGNIS, no longo prazo, é atuar como plataforma intermediária entre infraestrutura orbital — que já existe, já é pública ou acessível — e gestores que não têm nem tempo nem capacidade técnica para usar esses dados diretamente. Isso é exatamente o que a economia espacial chama de 'downstream services'."

---

*FIAP · Análise e Desenvolvimento de Sistemas · Global Solution 2026*  
*Elias Sales de Freitas RM561257 · João Vitor Bernardo RM566427*
