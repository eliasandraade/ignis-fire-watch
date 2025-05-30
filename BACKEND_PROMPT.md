
# Prompt para Desenvolvimento do Back-end da Plataforma IGNIS

## Contexto e Objetivo

Desenvolver o back-end completo para a Plataforma IGNIS - uma solução web inteligente para centralizar informações e otimizar a resposta a incêndios florestais no Brasil. O sistema deve ser robusto, escalável, seguro e capaz de processar dados em tempo real.

## Stack Tecnológica Recomendada

### Core Backend
- **Framework**: Node.js com TypeScript + Express.js ou Fastify
- **Banco de Dados**: PostgreSQL (principal) + Redis (cache/sessões)
- **ORM**: Prisma ou TypeORM
- **Autenticação**: JWT + bcrypt
- **Validação**: Joi ou Zod
- **Documentação**: Swagger/OpenAPI

### Integrações e APIs
- **APIs Externas**: INPE, SIPAM, dados meteorológicos
- **Mapas**: Integração com Mapbox ou Google Maps API
- **Notificações**: 
  - Email: SendGrid ou NodeMailer
  - SMS: Twilio
  - Push: Firebase Cloud Messaging
- **File Storage**: AWS S3 ou CloudFlare R2
- **Monitoramento**: Winston para logs

### Infraestrutura
- **Deploy**: Docker + Kubernetes ou Docker Compose
- **Proxy**: Nginx
- **Monitoring**: Prometheus + Grafana
- **CI/CD**: GitHub Actions

## Funcionalidades Principais

### 1. Sistema de Autenticação e Autorização

```typescript
interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'bombeiro' | 'coordenador' | 'observador';
  permissions: string[];
  active: boolean;
  lastLogin: Date;
  createdAt: Date;
}

interface AuthPayload {
  userId: string;
  role: string;
  permissions: string[];
}
```

**Endpoints necessários:**
- `POST /auth/login` - Login com email/senha
- `POST /auth/logout` - Logout
- `POST /auth/refresh` - Renovar token
- `GET /auth/me` - Dados do usuário logado
- `POST /auth/forgot-password` - Recuperação de senha
- `PUT /auth/reset-password` - Reset de senha

### 2. Gestão de Incidentes

```typescript
interface Incident {
  id: string; // Formato: SP-GRU-30052501
  location: {
    latitude: number;
    longitude: number;
    address: string;
    city: string;
    state: string;
  };
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'detected' | 'confirmed' | 'active' | 'contained' | 'extinguished';
  source: 'inpe' | 'sipam' | 'citizen_report' | 'manual';
  confidence: number; // 0-100
  detectedAt: Date;
  confirmedAt?: Date;
  area: number; // hectares
  propagationPrediction?: PropagationModel;
  resources: ResourceAssignment[];
  createdBy: string;
  updatedAt: Date;
}

interface PropagationModel {
  windSpeed: number;
  windDirection: number;
  humidity: number;
  temperature: number;
  vegetation: string;
  predictedAreas: {
    timeframe: string; // '1h', '3h', '6h', '12h'
    polygon: number[][]; // coordenadas
    probability: number;
  }[];
}
```

**Endpoints necessários:**
- `GET /incidents` - Listar incidentes (com filtros)
- `POST /incidents` - Criar novo incidente
- `GET /incidents/:id` - Detalhes de um incidente
- `PUT /incidents/:id` - Atualizar incidente
- `DELETE /incidents/:id` - Excluir incidente
- `POST /incidents/:id/propagation` - Calcular propagação
- `GET /incidents/:id/timeline` - Timeline de eventos

### 3. Sistema de Denúncias (Chatbot AURORA)

```typescript
interface CitizenReport {
  id: string;
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  description: string;
  photos: string[]; // URLs das imagens
  videos: string[]; // URLs dos vídeos
  reporterContact?: {
    name?: string;
    phone?: string;
    email?: string;
  };
  status: 'pending' | 'verified' | 'false_alarm' | 'converted_to_incident';
  confidence: number;
  verifiedBy?: string;
  incidentId?: string; // Se convertido em incidente
  createdAt: Date;
}
```

**Endpoints necessários:**
- `POST /reports` - Nova denúncia via chatbot
- `GET /reports` - Listar denúncias
- `PUT /reports/:id/verify` - Verificar denúncia
- `POST /reports/:id/convert` - Converter em incidente
- `POST /reports/upload` - Upload de mídia

### 4. Gestão de Recursos

```typescript
interface Resource {
  id: string;
  name: string;
  type: 'helicopter' | 'airplane' | 'ground_team' | 'water_truck' | 'ambulance';
  status: 'available' | 'deployed' | 'maintenance' | 'unavailable';
  location: {
    latitude: number;
    longitude: number;
    baseId: string;
  };
  capabilities: {
    waterCapacity?: number;
    personnelCount?: number;
    equipmentList?: string[];
  };
  assignedIncident?: string;
  estimatedArrival?: Date;
  lastUpdate: Date;
}

interface Base {
  id: string;
  name: string;
  type: 'fire_station' | 'airport' | 'hospital' | 'supply_center' | 'forest_base' | 'shelter';
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  contact: {
    phone: string;
    email: string;
    radio?: string;
  };
  resources: string[]; // IDs dos recursos
  capacity: {
    personnel?: number;
    vehicles?: number;
    shelterCapacity?: number;
  };
  status: 'operational' | 'limited' | 'offline';
}
```

**Endpoints necessários:**
- `GET /resources` - Listar recursos
- `PUT /resources/:id/assign` - Atribuir recurso a incidente
- `PUT /resources/:id/status` - Atualizar status
- `GET /bases` - Listar bases/estruturas
- `PUT /bases/:id` - Atualizar base

### 5. Sistema de Alertas

```typescript
interface Alert {
  id: string;
  type: 'fire_detected' | 'evacuation_order' | 'resource_request' | 'weather_warning';
  severity: 'info' | 'warning' | 'critical';
  title: string;
  message: string;
  incidentId?: string;
  targetAudience: {
    roles?: string[];
    regions?: string[];
    users?: string[];
  };
  channels: ('email' | 'sms' | 'push' | 'system')[];
  sentAt?: Date;
  expiresAt?: Date;
  createdBy: string;
}
```

**Endpoints necessários:**
- `POST /alerts` - Criar alerta
- `GET /alerts` - Listar alertas
- `POST /alerts/:id/send` - Enviar alerta
- `GET /alerts/user/:userId` - Alertas do usuário

### 6. Integração com APIs Externas

**Serviços necessários:**
- **INPE API**: Dados de focos de calor
- **SIPAM**: Dados meteorológicos
- **Weather API**: Previsão do tempo
- **Mapbox/Google**: Geocoding e rotas

```typescript
interface ExternalDataService {
  fetchINPEData(): Promise<INPEFireData[]>;
  fetchWeatherData(lat: number, lng: number): Promise<WeatherData>;
  calculateRoute(from: Coordinates, to: Coordinates): Promise<RouteData>;
  geocodeAddress(address: string): Promise<Coordinates>;
}
```

### 7. WebSocket para Tempo Real

```typescript
interface WebSocketEvents {
  'incident:created': Incident;
  'incident:updated': Partial<Incident> & { id: string };
  'resource:status_changed': { resourceId: string; status: string };
  'alert:new': Alert;
  'crisis_room:join': { incidentId: string; userId: string };
  'crisis_room:leave': { incidentId: string; userId: string };
}
```

### 8. Sistema de Sala de Crise

```typescript
interface CrisisRoomSession {
  incidentId: string;
  participants: {
    userId: string;
    role: string;
    joinedAt: Date;
  }[];
  commands: {
    id: string;
    userId: string;
    action: string;
    target: string;
    timestamp: Date;
    status: 'sent' | 'acknowledged' | 'completed';
  }[];
  activeUntil: Date;
}
```

## Estrutura de Pastas Sugerida

```
backend/
├── src/
│   ├── controllers/        # Controladores das rotas
│   ├── services/          # Lógica de negócio
│   ├── models/            # Modelos do banco de dados
│   ├── middleware/        # Middlewares (auth, validation, etc.)
│   ├── routes/            # Definição das rotas
│   ├── integrations/      # Integrações com APIs externas
│   ├── websocket/         # Handlers do WebSocket
│   ├── utils/             # Utilitários
│   ├── types/             # Definições de tipos TypeScript
│   ├── config/            # Configurações
│   └── app.ts             # Configuração principal da aplicação
├── prisma/                # Schema e migrations do Prisma
├── tests/                 # Testes automatizados
├── docker/                # Arquivos Docker
├── docs/                  # Documentação da API
└── scripts/               # Scripts auxiliares
```

## Variáveis de Ambiente

```env
# Database
DATABASE_URL=
REDIS_URL=

# Auth
JWT_SECRET=
JWT_EXPIRES_IN=24h

# External APIs
INPE_API_KEY=
SIPAM_API_KEY=
WEATHER_API_KEY=
MAPBOX_API_KEY=

# Notifications
SENDGRID_API_KEY=
TWILIO_SID=
TWILIO_TOKEN=
FIREBASE_SERVER_KEY=

# Storage
AWS_ACCESS_KEY=
AWS_SECRET_KEY=
S3_BUCKET=

# App Config
PORT=3001
NODE_ENV=production
CORS_ORIGIN=
```

## Segurança

1. **Rate Limiting**: Implementar rate limiting em todas as rotas
2. **Validação**: Validar todos os inputs
3. **CORS**: Configurar CORS adequadamente
4. **Headers de Segurança**: Helmet.js
5. **Sanitização**: Sanitizar inputs para prevenir XSS
6. **SQL Injection**: Usar ORM/prepared statements
7. **Logs de Auditoria**: Log de todas as ações críticas

## Performance

1. **Cache**: Redis para cache de dados frequentes
2. **Database Indexing**: Índices adequados no PostgreSQL
3. **Connection Pooling**: Pool de conexões do banco
4. **Compression**: Gzip para respostas HTTP
5. **Pagination**: Paginação em todas as listagens

## Monitoramento

1. **Health Check**: Endpoint `/health`
2. **Metrics**: Prometheus metrics
3. **Logging**: Structured logging com Winston
4. **Error Tracking**: Sentry ou similar
5. **Database Monitoring**: Slow query logs

## Deployment

1. **Docker**: Containerização da aplicação
2. **CI/CD**: Pipeline automatizado
3. **Environment Management**: Diferentes ambientes (dev, staging, prod)
4. **Database Migrations**: Migrations automáticas
5. **Backup Strategy**: Backup automático do banco

## Testes

1. **Unit Tests**: Jest para testes unitários
2. **Integration Tests**: Testes de integração
3. **E2E Tests**: Testes end-to-end
4. **Load Tests**: Testes de carga com Artillery
5. **Coverage**: Mínimo de 80% de cobertura

## Documentação

1. **API Documentation**: Swagger/OpenAPI
2. **Code Documentation**: JSDoc
3. **README**: Instruções de setup e deployment
4. **Architecture**: Diagramas de arquitetura
5. **Deployment Guide**: Guia de deploy

Este prompt fornece uma base sólida para o desenvolvimento do back-end da Plataforma IGNIS, cobrindo todos os aspectos necessários para uma aplicação robusta e escalável de gestão de emergências.
