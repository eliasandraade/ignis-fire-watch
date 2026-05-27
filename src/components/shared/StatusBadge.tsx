import type { IncidentStatus, ReportStatus, TeamStatus } from '@/types/domain';

type Status = IncidentStatus | ReportStatus | TeamStatus;

interface Props {
  status: Status;
  size?: 'sm' | 'md';
}

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  // IncidentStatus
  'deteccao-orbital':     { label: 'Detecção Orbital',    color: 'oklch(65% 0.17 220)' },
  'confirmacao-pendente': { label: 'Confirmação Pendente',color: 'oklch(80% 0.16 75)'  },
  'protocolo-ativado':    { label: 'Protocolo Ativado',   color: 'oklch(70% 0.18 45)'  },
  'equipes-mobilizadas':  { label: 'Equipes Mobilizadas', color: 'oklch(70% 0.18 45)'  },
  'combate-ativo':        { label: 'Combate Ativo',       color: 'oklch(58% 0.22 25)'  },
  'controle-parcial':     { label: 'Controle Parcial',    color: 'oklch(70% 0.18 45)'  },
  'extinto':              { label: 'Extinto',             color: 'oklch(67% 0.18 145)' },
  'encerrado':            { label: 'Encerrado',           color: 'oklch(60% 0.018 240)'},
  // ReportStatus
  'em-triagem':           { label: 'Em Triagem',          color: 'oklch(65% 0.17 220)' },
  'validada':             { label: 'Validada',            color: 'oklch(67% 0.18 145)' },
  'em-campo':             { label: 'Em Campo',            color: 'oklch(70% 0.18 45)'  },
  'convertida-incidente': { label: 'Convertida',          color: 'oklch(58% 0.22 25)'  },
  'descartada':           { label: 'Descartada',          color: 'oklch(44% 0.018 240)'},
  // TeamStatus
  'disponivel':           { label: 'Disponível',          color: 'oklch(67% 0.18 145)' },
  'mobilizado':           { label: 'Mobilizado',          color: 'oklch(70% 0.18 45)'  },
  'em-transito':          { label: 'Em Trânsito',         color: 'oklch(65% 0.17 220)' },
  'indisponivel':         { label: 'Indisponível',        color: 'oklch(44% 0.018 240)'},
};

export function StatusBadge({ status, size = 'md' }: Props) {
  const cfg = STATUS_CONFIG[status] ?? { label: status, color: 'oklch(60% 0.018 240)' };
  const pad = size === 'sm' ? '2px 7px' : '3px 10px';
  const fs  = size === 'sm' ? 11 : 12;

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: pad,
      borderRadius: 4,
      fontSize: fs,
      fontWeight: 600,
      color: cfg.color,
      background: `color-mix(in oklch, ${cfg.color} 12%, transparent)`,
      border: `1px solid color-mix(in oklch, ${cfg.color} 28%, transparent)`,
      whiteSpace: 'nowrap',
    }}>
      {cfg.label}
    </span>
  );
}
