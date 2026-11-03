import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { isApiMode } from '@/services/dataSource';
import { integrityNotice, type IntegrityLevel } from '@/lib/dataIntegrity';

const COLOR: Record<IntegrityLevel, string> = {
  demo: 'oklch(60% 0.14 250)',
  degraded: 'oklch(70% 0.17 60)',
  prototype: 'oklch(55% 0.02 250)',
};

/** Faixa fixa, visível em todas as rotas, sobre a origem e a confiabilidade dos dados. */
export function DataIntegrityBanner() {
  const qc = useQueryClient();
  const [failed, setFailed] = useState(0);

  useEffect(() => {
    const cache = qc.getQueryCache();
    const count = () => cache.getAll().filter(q => q.state.status === 'error').length;
    setFailed(count());
    return cache.subscribe(() => setFailed(count()));
  }, [qc]);

  const notice = integrityNotice(isApiMode(), failed);
  const color = COLOR[notice.level];

  return (
    <div
      role="status"
      aria-live="polite"
      data-integrity-level={notice.level}
      style={{
        position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 9999,
        padding: '5px 12px', fontSize: 11, fontWeight: 600, lineHeight: 1.4,
        textAlign: 'center', color: 'white',
        background: `color-mix(in oklch, ${color} 92%, black)`,
        borderTop: `1px solid ${color}`,
      }}
    >
      {notice.message}
    </div>
  );
}
