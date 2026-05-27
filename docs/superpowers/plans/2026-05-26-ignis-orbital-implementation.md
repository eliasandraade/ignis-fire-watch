# IGNIS Orbital — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the ignis-fire-watch React scaffold into a complete 21-screen IGNIS Orbital prototype for FIAP Global Solution 2026 pitch video and PDF presentation.

**Architecture:** Feature-Domain structure (`pages/{shared,public,gestor,admin}` + `components/{shared,public,gestor,admin}`), React Router DOM 6 nested routes with `<Outlet>`, centralized mock data in `src/data/` (no data in components), UserContext for profile-based navigation.

**Tech Stack:** React 18.3 · TypeScript 5.5 · Vite 5.4 (SWC) · TailwindCSS 3.4 · shadcn/ui · React Router DOM 6.26 · Leaflet + React-Leaflet · Recharts 2.12 · Framer Motion · OKLCH CSS color system · Google Fonts (Space Grotesk + JetBrains Mono) · Vercel deploy

**Student:** Elias Sales de Freitas — RM561257 · FIAP GS 2026

---

## Routes (21 screens + NotFound)

| Route | Component | Layout |
|---|---|---|
| `/` | SplashPage | none |
| `/login` | LoginPage | none |
| `/select-profile` | SelectProfilePage | none |
| `/public` | PublicDashboardPage | PublicLayout |
| `/public/map` | PublicMapPage | PublicLayout |
| `/public/report` | RegisterReportPage | PublicLayout |
| `/public/report/status/:id` | ReportStatusPage | PublicLayout |
| `/gestor` | GestorDashboardPage | GestorLayout |
| `/gestor/reports` | ReportCenterPage | GestorLayout |
| `/gestor/reports/:id` | ReportValidationPage | GestorLayout |
| `/gestor/incident/:id` | ActiveIncidentPage | GestorLayout |
| `/gestor/map` | OrbitalMapPage | GestorLayout |
| `/gestor/mobilization` | MobilizationPage | GestorLayout |
| `/gestor/area/:id` | GestorAreaDetailPage | GestorLayout |
| `/gestor/ranking` | RiskRankingPage | GestorLayout |
| `/gestor/aurora` | AuroraPage | GestorLayout |
| `/gestor/esg` | ESGReportPage | GestorLayout |
| `/gestor/war-room` | WarRoomPage | **none** (fullscreen) |
| `/gestor/field` | FieldOperationPage | **none** (mobile-first) |
| `/admin` | AdminPanelPage | none |
| `*` | NotFoundPage | none |

---

## Phase 0 — Setup, Dependencies, Tokens, Plan

### Task 0.1: Install runtime dependencies

- [ ] Run: `npm install leaflet react-leaflet @types/leaflet framer-motion`
- [ ] Run: `npm install` to ensure all package.json deps are present
- [ ] Verify no peer dependency errors

### Task 0.2: Add Google Fonts to index.html

- [ ] Add to `<head>` in `index.html`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet" />
```

### Task 0.3: Update src/index.css

- [ ] After the existing shadcn/ui `:root` block, add IGNIS design tokens:
```css
:root {
  --bg-void:     oklch(9%  0.02  240);
  --bg-deep:     oklch(12% 0.025 240);
  --bg-surface:  oklch(15% 0.025 240);
  --bg-raised:   oklch(19% 0.025 240);
  --bg-panel:    oklch(11% 0.022 240);
  --orbital:     oklch(65% 0.17  220);
  --orbital-dim: oklch(65% 0.17  220 / 18%);
  --text-hi:     oklch(96% 0.008 240);
  --text-mid:    oklch(78% 0.018 240);
  --text-lo:     oklch(60% 0.018 240);
  --text-ghost:  oklch(44% 0.018 240);
  --risk-crit:   oklch(58% 0.22  25);
  --risk-high:   oklch(70% 0.18  45);
  --risk-med:    oklch(80% 0.16  75);
  --risk-low:    oklch(67% 0.18  145);
  --bar-h: 44px;
  --sidebar-w: 218px;
}
html, body { margin: 0; padding: 0; }
body {
  font-family: 'Space Grotesk', system-ui, sans-serif;
  background-color: var(--bg-void);
  color: var(--text-hi);
}
.ignis-dark-map .leaflet-tile {
  filter: invert(1) hue-rotate(180deg) brightness(0.92) saturate(0.35) contrast(0.9);
}
.ignis-dark-map.leaflet-container { background: var(--bg-void); }
.ignis-fullscreen { height: 100vh; overflow: hidden; display: flex; flex-direction: column; }
```
- [ ] **Important:** Remove or comment out `html, body, #root { height: 100% }` if it exists (breaks public page scrolling).

### Task 0.4: Update tailwind.config.ts

- [ ] Add to `theme.extend.colors`:
```ts
orbital:      'var(--orbital)',
'orbital-dim':'var(--orbital-dim)',
'bg-void':    'var(--bg-void)',
'bg-deep':    'var(--bg-deep)',
'bg-surface': 'var(--bg-surface)',
'bg-raised':  'var(--bg-raised)',
'bg-panel':   'var(--bg-panel)',
'risk-crit':  'var(--risk-crit)',
'risk-high':  'var(--risk-high)',
'risk-med':   'var(--risk-med)',
'risk-low':   'var(--risk-low)',
'text-hi':    'var(--text-hi)',
'text-mid':   'var(--text-mid)',
'text-lo':    'var(--text-lo)',
'text-ghost': 'var(--text-ghost)',
```
- [ ] Add to `theme.extend.fontFamily`:
```ts
ui:   ['Space Grotesk', 'system-ui', 'sans-serif'],
mono: ['JetBrains Mono', 'Courier New', 'monospace'],
```

### Task 0.5: Add vercel.json

- [ ] Create `vercel.json` at project root:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### Task 0.6: Verify build passes

- [ ] Run: `npm run build`
- [ ] Expected: `✓ built in X.XXs` with no TypeScript errors
- [ ] Commit: `chore: configure repository and implementation plan`

---

## Phase 1 — Domain Types + Mock Data

### Task 1.1: Create src/types/domain.ts

Full TypeScript types (create new file):

```ts
export type RiskLevel = 'critical' | 'high' | 'medium' | 'low';
export type DataQuality = 'official' | 'estimated' | 'mock';
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
export type UserRole = 'admin' | 'gestor' | 'campo' | 'analista' | 'publico';
export type AlertSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info';

export interface Coords { lat: number; lng: number; }

export interface GeoJSON {
  type: 'Polygon' | 'MultiPolygon';
  coordinates: number[][][] | number[][][][];
}

export interface ProtectedArea {
  id: string;
  name: string;
  type: string;
  state: string;
  hectares: number;
  risk: RiskLevel;
  center: [number, number];
  geometry: GeoJSON;
  description: string;
  source: string;
  confidence: number;
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
  aurora: {
    priority: string;
    recommendation: string;
    confidence: number;
  };
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
```

- [ ] Run: `npx tsc --noEmit` — verify no type errors

### Task 1.2: Create src/lib/geo.ts

```ts
import type { GeoJSON } from '@/types/domain';

export function getPolygonPositions(geometry: GeoJSON): [number, number][] {
  const ring = geometry.type === 'Polygon'
    ? (geometry.coordinates as number[][][])[0]
    : ((geometry.coordinates as number[][][][])[0])[0];
  return ring.map(([lng, lat]) => [lat, lng] as [number, number]);
}
```

### Task 1.3: Create src/data/areas.ts

8 protected areas, all `dataQuality: 'estimated'`. Key areas:

| id | name | risk | center |
|---|---|---|---|
| rppn-elias-andrade | RPPN Elias Andrade | critical | [-3.7172, -38.5434] |
| apa-serra-baturite | APA da Serra de Baturité | medium | [-4.2833, -38.8667] |
| parque-coco | Parque Estadual do Cocó | low | [-3.7419, -38.4769] |
| esec-pecem | Estação Ecológica do Pecém | high | [-3.5500, -38.8167] |
| flona-araripe | FLONA Araripe-Apodi | medium | [-7.2833, -39.4167] |
| parna-ubajara | Parque Nacional de Ubajara | low | [-3.8333, -40.9000] |
| apa-chapada-araripe | APA da Chapada do Araripe | medium | [-7.3500, -39.5000] |
| apa-estuario-ceara | APA do Estuário do Rio Ceará | low | [-3.6833, -38.6500] |

Each area needs a `geometry` with a valid Polygon (rectangle approximating the area for demo purposes).

Export helpers: `getAreaById`, `getAreasByRisk`, `getAreasSortedByRisk`, `getAreasWithActiveIncidents`.

### Task 1.4: Create src/data/incidents.ts

3 incidents:
- `IGN-CE-2026-0041`: critical, protocolo-ativado, areaId: rppn-elias-andrade, 42ha, confidence 87, source: 'INPE/MODIS (simulado)', teams: ['BRG-CE-01','DRN-CE-02','VTR-CE-01'], temp 36, humidity 18, windSpeed 22, windDirection 'NNE', 6-event timeline, aurora.confidence 91
- `IGN-CE-2026-0038`: high, deteccao-orbital, areaId: esec-pecem, type: desmatamento
- `IGN-CE-2026-0033`: medium, confirmacao-pendente, areaId: flona-araripe, type: caca-pesca

Export helpers: `getIncidentById`, `getIncidentsByArea`, `getActiveIncidents`, `getCriticalIncident`.

### Task 1.5: Create src/data/reports.ts

12 public reports: 4 em-triagem, 3 validada, 2 em-campo, 2 convertida-incidente, 1 descartada.

Export helpers: `getReportById`, `getReportsByStatus`, `getPendingReports`.

### Task 1.6: Create src/data/operations.ts

```ts
export const PROTOCOL_INCENDIO: Protocol = {
  id: 'prot-incendio-florestal',
  steps: [
    { id:'s1', order:1, title:'Confirmação por imagem orbital',
      description:'Cruzar fontes orbitais simuladas e registrar confiança. Protocolo demonstrativo.',
      completed:true, completedAt:'2026-05-26T09:41:00Z', completedBy:'Ana Lima' },
    { id:'s2', order:2, title:'Notificação de autoridades',
      description:'Acionar SEMACE, IBAMA e Defesa Civil estadual.',
      completed:true, completedAt:'2026-05-26T09:55:00Z', completedBy:'Sistema IGNIS' },
    { id:'s3', order:3, title:'Mobilização de equipes de campo', completed:false },
    { id:'s4', order:4, title:'Estabelecer perímetro de exclusão', completed:false },
    { id:'s5', order:5, title:'Combate direto ao foco', completed:false },
    { id:'s6', order:6, title:'Relatório de situação (SITREP)', completed:false },
  ],
};

export const TEAMS: FieldTeam[] = [
  { id:'BRG-CE-01', name:'Brigada Florestal CE-01', type:'Combate',
    status:'mobilizado', members:8, location:'RPPN Elias Andrade',
    currentIncident:'IGN-CE-2026-0041', contact:'+55 85 98765-0001' },
  { id:'DRN-CE-02', name:'Drone Monit CE-02', type:'Reconhecimento',
    status:'mobilizado', members:3, location:'Sobrevoo ativo',
    currentIncident:'IGN-CE-2026-0041', contact:'+55 85 98765-0002' },
  { id:'VTR-CE-01', name:'Viatura Apoio CE-01', type:'Apoio Logístico',
    status:'em-transito', members:4, location:'CE-025 km 34',
    currentIncident:'IGN-CE-2026-0041', contact:'+55 85 98765-0003' },
  { id:'BRG-CE-02', name:'Brigada Florestal CE-02', type:'Combate',
    status:'disponivel', members:10, location:'Base Pecém', contact:'+55 85 98765-0004' },
];

export const RESOURCES: Resource[] = [
  { id:'REC-001', name:'Viatura 4x4 Comando', type:'veiculo',
    status:'mobilizado', location:'RPPN Elias Andrade', currentIncident:'IGN-CE-2026-0041' },
  { id:'REC-002', name:'Drone DJI Matrice 300', type:'aeronave',
    status:'mobilizado', location:'Sobrevoo ativo', currentIncident:'IGN-CE-2026-0041' },
  { id:'REC-003', name:'Mangueiras e Canhão D\'água', type:'equipamento',
    status:'em-transito', location:'Em deslocamento' },
  { id:'REC-004', name:'Kit Primeiros Socorros', type:'suprimento',
    status:'disponivel', location:'Base Fortaleza' },
];

export const MISSIONS: Mission[] = [
  { id:'MSN-001', title:'Combate direto — Setor Norte', type:'Combate',
    status:'ativa', incidentId:'IGN-CE-2026-0041', teamId:'BRG-CE-01',
    startedAt:'2026-05-26T10:12:00Z',
    objectives:['Estabelecer linha de contenção norte','Evitar propagação para buffer','Registrar evidências'],
    notes:'Atenção ao vento NNE. Manter distância segura do flanco ativo.' },
  { id:'MSN-002', title:'Sobrevoo de reconhecimento — Perímetro', type:'Reconhecimento',
    status:'ativa', incidentId:'IGN-CE-2026-0041', teamId:'DRN-CE-02',
    startedAt:'2026-05-26T10:45:00Z',
    objectives:['Mapear extensão do foco','Identificar pontos de acesso'],
    notes:'Altitude mínima 80m. Evitar área de fumaça densa.' },
];
```

### Task 1.7: Create src/data/esg.ts

```ts
import type { ESGReport } from '@/types/domain';
export const ESG_DATA: ESGReport = {
  period: 'Jan–Mai 2026',
  areasMonitored: 8,
  incidentsDetected: 3,
  incidentsPrevented: 2,
  hectaresProtected: 847230,
  responseTimeAvg: 18,
  weeklyIncidents: [
    { week:'S1', count:1 }, { week:'S2', count:0 },
    { week:'S3', count:2 }, { week:'S4', count:1 },
    { week:'S5', count:0 }, { week:'S6', count:1 },
    { week:'S7', count:3 }, { week:'S8', count:1 },
  ],
  monthlyFoci: [
    { month:'Jan', foci:12 }, { month:'Fev', foci:8 },
    { month:'Mar', foci:15 }, { month:'Abr', foci:10 },
    { month:'Mai', foci:23 },
  ],
};
```

### Task 1.8: Create src/data/users.ts

```ts
export const MOCK_USERS = [
  { id:'u1', name:'Ana Lima', email:'ana.lima@ignis.ce.gov.br',
    role:'gestor' as const, lastLogin:'2026-05-26T10:30:00Z', active:true },
  { id:'u2', name:'Carlos Drummond', email:'c.drummond@bombeiros.ce.gov.br',
    role:'campo' as const, lastLogin:'2026-05-26T09:15:00Z', active:true },
  { id:'u3', name:'Maria Cecília', email:'m.cecilia@semace.ce.gov.br',
    role:'gestor' as const, lastLogin:'2026-05-25T16:00:00Z', active:true },
  { id:'u4', name:'Admin IGNIS', email:'admin@ignis.ce.gov.br',
    role:'admin' as const, lastLogin:'2026-05-26T08:00:00Z', active:true },
  { id:'u5', name:'João Público', email:'—',
    role:'publico' as const, lastLogin:'2026-05-24T11:00:00Z', active:false },
];

export const AUDIT_LOG = [
  { id:'a1', ts:'2026-05-26T10:45:00Z', user:'Ana Lima',
    action:'Validou denúncia RPT-1716724800000', entity:'report' },
  { id:'a2', ts:'2026-05-26T10:12:00Z', user:'Sistema IGNIS',
    action:'Incidente IGN-CE-2026-0041 elevado para CRÍTICO', entity:'incident' },
  { id:'a3', ts:'2026-05-26T09:55:00Z', user:'Sistema IGNIS',
    action:'Notificação enviada para SEMACE e IBAMA', entity:'system' },
  { id:'a4', ts:'2026-05-26T09:41:00Z', user:'Ana Lima',
    action:'Confirmação orbital registrada — confiança 87%', entity:'incident' },
  { id:'a5', ts:'2026-05-25T14:30:00Z', user:'Admin IGNIS',
    action:'Área RPPN Elias Andrade adicionada ao sistema', entity:'area' },
];
```

- [ ] Run: `npm run build`
- [ ] Commit: `feat: add domain types and mock data`

---

## Phase 2 — UserContext + Router + App

### Task 2.1: Create src/context/UserContext.tsx

```tsx
import { createContext, useContext, useState, ReactNode } from 'react';
import type { UserProfile, UserRole } from '@/types/domain';

interface UserCtx {
  profile: UserProfile | null;
  setProfile: (p: UserProfile) => void;
  clearProfile: () => void;
  isGestor: boolean;
  isAdmin: boolean;
  hasRole: (r: UserRole) => boolean;
}

const UserContext = createContext<UserCtx | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [profile, setProfileState] = useState<UserProfile | null>(null);

  const setProfile = (p: UserProfile) => setProfileState(p);
  const clearProfile = () => setProfileState(null);
  const isGestor = profile?.role === 'gestor' || profile?.role === 'admin';
  const isAdmin = profile?.role === 'admin';
  const hasRole = (r: UserRole) => profile?.role === r;

  return (
    <UserContext.Provider value={{ profile, setProfile, clearProfile, isGestor, isAdmin, hasRole }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
}
```

### Task 2.2: Create src/router/index.tsx

All 21 routes with correct layout nesting. WarRoomPage and FieldOperationPage bypass GestorLayout. Use React.lazy for page-level code splitting (optional but recommended for build size).

### Task 2.3: Replace src/App.tsx

```tsx
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { UserProvider } from '@/context/UserContext';
import { router } from '@/router';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <RouterProvider router={router} />
        </TooltipProvider>
      </UserProvider>
    </QueryClientProvider>
  );
}
```

- [ ] Run: `npm run build`
- [ ] Commit: `feat: add user context router and layouts`

---

## Phase 3 — Shared Components + Layouts + OrbitalMap + AuroraChat

### Task 3.1: Create src/components/shared/RiskBadge.tsx

Props: `{ risk: RiskLevel; size?: 'sm' | 'md' }`. Uses CSS variable colors with `color-mix(in oklch, var(--risk-*) 20%, transparent)` for background.

Labels: Crítico · Alto · Médio · Baixo. Includes fallback for undefined risk.

### Task 3.2: Create src/components/shared/StatusBadge.tsx

Maps ALL status values to labels + colors:
- IncidentStatus: deteccao-orbital, confirmacao-pendente, protocolo-ativado, equipes-mobilizadas, combate-ativo, controle-parcial, extinto, encerrado
- ReportStatus: em-triagem, validada, em-campo, convertida-incidente, descartada
- TeamStatus: **disponivel, mobilizado, em-transito, indisponivel** (critical: must all be covered)

### Task 3.3: Create src/components/shared/MetricCard.tsx

Props: `{ value: string | number; label: string; unit?: string; delta?: string; icon?: ReactNode; accent?: string }`.

### Task 3.4: Create src/components/shared/OrbitalMap.tsx

Leaflet wrapper:
- Fix Leaflet default icons at module scope (run once):
```ts
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({ iconUrl: markerIcon, iconRetinaUrl: markerIcon2x, shadowUrl: markerShadow });
```
- Props: `{ center, zoom, children?, darkTiles?: boolean (default true), zoomControl?: boolean (default true), className? }`
- Add className `.ignis-dark-map` when darkTiles=true
- Import `leaflet/dist/leaflet.css`
- **WarRoomPage uses `zoomControl={false}` to avoid duplicate controls**
- **Public maps use `darkTiles={false}`**

### Task 3.5: Create src/components/shared/AuroraChat.tsx

5 QUICK_ACTIONS:
1. "Resumir incidente ativo"
2. "Classificar risco da área"
3. "Gerar rascunho de relatório"
4. "Explicar dado orbital"
5. "Recomendar próxima ação operacional"

Disclaimer text: `"Resposta simulada — protótipo demonstrativo"` visible on every response.

### Task 3.6: Create layouts

**`src/components/layouts/PublicLayout.tsx`** — `min-h-screen` (not `height: 100vh`), top nav with links to /public, /public/map, /public/report.

**`src/components/layouts/GestorLayout.tsx`** — flex row, GestorSidebar (218px) + main column (flex: 1, overflow-y: auto), GestorTopbar (44px).

### Task 3.7: Create src/components/shared/GestorSidebar.tsx

218px sidebar. NavLink active state: `border-left: 3px solid var(--orbital)`. Bottom section: profile name + role + "Sair" button that calls `clearProfile()` + `navigate('/select-profile')`.

Nav links:
- / (Dashboard)
- /gestor/reports (Denúncias)
- /gestor/map (Mapa Orbital)
- /gestor/mobilization (Mobilização)
- /gestor/ranking (Ranking de Risco) ← **new**
- /gestor/aurora (Aurora IA)
- /gestor/esg (Relatório ESG)

### Task 3.8: Create src/components/shared/GestorTopbar.tsx

44px height. `getTitle()` function using exact match first, then `startsWith` patterns. Pulsing link to `/gestor/war-room` when critical incident exists (`getCriticalIncident()` not null).

- [ ] Run: `npm run build`
- [ ] Commit: `feat: add shared UI components and orbital map`

---

## Phase 4 — Entrada + Portal Público (5 screens)

### Task 4.1: src/pages/shared/SplashPage.tsx

Framer Motion ring animation. Tagline: "Conectando dados, salvando vidas." Auto-redirect to `/login` after 2500ms. Progress bar animation.

### Task 4.2: src/pages/shared/LoginPage.tsx

react-hook-form + Zod (email: string, password: min 1). Any credentials → `/select-profile`. Link to `/public` (Portal Público).

### Task 4.3: src/pages/shared/SelectProfilePage.tsx

5 profile cards with Framer Motion stagger (delay: index * 0.08s). Profiles: Admin, Gestora, Analista, Campo, Público. On click: `setProfile(user)` + `navigate(roleRoute)`.

### Task 4.4: src/pages/shared/NotFoundPage.tsx

"Coordenadas não encontradas" · IGNIS design · back link.

### Task 4.5: src/pages/public/PublicDashboardPage.tsx

- Hero section with tagline + disclaimer: `"Dados demonstrativos baseados em lógica de monitoramento orbital e ambiental. FIAP GS 2026."`
- 4 MetricCards: Áreas Monitoradas, Incidentes Ativos, Foco Crítico, Tempo Médio de Resposta
- PublicAlertList (inline component or extracted) — shows alerts from critical/high incidents
- OrbitalMap with darkTiles={false}, showing area polygons
- CTA button: "Registrar Denúncia" → `/public/report`

### Task 4.6: src/pages/public/PublicMapPage.tsx

Full-height map. Area polygons. Click area → collapsible side panel with:
- Area name + RiskBadge + dataQuality warning
- Button: "Ver detalhes" (navigates to `/gestor/area/:id` — gestor route, but accessible for demo)
- Button: "Registrar Denúncia nesta Área" → `/public/report?areaId=<id>`

### Task 4.7: src/pages/public/RegisterReportPage.tsx

2-col layout: form fields left | location map right.
- 10 occurrence type options
- Zod validation (occurrenceType, description min 20 chars, urgency)
- LocationPicker subcomponent (click map to set coords)
- Anonymous checkbox
- Truthful declaration checkbox (required)
- Submit: generate `RPT-${Date.now()}` → navigate to `/public/report/status/${id}`

### Task 4.8: src/pages/public/ReportStatusPage.tsx

Protocol ID card + 7-state progress timeline. If ID not in `reports.ts`, show mock "em-triagem" status with generated ID.

- [ ] Run: `npm run build`
- [ ] Commit: `feat: implement public portal flow`

---

## Phase 5 — Dashboard Gestor + Denúncias + Validação (3 screens)

### Task 5.1: src/pages/gestor/GestorDashboardPage.tsx

- 6 MetricCards: Áreas Monitoradas, Incidentes Ativos, Denúncias Pendentes, Equipes Mobilizadas, Alertas Críticos, Tempo Médio
- Recharts AreaChart (weeklyIncidents from ESG_DATA) with ResponsiveContainer
- Aurora insight widget (static card with recommendation from critical incident)
- Critical incident banner (red background, links to `/gestor/war-room`) — visible when getCriticalIncident() not null
- IncidentCard grid (extracted component)

### Task 5.2: src/components/gestor/IncidentCard.tsx

Shows `area.name` (via `getAreaById(incident.areaId)?.name`), NOT raw area ID. RiskBadge + StatusBadge. Links to `/gestor/incident/:id` and `/gestor/war-room`.

### Task 5.3: src/pages/gestor/ReportCenterPage.tsx

Tab filter: all / em-triagem / validada / em-campo / descartada. Text search input. ReportTable component.

### Task 5.4: src/components/gestor/ReportTable.tsx

Columns: ID, Tipo, Área (getAreaById name), Urgência, Status, Recebida, Ações.
Row actions: "Analisar" → `/gestor/reports/:id` (primary action), "Validar" quick action (toast).

### Task 5.5: src/pages/gestor/ReportValidationPage.tsx

2-col layout:
- Left: report details + location map + Aurora cross-reference
- Right: Aurora recommendation + 3 decision buttons

Decisions (all mock, local state only):
- **Validar** → toast success
- **Converter em incidente** → toast + navigate('/gestor/war-room') after 1500ms
- **Descartar** → toast + navigate('/gestor/reports')

- [ ] Run: `npm run build`
- [ ] Commit: `feat: implement gestor dashboard and report validation`

---

## Phase 6 — Central Tática Ambiental (WarRoomPage)

### Task 6.1: src/components/gestor/IncidentTimeline.tsx

Props: `{ events: IncidentEvent[]; reverse?: boolean (default true) }`.
Each event: dot colored by type + connector line + timestamp + description + author.

### Task 6.2: src/components/gestor/WeatherBlock.tsx

3-col grid: Temp / Umidade Relativa / Vento.
Red color when: temperature > 35 OR humidity < 20.

### Task 6.3: src/pages/gestor/WarRoomPage.tsx

**FULLSCREEN — bypasses GestorLayout.** Root: `height: 100vh; overflow: hidden; display: flex; flex-direction: column`.

Layout using inline styles with CSS variables (NOT Tailwind grid):

```
Command bar (height: var(--bar-h), background: var(--bg-panel)):
  IGNIS ORBITAL logo | "CENTRAL TÁTICA AMBIENTAL" | incident ID badge | StatusBadge
  | weather telemetry (Temp/UR/Wind) | live clock | "Incidente" link

3-col body (flex: 1, overflow: hidden):
  Left panel (width: var(--sidebar-w), overflow-y: auto, background: var(--bg-deep)):
    - RiskBadge + incident title + area name + coords (JetBrains Mono)
    - Metrics: Área Afetada / Confiança / Detecção / Fonte
    - Teams (TEAMS filtered by assignedTeams) with status dots
    - WeatherBlock
    - dataQuality warning if area.dataQuality !== 'official'
    - "Reforçar Protocolo de Resposta" button → toast + setReinforced(true)

  Center (flex: 1): OrbitalMap (zoomControl={false}, darkTiles={true})
    - Area polygon (red dashed)
    - Fire circle (radius from affectedHectares * 56 meters)
    - Incident marker
    - Legend overlay (bottom-left, z-index: 1000)

  Right panel (width: 270px, overflow-y: auto, background: var(--bg-deep)):
    - Aurora IA block: confidence badge + recommendation + "Resposta simulada" disclaimer
    - IncidentTimeline (reversed)
    - Protocol checklist (interactive useState(PROTOCOL_INCENDIO.steps))
```

- [ ] Run: `npm run build`
- [ ] Commit: `feat: implement tactical war room`

---

## Phase 7 — Mapa Orbital + Comando de Incidente (2 screens)

### Task 7.1: src/pages/gestor/OrbitalMapPage.tsx

Layer toggles: areas (default on), incidents, teams, buffer (placeholder), reports (placeholder).

```ts
const LAYER_META: Record<keyof typeof layers, string> = {
  areas: 'Áreas Protegidas',
  incidents: 'Incidentes Ativos',
  teams: 'Equipes de Campo',
  buffer: 'Zonas de Buffer',
  reports: 'Denúncias',
};
```

Area polygon click → selection panel with RiskBadge + dataQuality warning + links to area detail and WarRoom.
Use `getPolygonPositions` for all polygons.

### Task 7.2: src/components/gestor/EvidenceGrid.tsx

Props: `{ evidence: Evidence[] }`. 2-col grid. Each card: image placeholder + caption + source + timestamp. Fallback message when empty.

### Task 7.3: src/pages/gestor/ActiveIncidentPage.tsx

2-col layout:
- Left: mini OrbitalMap (height: 200px) + 3 MetricCards (Área/Confiança/Tempo) + WeatherBlock + Aurora widget
- Right: teams list + IncidentTimeline + EvidenceGrid

Header: incident ID badge + RiskBadge + StatusBadge + "Abrir Central Tática" red button → `/gestor/war-room`.
Null area fallback: `<p>Área não encontrada no sistema.</p>`.

- [ ] Run: `npm run build`
- [ ] Commit: `feat: implement orbital map and incident command`

---

## Phase 8 — Mobilização + Campo + Aurora + ESG (4 screens)

### Task 8.1: src/components/gestor/ResourceGrid.tsx

Props: `{ resources: Resource[] }`. 2-3 col grid.
TYPE_LABEL mapping for all ResourceType values: veículo, aeronave, equipamento, suprimento.
StatusBadge for each resource. currentIncident shown if set.

### Task 8.2: src/pages/gestor/MobilizationPage.tsx

- Team filter tabs: Todos / Combate / Reconhecimento / Apoio Logístico
- Team table with "Mobilizar" button → local state change + toast
- ResourceGrid at bottom

### Task 8.3: src/pages/gestor/FieldOperationPage.tsx

**MOBILE-FIRST — bypasses GestorLayout.** maxWidth: 390px, margin: 0 auto.

Header with back link to `/gestor/mobilization`.
Mission card: objectives list + notes.
Location map (OrbitalMap, height: 200px).

4 action areas with **minHeight: 48px each**:
1. "Cheguei ao Local" button (whileTap scale animation) → `setArrived(true)`, disabled after click
2. "📷 Anexar Evidência" button — disabled with `(protótipo)` label
3. Status update `<textarea>` (minHeight: 80px)
4. "Enviar Relatório de Campo" button → toast + `setSent(true)`

### Task 8.4: src/pages/gestor/AuroraPage.tsx

Context sidebar (critical incident summary + 8 area list) + AuroraChat full height.
Disclaimer at top of context sidebar:
```
"Sistema de IA demonstrativo — respostas simuladas para fins acadêmicos.
Não representa integração real com modelos de linguagem."
```

### Task 8.5: src/components/gestor/ESGCharts.tsx

Two charts with `<ResponsiveContainer width="100%" height={200}>`:
1. Recharts AreaChart (weeklyIncidents) with custom tooltip
2. Recharts BarChart (monthlyFoci) with custom tooltip
Custom tooltip style matching design system (bg: var(--bg-surface), border: 1px solid var(--bg-raised)).

### Task 8.6: src/pages/gestor/ESGReportPage.tsx

- Header: period + "Dados demonstrativos — FIAP GS 2026" note
- 4 MetricCards
- ESGCharts (with ResponsiveContainer)
- ODS grid showing **exactly**: ODS 2, 8, 9, 11, 13, 15
- `@media print { .no-print { display: none } }` for print optimization

- [ ] Run: `npm run build`
- [ ] Commit: `feat: add mobilization field aurora and esg screens`

---

## Phase 9 — Admin + Área Detail + Ranking (3 screens)

### Task 9.1: src/pages/gestor/GestorAreaDetailPage.tsx

Route: `/gestor/area/:id`. Breadcrumb: "Mapa Orbital / {area.name}".

- Null fallback: `<p>Área não encontrada.</p>` + back link
- dataQuality warning (pattern: orange/amber background with ⚠ icon)
- 4 MetricCards: Hectares / Incidentes Ativos / Confiança / Última Atualização
- 2-col: OrbitalMap (height: 340px) | incident list
- Action buttons: "Abrir Central Tática" + "Ver Ranking de Risco"

### Task 9.2: src/pages/gestor/RiskRankingPage.tsx

Sorted by risk (critical → high → medium → low). Rank number colored:
- #1: var(--risk-crit), #2: var(--risk-high), #3: var(--risk-med), others: var(--text-ghost)

Row #1 has subtle red tinted background: `oklch(58% 0.22 25 / 5%)`.

Disclaimer: "Os níveis de risco são calculados com base em dados estimados para fins demonstrativos do projeto IGNIS (FIAP GS 2026). Não representam avaliação técnica oficial."

Columns: # · Área · Tipo · Risco · Incidentes · Ações (Detalhar + Tática if active)

### Task 9.3: src/pages/admin/AdminPanelPage.tsx

3 tabs: Usuários / Áreas Protegidas / Log de Auditoria.

Users tab: columns Nome / E-mail / Perfil / Último acesso / Status.
Areas tab: columns Área / Tipo / Risco / Qualidade / Confiança.
Audit tab: columns Timestamp / Usuário / Ação.

Data from `src/data/users.ts` and `src/data/areas.ts` (no inline data in component).

- [ ] Update `src/router/index.tsx` to add `/gestor/area/:id` and `/gestor/ranking` inside GestorLayout children
- [ ] Update `src/components/shared/GestorSidebar.tsx` to add Ranking de Risco link
- [ ] Run: `npm run build`
- [ ] Commit: `feat: add admin area detail and risk ranking`

---

## Phase 10 — Cleanup + README + Build + Deploy Prep

### Task 10.1: Verify and remove legacy files (safe order)

1. Run: `grep -r "pages/Index\|pages/Login\|pages/CrisisRoom\|pages/AdminDashboard\|pages/PublicDashboard\|pages/NotFound" src/`
2. Expected: 0 occurrences (after App.tsx was replaced in Phase 2)
3. Only if grep returns 0: delete these files:
   - `src/pages/Index.tsx`
   - `src/pages/Login.tsx`
   - `src/pages/CrisisRoom.tsx`
   - `src/pages/AdminDashboard.tsx`
   - `src/pages/PublicDashboard.tsx`
   - `src/pages/NotFound.tsx`

### Task 10.2: Final build verification

- [ ] Run: `npm run build` — must be clean (0 errors, 0 TS warnings)
- [ ] If build fails: do NOT commit, fix errors first

### Task 10.3: Update README.md

Full content (see README spec in Phase 0 + adjustment: RPPN disclaimer text must be exactly):
> "A RPPN Elias Andrade é usada como caso demonstrativo. Dados territoriais, coordenadas e métricas exibidas no protótipo são estimados/simulados até validação por base oficial."

README sections: Project name · Vision · Stack · How to run · Main routes · GS scope · Prototype limits · Student info · Deploy link (placeholder).

### Task 10.4: Configure Vercel deploy

Option A (CLI):
```bash
npm i -g vercel
vercel login
vercel --prod
```

Option B (GitHub):
1. `git push origin main`
2. vercel.com/new → import `eliasandraade/ignis-fire-watch`
3. Framework: Vite · Build: `npm run build` · Output: `dist`
4. Copy production URL

### Task 10.5: Final commit and push

```bash
git add README.md vercel.json
git commit -m "docs: update readme and deploy configuration"
git push origin main
```

---

## Delivery Checklist

- [ ] `npm run build` clean (0 errors)
- [ ] All 21 routes navigable
- [ ] WarRoom fullscreen (no unwanted scroll)
- [ ] FieldOperation works at 390px viewport
- [ ] Public map has no dark filter (darkTiles=false)
- [ ] Gestor map has dark filter (darkTiles=true)
- [ ] All data disclaimers visible
- [ ] AuroraChat "Resposta simulada" on all instances
- [ ] ESG shows exactly ODS 2, 8, 9, 11, 13, 15
- [ ] vercel.json present (React Router SPA fix)
- [ ] README complete with deploy link
- [ ] Legacy files deleted after clean build
- [ ] All commits pushed to github.com/eliasandraade/ignis-fire-watch
