
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

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
  const incidents: FireIncident[] = [
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
  ];

  const getIntensityBadge = (intensity: string) => {
    switch (intensity) {
      case 'critical': return <Badge className="bg-fire-600 text-white">Crítico</Badge>;
      case 'high': return <Badge className="bg-fire-500 text-white">Alto</Badge>;
      case 'medium': return <Badge className="bg-warning-500 text-white">Médio</Badge>;
      case 'low': return <Badge className="bg-forest-500 text-white">Baixo</Badge>;
      default: return <Badge>Desconhecido</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <Badge variant="destructive" className="animate-pulse">Ativo</Badge>;
      case 'monitoring': return <Badge className="bg-warning-100 text-warning-800">Monitoramento</Badge>;
      case 'controlled': return <Badge className="bg-safe-100 text-safe-800">Controlado</Badge>;
      case 'extinguished': return <Badge className="bg-forest-100 text-forest-800">Extinto</Badge>;
      default: return <Badge variant="secondary">Desconhecido</Badge>;
    }
  };

  const getCardBorder = (intensity: string) => {
    switch (intensity) {
      case 'critical': return 'border-l-4 border-l-fire-600';
      case 'high': return 'border-l-4 border-l-fire-500';
      case 'medium': return 'border-l-4 border-l-warning-500';
      case 'low': return 'border-l-4 border-l-forest-500';
      default: return '';
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Focos em Monitoramento</h2>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {incidents.map((incident) => (
          <Card key={incident.id} className={`${getCardBorder(incident.intensity)} hover:shadow-lg transition-shadow`}>
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
                  <span className="text-xs text-gray-600">Confiança</span>
                  <span className="text-xs font-medium">{incident.confidence}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${incident.confidence >= 90 ? 'bg-forest-500' : incident.confidence >= 70 ? 'bg-warning-500' : 'bg-fire-500'}`}
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

              {/* Ações */}
              <div className="flex space-x-2 pt-2">
                <Button size="sm" variant="outline" className="flex-1 text-xs">
                  Detalhes
                </Button>
                <Button size="sm" variant="default" className="flex-1 text-xs">
                  Sala de Crise
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FireStatusCards;
