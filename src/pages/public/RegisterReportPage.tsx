import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { OrbitalMap } from '@/components/shared/OrbitalMap';
import { PROTECTED_AREAS } from '@/data/areas';
import type { OccurrenceType, RiskLevel } from '@/types/domain';
import { Marker, useMapEvents } from 'react-leaflet';

const OCCURRENCE_LABELS: Record<OccurrenceType, string> = {
  'incendio':          'Incêndio Florestal',
  'queimada':          'Queimada',
  'desmatamento':      'Desmatamento Ilegal',
  'caca':              'Caça Ilegal',
  'pesca-ilegal':      'Pesca Ilegal',
  'mineracao':         'Mineração Ilegal',
  'despejo-residuos':  'Despejo de Resíduos',
  'especie-invasora':  'Espécie Invasora',
  'contaminacao-agua': 'Contaminação de Água',
  'outro':             'Outro',
};

const schema = z.object({
  occurrenceType: z.enum(['incendio','queimada','desmatamento','caca','pesca-ilegal',
                           'mineracao','despejo-residuos','especie-invasora',
                           'contaminacao-agua','outro'] as [OccurrenceType, ...OccurrenceType[]]),
  areaId:         z.string().optional(),
  description:    z.string().min(20, 'Descreva com pelo menos 20 caracteres'),
  urgency:        z.enum(['critical','high','medium','low'] as [RiskLevel, ...RiskLevel[]]),
  isAnonymous:    z.boolean(),
  reporterName:   z.string().optional(),
  declaration:    z.boolean().refine(v => v === true, 'Declaração obrigatória'),
});
type FormData = z.infer<typeof schema>;

function LocationPicker({ onPick }: { onPick: (lat: number, lng: number) => void }) {
  const [pos, setPos] = useState<[number, number] | null>(null);
  useMapEvents({
    click(e) {
      setPos([e.latlng.lat, e.latlng.lng]);
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return pos ? <Marker position={pos} /> : null;
}

export default function RegisterReportPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting }, watch } =
    useForm<FormData>({
      resolver: zodResolver(schema),
      defaultValues: {
        areaId: searchParams.get('areaId') ?? '',
        isAnonymous: false,
        urgency: 'medium',
      },
    });

  const isAnon = watch('isAnonymous');

  const onSubmit = async (_data: FormData) => {
    await new Promise(r => setTimeout(r, 500));
    const id = `RPT-${Date.now()}`;
    navigate(`/public/report/status/${id}`);
  };

  const inputStyle = (hasError?: boolean): React.CSSProperties => ({
    width: '100%', padding: '10px 14px', borderRadius: 6, fontSize: 13,
    background: 'var(--bg-raised)', border: `1px solid ${hasError ? 'var(--risk-crit)' : 'var(--bg-void)'}`,
    color: 'var(--text-hi)', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
  });

  const labelStyle: React.CSSProperties = {
    fontSize: 12, color: 'var(--text-mid)', fontWeight: 500,
    display: 'block', marginBottom: 6,
  };

  return (
    <div style={{ padding: '40px 48px', maxWidth: 1100, margin: '0 auto' }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-hi)',
                   margin: '0 0 8px' }}>
        Registrar Denúncia Ambiental
      </h1>
      <p style={{ fontSize: 13, color: 'var(--text-lo)', margin: '0 0 32px' }}>
        Relate ocorrências em áreas protegidas do Ceará. Sua denúncia será avaliada por gestores.
      </p>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 32 }}>
          {/* Left: form fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label style={labelStyle}>Tipo de ocorrência *</label>
              <select {...register('occurrenceType')} style={inputStyle(!!errors.occurrenceType)}>
                {(Object.entries(OCCURRENCE_LABELS) as [OccurrenceType, string][]).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={labelStyle}>Área protegida (opcional)</label>
              <select {...register('areaId')} style={inputStyle()}>
                <option value="">Selecionar área...</option>
                {PROTECTED_AREAS.map(a => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={labelStyle}>Descrição detalhada * (mínimo 20 caracteres)</label>
              <textarea
                {...register('description')}
                rows={5}
                placeholder="Descreva o que observou, quando, onde e qualquer detalhe relevante..."
                style={{ ...inputStyle(!!errors.description), resize: 'vertical' }}
              />
              {errors.description && (
                <p style={{ fontSize: 11, color: 'var(--risk-crit)', marginTop: 4 }}>
                  {errors.description.message}
                </p>
              )}
            </div>

            <div>
              <label style={labelStyle}>Urgência percebida *</label>
              <select {...register('urgency')} style={inputStyle()}>
                <option value="critical">Crítica — risco imediato</option>
                <option value="high">Alta — ação urgente</option>
                <option value="medium">Média — atenção necessária</option>
                <option value="low">Baixa — informativo</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <input type="checkbox" id="anon" {...register('isAnonymous')}
                     style={{ width: 16, height: 16, accentColor: 'var(--orbital)' }} />
              <label htmlFor="anon" style={{ fontSize: 13, color: 'var(--text-mid)',
                                             cursor: 'pointer' }}>
                Denúncia anônima
              </label>
            </div>

            {!isAnon && (
              <div>
                <label style={labelStyle}>Seu nome (opcional)</label>
                <input {...register('reporterName')} type="text"
                       placeholder="Nome completo" style={inputStyle()} />
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <input type="checkbox" id="decl" {...register('declaration')}
                     style={{ width: 16, height: 16, marginTop: 2, accentColor: 'var(--orbital)' }} />
              <label htmlFor="decl" style={{ fontSize: 12, color: 'var(--text-lo)',
                                             cursor: 'pointer', lineHeight: 1.4 }}>
                Declaro que as informações prestadas são verídicas e foram obtidas por
                observação direta. Protótipo demonstrativo — sem envio real de dados.
              </label>
            </div>
            {errors.declaration && (
              <p style={{ fontSize: 11, color: 'var(--risk-crit)', marginTop: -16 }}>
                {errors.declaration.message}
              </p>
            )}

            <button type="submit" disabled={isSubmitting} style={{
              padding: '13px 0', borderRadius: 8, border: 'none',
              background: isSubmitting ? 'var(--bg-raised)' : 'var(--orbital)',
              color: isSubmitting ? 'var(--text-ghost)' : 'white',
              fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
            }}>
              {isSubmitting ? 'Enviando...' : 'Enviar Denúncia'}
            </button>
          </div>

          {/* Right: location map */}
          <div>
            <label style={{ ...labelStyle, marginBottom: 10 }}>
              Localização aproximada (clique no mapa)
            </label>
            <div style={{ height: 320, borderRadius: 8, overflow: 'hidden',
                          border: '1px solid var(--bg-raised)', marginBottom: 8 }}>
              <OrbitalMap center={[-4.5, -39.0]} zoom={6} darkTiles={false}>
                <LocationPicker onPick={(lat, lng) => setCoords({ lat, lng })} />
              </OrbitalMap>
            </div>
            {coords ? (
              <p style={{ fontSize: 11, color: 'var(--orbital)', fontFamily: 'monospace' }}>
                📍 {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
              </p>
            ) : (
              <p style={{ fontSize: 11, color: 'var(--text-ghost)' }}>
                Nenhuma localização selecionada (opcional)
              </p>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
