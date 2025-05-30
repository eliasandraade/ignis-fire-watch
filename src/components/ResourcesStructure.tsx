
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  MapPin, 
  Plane, 
  Truck, 
  Shield, 
  Users, 
  Clock,
  Phone,
  Activity,
  Home,
  Building
} from 'lucide-react';

const ResourcesStructure = () => {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const structures = [
    {
      id: 1,
      name: 'Base Aérea Norte',
      type: 'airport',
      location: 'Cumbica, Guarulhos - SP',
      coordinates: '-23.4356, -46.4731',
      resources: {
        helicopters: 3,
        planes: 2,
        personnel: 25
      },
      status: 'operational',
      contact: '+55 (11) 2445-3300'
    },
    {
      id: 2,
      name: 'Quartel Central SP',
      type: 'fire_station',
      location: 'Bom Retiro, São Paulo - SP',
      coordinates: '-23.5354, -46.6731',
      resources: {
        trucks: 8,
        ambulances: 4,
        personnel: 45
      },
      status: 'operational',
      contact: '+55 (11) 3311-1193'
    },
    {
      id: 3,
      name: 'Hospital das Clínicas',
      type: 'hospital',
      location: 'Cerqueira César, São Paulo - SP',
      coordinates: '-23.5558, -46.6702',
      resources: {
        beds: 150,
        burn_unit: 20,
        personnel: 200
      },
      status: 'operational',
      contact: '+55 (11) 2661-0000'
    },
    {
      id: 4,
      name: 'Centro de Abastecimento',
      type: 'supply',
      location: 'Vila Leopoldina, São Paulo - SP',
      coordinates: '-23.5234, -46.7123',
      resources: {
        water_trucks: 12,
        fuel_capacity: '50000L',
        personnel: 15
      },
      status: 'operational',
      contact: '+55 (11) 3837-2200'
    },
    {
      id: 5,
      name: 'Base Florestal Cantareira',
      type: 'forest_base',
      location: 'Parque Estadual Cantareira - SP',
      coordinates: '-23.4123, -46.6234',
      resources: {
        rangers: 30,
        vehicles: 8,
        lookout_towers: 5
      },
      status: 'active',
      contact: '+55 (11) 2203-3000'
    },
    {
      id: 6,
      name: 'Abrigo Temporário Norte',
      type: 'shelter',
      location: 'Parada Inglesa, São Paulo - SP',
      coordinates: '-23.4567, -46.6123',
      resources: {
        capacity: 500,
        active_occupants: 0,
        personnel: 8
      },
      status: 'standby',
      contact: '+55 (11) 2208-1500'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'bg-green-600';
      case 'active': return 'bg-blue-600';
      case 'standby': return 'bg-yellow-600';
      case 'maintenance': return 'bg-gray-600';
      default: return 'bg-gray-600';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'airport': return <Plane className="h-5 w-5" />;
      case 'fire_station': return <Shield className="h-5 w-5" />;
      case 'hospital': return <Activity className="h-5 w-5" />;
      case 'supply': return <Truck className="h-5 w-5" />;
      case 'forest_base': return <Home className="h-5 w-5" />;
      case 'shelter': return <Building className="h-5 w-5" />;
      default: return <MapPin className="h-5 w-5" />;
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case 'airport': return 'Base Aérea';
      case 'fire_station': return 'Quartel';
      case 'hospital': return 'Hospital';
      case 'supply': return 'Abastecimento';
      case 'forest_base': return 'Base Florestal';
      case 'shelter': return 'Abrigo';
      default: return 'Estrutura';
    }
  };

  const handleContactStructure = (structure: any) => {
    toast({
      title: "Contato Estabelecido",
      description: `Conectando com ${structure.name}`,
    });
  };

  const handleRequestResources = (structure: any) => {
    toast({
      title: "Recursos Solicitados",
      description: `Solicitação enviada para ${structure.name}`,
    });
  };

  const filteredStructures = selectedCategory === 'all' 
    ? structures 
    : structures.filter(s => s.type === selectedCategory);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Estruturas e Recursos</h2>
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            onClick={() => setSelectedCategory('all')}
          >
            Todas
          </Button>
          <Button
            size="sm"
            variant={selectedCategory === 'fire_station' ? 'default' : 'outline'}
            onClick={() => setSelectedCategory('fire_station')}
          >
            Quartéis
          </Button>
          <Button
            size="sm"
            variant={selectedCategory === 'hospital' ? 'default' : 'outline'}
            onClick={() => setSelectedCategory('hospital')}
          >
            Hospitais
          </Button>
          <Button
            size="sm"
            variant={selectedCategory === 'airport' ? 'default' : 'outline'}
            onClick={() => setSelectedCategory('airport')}
          >
            Bases Aéreas
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStructures.map((structure) => (
          <Card key={structure.id} className="border-l-4 border-l-forest-500">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getTypeIcon(structure.type)}
                  <div>
                    <CardTitle className="text-lg">{structure.name}</CardTitle>
                    <p className="text-sm text-gray-600">{getTypeName(structure.type)}</p>
                  </div>
                </div>
                <Badge className={getStatusColor(structure.status)}>
                  {structure.status === 'operational' ? 'Operacional' :
                   structure.status === 'active' ? 'Ativo' :
                   structure.status === 'standby' ? 'Standby' : 'Manutenção'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Localização */}
              <div>
                <div className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
                  <MapPin className="h-4 w-4" />
                  <span>Localização</span>
                </div>
                <p className="text-sm">{structure.location}</p>
                <p className="text-xs text-gray-500 font-mono">{structure.coordinates}</p>
              </div>

              {/* Recursos */}
              <div>
                <h4 className="text-sm font-semibold mb-2">Recursos Disponíveis</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {Object.entries(structure.resources).map(([key, value]) => (
                    <div key={key} className="flex justify-between p-2 bg-gray-50 rounded">
                      <span className="capitalize">
                        {key.replace(/_/g, ' ')}
                      </span>
                      <span className="font-semibold">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contato */}
              <div>
                <div className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
                  <Phone className="h-4 w-4" />
                  <span>Contato</span>
                </div>
                <p className="text-sm font-mono">{structure.contact}</p>
              </div>

              {/* Ações */}
              <div className="flex space-x-2 pt-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => handleContactStructure(structure)}
                >
                  <Phone className="h-4 w-4 mr-1" />
                  Contatar
                </Button>
                <Button 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleRequestResources(structure)}
                >
                  Solicitar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Resumo Geral */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            Resumo Geral de Recursos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded">
              <p className="text-2xl font-bold text-blue-700">5</p>
              <p className="text-sm text-gray-600">Aeronaves</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded">
              <p className="text-2xl font-bold text-green-700">20</p>
              <p className="text-sm text-gray-600">Veículos Terrestres</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded">
              <p className="text-2xl font-bold text-purple-700">293</p>
              <p className="text-sm text-gray-600">Pessoal Disponível</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded">
              <p className="text-2xl font-bold text-yellow-700">6</p>
              <p className="text-sm text-gray-600">Estruturas Ativas</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResourcesStructure;
