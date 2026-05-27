import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { OrbitalMap } from '@/components/shared/OrbitalMap';
import { getCriticalIncident } from '@/data/incidents';
import { getAreaById } from '@/data/areas';
import { MISSIONS } from '@/data/operations';
import { useToast } from '@/hooks/use-toast';

export default function FieldOperationPage() {
  const [arrived, setArrived] = useState(false);
  const [report, setReport]   = useState('');
  const [sent, setSent]       = useState(false);
  const { toast } = useToast();

  const incident = getCriticalIncident();
  const area     = incident ? getAreaById(incident.areaId) : null;
  const mission  = MISSIONS[0]; // Active mission for demo

  const mapCenter: [number, number] = area?.center ?? [-4.5, -39.0];

  const handleSend = () => {
    if (!report.trim()) return;
    setSent(true);
    toast({ title: 'Relatório enviado (protótipo)', description: 'Sem envio real — demonstração' });
  };

  return (
    <div style={{ maxWidth: 390, margin: '0 auto', minHeight: '100vh',
                  background: 'var(--bg-void)', paddingBottom: 48 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12,
                    padding: '12px 16px', background: 'var(--bg-panel)',
                    borderBottom: '1px solid var(--bg-raised)', position: 'sticky',
                    top: 0, zIndex: 10 }}>
        <Link to="/gestor/mobilization" style={{
          color: 'var(--orbital)', textDecoration: 'none', fontSize: 14,
          fontWeight: 600, padding: '6px 0',
        }}>
          ← Operações
        </Link>
        <span style={{ fontSize: 12, color: 'var(--text-ghost)', marginLeft: 'auto' }}>
          Operação de Campo
        </span>
      </div>

      <div style={{ padding: '16px 16px 0' }}>
        {/* Mission card */}
        <div style={{ background: 'var(--bg-surface)', borderRadius: 8, padding: 16,
                      border: '1px solid var(--bg-raised)', marginBottom: 16 }}>
          <div style={{ fontSize: 10, color: 'var(--orbital)', fontWeight: 700,
                        textTransform: 'uppercase', letterSpacing: '0.1em',
                        marginBottom: 6 }}>
            {mission.type} · {mission.id}
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-hi)',
                        marginBottom: 10 }}>
            {mission.title}
          </div>

          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 11, color: 'var(--text-ghost)',
                          textTransform: 'uppercase', letterSpacing: '0.06em',
                          marginBottom: 6 }}>
              Objetivos
            </div>
            {mission.objectives.map((obj, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 4,
                                    fontSize: 13, color: 'var(--text-mid)' }}>
                <span style={{ color: 'var(--orbital)', flexShrink: 0 }}>▸</span>
                {obj}
              </div>
            ))}
          </div>

          <div style={{ padding: '10px 12px', background: 'oklch(70% 0.18 45 / 10%)',
                        border: '1px solid oklch(70% 0.18 45 / 25%)', borderRadius: 5,
                        fontSize: 12, color: 'oklch(80% 0.12 60)', lineHeight: 1.4 }}>
            ⚠ {mission.notes}
          </div>
        </div>

        {/* Location map */}
        <div style={{ borderRadius: 8, overflow: 'hidden',
                      border: '1px solid var(--bg-raised)', marginBottom: 16 }}>
          <div style={{ height: 200 }}>
            <OrbitalMap center={mapCenter} zoom={12} darkTiles zoomControl={false} />
          </div>
          <div style={{ padding: '8px 12px', background: 'var(--bg-panel)',
                        fontSize: 11, color: 'var(--text-ghost)',
                        fontFamily: 'JetBrains Mono, monospace' }}>
            {mapCenter[0].toFixed(5)}, {mapCenter[1].toFixed(5)}
          </div>
        </div>

        {/* Action 1: Cheguei ao Local — minHeight 48px */}
        <motion.button
          onClick={() => { if (!arrived) setArrived(true); }}
          disabled={arrived}
          whileTap={!arrived ? { scale: 0.97 } : {}}
          style={{
            width: '100%', minHeight: 48, borderRadius: 8, border: 'none',
            background: arrived
              ? 'color-mix(in oklch, var(--risk-low) 15%, transparent)'
              : 'var(--orbital)',
            color: arrived ? 'var(--risk-low)' : 'white',
            fontSize: 15, fontWeight: 700, cursor: arrived ? 'default' : 'pointer',
            fontFamily: 'inherit', marginBottom: 12,
          } as React.CSSProperties}
        >
          {arrived ? '✓ Local Confirmado' : '📍 Cheguei ao Local'}
        </motion.button>

        {/* Action 2: Photo upload placeholder — minHeight 48px */}
        <button disabled style={{
          width: '100%', minHeight: 48, borderRadius: 8, cursor: 'not-allowed',
          background: 'var(--bg-raised)', color: 'var(--text-ghost)',
          border: '1px solid var(--bg-raised)', fontSize: 14,
          fontFamily: 'inherit', marginBottom: 12, opacity: 0.6,
        }}>
          📷 Anexar Evidência (protótipo)
        </button>

        {/* Action 3: Status textarea — minHeight 80px */}
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 12, color: 'var(--text-mid)', fontWeight: 500,
                          display: 'block', marginBottom: 6 }}>
            Atualização de status
          </label>
          <textarea
            value={report}
            onChange={e => setReport(e.target.value)}
            disabled={sent}
            rows={4}
            placeholder="Descreva a situação atual no campo..."
            style={{
              width: '100%', minHeight: 80, padding: '10px 14px', borderRadius: 6,
              fontSize: 13, background: 'var(--bg-raised)',
              border: '1px solid var(--bg-void)', color: 'var(--text-hi)',
              fontFamily: 'inherit', outline: 'none', resize: 'vertical',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Action 4: Send — minHeight 48px */}
        <button
          onClick={handleSend}
          disabled={!report.trim() || sent}
          style={{
            width: '100%', minHeight: 48, borderRadius: 8, border: 'none',
            background: sent ? 'var(--bg-raised)'
              : !report.trim() ? 'var(--bg-raised)'
              : 'color-mix(in oklch, var(--risk-low) 80%, transparent)',
            color: sent ? 'var(--text-ghost)'
              : !report.trim() ? 'var(--text-ghost)'
              : 'white',
            fontSize: 15, fontWeight: 700,
            cursor: !report.trim() || sent ? 'not-allowed' : 'pointer',
            fontFamily: 'inherit',
          }}
        >
          {sent ? '✓ Relatório Enviado' : 'Enviar Relatório de Campo'}
        </button>

        <div style={{ marginTop: 16, padding: '10px 12px', background: 'var(--bg-panel)',
                      borderRadius: 6, fontSize: 11, color: 'var(--text-ghost)',
                      textAlign: 'center', lineHeight: 1.5 }}>
          Protótipo demonstrativo — sem envio real de dados
        </div>
      </div>
    </div>
  );
}
