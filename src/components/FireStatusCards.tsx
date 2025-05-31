import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import IncidentDetails from './IncidentDetails';
import ResourceMobilization from './ResourceMobilization';

interface FireIncident {
  id: string;
  location: string;
  intensity: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'monitoring' | 'controlled' | 'extinguished';
  timestamp: string;
  resources: string[];
  confidence: number;
}

const FireStatusCards = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedIncident, setSelectedIncident] = useState<string | null>(null);
  const [detailsIncident, setDetailsIncident] = useState<FireIncident | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showMobilization, setShowMobilization] = useState(false);
  const [mobilizationType, setMobilizationType] = useState<'aircraft' | 'ground' | 'water' | null>(null);
  const [incidents, setIncidents] = useState<FireIncident[]>([
    {
      id: 'SP-GRU-30052501',
      location: 'Parque Estadual da Cantareira, SP',
      intensity: 'critical',
      status: 'active',
      timestamp: '2024-05-30T14:30:00Z',
      resources: ['3 Aeronaves', '15 Bombeiros', '2 Caminhões'],
      confidence: 95
    },
    {
      id: 'RJ-NOV-30052502',
      location: 'Tijuca, Rio de Janeiro, RJ',
      intensity: 'high',
      status: 'monitoring',
      timestamp: '2024-05-30T13:45:00Z',
      resources: ['1 Aeronave', '8 Bombeiros'],
      confidence: 87
    },
    {
      id: 'MG-BEL-30052503',
      location: 'Serra do Curral, Belo Horizonte, MG',
      intensity: 'medium',
      status: 'controlled',
      timestamp: '2024-05-30T12:15:00Z',
      resources: ['5 Bombeiros', '1 Caminhão'],
      confidence: 78
    }
  ]);

  const getIntensityBadge = (intensity: string) => {
    switch (intensity) {
      case 'critical': return <Badge className="bg-fire-600 text-white animate-pulse">Crítico</Badge>;
      case 'high': return <Badge className="bg-fire-500 text-white">Alto</Badge>;
      case 'medium': return <Badge className="bg-warning-500 text-white">Médio</Badge>;
      case 'low': return <Badge className="bg-forest-500 text-white">Baixo</Badge>;
      default: return <Badge>Desconhecido</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <Badge variant="destructive" className="animate-pulse">🔥 Ativo</Badge>;
      case 'monitoring': return <Badge className="bg-warning-100 text-warning-800">👁️ Monitoramento</Badge>;
      case 'controlled': return <Badge className="bg-blue-100 text-blue-800">🛡️ Controlado</Badge>;
      case 'extinguished': return <Badge className="bg-forest-100 text-forest-800">✅ Extinto</Badge>;
      default: return <Badge variant="secondary">Desconhecido</Badge>;
    }
  };

  const getCardBorder = (intensity: string) => {
    switch (intensity) {
      case 'critical': return 'border-l-4 border-l-fire-600 shadow-lg shadow-red-200';
      case 'high': return 'border-l-4 border-l-fire-500 shadow-lg shadow-orange-200';
      case 'medium': return 'border-l-4 border-l-warning-500 shadow-lg shadow-yellow-200';
      case 'low': return 'border-l-4 border-l-forest-500 shadow-lg shadow-green-200';
      default: return '';
    }
  };

  const handleDetailsClick = (incident: FireIncident) => {
    setDetailsIncident(incident);
    setShowDetails(true);
  };

  const handleCrisisRoomClick = (incident: FireIncident) => {
    navigate(`/crisis-room?incident=${incident.id}`);
  };

  const handleMobilizeResources = (incident: FireIncident, type: 'aircraft' | 'ground' | 'water') => {
    setSelectedIncident(incident.id);
    setMobilizationType(type);
    setShowMobilization(true);
  };

  const handleMobilizationComplete = () => {
    setShowMobilization(false);
    setMobilizationType(null);
    setSelectedIncident(null);
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Focos em Monitoramento</h2>
          <div className="flex space-x-2">
            <Badge variant="destructive" className="animate-pulse">
              {incidents.filter(i => i.status === 'active').length} Ativos
            </Badge>
            <Badge className="bg-warning-100 text-warning-800">
              {incidents.filter(i => i.status === 'monitoring').length} Monitoramento
            </Badge>
            <Badge className="bg-blue-100 text-blue-800">
              {incidents.filter(i => i.status === 'controlled').length} Controlados
            </Badge>
          </div>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {incidents.map((incident) => (
            <Card 
              key={incident.id} 
              className={`${getCardBorder(incident.intensity)} hover:shadow-xl transition-all duration-300 cursor-pointer ${
                selectedIncident === incident.id ? 'ring-2 ring-blue-400' : ''
              }`}
              onClick={() => setSelectedIncident(incident.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-sm font-mono text-gray-600">{incident.id}</CardTitle>
                    <p className="text-sm font-medium text-gray-900 mt-1">{incident.location}</p>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    {getIntensityBadge(incident.intensity)}
                    {getStatusBadge(incident.status)}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                {/* Nível de Confiança */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-600">Confiança da Detecção</span>
                    <span className="text-xs font-medium">{incident.confidence}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        incident.confidence >= 90 ? 'bg-forest-500' : 
                        incident.confidence >= 70 ? 'bg-warning-500' : 'bg-fire-500'
                      }`}
                      style={{ width: `${incident.confidence}%` }}
                    ></div>
                  </div>
                </div>

                {/* Recursos Mobilizados */}
                <div>
                  <p className="text-xs text-gray-600 mb-1">Recursos Mobilizados</p>
                  <div className="flex flex-wrap gap-1">
                    {incident.resources.map((resource, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {resource}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Timestamp */}
                <div>
                  <p className="text-xs text-gray-600">Última atualização</p>
                  <p className="text-xs text-gray-900">
                    {new Date(incident.timestamp).toLocaleString('pt-BR')}
                  </p>
                </div>

                {/* Ações Principais */}
                <div className="flex space-x-2 pt-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1 text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDetailsClick(incident);
                    }}
                  >
                    📋 Detalhes
                  </Button>
                  <Button 
                    size="sm" 
                    variant="default" 
                    className="flex-1 text-xs bg-fire-500 hover:bg-fire-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCrisisRoomClick(incident);
                    }}
                  >
                    🚨 Crise
                  </Button>
                </div>

                {/* Ações de Mobilização para casos ativos */}
                {incident.status === 'active' && (
                  <div className="grid grid-cols-3 gap-1 pt-2">
                    <Button 
                      size="sm" 
                      className="text-xs bg-blue-500 hover:bg-blue-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMobilizeResources(incident, 'aircraft');
                      }}
                    >
                      🚁 Aérea
                    </Button>
                    <Button 
                      size="sm" 
                      className="text-xs bg-green-500 hover:bg-green-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMobilizeResources(incident, 'ground');
                      }}
                    >
                      👥 Terrestre
                    </Button>
                    <Button 
                      size="sm" 
                      className="text-xs bg-cyan-500 hover:bg-cyan-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMobilizeResources(incident, 'water');
                      }}
                    >
                      🚛 Água
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Modais */}
      <IncidentDetails 
        incident={detailsIncident}
        isOpen={showDetails}
        onClose={() => {
          setShowDetails(false);
          setDetailsIncident(null);
        }}
      />

      <ResourceMobilization 
        isOpen={showMobilization}
        onClose={handleMobilizationComplete}
        type={mobilizationType}
        incidentId={selectedIncident}
      />
    </>
  );
};

export default FireStatusCards;
