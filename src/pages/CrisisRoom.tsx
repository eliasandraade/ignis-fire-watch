
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  AlertTriangle, 
  Users, 
  MapPin, 
  Clock, 
  Phone, 
  Radio,
  Truck,
  Plane,
  Shield,
  Activity
} from 'lucide-react';
import ResourceMobilization from '../components/ResourceMobilization';
import CommunicationDialog from '../components/CommunicationDialog';
import PerimeterControl from '../components/PerimeterControl';

const CrisisRoom = () => {
  const { toast } = useToast();
  const [activeIncident] = useState('SP-GRU-30052501');
  const [showMobilization, setShowMobilization] = useState(false);
  const [mobilizationType, setMobilizationType] = useState<'aircraft' | 'ground' | 'water' | null>(null);
  const [showCommunication, setShowCommunication] = useState(false);
  const [communicationType, setCommunicationType] = useState<'radio' | 'phone' | null>(null);
  const [showPerimeter, setShowPerimeter] = useState(false);

  const resources = [
    { id: 1, type: 'helicopter', name: 'Águia 01', status: 'em_rota', eta: '8 min', location: 'Cantareira' },
    { id: 2, type: 'ground', name: 'Equipe Alpha', status: 'no_local', eta: '0 min', location: 'Cantareira' },
    { id: 3, type: 'water_truck', name: 'Caminhão Pipa 05', status: 'disponivel', eta: '15 min', location: 'Base Norte' },
    { id: 4, type: 'ambulance', name: 'SAMU 192', status: 'standby', eta: '12 min', location: 'Hospital Regional' },
  ];

  const incidentData = {
    id: 'SP-GRU-30052501',
    location: 'Parque Estadual da Cantareira, São Paulo',
    startTime: '14:25',
    severity: 'critical',
    area: '47 hectares',
    threatened: {
      people: 150,
      homes: 45,
      infrastructure: 'Subestação Elétrica'
    }
  };

  const handleResourceAction = (resourceId: number, action: string) => {
    toast({
      title: "Comando Enviado",
      description: `${action} para recurso ${resourceId}`,
    });
  };

  const handleEvacuation = () => {
    toast({
      title: "🚨 Ordem de Evacuação",
      description: "Evacuação iniciada para área de risco",
      variant: "destructive"
    });
  };

  const handleCommunication = (type: 'radio' | 'phone') => {
    setCommunicationType(type);
    setShowCommunication(true);
  };

  const handleMobilizeResources = () => {
    setMobilizationType('ground');
    setShowMobilization(true);
  };

  const handlePerimeterControl = () => {
    setShowPerimeter(true);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header da Sala de Crise */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-fire-400 mb-2">
              🚨 SALA DE CRISE VIRTUAL
            </h1>
            <p className="text-gray-300">Coordenação de Emergência - {activeIncident}</p>
          </div>
          <div className="flex space-x-3">
            <Badge className="bg-fire-600 text-white animate-pulse">
              ATIVO - {new Date().toLocaleTimeString('pt-BR')}
            </Badge>
            <Button variant="destructive" onClick={handleEvacuation}>
              🚨 EVACUAR ÁREA
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informações do Incidente */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-gray-800 border-fire-600">
            <CardHeader>
              <CardTitle className="text-fire-400 flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Dados do Incidente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-400">ID do Incidente</p>
                <p className="font-mono text-lg">{incidentData.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Localização</p>
                <p>{incidentData.location}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Início</p>
                  <p className="font-semibold">{incidentData.startTime}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Área Atingida</p>
                  <p className="font-semibold text-fire-400">{incidentData.area}</p>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-700">
                <p className="text-sm text-gray-400 mb-2">Ameaças Identificadas</p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Pessoas em risco</span>
                    <Badge variant="destructive">{incidentData.threatened.people}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Residências</span>
                    <Badge variant="destructive">{incidentData.threatened.homes}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Infraestrutura</span>
                    <Badge className="bg-warning-600">{incidentData.threatened.infrastructure}</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ações Rápidas */}
          <Card className="bg-gray-800 border-warning-600">
            <CardHeader>
              <CardTitle className="text-warning-400">Ações de Comando</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full justify-start bg-fire-600 hover:bg-fire-700"
                onClick={() => handleCommunication('radio')}
              >
                <Radio className="h-4 w-4 mr-2" />
                Comunicação Geral
              </Button>
              <Button 
                className="w-full justify-start bg-blue-600 hover:bg-blue-700"
                onClick={() => handleCommunication('phone')}
              >
                <Phone className="h-4 w-4 mr-2" />
                Contatar Comando
              </Button>
              <Button 
                className="w-full justify-start bg-green-600 hover:bg-green-700"
                onClick={handleMobilizeResources}
              >
                <Users className="h-4 w-4 mr-2" />
                Mobilizar Recursos
              </Button>
              <Button 
                className="w-full justify-start bg-purple-600 hover:bg-purple-700"
                onClick={handlePerimeterControl}
              >
                <MapPin className="h-4 w-4 mr-2" />
                Definir Perímetro
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Mapa Tático */}
        <div className="lg:col-span-1">
          <Card className="bg-gray-800 border-forest-600 h-full">
            <CardHeader>
              <CardTitle className="text-forest-400">Mapa Tático</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-96 bg-gradient-to-br from-green-900 via-yellow-800 to-red-900 relative">
                {/* Foco do Incêndio */}
                <div className="absolute top-1/3 left-1/2 w-8 h-8 bg-fire-600 rounded-full animate-pulse transform -translate-x-4 -translate-y-4">
                  <div className="absolute inset-0 bg-fire-400 rounded-full animate-ping"></div>
                </div>
                
                {/* Recursos no Mapa */}
                <div className="absolute top-1/4 left-1/3 w-4 h-4 bg-blue-500 rounded-full">
                  <span className="absolute -top-6 -left-8 text-xs bg-blue-600 px-1 rounded">Águia 01</span>
                </div>
                <div className="absolute top-2/3 left-2/3 w-4 h-4 bg-green-500 rounded-full">
                  <span className="absolute -top-6 -left-8 text-xs bg-green-600 px-1 rounded">Alpha</span>
                </div>
                
                {/* Área de Evacuação */}
                <div className="absolute top-1/2 left-1/4 w-20 h-20 border-2 border-yellow-400 border-dashed rounded-full opacity-70">
                  <span className="absolute -bottom-8 left-0 text-xs text-yellow-400">Zona Evacuação</span>
                </div>
                
                {/* Legenda */}
                <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 p-3 rounded text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-fire-600 rounded-full"></div>
                      <span>Foco Principal</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span>Aeronaves</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span>Equipes Terrestres</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recursos e Status */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-gray-800 border-blue-600">
            <CardHeader>
              <CardTitle className="text-blue-400 flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                Recursos Mobilizados
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {resources.map((resource) => (
                <div key={resource.id} className="border border-gray-700 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {resource.type === 'helicopter' && <Plane className="h-4 w-4 text-blue-400" />}
                      {resource.type === 'ground' && <Shield className="h-4 w-4 text-green-400" />}
                      {resource.type === 'water_truck' && <Truck className="h-4 w-4 text-blue-400" />}
                      {resource.type === 'ambulance' && <Activity className="h-4 w-4 text-red-400" />}
                      <span className="font-semibold">{resource.name}</span>
                    </div>
                    <Badge 
                      className={
                        resource.status === 'no_local' ? 'bg-green-600' :
                        resource.status === 'em_rota' ? 'bg-yellow-600' :
                        'bg-gray-600'
                      }
                    >
                      {resource.status === 'no_local' ? 'No Local' :
                       resource.status === 'em_rota' ? 'Em Rota' :
                       resource.status === 'standby' ? 'Standby' : 'Disponível'}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-400 mb-3">
                    <div className="flex justify-between">
                      <span>ETA: {resource.eta}</span>
                      <span>{resource.location}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleResourceAction(resource.id, 'Redirecionar')}
                    >
                      Redirecionar
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={() => handleResourceAction(resource.id, 'Contatar')}
                    >
                      Contatar
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Timeline de Eventos */}
          <Card className="bg-gray-800 border-gray-600">
            <CardHeader>
              <CardTitle className="text-gray-400 flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Timeline de Eventos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex space-x-3">
                  <div className="w-2 h-2 bg-fire-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-semibold">14:25 - Detecção do foco</p>
                    <p className="text-gray-400">Sistema INPE - Coordenadas confirmadas</p>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-semibold">14:28 - Primeira equipe despachada</p>
                    <p className="text-gray-400">Equipe Alpha mobilizada</p>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-semibold">14:32 - Aeronave em rota</p>
                    <p className="text-gray-400">Helicóptero Águia 01 decolou</p>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-semibold">14:40 - Equipe no local</p>
                    <p className="text-gray-400">Início do combate terrestre</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modais */}
      <ResourceMobilization 
        isOpen={showMobilization}
        onClose={() => {
          setShowMobilization(false);
          setMobilizationType(null);
        }}
        type={mobilizationType}
        incidentId={activeIncident}
      />

      <CommunicationDialog 
        isOpen={showCommunication}
        onClose={() => {
          setShowCommunication(false);
          setCommunicationType(null);
        }}
        type={communicationType}
      />

      <PerimeterControl 
        isOpen={showPerimeter}
        onClose={() => setShowPerimeter(false)}
      />
    </div>
  );
};

export default CrisisRoom;
