/** Random provisional password (never stored by the UI; shown only to the admin typing it). */
export function generatePassword(length = 16): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789-_.!';
  const bytes = new Uint32Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, b => alphabet[b % alphabet.length]).join('');
}

const LEVEL: Record<string, number> = { publico: 0, campo: 1, gestor: 2, orgao: 3, admin: 4 };

/** Mirrors app/core/permissions.allowed: the backend is the source of truth. */
export function allows(access: string, role: string): boolean {
  if (access === 'público' || access === 'autenticado') return true;
  return (LEVEL[role] ?? -1) >= (LEVEL[access] ?? Number.POSITIVE_INFINITY);
}

export interface Operation {
  method: string;
  path: string;
  tag: string;
  summary: string;
  description?: string;
  parameters: { name: string; in: string; required?: boolean; description?: string }[];
  responses: Record<string, { description?: string }>;
  secured: boolean;
  hasBody: boolean;
}

export type Spec = {
  info?: { title?: string; version?: string; description?: string };
  tags?: { name: string; description?: string }[];
  paths?: Record<string, Record<string, Record<string, unknown>>>;
};

export function operationsOf(spec: Spec): Operation[] {
  const ops: Operation[] = [];
  for (const [path, item] of Object.entries(spec.paths ?? {})) {
    for (const [method, raw] of Object.entries(item)) {
      const op = raw as {
        tags?: string[];
        summary?: string;
        description?: string;
        parameters?: Operation['parameters'];
        responses?: Operation['responses'];
        security?: unknown[];
        requestBody?: unknown;
      };
      ops.push({
        method: method.toUpperCase(),
        path,
        tag: op.tags?.[0] ?? 'outros',
        summary: op.summary ?? '',
        description: op.description,
        parameters: op.parameters ?? [],
        responses: op.responses ?? {},
        secured: Array.isArray(op.security) && op.security.length > 0,
        hasBody: Boolean(op.requestBody),
      });
    }
  }
  return ops;
}

