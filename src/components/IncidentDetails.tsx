
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { MapPin, Clock, Users, Flame, Wind, Thermometer } from 'lucide-react';

interface IncidentDetailsProps {
  incident: {
    id: string;
    location: string;
    intensity: string;
    status: string;
    timestamp: string;
    resources: string[];
    confidence: number;
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

const IncidentDetails = ({ incident, isOpen, onClose }: IncidentDetailsProps) => {
  const { toast } = useToast();

  if (!incident) return null;

  const handlePrintReport = () => {
    toast({
      title: "📋 Relatório Gerado",
      description: "Relatório detalhado enviado para impressão",
    });
  };

  const handleShareInfo = () => {
    toast({
      title: "📤 Informações Compartilhadas",
      description: "Dados enviados para equipes de coordenação",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Flame className="h-5 w-5 text-fire-500" />
            <span>Detalhes do Foco {incident.id}</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                Localização
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Endereço</p>
                <p className="font-semibold">{incident.location}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Coordenadas</p>
                <p className="font-mono">-23.4692, -46.5450</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Área Estimada</p>
                <p className="font-semibold">2.5 hectares</p>
              </div>
            </CardContent>
          </Card>

          {/* Status e Intensidade */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Flame className="h-4 w-4 mr-2" />
                Status do Incêndio
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span>Intensidade</span>
                <Badge className={
                  incident.intensity === 'critical' ? 'bg-fire-600' :
                  incident.intensity === 'high' ? 'bg-fire-500' :
                  incident.intensity === 'medium' ? 'bg-warning-500' : 'bg-forest-500'
                }>
                  {incident.intensity === 'critical' ? 'Crítico' :
                   incident.intensity === 'high' ? 'Alto' :
                   incident.intensity === 'medium' ? 'Médio' : 'Baixo'}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Confiança</span>
                <Badge variant="secondary">{incident.confidence}%</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Duração</span>
                <span className="font-semibold">2h 35min</span>
              </div>
            </CardContent>
          </Card>

          {/* Condições Ambientais */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Wind className="h-4 w-4 mr-2" />
                Condições Meteorológicas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center space-x-2">
                  <Wind className="h-4 w-4 text-blue-500" />
                  <div>
                    <p className="text-xs text-gray-600">Vento</p>
                    <p className="font-semibold">15 km/h NE</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Thermometer className="h-4 w-4 text-red-500" />
                  <div>
                    <p className="text-xs text-gray-600">Temperatura</p>
                    <p className="font-semibold">28°C</p>
                  </div>
                </div>
              </div>
              <div className="text-center p-2 bg-warning-50 rounded">
                <Badge className="bg-warning-100 text-warning-800">
                  ⚠️ Condições favoráveis à propagação
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Recursos Mobilizados */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Recursos Mobilizados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {incident.resources.map((resource, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-sm">{resource}</span>
                    <Badge className="bg-green-100 text-green-800">Ativo</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Timeline de Eventos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-3 h-3 bg-fire-500 rounded-full mt-1"></div>
                  <div>
                    <p className="font-semibold text-sm">14:25 - Detecção Inicial</p>
                    <p className="text-xs text-gray-600">Satélite INPE detectou anomalia térmica</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mt-1"></div>
                  <div>
                    <p className="font-semibold text-sm">14:28 - Primeira Equipe Despachada</p>
                    <p className="text-xs text-gray-600">Bombeiros da base mais próxima acionados</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full mt-1"></div>
                  <div>
                    <p className="font-semibold text-sm">14:45 - Chegada no Local</p>
                    <p className="text-xs text-gray-600">Equipe confirma presença de foco ativo</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mt-1"></div>
                  <div>
                    <p className="font-semibold text-sm">15:00 - Combate Iniciado</p>
                    <p className="text-xs text-gray-600">Início das operações de extinção</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Ações */}
        <div className="flex space-x-3 pt-4 border-t">
          <Button onClick={handlePrintReport} variant="outline">
            📋 Gerar Relatório
          </Button>
          <Button onClick={handleShareInfo} variant="outline">
            📤 Compartilhar
          </Button>
          <Button onClick={onClose}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default IncidentDetails;
