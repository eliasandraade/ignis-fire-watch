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
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5" />
            <span>Controle de Perímetro</span>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Zonas de Segurança */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <span>Zonas de Segurança</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {securityZones.map((zone) => (
                <div 
                  key={zone.id}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedZone === zone.id ? 'ring-2 ring-blue-400' : ''
                  } ${getZoneColor(zone.type)}`}
                  onClick={() => handleZoneSelect(zone.id)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold">{zone.name}</h4>
                      <p className="text-sm opacity-75">Raio: {zone.radius}</p>
                    </div>
                    <Badge className={
                      zone.status === 'active' ? 'bg-green-600' : 'bg-gray-600'
                    }>
                      {zone.status === 'active' ? 'Ativo' : 'Monitoramento'}
                    </Badge>
                  </div>
                  <p className="text-sm mb-3">{zone.description}</p>
                  <div className="flex items-center space-x-4 text-xs">
                    <div className="flex items-center space-x-1">
                      <Users className="h-3 w-3" />
                      <span>{zone.personnel} pessoas</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>Ativo há 2h15m</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Postos de Controle */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4" />
                <span>Postos de Controle</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {checkpoints.map((checkpoint) => (
                <div key={checkpoint.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-sm">{checkpoint.name}</h4>
                    <Badge className={
                      checkpoint.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }>
                      {checkpoint.status === 'active' ? 'Operacional' : 'Standby'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>Zona: {checkpoint.zone.toUpperCase()}</span>
                    <div className="flex items-center space-x-1">
                      <Users className="h-3 w-3" />
                      <span>{checkpoint.personnel} agentes</span>
                    </div>
                  </div>
                </div>
              ))}
              
              <Button 
                className="w-full mt-4" 
                onClick={handleEstablishCheckpoint}
                variant="outline"
              >
                <MapPin className="h-4 w-4 mr-2" />
                Estabelecer Novo Posto
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Controles de Ação */}
        {selectedZone && (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Ações de Controle</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Button onClick={handleExpandZone} variant="outline">
                  <MapPin className="h-4 w-4 mr-2" />
                  Expandir Zona
                </Button>
                <Button onClick={handleReinforceSecurityAction} variant="outline">
                  <Shield className="h-4 w-4 mr-2" />
                  Reforçar Segurança
                </Button>
                <Button onClick={handleEvacuateAreaAction} variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  Evacuar Área
                </Button>
                <Button onClick={handleEmergencyAction} variant="destructive">
                  <AlertTriangle className="h-4 w-4 mr-2" />
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
