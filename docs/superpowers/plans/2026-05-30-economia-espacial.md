# Economia Espacial Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Criar a rota `/gestor/economia-espacial` com 8 blocos de conteúdo que demonstram explicitamente a relação do IGNIS Orbital com a economia espacial, incluindo cadeia de valor, fontes orbitais, métricas reais via hooks, RadarChart de maturidade, casos de uso, modelo econômico e roadmap.

**Architecture:** Hybrid — `EconomiaEspacialPage.tsx` orquestra 8 blocos inline + 2 componentes extraídos para os blocos mais complexos (`SpaceValueChain` para a timeline vertical e `SpaceImpactChart` para o RadarChart + lista lateral). Dados do Bloco 4 derivados de `useProtectedAreas` + `useIncidents` com fallback estático. Todos os demais blocos são estáticos com linguagem "demonstrativo/simulado".

**Tech Stack:** React 18 + TypeScript 5.5 · Recharts 2.12 (RadarChart) · TanStack Query v5 · inline styles com CSS vars do tema · lucide-react para ícones

---

## File Map

| Ação | Arquivo | Responsabilidade |
|---|---|---|
| Create | `src/components/space-economy/SpaceValueChain.tsx` | Timeline vertical 7 etapas com gradiente de cor |
| Create | `src/components/space-economy/SpaceImpactChart.tsx` | RadarChart maturidade + lista de eixos com progress bars |
| Create | `src/pages/gestor/EconomiaEspacialPage.tsx` | Página principal com 8 blocos |
| Modify | `src/router/index.tsx` | Lazy import + rota `/gestor/economia-espacial` |
| Modify | `src/components/shared/GestorSidebar.tsx` | NAV_ITEMS: nova entrada 🛰 Economia Espacial |
| Create | `docs/entrega/README-ENTREGA.md` | Visão geral do projeto para entrega |
| Create | `docs/entrega/SLIDES-CONTEUDO.md` | Estrutura de slides |
| Create | `docs/entrega/ROTEIRO-PITCH-3MIN.md` | Roteiro de fala 3 min |

---

## Task 1: SpaceValueChain component

**Files:**
- Create: `src/components/space-economy/SpaceValueChain.tsx`

- [ ] **Step 1.1: Criar diretório e arquivo**

```bash
mkdir -p src/components/space-economy
```

- [ ] **Step 1.2: Escrever o componente**

```tsx
// src/components/space-economy/SpaceValueChain.tsx

interface ChainStep {
  step: number;
  title: string;
  description: string;
  tag: string;
  dotColor: string;
  lineColor: string;
}

const CHAIN_STEPS: ChainStep[] = [
  {
    step: 1,
    title: 'Satélites e Sensores',
    description: 'Infraestrutura orbital captura sinais ambientais sobre vegetação, calor, umidade, solo e atmosfera.',
    tag: 'Obs. da Terra',
    dotColor: '#3b82f6',
    lineColor: '#3b82f6',
  },
  {
    step: 2,
    title: 'Coleta Orbital',
    description: 'Dados brutos são recebidos de missões públicas ou comerciais de observação da Terra.',
    tag: 'Sens. Remoto',
    dotColor: '#38bdf8',
    lineColor: '#38bdf8',
  },
  {
    step: 3,
    title: 'Processamento Geoespacial',
    description: 'Informações são cruzadas com áreas protegidas, zonas de amortecimento e histórico de ocorrências.',
    tag: 'PostGIS · GeoJSON',
    dotColor: '#22c55e',
    lineColor: '#22c55e',
  },
  {
    step: 4,
    title: 'Detecção de Risco',
    description: 'Focos de calor, perda vegetal e anomalias são convertidos em alertas priorizados.',
    tag: 'Aurora IA',
    dotColor: '#f59e0b',
    lineColor: '#f59e0b',
  },
  {
    step: 5,
    title: 'Decisão Operacional',
    description: 'O gestor recebe ranking de risco, recomendações e protocolos de resposta.',
    tag: 'War Room',
    dotColor: '#f97316',
    lineColor: '#f97316',
  },
  {
    step: 6,
    title: 'Resposta em Campo',
    description: 'Equipes, recursos e evidências são coordenados pela Central Tática.',
    tag: 'Mobilização',
    dotColor: '#ef4444',
    lineColor: '#ef4444',
  },
  {
    step: 7,
    title: 'Impacto Econômico / Ambiental',
    description: 'Redução de danos ambientais, menor custo de resposta e geração de indicadores ESG.',
    tag: 'ESG',
    dotColor: '#a855f7',
    lineColor: '#a855f7',
  },
];

export function SpaceValueChain() {
  return (
    <div>
      <h2 style={{
        fontSize: 14, fontWeight: 700, color: 'var(--text-mid)',
        textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 24,
      }}>
        Cadeia de Valor Espacial
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {CHAIN_STEPS.map((s, i) => (
          <div key={s.step} style={{ display: 'flex', gap: 16 }}>
            {/* Timeline column */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 20, flexShrink: 0 }}>
              <div style={{
                width: 14, height: 14, borderRadius: '50%', flexShrink: 0,
                border: `2px solid ${s.dotColor}`,
                background: 'var(--bg-void)',
                marginTop: 14,
                zIndex: 1,
              }} />
              {i < CHAIN_STEPS.length - 1 && (
                <div style={{
                  flex: 1, width: 2, marginTop: 4, marginBottom: 4,
                  background: s.lineColor,
                  opacity: 0.4,
                }} />
              )}
            </div>

            {/* Card */}
            <div style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--bg-raised)',
              borderRadius: 8,
              padding: '12px 16px',
              flex: 1,
              marginBottom: i < CHAIN_STEPS.length - 1 ? 12 : 0,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{
                  fontSize: 11, fontWeight: 800,
                  fontFamily: 'JetBrains Mono, monospace',
                  color: s.dotColor,
                }}>
                  {String(s.step).padStart(2, '0')}
                </span>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-hi)' }}>
                  {s.title}
                </span>
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-lo)', margin: '0 0 8px', lineHeight: 1.6 }}>
                {s.description}
              </p>
              <span style={{
                fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 4,
                background: `${s.dotColor}22`,
                color: s.dotColor,
                border: `1px solid ${s.dotColor}44`,
              }}>
                {s.tag}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 1.3: Verificar TypeScript**

```bash
npx tsc --noEmit
```
Expected: sem erros novos.

---

## Task 2: SpaceImpactChart component

**Files:**
- Create: `src/components/space-economy/SpaceImpactChart.tsx`

- [ ] **Step 2.1: Escrever o componente**

```tsx
// src/components/space-economy/SpaceImpactChart.tsx
import {
  RadarChart, PolarGrid, PolarAngleAxis,
  Radar, ResponsiveContainer,
} from 'recharts';

const RADAR_DATA = [
  { axis: 'Dados Orbitais',    value: 72 },
  { axis: 'Geodados',          value: 88 },
  { axis: 'IA Operacional',    value: 65 },
  { axis: 'Resp. em Campo',    value: 80 },
  { axis: 'Rastreabilidade',   value: 58 },
  { axis: 'ESG',               value: 75 },
];

const FILL_COLOR = 'oklch(65% 0.17 220)';

export function SpaceImpactChart() {
  return (
    <div>
      <h2 style={{
        fontSize: 14, fontWeight: 700, color: 'var(--text-mid)',
        textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 20,
      }}>
        Maturidade de Uso Espacial
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Radar */}
        <div style={{
          background: 'var(--bg-surface)', border: '1px solid var(--bg-raised)',
          borderRadius: 8, padding: 20,
        }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-mid)', marginBottom: 12 }}>
            Capacidade orbital atual · simulado
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={RADAR_DATA} outerRadius={90} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
              <PolarGrid stroke="var(--bg-raised)" />
              <PolarAngleAxis
                dataKey="axis"
                tick={{ fontSize: 11, fill: 'var(--text-lo)' }}
              />
              <Radar
                name="IGNIS"
                dataKey="value"
                stroke={FILL_COLOR}
                fill={FILL_COLOR}
                fillOpacity={0.35}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Axis list with progress bars */}
        <div style={{
          background: 'var(--bg-surface)', border: '1px solid var(--bg-raised)',
          borderRadius: 8, padding: 20,
        }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-mid)', marginBottom: 16 }}>
            Dimensões de capacidade
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {RADAR_DATA.map(d => (
              <div key={d.axis}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 12, color: 'var(--text-mid)', fontWeight: 500 }}>
                    {d.axis}
                  </span>
                  <span style={{
                    fontSize: 12, fontFamily: 'JetBrains Mono, monospace',
                    color: 'var(--orbital)',
                  }}>
                    {d.value}%
                  </span>
                </div>
                <div style={{ height: 4, background: 'var(--bg-raised)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', width: `${d.value}%`,
                    background: FILL_COLOR, borderRadius: 2,
                  }} />
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 20, fontSize: 10, color: 'var(--text-ghost)', fontStyle: 'italic' }}>
            valores simulados para demonstração acadêmica · FIAP GS 2026
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2.2: Verificar TypeScript**

```bash
npx tsc --noEmit
```
Expected: 0 erros.

---

## Task 3: EconomiaEspacialPage

**Files:**
- Create: `src/pages/gestor/EconomiaEspacialPage.tsx`

- [ ] **Step 3.1: Escrever a página completa**

```tsx
// src/pages/gestor/EconomiaEspacialPage.tsx
import { MetricCard } from '@/components/shared/MetricCard';
import { SpaceValueChain } from '@/components/space-economy/SpaceValueChain';
import { SpaceImpactChart } from '@/components/space-economy/SpaceImpactChart';
import { useProtectedAreas } from '@/hooks/useProtectedAreas';
import { useIncidents } from '@/hooks/useIncidents';

// ── Bloco 3: Fontes orbitais ──────────────────────────────────────────────
const ORBITAL_SOURCES = [
  {
    name: 'NASA FIRMS',
    type: 'Focos de calor e incêndios',
    use: 'Alertas de incêndio preventivos antes da denúncia chegar',
    status: 'Fonte pública potencial',
    statusColor: '#3b82f6',
    dot: '#f97316',
  },
  {
    name: 'Sentinel / Copernicus',
    type: 'Imagens multiespectrais',
    use: 'Detecção de perda vegetal e variações de umidade',
    status: 'Integração prevista',
    statusColor: '#a855f7',
    dot: '#22c55e',
  },
  {
    name: 'Landsat',
    type: 'Histórico de cobertura',
    use: 'Análise de uso e ocupação do solo ao longo do tempo',
    status: 'Fonte pública potencial',
    statusColor: '#3b82f6',
    dot: '#3b82f6',
  },
  {
    name: 'INPE / Queimadas',
    type: 'Focos de calor no Brasil',
    use: 'Base nacional de referência para alertas por bioma',
    status: 'Integração prevista',
    statusColor: '#a855f7',
    dot: '#ef4444',
  },
  {
    name: 'MapBiomas',
    type: 'Cobertura e uso da terra',
    use: 'Zoneamento, identificação de biomas e áreas degradadas',
    status: 'Fonte pública potencial',
    statusColor: '#3b82f6',
    dot: '#10b981',
  },
  {
    name: 'NOAA / Meteorologia',
    type: 'Variáveis climáticas e atmosféricas',
    use: 'Correlação entre clima e risco ambiental',
    status: 'Fonte pública potencial',
    statusColor: '#3b82f6',
    dot: '#60a5fa',
  },
];

// ── Bloco 6: Casos de uso ─────────────────────────────────────────────────
const USE_CASES = [
  {
    icon: '🔥',
    title: 'Queimadas em Áreas Protegidas',
    flow: 'Foco de calor orbital → abertura automática de protocolo → resposta preventiva antes do alastramento',
  },
  {
    icon: '🌲',
    title: 'Desmatamento e Supressão Vegetal',
    flow: 'Variação de NDVI detectada → alerta de supressão → fiscalização prioritária',
  },
  {
    icon: '🗺️',
    title: 'Zonas de Amortecimento',
    flow: 'Anomalia orbital em buffer de AP → monitoramento intensificado → proteção da área núcleo',
  },
  {
    icon: '🚨',
    title: 'Apoio à Defesa Civil',
    flow: 'Dado climático orbital → coordenação antecipada de equipes → evacuação planejada',
  },
  {
    icon: '📊',
    title: 'Relatórios ESG e Políticas Públicas',
    flow: 'Incidentes + área monitorada → indicadores quantitativos → embasamento de política pública',
  },
  {
    icon: '🔍',
    title: 'Priorização de Fiscalização',
    flow: 'Ranking de risco orbital → foco de autuação → maior eficiência operacional com mesmo recurso',
  },
];

// ── Bloco 7: Modelo econômico ─────────────────────────────────────────────
const ECONOMY_LAYERS = [
  {
    icon: '🛰',
    label: 'Infraestrutura Espacial',
    desc: 'Satélites · sensores · dados orbitais · missões de observação da Terra',
    color: '#3b82f6',
  },
  {
    icon: '🖥',
    label: 'Camada Digital',
    desc: 'APIs espaciais · PostGIS · processamento geoespacial · Aurora IA rule-based',
    color: '#38bdf8',
  },
  {
    icon: '⚡',
    label: 'Camada Operacional',
    desc: 'War Room · denúncias · equipes · recursos · evidências · ranking de risco',
    color: '#f59e0b',
  },
  {
    icon: '🌿',
    label: 'Valor Gerado',
    desc: 'Prevenção de danos · resposta rápida · redução de custo operacional · ESG · governança ambiental',
    color: '#22c55e',
  },
];

// ── Bloco 8: Roadmap ──────────────────────────────────────────────────────
const ROADMAP = [
  { phase: 1, title: 'Dados Demonstrativos e Geointeligência', desc: 'Plataforma operacional com dados de base acadêmica e geointeligência simulada', status: 'ATIVO', active: true },
  { phase: 2, title: 'Importação de Bases Geoespaciais Oficiais', desc: 'Suporte a GeoJSON, Shapefile e KML de fontes como IBAMA, ICMBio e MMA', status: 'Planejado', active: false },
  { phase: 3, title: 'Integração com Dados Orbitais Públicos', desc: 'Focos de calor NASA FIRMS e INPE, imagens Sentinel/Copernicus via API', status: 'Planejado', active: false },
  { phase: 4, title: 'Modelos Preditivos de Risco Ambiental', desc: 'Machine learning sobre séries temporais de dados orbitais e histórico de incidentes', status: 'Futuro', active: false },
  { phase: 5, title: 'Marketplace de Inteligência Ambiental', desc: 'API aberta de geointeligência para gestores, RPPNs, órgãos públicos e empresas de ESG', status: 'Visão', active: false },
];

// ── Hero badges ───────────────────────────────────────────────────────────
const HERO_BADGES = [
  { label: 'Observação da Terra',  color: '#3b82f6' },
  { label: 'Sensoriamento Remoto', color: '#22c55e' },
  { label: 'Dados Orbitais',       color: '#a855f7' },
  { label: 'Geointeligência',      color: '#f97316' },
  { label: 'Resposta Ambiental',   color: '#ef4444' },
  { label: 'ESG',                  color: '#14b8a6' },
];

// ── Component ─────────────────────────────────────────────────────────────
export default function EconomiaEspacialPage() {
  const { areas } = useProtectedAreas();
  const { incidents } = useIncidents();

  const totalHa   = areas.reduce((s, a) => s + (a.hectares ?? 0), 0);
  const haLabel   = totalHa >= 1000
    ? `${(totalHa / 1000).toFixed(1)}k ha`
    : `${totalHa} ha`;
  const incCount  = incidents.length;

  const sectionTitle = (text: string) => (
    <h2 style={{
      fontSize: 14, fontWeight: 700, color: 'var(--text-mid)',
      textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 20,
    }}>
      {text}
    </h2>
  );

  return (
    <div style={{ padding: 24, maxWidth: 1000, margin: '0 auto' }}>

      {/* ── Bloco 1: Hero ─────────────────────────────────── */}
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--bg-raised)',
        borderRadius: 10,
        padding: '28px 32px',
        marginBottom: 32,
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Subtle orbital glow */}
        <div style={{
          position: 'absolute', top: -60, right: -60,
          width: 220, height: 220, borderRadius: '50%',
          background: 'radial-gradient(circle, oklch(60% 0.18 220 / 0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 24 }}>🛰</span>
            <h1 style={{ fontSize: 20, fontWeight: 800, margin: 0, color: 'var(--text-hi)', lineHeight: 1.2 }}>
              Economia Espacial aplicada à proteção ambiental
            </h1>
          </div>
          <div style={{
            padding: '5px 11px', background: 'var(--bg-raised)', borderRadius: 5,
            fontSize: 10, color: 'var(--text-ghost)', fontStyle: 'italic', flexShrink: 0, marginLeft: 16,
          }}>
            dados simulados · demonstração acadêmica FIAP GS 2026
          </div>
        </div>

        <p style={{ fontSize: 13, color: 'var(--text-lo)', margin: '0 0 20px', lineHeight: 1.7, maxWidth: 680 }}>
          O IGNIS Orbital conecta dados de satélites, sensoriamento remoto e inteligência operacional
          para transformar infraestrutura espacial em valor ambiental, econômico e institucional.
          Atuamos como camada de aplicação da economia espacial: cada dado orbital vira protocolo,
          alerta, relatório ESG ou decisão de resposta em campo.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {HERO_BADGES.map(b => (
            <span key={b.label} style={{
              padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 600,
              background: `${b.color}22`,
              color: b.color,
              border: `1px solid ${b.color}44`,
            }}>
              {b.label}
            </span>
          ))}
        </div>
      </div>

      {/* ── Bloco 2: Cadeia de valor ───────────────────────── */}
      <div style={{ marginBottom: 40 }}>
        <SpaceValueChain />
      </div>

      {/* ── Bloco 3: Fontes orbitais ───────────────────────── */}
      <div style={{ marginBottom: 40 }}>
        {sectionTitle('Fontes Orbitais e Espaciais')}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {ORBITAL_SOURCES.map(src => (
            <div key={src.name} style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--bg-raised)',
              borderRadius: 8, padding: '14px 16px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <div style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: src.dot, flexShrink: 0,
                }} />
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-hi)' }}>
                  {src.name}
                </span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-ghost)', marginBottom: 4 }}>
                {src.type}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-lo)', marginBottom: 10, lineHeight: 1.5 }}>
                {src.use}
              </div>
              <span style={{
                fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 4,
                background: `${src.statusColor}18`,
                color: src.statusColor,
                border: `1px solid ${src.statusColor}33`,
              }}>
                {src.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bloco 4: Métricas ──────────────────────────────── */}
      <div style={{ marginBottom: 40 }}>
        {sectionTitle('Métricas de Economia Espacial')}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 14 }}>
          <MetricCard value={haLabel}   label="Área monitorada (orbital)" unit="" accent="var(--orbital)" />
          <MetricCard value={37}        label="Alertas orbitais simulados" accent="#f97316" />
          <MetricCard value="até 42%"   label="Redução no tempo de triagem" accent="#22c55e" />
          <MetricCard value="R$ 184k"   label="Custo de resposta evitado*" accent="#a855f7" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
          <MetricCard value={incCount}  label="Incidentes com suporte geo." accent="#ef4444" />
          <MetricCard value={areas.length} label="Áreas protegidas monitoradas" accent="var(--orbital)" />
          <MetricCard value={6}         label="Fontes orbitais potenciais" accent="#38bdf8" />
          <MetricCard value={5}         label="Fases de integração espacial" accent="#f59e0b" />
        </div>
        <div style={{ marginTop: 10, fontSize: 11, color: 'var(--text-ghost)', fontStyle: 'italic' }}>
          * métricas simuladas para demonstração acadêmica · IGNIS Orbital · FIAP GS 2026 · (exceto áreas e incidentes, que usam dados reais da API quando disponível)
        </div>
      </div>

      {/* ── Bloco 5: Gráfico ───────────────────────────────── */}
      <div style={{ marginBottom: 40 }}>
        <SpaceImpactChart />
      </div>

      {/* ── Bloco 6: Casos de uso ──────────────────────────── */}
      <div style={{ marginBottom: 40 }}>
        {sectionTitle('Casos de Uso')}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {USE_CASES.map(uc => (
            <div key={uc.title} style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--bg-raised)',
              borderRadius: 8, padding: '16px',
            }}>
              <div style={{ fontSize: 22, marginBottom: 8 }}>{uc.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-hi)', marginBottom: 8 }}>
                {uc.title}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-lo)', lineHeight: 1.6 }}>
                {uc.flow}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bloco 7: Modelo econômico ──────────────────────── */}
      <div style={{ marginBottom: 40 }}>
        {sectionTitle('Como a Economia Espacial gera valor aqui')}

        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24,
        }}>
          <div style={{ fontSize: 13, color: 'var(--text-lo)', lineHeight: 1.9 }}>
            <p style={{ margin: '0 0 10px' }}>
              Satélites de observação da Terra <strong style={{ color: 'var(--text-mid)' }}>reduzem radicalmente o custo</strong> de monitoramento
              ambiental físico — cobrindo em minutos o que levaria dias de sobrevoo.
            </p>
            <p style={{ margin: '0 0 10px' }}>
              Dados orbitais <strong style={{ color: 'var(--text-mid)' }}>aumentam a escala de cobertura</strong> sem aumentar proporcionalmente o
              custo operacional. APIs espaciais transformam infraestrutura complexa em serviço
              acessível a gestores públicos e privados.
            </p>
            <p style={{ margin: 0 }}>
              Relatórios ESG comprovam impacto mensurável. Proteção ambiental vira dado auditável.
              O IGNIS atua como <strong style={{ color: 'var(--text-mid)' }}>camada de aplicação</strong> da economia espacial,
              convertendo dados orbitais em decisão operacional.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {ECONOMY_LAYERS.map((layer, i) => (
              <div key={layer.label} style={{
                background: 'var(--bg-surface)',
                border: `1px solid ${layer.color}33`,
                borderLeft: `3px solid ${layer.color}`,
                borderRadius: 6, padding: '10px 14px',
                display: 'flex', alignItems: 'flex-start', gap: 10,
              }}>
                <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>{layer.icon}</span>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: layer.color, marginBottom: 2 }}>
                    {layer.label}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-lo)', lineHeight: 1.5 }}>
                    {layer.desc}
                  </div>
                </div>
                {i < ECONOMY_LAYERS.length - 1 && (
                  <div style={{ display: 'none' }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bloco 8: Roadmap ───────────────────────────────── */}
      <div style={{ marginBottom: 16 }}>
        {sectionTitle('Próximas Integrações Espaciais')}
        <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4 }}>
          {ROADMAP.map(r => (
            <div key={r.phase} style={{
              background: r.active ? 'rgba(59,130,246,0.08)' : 'var(--bg-surface)',
              border: r.active ? '1px solid rgba(59,130,246,0.4)' : '1px solid var(--bg-raised)',
              borderRadius: 8, padding: '14px 16px',
              minWidth: 160, flex: '1 0 160px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <span style={{
                  fontSize: 10, fontWeight: 800,
                  fontFamily: 'JetBrains Mono, monospace',
                  color: r.active ? 'var(--orbital)' : 'var(--text-ghost)',
                }}>
                  F{r.phase}
                </span>
                {r.active && (
                  <span style={{
                    fontSize: 9, fontWeight: 700, padding: '1px 6px', borderRadius: 3,
                    background: 'rgba(59,130,246,0.2)', color: 'var(--orbital)',
                    border: '1px solid rgba(59,130,246,0.3)',
                  }}>
                    ATIVO
                  </span>
                )}
                {!r.active && (
                  <span style={{
                    fontSize: 9, color: 'var(--text-ghost)',
                    fontStyle: 'italic',
                  }}>
                    {r.status}
                  </span>
                )}
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: r.active ? 'var(--text-hi)' : 'var(--text-mid)', marginBottom: 6, lineHeight: 1.3 }}>
                {r.title}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-lo)', lineHeight: 1.5 }}>
                {r.desc}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer note */}
      <div style={{
        marginTop: 24, padding: '12px 16px',
        background: 'var(--bg-surface)', border: '1px solid var(--bg-raised)',
        borderRadius: 6, fontSize: 11, color: 'var(--text-ghost)', fontStyle: 'italic',
      }}>
        IGNIS Orbital · Plataforma de Inteligência Espacial Ambiental · FIAP GS 2026 ·
        Elias Sales de Freitas RM561257 · João Vitor Bernardo RM566427 ·
        Arquitetura preparada para integração com fontes orbitais públicas e comerciais.
        Dados demonstrativos — não afirmamos integração em tempo real com NASA, INPE ou ESA.
      </div>

    </div>
  );
}
```

- [ ] **Step 3.2: Verificar TypeScript**

```bash
npx tsc --noEmit
```
Expected: 0 erros.

---

## Task 4: Router + Sidebar wiring

**Files:**
- Modify: `src/router/index.tsx`
- Modify: `src/components/shared/GestorSidebar.tsx`

- [ ] **Step 4.1: Adicionar lazy import e rota no router**

Em `src/router/index.tsx`, após `const RiskRankingPage`:

```tsx
const EconomiaEspacialPage = React.lazy(() => import('@/pages/gestor/EconomiaEspacialPage'));
```

Na lista de `children` do `GestorLayout`, após `/gestor/esg`:

```tsx
{ path: '/gestor/economia-espacial', element: withSuspense(<EconomiaEspacialPage />) },
```

- [ ] **Step 4.2: Adicionar entrada na sidebar**

Em `src/components/shared/GestorSidebar.tsx`, adicionar ao array `NAV_ITEMS` após o item `/gestor/esg`:

```tsx
{ to: '/gestor/economia-espacial', label: 'Economia Espacial', icon: '🛰', end: false },
```

- [ ] **Step 4.3: Verificar TypeScript + build**

```bash
npx tsc --noEmit && npm run build
```
Expected: 0 erros TypeScript, build limpo.

- [ ] **Step 4.4: Commit parcial**

```bash
git add src/components/space-economy/ src/pages/gestor/EconomiaEspacialPage.tsx \
        src/router/index.tsx src/components/shared/GestorSidebar.tsx
git commit -m "feat: add space economy dashboard (/gestor/economia-espacial)"
```

---

## Task 5: Docs de entrega

**Files:**
- Create: `docs/entrega/README-ENTREGA.md`
- Create: `docs/entrega/SLIDES-CONTEUDO.md`
- Create: `docs/entrega/ROTEIRO-PITCH-3MIN.md`

- [ ] **Step 5.1: Criar docs/entrega/README-ENTREGA.md** (ver conteúdo no plano de execução)

- [ ] **Step 5.2: Criar docs/entrega/SLIDES-CONTEUDO.md** (ver conteúdo no plano de execução)

- [ ] **Step 5.3: Criar docs/entrega/ROTEIRO-PITCH-3MIN.md** (ver conteúdo no plano de execução)

- [ ] **Step 5.4: Commit docs**

```bash
git add docs/entrega/
git commit -m "docs: add delivery docs with space economy pitch content"
```

---

## Task 6: Push + Deploy

- [ ] **Step 6.1: Push origin master**

```bash
git push origin master
```

- [ ] **Step 6.2: Redeploy Vercel**

```bash
vercel --prod
```

- [ ] **Step 6.3: Validar rota em produção**

Abrir `https://ignis-fire-watch.vercel.app/gestor/economia-espacial` após login.
Expected: página renderiza com os 8 blocos, sidebar mostra "🛰 Economia Espacial".
