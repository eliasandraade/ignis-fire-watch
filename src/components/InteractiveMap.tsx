
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const InteractiveMap = () => {
  const { toast } = useToast();
  const [selectedLayers, setSelectedLayers] = useState({
    fires: true,
    weather: true,
    resources: false,
    evacuation: false
  });

  const [selectedFire, setSelectedFire] = useState<string | null>(null);

  const fires = [
    { id: '1', lat: -23.55, lng: -46.64, intensity: 'high', location: 'Cantareira, SP' },
    { id: '2', lat: -22.91, lng: -43.17, intensity: 'critical', location: 'Tijuca, RJ' },
    { id: '3', lat: -19.92, lng: -43.94, intensity: 'medium', location: 'Serra do Curral, MG' }
  ];

  const toggleLayer = (layer: string) => {
    setSelectedLayers(prev => ({
      ...prev,
      [layer]: !prev[layer as keyof typeof prev]
    }));
    toast({
      title: "Camada do Mapa",
      description: `Camada ${layer} ${selectedLayers[layer as keyof typeof selectedLayers] ? 'desativada' : 'ativada'}`,
    });
  };

  const handleFireClick = (fire: any) => {
    setSelectedFire(fire.id);
    toast({
      title: `Foco Selecionado`,
      description: `${fire.location} - Intensidade: ${fire.intensity}`,
    });
  };

  const handleFullScreen = () => {
    toast({
      title: "Modo Tela Cheia",
      description: "Expandindo mapa para visualização completa...",
    });
  };

  return (
    <div className="relative w-full h-96 bg-gradient-to-br from-forest-100 to-forest-200 rounded-lg overflow-hidden">
      {/* Mapa Base */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-100 via-yellow-50 to-red-100">
        {/* Simulação de focos de incêndio */}
        {fires.map((fire) => (
          <div
            key={fire.id}
            className={`absolute w-4 h-4 rounded-full cursor-pointer transform -translate-x-2 -translate-y-2 ${
              fire.intensity === 'critical' ? 'bg-fire-600 animate-pulse' :
              fire.intensity === 'high' ? 'bg-fire-500' :
              'bg-warning-500'
            } ${selectedFire === fire.id ? 'ring-4 ring-blue-400' : ''}`}
            style={{
              left: `${50 + (fire.lng + 46) * 10}%`,
              top: `${50 + (fire.lat + 23) * 10}%`,
            }}
            onClick={() => handleFireClick(fire)}
          />
        ))}

        {/* Overlay de informações */}
        <div className="absolute inset-0 bg-black bg-opacity-5"></div>
      </div>

      {/* Controles do Mapa */}
      <div className="absolute top-4 left-4 space-y-2">
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant={selectedLayers.fires ? "default" : "outline"}
            onClick={() => toggleLayer('fires')}
          >
            🔥 Focos
          </Button>
          <Button
            size="sm"
            variant={selectedLayers.weather ? "default" : "outline"}
            onClick={() => toggleLayer('weather')}
          >
            🌦️ Clima
          </Button>
          <Button
            size="sm"
            variant={selectedLayers.resources ? "default" : "outline"}
            onClick={() => toggleLayer('resources')}
          >
            🚁 Recursos
          </Button>
          <Button
            size="sm"
            variant={selectedLayers.evacuation ? "default" : "outline"}
            onClick={() => toggleLayer('evacuation')}
          >
            🚪 Evacuação
          </Button>
        </div>
      </div>

      {/* Legenda */}
      <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-lg">
        <h4 className="text-sm font-semibold mb-2">Legenda</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-fire-600 rounded-full"></div>
            <span>Crítico</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-fire-500 rounded-full"></div>
            <span>Alto</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-warning-500 rounded-full"></div>
            <span>Médio</span>
          </div>
        </div>
      </div>

      {/* Controles de Zoom */}
      <div className="absolute top-4 right-4 flex flex-col space-y-2">
        <Button size="sm" variant="outline" className="w-8 h-8 p-0">+</Button>
        <Button size="sm" variant="outline" className="w-8 h-8 p-0">-</Button>
        <Button size="sm" variant="outline" onClick={handleFullScreen}>⛶</Button>
      </div>

      {/* Informações do Foco Selecionado */}
      {selectedFire && (
        <Card className="absolute bottom-4 right-4 p-3 max-w-xs">
          <div className="text-sm">
            <h4 className="font-semibold">Foco Selecionado</h4>
            <p>ID: SP-GRU-{selectedFire}</p>
            <div className="flex justify-between mt-2">
              <Button size="sm" variant="outline">Detalhes</Button>
              <Button size="sm">Mobilizar</Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default InteractiveMap;
