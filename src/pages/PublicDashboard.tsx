
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  AlertTriangle, 
  MapPin, 
  Phone, 
  Navigation, 
  Info,
  ShieldAlert,
  Building,
  Car,
  Users,
  Clock
} from 'lucide-react';

const PublicDashboard = () => {
  const { toast } = useToast();
  const [selectedArea, setSelectedArea] = useState<string | null>(null);

  const activeAlerts = [
    {
      id: 'ALERT-001',
      type: 'evacuacao',
      area: 'Cantareira Norte',
      priority: 'critical',
      message: 'Evacuação imediata recomendada',
      time: '14:25'
    },
    {
      id: 'ALERT-002', 
      type: 'atencao',
      area: 'Vila Madalena',
      priority: 'high',
      message: 'Mantenha-se em alerta - fumaça detectada',
      time: '15:10'
    },
    {
      id: 'ALERT-003',
      type: 'informativo',
      area: 'Centro',
      priority: 'medium', 
      message: 'Vias alternativas disponíveis',
      time: '16:00'
    }
  ];

  const emergencyServices = [
    { name: 'Bombeiros', number: '193', icon: '🚒', status: 'disponivel' },
    { name: 'SAMU', number: '192', icon: '🚑', status: 'disponivel' },
    { name: 'Polícia Militar', number: '190', icon: '🚔', status: 'disponivel' },
    { name: 'Defesa Civil', number: '199', icon: '🏛️', status: 'disponivel' }
  ];

  const evacuationRoutes = [
    { id: 'ROTA-A', name: 'Marginal Tietê → Centro', status: 'livre', time: '15 min' },
    { id: 'ROTA-B', name: 'Radial Leste → Zona Sul', status: 'congestionada', time: '35 min' },
    { id: 'ROTA-C', name: 'Anhanguera → Interior', status: 'livre', time: '45 min' }
  ];

  const shelters = [
    { name: 'Centro Esportivo Municipal', address: 'Rua das Flores, 123', capacity: '500 pessoas', distance: '2.1 km' },
    { name: 'Escola Estadual Central', address: 'Av. Principal, 456', capacity: '300 pessoas', distance: '3.5 km' },
    { name: 'Ginásio do Pacaembu', address: 'Praça Charles Miller, s/n', capacity: '1000 pessoas', distance: '5.2 km' }
  ];

  const handleEmergencyCall = (service: any) => {
    toast({
      title: `📞 Chamada de Emergência`,
      description: `Chamando ${service.name} - ${service.number}`,
    });
  };

  const handleRouteNavigation = (route: any) => {
    toast({
      title: `🗺️ Navegação Iniciada`,
      description: `Direcionando para ${route.name} - Tempo estimado: ${route.time}`,
    });
  };

  const handleShelterInfo = (shelter: any) => {
    toast({
      title: `🏠 Informações do Abrigo`,
      description: `${shelter.name} - Capacidade: ${shelter.capacity}`,
    });
  };

  const handleAreaSelect = (alertId: string) => {
    setSelectedArea(alertId);
    const alert = activeAlerts.find(a => a.id === alertId);
    toast({
      title: `📍 Área Selecionada`,
      description: `${alert?.area} - ${alert?.message}`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Público */}
      <header className="bg-white shadow-lg border-b-4 border-fire-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 fire-gradient rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">🔥</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">IGNIS Público</h1>
                <p className="text-sm text-gray-600">Informações de Segurança para Cidadãos</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="destructive" className="animate-pulse">
                7 Focos Ativos
              </Badge>
              <Badge variant="secondary" className="bg-warning-100 text-warning-800">
                3 Alertas de Evacuação
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Alertas de Emergência */}
        <section className="mb-8">
          <Card className="border-l-4 border-l-fire-500">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ShieldAlert className="h-5 w-5 text-fire-600" />
                <span>Alertas de Emergência Ativos</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activeAlerts.map((alert) => (
                  <div 
                    key={alert.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedArea === alert.id ? 'bg-blue-50 border-blue-300' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleAreaSelect(alert.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Badge className={
                          alert.priority === 'critical' ? 'bg-fire-600' :
                          alert.priority === 'high' ? 'bg-warning-600' :
                          'bg-blue-600'
                        }>
                          {alert.type === 'evacuacao' ? 'EVACUAÇÃO' :
                           alert.type === 'atencao' ? 'ATENÇÃO' : 'INFORMATIVO'}
                        </Badge>
                        <div>
                          <h4 className="font-semibold">{alert.area}</h4>
                          <p className="text-sm text-gray-600">{alert.message}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">{alert.time}</p>
                        <MapPin className="h-4 w-4 text-gray-400 ml-auto" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Serviços de Emergência */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Phone className="h-5 w-5" />
                <span>Contatos de Emergência</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {emergencyServices.map((service, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{service.icon}</span>
                    <div>
                      <h4 className="font-semibold">{service.name}</h4>
                      <p className="text-sm text-gray-600">{service.number}</p>
                    </div>
                  </div>
                  <Button 
                    size="sm"
                    onClick={() => handleEmergencyCall(service)}
                    className="fire-gradient text-white"
                  >
                    <Phone className="h-3 w-3 mr-1" />
                    Ligar
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Rotas de Evacuação */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Navigation className="h-5 w-5" />
                <span>Rotas de Evacuação</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {evacuationRoutes.map((route) => (
                <div key={route.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-semibold">{route.name}</h4>
                    <div className="flex items-center space-x-2 text-sm">
                      <Badge className={
                        route.status === 'livre' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }>
                        {route.status === 'livre' ? 'Via Livre' : 'Congestionada'}
                      </Badge>
                      <span className="text-gray-600">
                        <Clock className="h-3 w-3 inline mr-1" />
                        {route.time}
                      </span>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleRouteNavigation(route)}
                  >
                    <Navigation className="h-3 w-3 mr-1" />
                    Navegar
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Abrigos de Emergência */}
        <section className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building className="h-5 w-5" />
                <span>Abrigos de Emergência Próximos</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {shelters.map((shelter, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">{shelter.name}</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>📍 {shelter.address}</p>
                      <p>👥 {shelter.capacity}</p>
                      <p>📏 {shelter.distance}</p>
                    </div>
                    <Button 
                      size="sm" 
                      className="w-full mt-3"
                      variant="outline"
                      onClick={() => handleShelterInfo(shelter)}
                    >
                      <Info className="h-3 w-3 mr-1" />
                      Mais Informações
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Dicas de Segurança */}
        <section className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>🛡️ Dicas de Segurança</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-fire-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">🚨</span>
                  </div>
                  <h3 className="font-semibold mb-2">Em Caso de Emergência</h3>
                  <p className="text-sm text-gray-600">
                    Mantenha a calma, siga as orientações das autoridades e tenha sempre uma rota de fuga planejada.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-warning-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">💨</span>
                  </div>
                  <h3 className="font-semibold mb-2">Proteja-se da Fumaça</h3>
                  <p className="text-sm text-gray-600">
                    Mantenha janelas fechadas, use panos úmidos no rosto e evite exercícios ao ar livre.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-forest-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">📱</span>
                  </div>
                  <h3 className="font-semibold mb-2">Mantenha-se Informado</h3>
                  <p className="text-sm text-gray-600">
                    Acompanhe os alertas oficiais e tenha sempre os contatos de emergência à mão.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
};

export default PublicDashboard;
