# IGNIS Orbital — Conexão com a Economia Espacial

**FIAP · Análise e Desenvolvimento de Sistemas · Global Solution 2026**  
**Elias Sales de Freitas RM561257 · João Vitor Bernardo RM566427**

---

## O que é Economia Espacial?

A **economia espacial** engloba toda a cadeia de valor gerada por atividades, infraestrutura e aplicações relacionadas ao espaço. Inclui desde a manufatura de satélites e foguetes (upstream) até os serviços e dados que satélites produzem para uso terrestre (downstream).

O segmento **downstream** é onde o crescimento mais acelerado ocorre: dados de observação da Terra (Earth Observation), comunicações, navegação por satélite (GPS) e serviços derivados. O custo de lançamento caiu mais de 95% desde 2000 com reusabilidade de foguetes. Isso criou um novo mercado de "dados como serviço orbital".

---

## Como o IGNIS Orbital se posiciona

O IGNIS Orbital é uma **aplicação da economia espacial no setor ambiental**. Ele não fabrica satélites — atua na camada de aplicação downstream:

> **"O IGNIS Orbital atua na camada de aplicação da economia espacial: transforma infraestrutura orbital em inteligência ambiental e resposta operacional."**

A cadeia completa:
```
Satélite → dado orbital → geointeligência → alerta → protocolo → equipe → impacto econômico e ambiental
```

---

## Respondendo às 8 Perguntas Esperadas

### 1. Como vocês usam dados de satélite?

A arquitetura do IGNIS está preparada para receber dados orbitais públicos via API:
- **NASA FIRMS** — focos de calor e incêndios em tempo quase real
- **Sentinel/Copernicus (ESA)** — imagens multiespectrais para detecção de NDVI, umidade
- **INPE/Queimadas** — base nacional de referência por bioma e estado
- **Landsat** — histórico de cobertura do solo
- **MapBiomas** — zoneamento e uso da terra
- **NOAA** — variáveis climáticas e atmosféricas

Hoje, a integração é demonstrativa (Fase 1 do roadmap). A integração real está planejada para as Fases 2–3.

### 2. O que muda com dados orbitais reais?

Hoje: gestor recebe denúncia → valida → abre incidente.
Com dados orbitais reais: sistema detecta anomalia (foco de calor, supressão vegetal) → abre alerta automático antes da denúncia → gestor responde de forma preventiva.

O mesmo fluxo operacional (War Room, mobilização, ESG) se aplica — o gatilho muda de reativo para preditivo.

### 3. Por que economia espacial e não só "monitoramento ambiental"?

Porque o modelo de negócio do IGNIS, no longo prazo, é ser uma **plataforma intermediária** entre infraestrutura orbital (que já existe, já é pública ou comercialmente acessível) e gestores que não têm capacidade técnica para consumir esses dados diretamente. Isso é o que a literatura chama de "downstream services" — camada de aplicação da economia espacial.

### 4. Qual é o diferencial técnico em relação a sistemas tradicionais?

| Sistema tradicional | IGNIS Orbital |
|---|---|
| Denúncia por telefone/formulário | Denúncia digital com coords + protocolo automático |
| Planilha de ocorrências | PostGIS com geometrias reais de áreas protegidas |
| Reunião presencial para coordenar | War Room com timeline e protocolo de incidente |
| Relatório anual manual | ESG automático por incidentes + área monitorada |
| Sem dados orbitais | Arquitetura preparada para NASA FIRMS, Sentinel, INPE |

### 5. Os dados são reais?

**Sim e não — com transparência total:**
- Áreas protegidas: geometrias reais (MULTIPOLYGON PostGIS) de UC do Ceará
- Incidentes e denúncias: dados de base demonstrativa acadêmica (`data_quality="estimated"`)
- Alertas orbitais e métricas (custo evitado, tempo de triagem): simulados para fins acadêmicos
- Nunca afirmamos integração em tempo real com NASA, INPE ou ESA nesta versão

### 6. Qual o impacto econômico esperado?

Os dados simulados na página Economia Espacial ilustram o modelo:
- **Redução de 42% no tempo de triagem** — quando o alerta orbital chega antes da denúncia, o gestor já sabe onde atuar
- **R$ 184 mil de custo evitado** — estimativa baseada em deslocamentos de equipe substituídos por inteligência orbital
- **128k ha monitorados** — cobertura que seria impossível manter com inspeção física

### 7. O que seria necessário para integração real com NASA FIRMS?

A Fase 3 do roadmap prevê:
1. Cron job no backend para consultar a API pública NASA FIRMS (https://firms.modaps.eosdis.nasa.gov/api/)
2. Filtro geoespacial com PostGIS para cruzar focos de calor com geometrias de áreas protegidas
3. Criação automática de alertas/incidentes pré-classificados por tipo e severidade

O backend (FastAPI + PostGIS + Alembic) já tem toda a estrutura necessária. Seria uma nova migration + novo endpoint + cronjob.

### 8. Como isso se diferencia do INPE/IBAMA?

INPE e IBAMA são produtores de dados e órgãos reguladores. O IGNIS é uma **camada de aplicação** que consome esses dados e os entrega como serviço operacional para gestores específicos (UCs, RPPNs, municípios). É complementar, não concorrente.

---

## Cadeia de Valor Completa

| Etapa | Quem faz | Como o IGNIS conecta |
|---|---|---|
| Observação orbital | NASA, ESA, INPE | Consumo via API pública |
| Processamento de imagens | NASA FIRMS, MapBiomas | Dados já processados disponíveis |
| Análise geoespacial | PostGIS, GeoAlchemy2 | Cruzamento com geometrias de UCs |
| Detecção de anomalia | Aurora IA rule-based | Classificação por tipo e urgência |
| Alerta operacional | War Room | Notificação e abertura de protocolo |
| Resposta em campo | Módulo Mobilização | Equipes, recursos e missões |
| Evidência e ESG | Relatório ESG automático | Dados auditáveis por período |

---

## ODS Relacionados

- **ODS 9** — Indústria, Inovação e Infraestrutura (uso de infraestrutura espacial)
- **ODS 11** — Cidades e Comunidades Sustentáveis (proteção de zonas de amortecimento)
- **ODS 13** — Ação Contra a Mudança Global do Clima (monitoramento de focos de calor)
- **ODS 15** — Vida Terrestre (proteção de áreas naturais e biodiversidade)

---

*FIAP · Análise e Desenvolvimento de Sistemas · Global Solution 2026*  
*Elias Sales de Freitas RM561257 · João Vitor Bernardo RM566427*  
*Não afirmamos integração em tempo real com NASA, INPE, ESA ou qualquer órgão oficial nesta versão.*
