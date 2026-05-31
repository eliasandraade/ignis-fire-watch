// Fallback barrel — explicit FALLBACK_* aliases for all mock data.
// Import from '@/data/fallback' to make it clear that fallback/demo data is being used.

// ── Areas ────────────────────────────────────────────────────────────────────
export {
  PROTECTED_AREAS as FALLBACK_AREAS,
  getAreaById as getFallbackAreaById,
} from '@/data/areas';

// ── Incidents ────────────────────────────────────────────────────────────────
export {
  INCIDENTS as FALLBACK_INCIDENTS,
  getActiveIncidents as getFallbackActiveIncidents,
  getCriticalIncident as getFallbackCriticalIncident,
  getIncidentById as getFallbackIncidentById,
} from '@/data/incidents';

// ── Reports ──────────────────────────────────────────────────────────────────
export {
  PUBLIC_REPORTS as FALLBACK_REPORTS,
} from '@/data/reports';

// ── Operations ───────────────────────────────────────────────────────────────
export {
  TEAMS as FALLBACK_TEAMS,
  RESOURCES as FALLBACK_RESOURCES,
  MISSIONS as FALLBACK_MISSIONS,
  PROTOCOL_INCENDIO as FALLBACK_PROTOCOL_INCENDIO,
} from '@/data/operations';

// ── Users ────────────────────────────────────────────────────────────────────
export {
  MOCK_USERS as FALLBACK_USERS,
  AUDIT_LOG as FALLBACK_AUDIT_LOG,
} from '@/data/users';

// ── ESG ──────────────────────────────────────────────────────────────────────
export {
  ESG_DATA as FALLBACK_ESG_DATA,
} from '@/data/esg';
