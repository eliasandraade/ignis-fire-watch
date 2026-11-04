import { Link } from 'react-router-dom';
import { OrbitalDashboardSection } from '@/components/orbital-map/OrbitalDashboardSection';

/**
 * Public portal. Shows only data that can be published: satellite heat spots
 * (NASA FIRMS / INPE, public) persisted by IGNIS and official IBGE boundaries.
 * No incidents, reports, people, teams or internal identifiers.
 */
const GLOSSARY: { term: string; text: string }[] = [
  {
    term: 'Foco de calor (detecção orbital)',
    text: 'Pixel em que um satélite mediu temperatura anômala. Pode ser queimada, incêndio, chaminé industrial ou reflexo. É o único dado exibido neste portal.',
  },
  {
    term: 'Alerta',
    text: 'Sinal interno para que um operador analise um ou mais focos. Não é publicado aqui e não aciona nenhum órgão.',
  },
  {
    term: 'Incidente',
    text: 'Ocorrência registrada e acompanhada por um operador humano autorizado, depois de avaliação. Nenhum foco vira incidente automaticamente.',
  },
  {
    term: 'Incêndio confirmado',
    text: 'Só existe após verificação em campo ou por órgão competente (Bombeiros, Defesa Civil). Este protótipo não tem integração com esses órgãos.',
  },
  {
    term: 'Simulação / demonstração',
    text: 'Conteúdo fictício para treino ou apresentação. Quando existir, é sempre rotulado como tal.',
  },
];

export default function PublicDashboardPage() {
  return (
    <div style={{ background: 'var(--bg-void)', minHeight: '100vh' }}>
      <div style={{
        padding: '48px 24px 32px',
        background: 'linear-gradient(180deg, oklch(12% 0.025 240) 0%, var(--bg-void) 100%)',
        borderBottom: '1px solid var(--bg-raised)',
      }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ fontSize: 11, color: 'var(--orbital)', fontWeight: 700, letterSpacing: '0.2em',
                        textTransform: 'uppercase', marginBottom: 12 }}>
            Monitoramento ambiental do Ceará
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 800, color: 'var(--text-hi)', letterSpacing: '-0.03em',
                       margin: '0 0 12px', lineHeight: 1.1 }}>
            IGNIS Orbital
          </h1>
          <p style={{ fontSize: 15, color: 'var(--text-lo)', margin: '0 0 16px', lineHeight: 1.6, maxWidth: 640 }}>
            Focos de calor detectados por satélite (NASA FIRMS e INPE Programa Queimadas),
            gravados pelo IGNIS e localizados nos 184 municípios oficiais do Ceará (malha IBGE 2025).
          </p>
          <div role="note" style={{ padding: '10px 14px', background: 'oklch(12% 0.025 240)', border: '1px solid var(--bg-raised)',
                                    borderRadius: 6, fontSize: 12, color: 'var(--text-ghost)', marginBottom: 20, maxWidth: 720 }}>
            Protótipo em validação, não operacional. Focos de calor não são incêndios confirmados.
            Em emergência, ligue 193 (Corpo de Bombeiros).
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link to="/public/map" style={{ display: 'inline-block', padding: '12px 24px', background: 'var(--orbital)',
                                             color: 'white', borderRadius: 8, textDecoration: 'none', fontSize: 14, fontWeight: 700 }}>
              Ver mapa de focos
            </Link>
            <Link to="/public/report" style={{ display: 'inline-block', padding: '12px 24px', border: '1px solid var(--bg-raised)',
                                                color: 'var(--text-mid)', borderRadius: 8, textDecoration: 'none', fontSize: 14 }}>
              Registrar denúncia
            </Link>
          </div>
        </div>
      </div>

      <div style={{ padding: '32px 24px', maxWidth: 960, margin: '0 auto' }}>
        <OrbitalDashboardSection mapLink="/public/map" />

        <section aria-label="Entenda os termos" style={{ marginTop: 8 }}>
          <h2 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-mid)', textTransform: 'uppercase',
                       letterSpacing: '0.08em', margin: '0 0 12px' }}>
            Entenda os termos
          </h2>
          <dl style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 10, margin: 0 }}>
            {GLOSSARY.map(g => (
              <div key={g.term} style={{ background: 'var(--bg-surface)', border: '1px solid var(--bg-raised)', borderRadius: 8, padding: 12 }}>
                <dt style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-hi)', marginBottom: 4 }}>{g.term}</dt>
                <dd style={{ fontSize: 12, color: 'var(--text-lo)', margin: 0, lineHeight: 1.5 }}>{g.text}</dd>
              </div>
            ))}
          </dl>
        </section>

        <p style={{ fontSize: 11, color: 'var(--text-ghost)', marginTop: 24 }}>
          Fontes: NASA FIRMS (LANCE/EOSDIS) e INPE — Programa Queimadas (dados abertos). Limites
          municipais: IBGE, Malha Municipal Digital 2025 (finalidade estatística; o IBGE não demarca limites legais).
          Mapa base: © colaboradores do OpenStreetMap.
        </p>
      </div>
    </div>
  );
}
