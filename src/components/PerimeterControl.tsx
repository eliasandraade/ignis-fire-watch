
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { MapPin, AlertTriangle, Shield, Users, Clock } from 'lucide-react';

interface PerimeterControlProps {
  isOpen: boolean;
  onClose: () => void;
}

const PerimeterControl = ({ isOpen, onClose }: PerimeterControlProps) => {
  const { toast } = useToast();
  const [selectedZone, setSelectedZone] = useState<string | null>(null);

  const securityZones = [
    { 
      id: 'red', 
      name: 'Zona Vermelha', 
      type: 'exclusion', 
      radius: '500m',
      status: 'active',
      description: 'Área de combate direto - Acesso restrito a bombeiros',
      personnel: 12
    },
    { 
      id: 'yellow', 
      name: 'Zona Amarela', 
      type: 'warning', 
      radius: '1.2km',
      status: 'active',
      description: 'Área de risco - Evacuação em andamento',
      personnel: 25
    },
    { 
      id: 'green', 
      name: 'Zona Verde', 
      type: 'safe', 
      radius: '2km',
      status: 'monitoring',
      description: 'Área segura - Centro de apoio e abrigo',
      personnel: 8
    },
  ];

  const checkpoints = [
    { id: 'cp1', name: 'Posto 1 - Entrada Norte', zone: 'yellow', status: 'active', personnel: 4 },
    { id: 'cp2', name: 'Posto 2 - Entrada Sul', zone: 'yellow', status: 'active', personnel: 3 },
    { id: 'cp3', name: 'Posto 3 - Acesso Principal', zone: 'red', status: 'active', personnel: 6 },
    { id: 'cp4', name: 'Posto 4 - Evacuação', zone: 'green', status: 'standby', personnel: 2 },
  ];

  const handleZoneSelect = (zoneId: string) => {
    setSelectedZone(zoneId);
    const zone = securityZones.find(z => z.id === zoneId);
    toast({
      title: "🗺️ Zona Selecionada",
      description: `${zone?.name} - ${zone?.description}`,
    });
  };

  const handleExpandZone = () => {
    if (!selectedZone) return;
    const zone = securityZones.find(z => z.id === selectedZone);
    toast({
      title: "📏 Perímetro Expandido",
      description: `${zone?.name} expandida em 200m - Novas coordenadas enviadas para equipes`,
    });
  };

  const handleReinforceSecurityAction = () => {
    if (!selectedZone) return;
    const zone = securityZones.find(z => z.id === selectedZone);
    toast({
      title: "🛡️ Segurança Reforçada",
      description: `Equipes adicionais despachadas para ${zone?.name}`,
    });
  };

  const handleEvacuateAreaAction = () => {
    if (!selectedZone) return;
    const zone = securityZones.find(z => z.id === selectedZone);
    toast({
      title: "🚨 Evacuação Iniciada",
      description: `Ordem de evacuação emitida para ${zone?.name}`,
      variant: "destructive"
    });
  };

  const handleEmergencyAction = () => {
    if (!selectedZone) return;
    toast({
      title: "🚨 PROTOCOLO DE EMERGÊNCIA",
      description: "Todas as unidades mobilizadas - Situação crítica declarada",
      variant: "destructive"
    });
  };

  const handleEstablishCheckpoint = () => {
    toast({
      title: "🛡️ Novo Posto de Controle",
      description: "Coordenadas enviadas - Equipe sendo despachada",
    });
  };

  const getZoneColor = (type: string) => {
    switch (type) {
      case 'exclusion': return 'bg-red-100 text-red-800 border-red-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'safe': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5" />
            <span>Controle de Perímetro</span>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Mapa de Perímetros */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Mapa de Perímetros de Segurança</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-96 bg-gradient-to-br from-green-900 via-yellow-800 to-red-900 relative rounded-lg overflow-hidden">
                  {/* Foco do Incêndio */}
                  <div className="absolute top-1/2 left-1/2 w-6 h-6 bg-fire-600 rounded-full animate-pulse transform -translate-x-3 -translate-y-3 z-10">
                    <div className="absolute inset-0 bg-fire-400 rounded-full animate-ping"></div>
                  </div>
                  
                  {/* Zona Vermelha - Exclusão */}
                  <div className="absolute top-1/2 left-1/2 w-24 h-24 border-4 border-red-500 rounded-full transform -translate-x-12 -translate-y-12 opacity-80">
                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs bg-red-600 text-white px-2 py-1 rounded">
                      Zona Vermelha
                    </div>
                  </div>
                  
                  {/* Zona Amarela - Alerta */}
                  <div className="absolute top-1/2 left-1/2 w-40 h-40 border-4 border-yellow-500 border-dashed rounded-full transform -translate-x-20 -translate-y-20 opacity-70">
                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs bg-yellow-600 text-white px-2 py-1 rounded">
                      Zona Amarela
                    </div>
                  </div>
                  
                  {/* Zona Verde - Segura */}
                  <div className="absolute top-1/2 left-1/2 w-56 h-56 border-4 border-green-500 border-dotted rounded-full transform -translate-x-28 -translate-y-28 opacity-60">
                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs bg-green-600 text-white px-2 py-1 rounded">
                      Zona Verde
                    </div>
                  </div>

                  {/* Postos de Controle */}
                  <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-blue-500 rounded-full">
                    <span className="absolute -top-6 -left-6 text-xs bg-blue-600 text-white px-1 rounded">CP1</span>
                  </div>
                  <div className="absolute top-3/4 left-3/4 w-3 h-3 bg-blue-500 rounded-full">
                    <span className="absolute -top-6 -left-6 text-xs bg-blue-600 text-white px-1 rounded">CP2</span>
                  </div>
                  <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-blue-500 rounded-full">
                    <span className="absolute -top-6 -left-6 text-xs bg-blue-600 text-white px-1 rounded">CP3</span>
                  </div>

                  {/* Legenda do Mapa */}
                  <div className="absolute bottom-4 left-4 bg-black bg-opacity-80 p-3 rounded text-xs text-white">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-fire-600 rounded-full"></div>
                        <span>Foco do Incêndio</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 border-2 border-red-500 rounded-full"></div>
                        <span>Zona Vermelha (500m)</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 border-2 border-yellow-500 border-dashed rounded-full"></div>
                        <span>Zona Amarela (1.2km)</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 border-2 border-green-500 border-dotted rounded-full"></div>
                        <span>Zona Verde (2km)</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span>Postos de Controle</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Controles de Zona */}
          <div className="lg:col-span-1 space-y-4">
            {/* Zonas de Segurança */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-sm">
                  <Shield className="h-4 w-4" />
                  <span>Zonas de Segurança</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {securityZones.map((zone) => (
                  <div 
                    key={zone.id}
                    className={`p-3 border-2 rounded-lg cursor-pointer transition-all text-xs ${
                      selectedZone === zone.id ? 'ring-2 ring-blue-400' : ''
                    } ${getZoneColor(zone.type)}`}
                    onClick={() => handleZoneSelect(zone.id)}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <div>
                        <h4 className="font-semibold text-sm">{zone.name}</h4>
                        <p className="text-xs opacity-75">Raio: {zone.radius}</p>
                      </div>
                      <Badge className={
                        zone.status === 'active' ? 'bg-green-600 text-xs' : 'bg-gray-600 text-xs'
                      }>
                        {zone.status === 'active' ? 'Ativo' : 'Monitor'}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-3 text-xs">
                      <div className="flex items-center space-x-1">
                        <Users className="h-3 w-3" />
                        <span>{zone.personnel}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>2h15m</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Postos de Controle */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-sm">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Postos de Controle</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {checkpoints.map((checkpoint) => (
                  <div key={checkpoint.id} className="p-2 border rounded-lg text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-xs">{checkpoint.name}</h4>
                      <Badge className={
                        checkpoint.status === 'active' ? 'bg-green-100 text-green-800 text-xs' : 'bg-gray-100 text-gray-800 text-xs'
                      }>
                        {checkpoint.status === 'active' ? 'Ativo' : 'Standby'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span>Zona: {checkpoint.zone.toUpperCase()}</span>
                      <div className="flex items-center space-x-1">
                        <Users className="h-3 w-3" />
                        <span>{checkpoint.personnel}</span>
                      </div>
                    </div>
                  </div>
                ))}
                
                <Button 
                  className="w-full mt-2 text-xs" 
                  onClick={handleEstablishCheckpoint}
                  variant="outline"
                  size="sm"
                >
                  <MapPin className="h-3 w-3 mr-1" />
                  Novo Posto
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Controles de Ação */}
        {selectedZone && (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-sm">Ações de Controle</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Button onClick={handleExpandZone} variant="outline" size="sm">
                  <MapPin className="h-3 w-3 mr-1" />
                  Expandir
                </Button>
                <Button onClick={handleReinforceSecurityAction} variant="outline" size="sm">
                  <Shield className="h-3 w-3 mr-1" />
                  Reforçar
                </Button>
                <Button onClick={handleEvacuateAreaAction} variant="outline" size="sm">
                  <Users className="h-3 w-3 mr-1" />
                  Evacuar
                </Button>
                <Button onClick={handleEmergencyAction} variant="destructive" size="sm">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Emergência
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button onClick={onClose} variant="outline">
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PerimeterControl;
