
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plane, Users, Truck, MapPin, Clock } from 'lucide-react';

interface ResourceMobilizationProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'aircraft' | 'ground' | 'water' | null;
  incidentId?: string;
}

const ResourceMobilization = ({ isOpen, onClose, type, incidentId }: ResourceMobilizationProps) => {
  const { toast } = useToast();
  const [selectedResources, setSelectedResources] = useState<string[]>([]);

  const resources = {
    aircraft: [
      { id: 'AIR-001', name: 'Helicóptero Águia 01', status: 'disponível', eta: '8 min', location: 'Base Aérea Norte' },
      { id: 'AIR-002', name: 'Avião Bombardeiro B-02', status: 'disponível', eta: '15 min', location: 'Aeroporto Municipal' },
      { id: 'AIR-003', name: 'Helicóptero Águia 03', status: 'em_missão', eta: '45 min', location: 'Serra da Mantiqueira' },
    ],
    ground: [
      { id: 'GRD-001', name: 'Equipe Alpha (8 bombeiros)', status: 'disponível', eta: '12 min', location: 'Quartel Central' },
      { id: 'GRD-002', name: 'Equipe Bravo (6 bombeiros)', status: 'disponível', eta: '18 min', location: 'Quartel Sul' },
      { id: 'GRD-003', name: 'Equipe Charlie (10 bombeiros)', status: 'standby', eta: '25 min', location: 'Quartel Norte' },
    ],
    water: [
      { id: 'WTR-001', name: 'Caminhão Pipa CP-05', status: 'disponível', eta: '15 min', location: 'Base Norte' },
      { id: 'WTR-002', name: 'Caminhão Pipa CP-12', status: 'disponível', eta: '20 min', location: 'Base Sul' },
      { id: 'WTR-003', name: 'Caminhão Pipa CP-18', status: 'manutenção', eta: '60 min', location: 'Oficina Central' },
    ]
  };

  const getTitle = () => {
    switch (type) {
      case 'aircraft': return 'Solicitar Aeronave';
      case 'ground': return 'Mobilizar Equipe Terrestre';
      case 'water': return 'Solicitar Caminhão-Pipa';
      default: return 'Mobilizar Recursos';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'aircraft': return <Plane className="h-5 w-5" />;
      case 'ground': return <Users className="h-5 w-5" />;
      case 'water': return <Truck className="h-5 w-5" />;
      default: return <MapPin className="h-5 w-5" />;
    }
  };

  const currentResources = type ? resources[type] : [];

  const handleResourceToggle = (resourceId: string) => {
    setSelectedResources(prev => 
      prev.includes(resourceId) 
        ? prev.filter(id => id !== resourceId)
        : [...prev, resourceId]
    );
  };

  const handleMobilize = () => {
    if (selectedResources.length === 0) {
      toast({
        title: "⚠️ Seleção Necessária",
        description: "Selecione pelo menos um recurso para mobilizar",
        variant: "destructive"
      });
      return;
    }

    const resourceNames = currentResources
      .filter(r => selectedResources.includes(r.id))
      .map(r => r.name)
      .join(', ');

    toast({
      title: "🚁 Recursos Mobilizados",
      description: `${resourceNames} despachados para ${incidentId || 'ocorrência'}`,
    });

    setSelectedResources([]);
    onClose();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'disponível': return <Badge className="bg-green-100 text-green-800">Disponível</Badge>;
      case 'em_missão': return <Badge className="bg-yellow-100 text-yellow-800">Em Missão</Badge>;
      case 'standby': return <Badge className="bg-blue-100 text-blue-800">Standby</Badge>;
      case 'manutenção': return <Badge className="bg-red-100 text-red-800">Manutenção</Badge>;
      default: return <Badge variant="secondary">Desconhecido</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            {getIcon()}
            <span>{getTitle()}</span>
            {incidentId && <Badge variant="outline">{incidentId}</Badge>}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid gap-3">
            {currentResources.map((resource) => (
              <Card 
                key={resource.id} 
                className={`cursor-pointer transition-all ${
                  selectedResources.includes(resource.id) ? 'ring-2 ring-blue-400 bg-blue-50' : ''
                } ${resource.status !== 'disponível' && resource.status !== 'standby' ? 'opacity-50' : ''}`}
                onClick={() => resource.status === 'disponível' || resource.status === 'standby' ? handleResourceToggle(resource.id) : null}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-semibold">{resource.name}</h4>
                        {getStatusBadge(resource.status)}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>ETA: {resource.eta}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3" />
                          <span>{resource.location}</span>
                        </div>
                      </div>
                    </div>
                    {selectedResources.includes(resource.id) && (
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {selectedResources.length > 0 && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <h4 className="font-semibold mb-2">Recursos Selecionados ({selectedResources.length})</h4>
                <div className="space-y-1">
                  {currentResources
                    .filter(r => selectedResources.includes(r.id))
                    .map(resource => (
                      <div key={resource.id} className="text-sm">
                        • {resource.name} - ETA: {resource.eta}
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="flex space-x-3 pt-4 border-t">
          <Button 
            onClick={handleMobilize} 
            disabled={selectedResources.length === 0}
            className="flex-1"
          >
            🚁 Mobilizar Recursos ({selectedResources.length})
          </Button>
          <Button onClick={onClose} variant="outline">
            Cancelar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ResourceMobilization;
