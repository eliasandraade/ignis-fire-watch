
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface FirePoint {
  id: string;
  lat: number;
  lng: number;
  intensity: 'low' | 'medium' | 'high' | 'critical';
  location: string;
  timestamp: string;
}

const InteractiveMap = () => {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  
  const firePoints: FirePoint[] = [
    {
      id: 'SP-GRU-30052501',
      lat: -23.5505,
      lng: -46.6333,
      intensity: 'critical',
      location: 'Parque Estadual da Cantareira, SP',
      timestamp: '2024-05-30T14:30:00Z'
    },
    {
      id: 'RJ-NOV-30052502',
      lat: -22.9068,
      lng: -43.1729,
      intensity: 'high',
      location: 'Tijuca, Rio de Janeiro, RJ',
      timestamp: '2024-05-30T13:45:00Z'
    },
    {
      id: 'MG-BEL-30052503',
      lat: -19.9191,
      lng: -43.9386,
      intensity: 'medium',
      location: 'Serra do Curral, Belo Horizonte, MG',
      timestamp: '2024-05-30T12:15:00Z'
    }
  ];

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case 'critical': return 'bg-fire-600 border-fire-700';
      case 'high': return 'bg-fire-500 border-fire-600';
      case 'medium': return 'bg-warning-500 border-warning-600';
      case 'low': return 'bg-forest-500 border-forest-600';
      default: return 'bg-gray-500 border-gray-600';
    }
  };

  const getIntensityBadge = (intensity: string) => {
    switch (intensity) {
      case 'critical': return <Badge className="bg-fire-600 text-white">Crítico</Badge>;
      case 'high': return <Badge className="bg-fire-500 text-white">Alto</Badge>;
      case 'medium': return <Badge className="bg-warning-500 text-white">Médio</Badge>;
      case 'low': return <Badge className="bg-forest-500 text-white">Baixo</Badge>;
      default: return <Badge>Desconhecido</Badge>;
    }
  };

  return (
    <Card className="h-96 relative overflow-hidden">
      {/* Controles do Mapa */}
      <div className="absolute top-4 left-4 z-10 flex space-x-2">
        <Button 
          size="sm" 
          variant={selectedFilter === 'all' ? 'default' : 'outline'}
          onClick={() => setSelectedFilter('all')}
        >
          Todos
        </Button>
        <Button 
          size="sm" 
          variant={selectedFilter === 'critical' ? 'default' : 'outline'}
          onClick={() => setSelectedFilter('critical')}
        >
          Críticos
        </Button>
        <Button 
          size="sm" 
          variant={selectedFilter === 'active' ? 'default' : 'outline'}
          onClick={() => setSelectedFilter('active')}
        >
          Ativos
        </Button>
      </div>

      {/* Legenda */}
      <div className="absolute top-4 right-4 z-10 bg-white p-3 rounded-lg shadow-md">
        <h4 className="font-semibold text-sm mb-2">Intensidade</h4>
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-fire-600 rounded-full"></div>
            <span className="text-xs">Crítico</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-fire-500 rounded-full"></div>
            <span className="text-xs">Alto</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-warning-500 rounded-full"></div>
            <span className="text-xs">Médio</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-forest-500 rounded-full"></div>
            <span className="text-xs">Baixo</span>
          </div>
        </div>
      </div>

      {/* Simulação do Mapa */}
      <div className="w-full h-full bg-gradient-to-br from-forest-50 to-forest-100 relative">
        {/* Background pattern para simular mapa */}
        <div className="absolute inset-0 opacity-20 bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300"></div>
        
        {/* Pontos de Fogo */}
        {firePoints.map((point) => (
          <div
            key={point.id}
            className={`absolute w-6 h-6 rounded-full border-2 ${getIntensityColor(point.intensity)} animate-pulse-fire cursor-pointer transform -translate-x-1/2 -translate-y-1/2`}
            style={{
              left: `${(point.lng + 50) * 2}%`,
              top: `${(point.lat + 30) * 2}%`
            }}
            title={`${point.location} - ${point.intensity}`}
          >
            <div className="w-full h-full rounded-full animate-ping"></div>
          </div>
        ))}

        {/* Overlay de informação quando um ponto é selecionado */}
        <div className="absolute bottom-4 left-4 right-4 bg-white rounded-lg shadow-lg p-4">
          <h3 className="font-semibold text-lg mb-2">Foco Selecionado: SP-GRU-30052501</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Localização</p>
              <p className="font-medium">Parque Estadual da Cantareira, SP</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Intensidade</p>
              {getIntensityBadge('critical')}
            </div>
            <div>
              <p className="text-sm text-gray-600">Última Atualização</p>
              <p className="font-medium">30/05/2024 14:30</p>
            </div>
          </div>
          <div className="mt-3 flex space-x-2">
            <Button size="sm" variant="default">
              Ver Detalhes
            </Button>
            <Button size="sm" variant="outline">
              Mobilizar Recursos
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default InteractiveMap;
