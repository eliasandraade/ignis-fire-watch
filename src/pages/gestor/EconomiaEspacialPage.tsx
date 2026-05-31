import { motion, useReducedMotion } from 'framer-motion';
import { SpaceValueChain } from '@/components/space-economy/SpaceValueChain';
import { SpaceImpactChart } from '@/components/space-economy/SpaceImpactChart';
import {
  OrbitalBackground,
  MissionGlow,
  SpaceMetricCard,
  OrbitalSectionHeader,
} from '@/components/orbital';
import { useProtectedAreas } from '@/hooks/useProtectedAreas';
import { useIncidents } from '@/hooks/useIncidents';
import { fadeUpVariants, staggerContainerVariants } from '@/lib/motion';

// ── Static data ───────────────────────────────────────────────────────────

const HERO_BADGES = [
  { label: 'Observação da Terra',  color: '#3b82f6' },
  { label: 'Sensoriamento Remoto', color: '#22c55e' },
  { label: 'Dados Orbitais',       color: '#a855f7' },
  { label: 'Geointeligência',      color: '#f97316' },
  { label: 'Resposta Ambiental',   color: '#ef4444' },
  { label: 'ESG',                  color: '#14b8a6' },
];

const ORBITAL_SOURCES = [
  {
    name: 'NASA FIRMS',
    type: 'Focos de calor e incêndios',
    use: 'Alertas de incêndio preventivos antes da denúncia chegar por canais tradicionais.',
    status: 'Fonte pública potencial',
    statusColor: '#3b82f6',
    dot: '#f97316',
  },
  {
    name: 'Sentinel / Copernicus',
    type: 'Imagens multiespectrais (ESA)',
    use: 'Detecção de perda vegetal, variações de umidade e supressão de cobertura.',
    status: 'Integração prevista',
    statusColor: '#a855f7',
    dot: '#22c55e',
  },
  {
    name: 'Landsat',
    type: 'Histórico de cobertura do solo',
    use: 'Análise de uso e ocupação do solo ao longo do tempo por bioma.',
    status: 'Fonte pública potencial',
    statusColor: '#3b82f6',
    dot: '#3b82f6',
  },
  {
    name: 'INPE / Queimadas',
    type: 'Focos de calor no Brasil',
    use: 'Base nacional de referência para alertas por bioma e estado.',
    status: 'Integração prevista',
    statusColor: '#a855f7',
    dot: '#ef4444',
  },
  {
    name: 'MapBiomas',
    type: 'Cobertura e uso da terra',
    use: 'Zoneamento, identificação de biomas e quantificação de áreas degradadas.',
    status: 'Fonte pública potencial',
    statusColor: '#3b82f6',
    dot: '#10b981',
  },
  {
    name: 'NOAA / Meteorologia',
    type: 'Variáveis climáticas e atmosféricas',
    use: 'Correlação entre padrões climáticos orbitais e risco ambiental sazonal.',
    status: 'Fonte pública potencial',
    statusColor: '#3b82f6',
    dot: '#60a5fa',
  },
];

const USE_CASES = [
  {
    icon: '🔥',
    title: 'Queimadas em Áreas Protegidas',
    flow: 'Foco de calor orbital → abertura automática de protocolo → resposta preventiva antes do alastramento.',
  },
  {
    icon: '🌲',
    title: 'Desmatamento e Supressão Vegetal',
    flow: 'Variação de NDVI detectada → alerta de supressão → fiscalização prioritária com evidência orbital.',
  },
  {
    icon: '🗺️',
    title: 'Zonas de Amortecimento',
    flow: 'Anomalia orbital em buffer de área protegida → monitoramento intensificado → proteção da área núcleo.',
  },
  {
    icon: '🚨',
    title: 'Apoio à Defesa Civil',
    flow: 'Dado climático orbital → coordenação antecipada de equipes → evacuação e resposta planejada.',
  },
  {
    icon: '📊',
    title: 'Relatórios ESG e Políticas Públicas',
    flow: 'Incidentes + área monitorada → indicadores quantitativos → embasamento de política e auditoria.',
  },
  {
    icon: '🔍',
    title: 'Priorização de Fiscalização',
    flow: 'Ranking de risco orbital → foco de autuação → maior eficiência operacional com mesmo recurso.',
  },
];

const ECONOMY_LAYERS = [
  {
    icon: '🛰',
    label: 'Infraestrutura Espacial',
    desc: 'Satélites · sensores orbitais · dados de missões de observação da Terra',
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

const ROADMAP = [
  {
    phase: 1,
    title: 'Dados Demonstrativos e Geointeligência',
    desc: 'Plataforma operacional com dados de base acadêmica e geointeligência simulada.',
    status: 'ATIVO',
    active: true,
  },
  {
    phase: 2,
    title: 'Importação de Bases Geoespaciais Oficiais',
    desc: 'Suporte a GeoJSON, Shapefile e KML de fontes como IBAMA, ICMBio e MMA.',
    status: 'Planejado',
    active: false,
  },
  {
    phase: 3,
    title: 'Integração com Dados Orbitais Públicos',
    desc: 'Focos de calor NASA FIRMS e INPE, imagens Sentinel/Copernicus via API.',
    status: 'Planejado',
    active: false,
  },
  {
    phase: 4,
    title: 'Modelos Preditivos de Risco Ambiental',
    desc: 'Machine learning sobre séries temporais de dados orbitais e histórico de incidentes.',
    status: 'Futuro',
    active: false,
  },
  {
    phase: 5,
    title: 'Marketplace de Inteligência Ambiental',
    desc: 'API aberta de geointeligência para gestores, RPPNs, órgãos públicos e empresas de ESG.',
    status: 'Visão',
    active: false,
  },
];

// ── Page ──────────────────────────────────────────────────────────────────

export default function EconomiaEspacialPage() {
  const { areas } = useProtectedAreas();
  const { incidents } = useIncidents();
  const reducedMotion = useReducedMotion();

  const totalHa = areas.reduce((sum, a) => sum + (a.hectares ?? 0), 0);
  const haLabel =
    totalHa >= 1000
      ? `${(totalHa / 1000).toFixed(1)}k ha`
      : `${totalHa} ha`;

  return (
    <div style={{ padding: 24, maxWidth: 1000, margin: '0 auto' }}>

      {/* ── Bloco 1: Hero ──────────────────────────────────────────── */}
      <div
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--bg-raised)',
          borderRadius: 10,
          padding: '28px 32px',
          marginBottom: 36,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Orbital background layer */}
        <OrbitalBackground intensity="low" showGrid showOrbits showDots />

        {/* Mission glow accent */}
        <MissionGlow
          size={320}
          opacity={0.09}
          style={{
            position: 'absolute',
            top: -100,
            right: -80,
            pointerEvents: 'none',
          }}
        />

        {/* Animated hero content */}
        <motion.div
          variants={fadeUpVariants}
          initial={reducedMotion ? false : 'hidden'}
          animate="visible"
          custom={0}
          style={{ position: 'relative', zIndex: 1 }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: 14,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 24, lineHeight: 1 }}>🛰</span>
              <h1
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  margin: 0,
                  color: 'var(--text-hi)',
                  lineHeight: 1.2,
                }}
              >
                Economia Espacial aplicada à proteção ambiental
              </h1>
            </div>
            <div
              style={{
                padding: '5px 11px',
                background: 'var(--bg-raised)',
                borderRadius: 5,
                fontSize: 10,
                color: 'var(--text-ghost)',
                fontStyle: 'italic',
                flexShrink: 0,
                marginLeft: 20,
                whiteSpace: 'nowrap',
              }}
            >
              dados simulados · demonstração acadêmica FIAP GS 2026
            </div>
          </div>

          {/* Central message — key phrase */}
          <div
            style={{
              background: 'oklch(60% 0.18 220 / 0.07)',
              border: '1px solid oklch(60% 0.18 220 / 0.22)',
              borderLeft: '3px solid var(--orbital)',
              borderRadius: 6,
              padding: '10px 16px',
              marginBottom: 16,
            }}
          >
            <p style={{ margin: 0, fontSize: 13, color: 'var(--text-hi)', fontWeight: 600, lineHeight: 1.55 }}>
              O IGNIS Orbital atua na camada de aplicação da economia espacial: transforma
              infraestrutura orbital em inteligência ambiental e resposta operacional.
            </p>
          </div>

          <p
            style={{
              fontSize: 13,
              color: 'var(--text-lo)',
              margin: '0 0 14px',
              lineHeight: 1.75,
              maxWidth: 700,
            }}
          >
            Cada dado orbital vira protocolo, alerta, relatório ESG ou decisão de resposta em campo.
            APIs espaciais transformam infraestrutura complexa em serviço acessível a gestores
            públicos e privados — reduzindo custo de monitoramento físico e ampliando cobertura.
          </p>

          {/* Flow chain summary */}
          <div
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 11,
              color: 'var(--text-ghost)',
              marginBottom: 20,
              letterSpacing: '0.03em',
            }}
          >
            Satélite → dado orbital → geointeligência → alerta → protocolo → equipe → impacto econômico e ambiental
          </div>

          {/* Animated badges */}
          <motion.div
            variants={staggerContainerVariants}
            initial={reducedMotion ? false : 'hidden'}
            animate="visible"
            style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}
          >
            {HERO_BADGES.map((b) => (
              <motion.span
                key={b.label}
                variants={fadeUpVariants}
                style={{
                  padding: '4px 13px',
                  borderRadius: 20,
                  fontSize: 11,
                  fontWeight: 600,
                  background: `${b.color}22`,
                  color: b.color,
                  border: `1px solid ${b.color}44`,
                }}
              >
                {b.label}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* ── Bloco 2: Cadeia de valor ───────────────────────────────── */}
      <div style={{ marginBottom: 44 }}>
        <SpaceValueChain />
      </div>

      {/* ── Bloco 3: Fontes orbitais ───────────────────────────────── */}
      <div style={{ marginBottom: 44 }}>
        <div style={{ marginBottom: 20 }}>
          <OrbitalSectionHeader icon="📡">Fontes Orbitais e Espaciais</OrbitalSectionHeader>
        </div>
        <motion.div
          variants={staggerContainerVariants}
          initial={reducedMotion ? false : 'hidden'}
          animate="visible"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 14,
          }}
        >
          {ORBITAL_SOURCES.map((src) => (
            <motion.div
              key={src.name}
              variants={fadeUpVariants}
              whileHover={reducedMotion ? {} : { y: -2 }}
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--bg-raised)',
                borderRadius: 8,
                padding: '14px 16px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 6,
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: src.dot,
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-hi)' }}
                >
                  {src.name}
                </span>
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: 'var(--text-ghost)',
                  marginBottom: 5,
                }}
              >
                {src.type}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: 'var(--text-lo)',
                  marginBottom: 10,
                  lineHeight: 1.55,
                }}
              >
                {src.use}
              </div>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  padding: '2px 8px',
                  borderRadius: 4,
                  background: `${src.statusColor}18`,
                  color: src.statusColor,
                  border: `1px solid ${src.statusColor}33`,
                }}
              >
                {src.status}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* ── Bloco 4: Métricas ──────────────────────────────────────── */}
      <div style={{ marginBottom: 44 }}>
        <div style={{ marginBottom: 20 }}>
          <OrbitalSectionHeader icon="📊">Métricas de Economia Espacial</OrbitalSectionHeader>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 14,
            marginBottom: 14,
          }}
        >
          <SpaceMetricCard
            value={haLabel}
            label="Área monitorada (orbital)"
            accent="var(--orbital)"
            sublabel="observação da Terra"
            delay={0}
          />
          <SpaceMetricCard
            value={37}
            label="Alertas orbitais simulados"
            accent="#f97316"
            sublabel="dados orbitais"
            delay={0.05}
          />
          <SpaceMetricCard
            value="até 42%"
            label="Redução no tempo de triagem"
            accent="#22c55e"
            sublabel="eficiência geoespacial"
            delay={0.10}
          />
          <SpaceMetricCard
            value="R$ 184k"
            label="Custo de resposta evitado*"
            accent="#a855f7"
            sublabel="impacto econômico"
            delay={0.15}
          />
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 14,
          }}
        >
          <SpaceMetricCard
            value={incidents.length}
            label="Incidentes com suporte geo."
            accent="#ef4444"
            sublabel="API real"
            delay={0.20}
          />
          <SpaceMetricCard
            value={areas.length}
            label="Áreas protegidas monitoradas"
            accent="var(--orbital)"
            sublabel="geodados"
            delay={0.25}
          />
          <SpaceMetricCard
            value={6}
            label="Fontes orbitais potenciais"
            accent="#38bdf8"
            sublabel="sensoriamento remoto"
            delay={0.30}
          />
          <SpaceMetricCard
            value={5}
            label="Fases de integração espacial"
            accent="#f59e0b"
            sublabel="roadmap orbital"
            delay={0.35}
          />
        </div>
        <div
          style={{
            marginTop: 10,
            fontSize: 11,
            color: 'var(--text-ghost)',
            fontStyle: 'italic',
          }}
        >
          Esta página usa métricas demonstrativas acadêmicas e arquitetura preparada para
          integração futura com fontes orbitais públicas e comerciais. * métricas simuladas
          para demonstração acadêmica · IGNIS Orbital · FIAP GS 2026 · áreas e incidentes
          usam dados reais da API quando disponíveis.
        </div>
      </div>

      {/* ── Bloco 5: Gráfico RadarChart ────────────────────────────── */}
      <div style={{ marginBottom: 44 }}>
        <SpaceImpactChart />
      </div>

      {/* ── Bloco 6: Casos de uso ──────────────────────────────────── */}
      <div style={{ marginBottom: 44 }}>
        <div style={{ marginBottom: 20 }}>
          <OrbitalSectionHeader icon="💡">Casos de Uso</OrbitalSectionHeader>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 14,
          }}
        >
          {USE_CASES.map((uc) => (
            <div
              key={uc.title}
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--bg-raised)',
                borderRadius: 8,
                padding: '16px',
              }}
            >
              <div style={{ fontSize: 22, marginBottom: 8 }}>{uc.icon}</div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: 'var(--text-hi)',
                  marginBottom: 8,
                }}
              >
                {uc.title}
              </div>
              <div
                style={{ fontSize: 12, color: 'var(--text-lo)', lineHeight: 1.65 }}
              >
                {uc.flow}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bloco 7: Modelo econômico ──────────────────────────────── */}
      <div style={{ marginBottom: 44 }}>
        <div style={{ marginBottom: 20 }}>
          <OrbitalSectionHeader icon="⚡">Como a Economia Espacial gera valor aqui</OrbitalSectionHeader>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 24,
          }}
        >
          {/* Left: explanatory text */}
          <div
            style={{ fontSize: 13, color: 'var(--text-lo)', lineHeight: 1.85 }}
          >
            <p style={{ margin: '0 0 12px' }}>
              Satélites de observação da Terra{' '}
              <strong style={{ color: 'var(--text-mid)' }}>
                reduzem radicalmente o custo
              </strong>{' '}
              de monitoramento ambiental físico — cobrindo em minutos o que levaria
              dias de sobrevoo ou inspeção terrestre.
            </p>
            <p style={{ margin: '0 0 12px' }}>
              Dados orbitais{' '}
              <strong style={{ color: 'var(--text-mid)' }}>
                aumentam a escala de cobertura
              </strong>{' '}
              sem aumentar proporcionalmente o custo operacional. APIs espaciais
              transformam infraestrutura complexa em serviço acessível a gestores
              públicos e privados.
            </p>
            <p style={{ margin: 0 }}>
              Relatórios ESG comprovam impacto mensurável. Proteção ambiental vira dado
              auditável. O IGNIS atua como{' '}
              <strong style={{ color: 'var(--text-mid)' }}>
                camada de aplicação
              </strong>{' '}
              da economia espacial, convertendo dados orbitais em decisão operacional,
              valor público e governança ambiental.
            </p>
          </div>

          {/* Right: value stack */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {ECONOMY_LAYERS.map((layer) => (
              <div
                key={layer.label}
                style={{
                  background: 'var(--bg-surface)',
                  border: `1px solid ${layer.color}33`,
                  borderLeft: `3px solid ${layer.color}`,
                  borderRadius: 6,
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 10,
                }}
              >
                <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>
                  {layer.icon}
                </span>
                <div>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: layer.color,
                      marginBottom: 3,
                    }}
                  >
                    {layer.label}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: 'var(--text-lo)',
                      lineHeight: 1.5,
                    }}
                  >
                    {layer.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bloco 8: Roadmap ───────────────────────────────────────── */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ marginBottom: 20 }}>
          <OrbitalSectionHeader icon="🗺️">Próximas Integrações Espaciais</OrbitalSectionHeader>
        </div>
        <div
          style={{
            display: 'flex',
            gap: 12,
            overflowX: 'auto',
            paddingBottom: 6,
          }}
        >
          {ROADMAP.map((r) => (
            <div
              key={r.phase}
              style={{
                background: r.active
                  ? 'rgba(59,130,246,0.08)'
                  : 'var(--bg-surface)',
                border: r.active
                  ? '1px solid rgba(59,130,246,0.35)'
                  : '1px solid var(--bg-raised)',
                borderRadius: 8,
                padding: '14px 16px',
                minWidth: 164,
                flex: '1 0 164px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  marginBottom: 8,
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    fontFamily: 'JetBrains Mono, monospace',
                    color: r.active ? 'var(--orbital)' : 'var(--text-ghost)',
                  }}
                >
                  F{r.phase}
                </span>
                {r.active ? (
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 700,
                      padding: '1px 6px',
                      borderRadius: 3,
                      background: 'rgba(59,130,246,0.2)',
                      color: 'var(--orbital)',
                      border: '1px solid rgba(59,130,246,0.3)',
                    }}
                  >
                    ATIVO
                  </span>
                ) : (
                  <span
                    style={{
                      fontSize: 9,
                      color: 'var(--text-ghost)',
                      fontStyle: 'italic',
                    }}
                  >
                    {r.status}
                  </span>
                )}
              </div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: r.active ? 'var(--text-hi)' : 'var(--text-mid)',
                  marginBottom: 6,
                  lineHeight: 1.35,
                }}
              >
                {r.title}
              </div>
              <div
                style={{ fontSize: 11, color: 'var(--text-lo)', lineHeight: 1.55 }}
              >
                {r.desc}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer / autoria */}
      <div
        style={{
          marginTop: 28,
          padding: '12px 16px',
          background: 'var(--bg-surface)',
          border: '1px solid var(--bg-raised)',
          borderRadius: 6,
          fontSize: 11,
          color: 'var(--text-ghost)',
          fontStyle: 'italic',
          lineHeight: 1.6,
        }}
      >
        IGNIS Orbital · Plataforma de Inteligência Espacial Ambiental · FIAP GS 2026 ·
        Elias Sales de Freitas RM561257 · João Vitor Bernardo RM566427 ·
        Arquitetura preparada para integração com fontes orbitais públicas e comerciais.
        Dados demonstrativos — não afirmamos integração em tempo real com NASA, INPE ou ESA.
      </div>
    </div>
  );
}
