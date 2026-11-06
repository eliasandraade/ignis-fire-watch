import { useEffect, useMemo, useState } from 'react';
import { CircleMarker, GeoJSON, MapContainer, Popup, TileLayer, ZoomControl, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  useDetectionDetail,
  useDetections,
  useJurisdictionGeoJSON,
  useMunicipalities,
  useSources,
} from '@/hooks/useOrbital';
import {
  CEARA_BOUNDS,
  PERIODS,
  SOURCE_STYLE,
  STATE_COLOR,
  STATE_LABEL,
  THERMAL_ANOMALY_DISCLAIMER,
  brightnessText,
  confidenceText,
  coordinatesText,
  dateRangeWindow,
  emptyMessage,
  formatAge,
  formatInstant,
  frpText,
  periodWindow,
  type PeriodKey,
} from '@/lib/orbital';
import { tileConfig } from '@/lib/tiles';
import type { Detection, DetectionFilters, OrbitalSource, SourceStatus } from '@/services/api/orbitalTypes';

interface Props {
  /** public: no ingestion-run identifiers or raw provider rows. */
  mode: 'gestor' | 'public';
}

const PANEL: React.CSSProperties = {
  background: 'var(--bg-surface)',
  border: '1px solid var(--bg-raised)',
  borderRadius: 8,
  padding: 12,
};
const LABEL: React.CSSProperties = {
  fontSize: 10,
  fontWeight: 700,
  color: 'var(--text-ghost)',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
};
const INPUT: React.CSSProperties = {
  width: '100%',
  background: 'var(--bg-panel)',
  color: 'var(--text-hi)',
  border: '1px solid var(--bg-raised)',
  borderRadius: 6,
  padding: '6px 8px',
  fontSize: 13,
};

function FitCeara() {
  const map = useMap();
  useEffect(() => {
    map.fitBounds(CEARA_BOUNDS, { padding: [12, 12] });
  }, [map]);
  return null;
}

function FlyTo({ target }: { target: Detection | null }) {
  const map = useMap();
  useEffect(() => {
    if (target) map.flyTo([target.lat, target.lng], Math.max(map.getZoom(), 10), { duration: 0.6 });
  }, [map, target]);
  return null;
}

function SourceBadge({ s }: { s: SourceStatus }) {
  return (
    <div data-testid={`source-status-${s.source}`} data-state={s.state} style={{ ...PANEL, padding: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'center' }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-hi)' }}>
          <span style={{ display: 'inline-block', width: 9, height: 9, borderRadius: '50%',
                         background: SOURCE_STYLE[s.source].color, marginRight: 6 }} />
          {s.label}
        </span>
        <span style={{ fontSize: 11, fontWeight: 700, color: STATE_COLOR[s.state] }}>
          {STATE_LABEL[s.state]}
        </span>
      </div>
      <div style={{ fontSize: 11, color: 'var(--text-lo)', marginTop: 4 }}>{s.message}</div>
      <div style={{ fontSize: 11, color: 'var(--text-ghost)', marginTop: 4, lineHeight: 1.5 }}>
        Última ingestão bem-sucedida: {s.last_success_at ? `${formatInstant(s.last_success_at)} (${formatAge(s.last_success_at)})` : 'nunca'}
        <br />
        Observação mais recente no banco: {formatInstant(s.latest_observation_at)}
        {s.origin === 'fixture' && (
          <>
            <br />
            <strong style={{ color: '#f59e0b' }}>Amostra histórica pública (fixture) — não são dados atuais.</strong>
          </>
        )}
      </div>
    </div>
  );
}

function DetectionFields({ d, mode }: { d: Detection; mode: Props['mode'] }) {
  const rows: [string, string | null][] = [
    ['Fonte', SOURCE_STYLE[d.source].label],
    ['Produto / satélite', `${d.product} · ${d.satellite} (${d.instrument})`],
    ['Observado em', formatInstant(d.observed_at)],
    ['Ingerido em', formatInstant(d.ingested_at)],
    ['Município (IBGE 2025)', `${d.jurisdiction.name} · ${d.jurisdiction.ibge_code}`],
    ['Coordenadas', coordinatesText(d.lat, d.lng)],
    ['Confiança', confidenceText(d)],
    ['FRP', frpText(d)],
    ['Brilho', brightnessText(d)],
    ['Período', d.daynight === 'D' ? 'diurno' : d.daynight === 'N' ? 'noturno' : null],
    ['Id no provedor', d.provider_record_id],
    ['Execução de ingestão', mode === 'gestor' ? d.ingestion_run_id : null],
  ];
  return (
    <dl style={{ margin: 0, display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '4px 10px', fontSize: 12 }}>
      {rows.filter(([, v]) => v).map(([k, v]) => (
        <div key={k} style={{ display: 'contents' }}>
          <dt style={{ color: 'var(--text-ghost)' }}>{k}</dt>
          <dd style={{ margin: 0, color: 'var(--text-hi)', wordBreak: 'break-word' }}>{v}</dd>
        </div>
      ))}
    </dl>
  );
}

function DetectionPanel({ d, mode, onClose }: { d: Detection; mode: Props['mode']; onClose: () => void }) {
  const detail = useDetectionDetail(mode === 'gestor' ? d.id : null);
  return (
    <section data-testid="detection-detail" aria-label="Detalhe do foco de calor" style={{ ...PANEL, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-hi)' }}>Foco de calor</span>
        <button type="button" onClick={onClose} aria-label="Fechar detalhe"
                style={{ background: 'none', border: 'none', color: 'var(--text-ghost)', cursor: 'pointer', fontSize: 18 }}>×</button>
      </div>
      <DetectionFields d={d} mode={mode} />
      <div role="note" style={{ fontSize: 11, color: '#fbbf24', background: '#f59e0b14', border: '1px solid #f59e0b40', borderRadius: 6, padding: 8 }}>
        {THERMAL_ANOMALY_DISCLAIMER}
      </div>
      {mode === 'gestor' && detail.data && (
        <details>
          <summary style={{ fontSize: 12, color: 'var(--text-lo)', cursor: 'pointer' }}>Registro original do provedor</summary>
          <pre style={{ fontSize: 10, color: 'var(--text-lo)', whiteSpace: 'pre-wrap', margin: '6px 0 0' }}>
            {JSON.stringify(detail.data.raw, null, 2)}
          </pre>
        </details>
      )}
    </section>
  );
}

export function OrbitalExplorer({ mode }: Props) {
  const [period, setPeriod] = useState<PeriodKey>('7d');
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');
  const [source, setSource] = useState<OrbitalSource | ''>('');
  const [satellite, setSatellite] = useState('');
  const [jurisdiction, setJurisdiction] = useState('');
  const [showMunicipalities, setShowMunicipalities] = useState(true);
  const [selected, setSelected] = useState<Detection | null>(null);
  const [nowKey, setNowKey] = useState(() => new Date());

  const window_ = useMemo(() => {
    if (period === 'custom') return dateRangeWindow(customFrom, customTo);
    return periodWindow(period, nowKey);
  }, [period, customFrom, customTo, nowKey]);

  const filters: DetectionFilters | null = window_
    ? {
        ...window_,
        source: source || undefined,
        satellite: satellite || undefined,
        jurisdiction: jurisdiction || undefined,
      }
    : null;

  const detections = useDetections(filters ?? periodWindow('7d', nowKey));
  const sources = useSources();
  const state = useJurisdictionGeoJSON('state');
  const municipalitiesGeo = useJurisdictionGeoJSON('municipality', showMunicipalities);
  const municipalities = useMunicipalities(filters ?? periodWindow('7d', nowKey));

  const items = useMemo(() => detections.data?.items ?? [], [detections.data]);
  const sourceList = sources.data ?? detections.data?.sources ?? [];
  const satellites = useMemo(
    () => Array.from(new Set(items.map(d => d.satellite))).sort(),
    [items],
  );
  const tiles = tileConfig();
  const renderer = useMemo(() => L.canvas({ padding: 0.5 }), []);

  return (
    <div style={{ display: 'flex', height: '100%', minHeight: 520, overflow: 'hidden', flexWrap: 'wrap' }}>
      <aside aria-label="Filtros e situação das fontes" className="ignis-orbital-aside" style={{
        width: 330, maxWidth: '100%', background: 'var(--bg-panel)', borderRight: '1px solid var(--bg-raised)',
        overflowY: 'auto', padding: 12, display: 'flex', flexDirection: 'column', gap: 10, maxHeight: '100%',
      }}>
        <div style={LABEL}>Período de observação</div>
        <select aria-label="Período" data-testid="filter-period" value={period} style={INPUT}
                onChange={e => { setPeriod(e.target.value as PeriodKey); setNowKey(new Date()); }}>
          {PERIODS.map(p => <option key={p.key} value={p.key}>{p.label}</option>)}
          <option value="custom">Intervalo de datas…</option>
        </select>
        {period === 'custom' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
            <input aria-label="Data inicial" data-testid="filter-from" type="date" value={customFrom} style={INPUT}
                   onChange={e => setCustomFrom(e.target.value)} />
            <input aria-label="Data final" data-testid="filter-to" type="date" value={customTo} style={INPUT}
                   onChange={e => setCustomTo(e.target.value)} />
            {!window_ && (
              <span style={{ gridColumn: '1 / -1', fontSize: 11, color: '#f59e0b' }}>
                Informe datas válidas (até 92 dias, UTC).
              </span>
            )}
          </div>
        )}

        <div style={LABEL}>Fonte</div>
        <select aria-label="Fonte" data-testid="filter-source" value={source} style={INPUT}
                onChange={e => setSource(e.target.value as OrbitalSource | '')}>
          <option value="">Todas</option>
          <option value="NASA_FIRMS">NASA FIRMS</option>
          <option value="INPE_QUEIMADAS">INPE Programa Queimadas</option>
        </select>

        <div style={LABEL}>Satélite</div>
        <select aria-label="Satélite" data-testid="filter-satellite" value={satellite} style={INPUT}
                onChange={e => setSatellite(e.target.value)}>
          <option value="">Todos</option>
          {Array.from(new Set([...satellites, satellite].filter(Boolean))).map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        <div style={LABEL}>Município (malha IBGE {municipalities.data?.dataset.version ?? ''})</div>
        <select aria-label="Município" data-testid="filter-municipality" value={jurisdiction} style={INPUT}
                onChange={e => { setJurisdiction(e.target.value); setSelected(null); }}>
          <option value="">Todos os 184 municípios</option>
          {(municipalities.data?.items ?? []).map(m => (
            <option key={m.ibge_code} value={m.ibge_code}>
              {m.name} ({m.detections})
            </option>
          ))}
        </select>

        <label style={{ fontSize: 12, color: 'var(--text-lo)', display: 'flex', gap: 6, alignItems: 'center' }}>
          <input type="checkbox" checked={showMunicipalities} onChange={e => setShowMunicipalities(e.target.checked)} />
          Limites municipais
        </label>
        <label style={{ fontSize: 12, color: 'var(--text-ghost)', display: 'flex', gap: 6, alignItems: 'center' }}
               title="Nenhuma base oficial validada de unidades de conservação foi carregada">
          <input type="checkbox" disabled data-testid="layer-uc" />
          Unidades de conservação — indisponível (base oficial não carregada)
        </label>

        <div style={LABEL}>Situação das fontes</div>
        {sources.isError && <div data-testid="sources-error" style={{ fontSize: 12, color: '#ef4444' }}>Não foi possível consultar a situação das fontes.</div>}
        {sourceList.map(s => <SourceBadge key={s.source} s={s} />)}

        <div style={LABEL}>Focos no período</div>
        {detections.isLoading && <div data-testid="detections-loading" style={{ fontSize: 12, color: 'var(--text-lo)' }}>Carregando focos persistidos…</div>}
        {detections.isError && (
          <div data-testid="detections-error" role="alert" style={{ fontSize: 12, color: '#ef4444' }}>
            Falha ao consultar a API de focos. Nada é exibido no lugar dos dados.
            <button type="button" onClick={() => detections.refetch()} style={{ marginLeft: 6 }}>Tentar novamente</button>
          </div>
        )}
        {detections.data && (
          <>
            <div data-testid="detection-count" data-count={detections.data.total} style={{ fontSize: 13, color: 'var(--text-hi)' }}>
              <strong>{detections.data.total.toLocaleString('pt-BR')}</strong> focos persistidos
              {detections.data.truncated && (
                <span data-testid="truncated-notice" style={{ color: '#f59e0b' }}>
                  {' '}· exibindo os {items.length.toLocaleString('pt-BR')} mais recentes — refine os filtros
                </span>
              )}
            </div>
            {detections.data.total === 0 && (
              <div data-testid="empty-state" style={{ fontSize: 12, color: 'var(--text-lo)' }}>
                {emptyMessage(sourceList, source || undefined)}
              </div>
            )}
            <ol aria-label="Focos mais recentes" style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
              {items.slice(0, 50).map(d => (
                <li key={d.id}>
                  <button type="button" data-testid="detection-item" onClick={() => setSelected(d)}
                          style={{ width: '100%', textAlign: 'left', background: selected?.id === d.id ? 'var(--bg-raised)' : 'transparent',
                                   border: '1px solid var(--bg-raised)', borderRadius: 6, padding: '6px 8px', cursor: 'pointer',
                                   color: 'var(--text-hi)', fontSize: 12 }}>
                    <span style={{ color: SOURCE_STYLE[d.source].color, fontWeight: 700 }}>{SOURCE_STYLE[d.source].short}</span>
                    {' '}{d.jurisdiction.name} · {d.satellite}
                    <br />
                    <span style={{ color: 'var(--text-ghost)' }}>{formatInstant(d.observed_at)}</span>
                  </button>
                </li>
              ))}
            </ol>
          </>
        )}
      </aside>

      <div style={{ flex: 1, minWidth: 300, position: 'relative', minHeight: 420 }} data-testid="orbital-map">
        <MapContainer
          bounds={CEARA_BOUNDS}
          zoom={7}
          minZoom={6}
          maxBounds={[[-12, -46], [1, -33]]}
          preferCanvas
          zoomControl={false}
          style={{ width: '100%', height: '100%', minHeight: 420 }}
        >
          <FitCeara />
          <FlyTo target={selected} />
          <TileLayer url={tiles.url} attribution={tiles.attribution} maxZoom={tiles.maxZoom} />
          <ZoomControl position="bottomright" />
          {state.data && (
            <GeoJSON key="state" data={state.data as GeoJSON.FeatureCollection}
                     style={{ color: '#f97316', weight: 2.5, fill: false }} interactive={false} />
          )}
          {showMunicipalities && municipalitiesGeo.data && (
            <GeoJSON key={`munis-${jurisdiction}`} data={municipalitiesGeo.data as GeoJSON.FeatureCollection}
                     style={feature => ({
                       color: '#94a3b8',
                       weight: feature?.id === jurisdiction ? 2.5 : 0.6,
                       fillOpacity: feature?.id === jurisdiction ? 0.08 : 0,
                     })}
                     onEachFeature={(feature, layer) => layer.bindTooltip(
                       `${feature.properties.name} · ${feature.properties.ibge_code}`, { sticky: true })} />
          )}
          {items.map(d => (
            <CircleMarker key={d.id} center={[d.lat, d.lng]} radius={selected?.id === d.id ? 8 : 5}
                          renderer={renderer}
                          pathOptions={{ color: '#0f172a', weight: 1, fillColor: SOURCE_STYLE[d.source].color, fillOpacity: 0.9 }}
                          eventHandlers={{ click: () => setSelected(d) }}>
              <Popup>
                <div data-testid="detection-popup" style={{ minWidth: 220 }}>
                  <DetectionFields d={d} mode={mode} />
                  <p style={{ fontSize: 11, margin: '6px 0 0' }}>{THERMAL_ANOMALY_DISCLAIMER}</p>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>

        <div aria-label="Legenda" data-testid="map-legend" className="ignis-map-legend" style={{
          position: 'absolute', left: 10, bottom: 10, zIndex: 1000, ...PANEL, padding: '8px 10px',
          background: 'oklch(14% 0.02 240 / 92%)', maxWidth: 280,
        }}>
          {(Object.keys(SOURCE_STYLE) as OrbitalSource[]).map(s => (
            <div key={s} style={{ fontSize: 11, color: 'var(--text-hi)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: SOURCE_STYLE[s].color, border: '1px solid #0f172a' }} />
              {SOURCE_STYLE[s].label}
            </div>
          ))}
          <div style={{ fontSize: 11, color: 'var(--text-hi)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 14, height: 0, borderTop: '2.5px solid #f97316' }} /> Limite do Ceará (IBGE 2025)
          </div>
          <div style={{ fontSize: 10, color: 'var(--text-ghost)', marginTop: 4 }}>
            Cores distinguem a fonte, não a gravidade. {THERMAL_ANOMALY_DISCLAIMER}
          </div>
        </div>

        {selected && (
          <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 1000, width: 320, maxWidth: 'calc(100% - 20px)', maxHeight: 'calc(100% - 20px)', overflowY: 'auto' }}>
            <DetectionPanel d={selected} mode={mode} onClose={() => setSelected(null)} />
          </div>
        )}
      </div>
    </div>
  );
}
