import type { ESGReport } from '@/types/domain';

export const ESG_DATA: ESGReport = {
  period: 'Jan–Mai 2026',
  areasMonitored: 8,
  incidentsDetected: 3,
  incidentsPrevented: 2,
  hectaresProtected: 1171375,
  responseTimeAvg: 18,
  weeklyIncidents: [
    { week: 'S1', count: 1 },
    { week: 'S2', count: 0 },
    { week: 'S3', count: 2 },
    { week: 'S4', count: 1 },
    { week: 'S5', count: 0 },
    { week: 'S6', count: 1 },
    { week: 'S7', count: 3 },
    { week: 'S8', count: 1 },
  ],
  monthlyFoci: [
    { month: 'Jan', foci: 12 },
    { month: 'Fev', foci: 8 },
    { month: 'Mar', foci: 15 },
    { month: 'Abr', foci: 10 },
    { month: 'Mai', foci: 23 },
  ],
};
