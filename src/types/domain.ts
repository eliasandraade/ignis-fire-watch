export type RiskLevel = 'critical' | 'high' | 'medium' | 'low';
/** Qualidade declarada pela API (enum DataQuality do backend) ou 'unknown'. */
export type DataQuality = 'high' | 'medium' | 'low' | 'estimated' | 'mock' | 'unknown';
export type IncidentStatus =
  | 'deteccao-orbital' | 'confirmacao-pendente' | 'protocolo-ativado'
  | 'equipes-mobilizadas' | 'combate-ativo' | 'controle-parcial'
  | 'extinto' | 'encerrado';
export type IncidentType =
  | 'incendio-florestal' | 'queimada' | 'desmatamento'
  | 'caca-pesca' | 'contaminacao' | 'erosao';
export type ReportStatus =
  | 'em-triagem' | 'validada' | 'em-campo' | 'convertida-incidente' | 'descartada';
export type OccurrenceType =
  | 'incendio' | 'queimada' | 'desmatamento' | 'caca'
  | 'pesca-ilegal' | 'mineracao' | 'despejo-residuos'
  | 'especie-invasora' | 'contaminacao-agua' | 'outro';
export type TeamStatus = 'disponivel' | 'mobilizado' | 'em-transito' | 'indisponivel';
export type ResourceType = 'veiculo' | 'aeronave' | 'equipamento' | 'suprimento';
export type UserRole = 'admin' | 'gestor' | 'campo' | 'analista' | 'orgao' | 'publico';
export type AlertSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info';

export interface Coords {
  lat: number;
  lng: number;
}

export interface GeoJSON {
  type: 'Polygon' | 'MultiPolygon';
  coordinates: number[][][] | number[][][][];
}

/**
 * Área protegida como devolvida pela API. Campos que a API não informa ficam
 * null — a interface mostra "—" ou um estado vazio, nunca um valor estimado.
 */
export interface ProtectedArea {
  id: string;
  name: string;
  type: string;
  state: string;
  hectares: number | null;
  /** O backend ainda não calcula risco por área. */
  risk: RiskLevel | null;
  /** Centro informado pela API ou, na falta dele, o centroide da geometria real. */
  center: [number, number] | null;
  /** Perímetro real (WKT da API); null quando a API não tem geometria. */
  geometry: GeoJSON | null;
  description: string;
  source: string | null;
  lastUpdated: string;
  dataQuality: DataQuality;
}

export interface IncidentEvent {
  id: string;
  timestamp: string;
  type: 'detection' | 'confirmation' | 'mobilization' | 'update' | 'alert' | 'resolution';
  description: string;
  author: string;
}

export interface Evidence {
  id: string;
  type: 'image' | 'satellite' | 'field-photo' | 'document';
  url: string;
  caption: string;
  source: string;
  timestamp: string;
}

export interface Incident {
  id: string;
  code?: string;
  areaId: string;
  type: IncidentType;
  status: IncidentStatus;
  risk: RiskLevel;
  detectedAt: string;
  updatedAt: string;
  affectedHectares: number;
  confidence: number;
  source: string;
  description: string;
  assignedTeams: string[];
  events: IncidentEvent[];
  evidence: Evidence[];
  temperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: string;
}

export interface PublicReport {
  id: string;
  occurrenceType: OccurrenceType;
  areaId?: string;
  customLocation?: string;
  coords?: Coords;
  description: string;
  urgency: RiskLevel;
  status: ReportStatus;
  submittedAt: string;
  isAnonymous: boolean;
  reporterName?: string;
  reporterContact?: string;
  evidence: string[];
  linkedIncidentId?: string;
  assignedTeam?: string;
  notes?: string;
}

export interface Alert {
  id: string;
  severity: AlertSeverity;
  title: string;
  message: string;
  areaId?: string;
  incidentId?: string;
  createdAt: string;
  read: boolean;
}

export interface FieldTeam {
  id: string;
  name: string;
  type: string;
  status: TeamStatus;
  members: number;
  location?: string;
  currentIncident?: string;
  contact: string;
}

export interface Resource {
  id: string;
  name: string;
  type: ResourceType;
  status: TeamStatus;
  location: string;
  currentIncident?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  /** The API only allows /auth/me and /auth/change-password until it is cleared. */
  mustChangePassword?: boolean;
}

export interface ESGReport {
  period: string;
  areasMonitored: number;
  incidentsDetected: number;
  incidentsPrevented: number;
  hectaresProtected: number;
  responseTimeAvg: number;
  weeklyIncidents: { week: string; count: number }[];
  monthlyFoci: { month: string; foci: number }[];
}

export interface ProtocolStep {
  id: string;
  order?: number;
  title: string;
  description?: string;
  completed: boolean;
  completedAt?: string;
  completedBy?: string;
}

export interface Protocol {
  id: string;
  title?: string;
  steps: ProtocolStep[];
}

export interface Mission {
  id: string;
  title: string;
  type: string;
  status: 'ativa' | 'concluida' | 'cancelada';
  incidentId: string;
  teamId: string;
  startedAt: string;
  objectives: string[];
  notes: string;
}
