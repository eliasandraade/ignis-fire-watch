import type { ProtectedArea } from '@/types/domain';

export const PROTECTED_AREAS: ProtectedArea[] = [
  {
    id: 'rppn-elias-andrade',
    name: 'RPPN Elias Andrade',
    type: 'RPPN',
    state: 'CE',
    hectares: 1240,
    risk: 'critical',
    center: [-3.7172, -38.5434],
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [-38.5634, -3.6972], [-38.5234, -3.6972],
        [-38.5234, -3.7372], [-38.5634, -3.7372],
        [-38.5634, -3.6972],
      ]],
    },
    description: 'Reserva Particular do Patrimônio Natural — caso demonstrativo IGNIS.',
    source: 'IGNIS/Estimado',
    confidence: 72,
    lastUpdated: '2026-05-26T09:00:00Z',
    dataQuality: 'estimated',
  },
  {
    id: 'apa-serra-baturite',
    name: 'APA da Serra de Baturité',
    type: 'APA',
    state: 'CE',
    hectares: 32690,
    risk: 'medium',
    center: [-4.2833, -38.8667],
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [-38.9667, -4.1833], [-38.7667, -4.1833],
        [-38.7667, -4.3833], [-38.9667, -4.3833],
        [-38.9667, -4.1833],
      ]],
    },
    description: 'Área de Proteção Ambiental com remanescentes de Mata Atlântica serrana.',
    source: 'SEMACE/Estimado',
    confidence: 81,
    lastUpdated: '2026-05-20T00:00:00Z',
    dataQuality: 'estimated',
  },
  {
    id: 'parque-coco',
    name: 'Parque Estadual do Cocó',
    type: 'Parque Estadual',
    state: 'CE',
    hectares: 1155,
    risk: 'low',
    center: [-3.7419, -38.4769],
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [-38.5069, -3.7219], [-38.4469, -3.7219],
        [-38.4469, -3.7619], [-38.5069, -3.7619],
        [-38.5069, -3.7219],
      ]],
    },
    description: 'Parque urbano de manguezal e mata ciliar em Fortaleza.',
    source: 'SEMACE/Estimado',
    confidence: 88,
    lastUpdated: '2026-05-22T00:00:00Z',
    dataQuality: 'estimated',
  },
  {
    id: 'esec-pecem',
    name: 'Estação Ecológica do Pecém',
    type: 'Estação Ecológica',
    state: 'CE',
    hectares: 1540,
    risk: 'high',
    center: [-3.5500, -38.8167],
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [-38.8667, -3.5000], [-38.7667, -3.5000],
        [-38.7667, -3.6000], [-38.8667, -3.6000],
        [-38.8667, -3.5000],
      ]],
    },
    description: 'Ecossistema costeiro com vegetação de restinga e tabuleiro.',
    source: 'IBAMA/Estimado',
    confidence: 76,
    lastUpdated: '2026-05-18T00:00:00Z',
    dataQuality: 'estimated',
  },
  {
    id: 'flona-araripe',
    name: 'FLONA Araripe-Apodi',
    type: 'Floresta Nacional',
    state: 'CE',
    hectares: 38262,
    risk: 'medium',
    center: [-7.2833, -39.4167],
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [-39.5167, -7.1833], [-39.3167, -7.1833],
        [-39.3167, -7.3833], [-39.5167, -7.3833],
        [-39.5167, -7.1833],
      ]],
    },
    description: 'Maior floresta nacional do semiárido brasileiro.',
    source: 'ICMBio/Estimado',
    confidence: 84,
    lastUpdated: '2026-05-15T00:00:00Z',
    dataQuality: 'estimated',
  },
  {
    id: 'parna-ubajara',
    name: 'Parque Nacional de Ubajara',
    type: 'Parque Nacional',
    state: 'CE',
    hectares: 6288,
    risk: 'low',
    center: [-3.8333, -40.9000],
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [-40.9500, -3.7833], [-40.8500, -3.7833],
        [-40.8500, -3.8833], [-40.9500, -3.8833],
        [-40.9500, -3.7833],
      ]],
    },
    description: 'Parque com cavernas, cachoeiras e floresta úmida de altitude.',
    source: 'ICMBio/Estimado',
    confidence: 90,
    lastUpdated: '2026-05-10T00:00:00Z',
    dataQuality: 'estimated',
  },
  {
    id: 'apa-chapada-araripe',
    name: 'APA da Chapada do Araripe',
    type: 'APA',
    state: 'CE',
    hectares: 1090766,
    risk: 'medium',
    center: [-7.3500, -39.5000],
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [-39.7500, -7.1500], [-39.2500, -7.1500],
        [-39.2500, -7.5500], [-39.7500, -7.5500],
        [-39.7500, -7.1500],
      ]],
    },
    description: 'Maior APA do Brasil, protege o aquífero Araripe e a floresta umidecida.',
    source: 'ICMBio/Estimado',
    confidence: 79,
    lastUpdated: '2026-05-12T00:00:00Z',
    dataQuality: 'estimated',
  },
  {
    id: 'apa-estuario-ceara',
    name: 'APA do Estuário do Rio Ceará',
    type: 'APA',
    state: 'CE',
    hectares: 1430,
    risk: 'low',
    center: [-3.6833, -38.6500],
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [-38.6900, -3.6633], [-38.6100, -3.6633],
        [-38.6100, -3.7033], [-38.6900, -3.7033],
        [-38.6900, -3.6633],
      ]],
    },
    description: 'Área de proteção de manguezal e estuário na foz do Rio Ceará.',
    source: 'SEMACE/Estimado',
    confidence: 85,
    lastUpdated: '2026-05-08T00:00:00Z',
    dataQuality: 'estimated',
  },
];

const RISK_ORDER: Record<string, number> = {
  critical: 0, high: 1, medium: 2, low: 3,
};

export function getAreaById(id: string): ProtectedArea | undefined {
  return PROTECTED_AREAS.find(a => a.id === id);
}

export function getAreasByRisk(risk: ProtectedArea['risk']): ProtectedArea[] {
  return PROTECTED_AREAS.filter(a => a.risk === risk);
}

export function getAreasSortedByRisk(): ProtectedArea[] {
  return [...PROTECTED_AREAS].sort(
    (a, b) => (RISK_ORDER[a.risk] ?? 4) - (RISK_ORDER[b.risk] ?? 4)
  );
}

export function getAreasWithActiveIncidents(activeAreaIds: string[]): ProtectedArea[] {
  return PROTECTED_AREAS.filter(a => activeAreaIds.includes(a.id));
}
