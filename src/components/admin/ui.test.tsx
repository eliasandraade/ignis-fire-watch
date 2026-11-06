import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { EmptyState, ErrorState, Pager, Pill, Stat } from './ui';
import { ApiError } from '@/services/api/errors';

const html = (node: React.ReactElement) => renderToStaticMarkup(node);

describe('state components', () => {
  it('error state says the service is unavailable and offers a retry, never numbers', () => {
    const out = html(<ErrorState error={new ApiError(503, 'x')} onRetry={() => undefined} />);
    expect(out).toContain('role="alert"');
    expect(out).toContain('Serviço temporariamente indisponível');
    expect(out).toContain('Tentar novamente');
    expect(out).toContain('A API respondeu com erro 503');
  });

  it('empty state explains what would appear', () => {
    const out = html(<EmptyState title="Nenhuma execução registrada">As execuções aparecem aqui.</EmptyState>);
    expect(out).toContain('role="status"');
    expect(out).toContain('Nenhuma execução registrada');
  });

  it('pager disables the impossible directions', () => {
    const first = html(<Pager page={1} pages={3} total={45} onPage={() => undefined} noun="usuários" />);
    expect(first).toContain('45 usuários · página 1 de 3');
    expect(first).toMatch(/<button[^>]*disabled=""[^>]*>Anterior/);
    expect(first).not.toMatch(/<button[^>]*disabled=""[^>]*>Próxima/);
    const empty = html(<Pager page={1} pages={0} total={0} onPage={() => undefined} />);
    expect(empty).toContain('página 1 de 1');
    expect(empty).toMatch(/disabled=""[^>]*>Próxima/);
  });

  it('pills and stats carry their tone', () => {
    expect(html(<Pill tone="err">Inacessível</Pill>)).toContain('ig-pill err');
    expect(html(<Stat label="Focos" value="319" tone="warn" />)).toContain('var(--ig-warn)');
  });
});
