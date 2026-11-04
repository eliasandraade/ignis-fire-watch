/**
 * Dates come from the API in UTC (ISO 8601). The interface always shows them in
 * Fortaleza time (UTC−3, no daylight saving), whatever the browser's zone.
 */
export const TIME_ZONE = 'America/Fortaleza';

const dateTime = new Intl.DateTimeFormat('pt-BR', {
  timeZone: TIME_ZONE,
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

const dateOnly = new Intl.DateTimeFormat('pt-BR', {
  timeZone: TIME_ZONE,
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

/** The API stores some instants as naive UTC ("2026-11-04T12:00:00"): read them as UTC. */
export function parseApiDate(value: string | null | undefined): Date | null {
  if (!value) return null;
  const hasZone = /[zZ]$|[+-]\d{2}:?\d{2}$/.test(value);
  const date = new Date(hasZone ? value : `${value}Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatDateTime(value: string | null | undefined, empty = '—'): string {
  const date = parseApiDate(value);
  return date ? dateTime.format(date) : empty;
}

export function formatDate(value: string | null | undefined, empty = '—'): string {
  const date = parseApiDate(value);
  return date ? dateOnly.format(date) : empty;
}

/** "há 5 min", "há 3 h", "há 2 dias"; future instants say "agora". */
export function formatRelative(value: string | null | undefined, now = Date.now()): string {
  const date = parseApiDate(value);
  if (!date) return '—';
  const seconds = Math.max(0, Math.round((now - date.getTime()) / 1000));
  if (seconds < 60) return 'agora';
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `há ${minutes} min`;
  const hours = Math.round(minutes / 60);
  if (hours < 48) return `há ${hours} h`;
  return `há ${Math.round(hours / 24)} dias`;
}

export function formatDuration(start: string | null, end: string | null): string {
  const a = parseApiDate(start);
  const b = parseApiDate(end);
  if (!a || !b) return '—';
  const ms = Math.max(0, b.getTime() - a.getTime());
  if (ms < 1000) return `${ms} ms`;
  const seconds = ms / 1000;
  if (seconds < 60) return `${seconds.toFixed(1).replace('.', ',')} s`;
  const minutes = Math.floor(seconds / 60);
  return `${minutes} min ${Math.round(seconds % 60)} s`;
}

/** A local date-time input value (Fortaleza) → ISO UTC for the API. */
export function fortalezaInputToIso(value: string): string | undefined {
  if (!value) return undefined;
  // datetime-local gives "YYYY-MM-DDTHH:mm"; Fortaleza is a fixed UTC−3.
  const date = new Date(`${value}:00-03:00`);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}
