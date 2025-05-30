
import React, { useState } from 'react';
import Header from '@/components/Header';
import InteractiveMap from '@/components/InteractiveMap';
import FireStatusCards from '@/components/FireStatusCards';
import MetricsDashboard from '@/components/MetricsDashboard';
import ChatbotAurora from '@/components/ChatbotAurora';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { toast } = useToast();
  const [isAuroraOpen, setIsAuroraOpen] = useState(false);

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'aircraft':
        toast({
          title: "🚁 Aeronave Solicitada",
          description: "Helicóptero será despachado em 8 minutos",
        });
        break;
      case 'ground':
        toast({
          title: "🚒 Equipe Mobilizada",
          description: "Bombeiros terrestres a caminho - ETA 12 min",
        });
        break;
      case 'alert':
        toast({
          title: "📢 Alerta Público Emitido",
          description: "População local foi notificada via SMS",
          variant: "destructive"
        });
        break;
      case 'crisis':
        toast({
          title: "🚨 Sala de Crise Ativada",
          description: "Coordenação de emergência iniciada",
          variant: "destructive"
        });
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header onOpenAurora={() => setIsAuroraOpen(true)} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard de Métricas */}
        <section className="mb-8">
          <MetricsDashboard />
        </section>

        {/* Mapa Principal e Informações */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Mapa Interativo */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl">Mapa de Situação em Tempo Real</CardTitle>
                  <div className="flex space-x-2">
                    <Badge className="bg-forest-100 text-forest-800 animate-pulse">
                      🔄 Última atualização: {new Date().toLocaleTimeString('pt-BR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </Badge>
                    <Button size="sm" variant="outline">
                      🖥️ Tela Cheia
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <InteractiveMap />
              </CardContent>
            </Card>
          </div>

          {/* Painel de Informações Rápidas */}
          <div className="space-y-4">
            {/* Clima e Condições */}
            <Card className="border-l-4 border-l-warning-500">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  🌦️ Condições Meteorológicas
                  <Badge className="ml-2 bg-warning-100 text-warning-800">Atualizado</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-2 bg-blue-50 rounded">
                    <p className="text-sm text-gray-600">Vento</p>
                    <p className="font-semibold text-blue-700">15 km/h NE</p>
                  </div>
                  <div className="text-center p-2 bg-red-50 rounded">
                    <p className="text-sm text-gray-600">Umidade</p>
                    <p className="font-semibold text-red-700">32%</p>
                  </div>
                  <div className="text-center p-2 bg-orange-50 rounded">
                    <p className="text-sm text-gray-600">Temperatura</p>
                    <p className="font-semibold text-orange-700">28°C</p>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <p className="text-sm text-gray-600">Pressão</p>
                    <p className="font-semibold text-gray-700">1013 hPa</p>
                  </div>
                </div>
                <div className="pt-2 border-t">
                  <Badge className="bg-warning-100 text-warning-800 animate-pulse w-full justify-center">
                    ⚠️ Condições favoráveis à propagação
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Ações Rápidas */}
            <Card className="border-l-4 border-l-fire-500">
              <CardHeader>
                <CardTitle className="text-lg">🚨 Ações de Emergência</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => handleQuickAction('aircraft')}
                >
                  🚁 Solicitar Aeronave
                </Button>
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => handleQuickAction('ground')}
                >
                  🚒 Mobilizar Equipe Terrestre
                </Button>
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => handleQuickAction('alert')}
                >
                  📢 Emitir Alerta Público
                </Button>
                <Button 
                  className="w-full justify-start fire-gradient text-white hover:opacity-90"
                  onClick={() => handleQuickAction('crisis')}
                >
                  🚨 Sala de Crise Virtual
                </Button>
              </CardContent>
            </Card>

            {/* Recursos Disponíveis */}
            <Card className="border-l-4 border-l-forest-500">
              <CardHeader>
                <CardTitle className="text-lg">📊 Recursos Disponíveis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                  <span className="text-sm font-medium">🚁 Aeronaves</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">7 disponíveis</Badge>
                </div>
                <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                  <span className="text-sm font-medium">👥 Equipes Terrestres</span>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">12 disponíveis</Badge>
                </div>
                <div className="flex justify-between items-center p-2 bg-yellow-50 rounded">
                  <span className="text-sm font-medium">🚛 Caminhões-Pipa</span>
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">5 disponíveis</Badge>
                </div>
                <div className="flex justify-between items-center p-2 bg-purple-50 rounded">
                  <span className="text-sm font-medium">🏥 Hospitais de Apoio</span>
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800">8 ativos</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Cards de Status dos Focos */}
        <section className="mb-8">
          <FireStatusCards />
        </section>

        {/* Informações Públicas */}
        <section>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Informações Públicas - Segurança</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-fire-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">🚨</span>
                  </div>
                  <h3 className="font-semibold mb-2">Em Caso de Emergência</h3>
                  <p className="text-sm text-gray-600">
                    Ligue 193 imediatamente e siga as orientações dos bombeiros.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-warning-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">🛡️</span>
                  </div>
                  <h3 className="font-semibold mb-2">Mantenha-se Seguro</h3>
                  <p className="text-sm text-gray-600">
                    Evite áreas com fumaça, mantenha janelas fechadas e tenha sempre uma rota de fuga.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-forest-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">📱</span>
                  </div>
                  <h3 className="font-semibold mb-2">Reporte Focos</h3>
                  <p className="text-sm text-gray-600">
                    Use nossa assistente AURORA para reportar novos focos de incêndio rapidamente.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      {/* Chatbot AURORA */}
      <ChatbotAurora 
        isOpen={isAuroraOpen} 
        onToggle={() => setIsAuroraOpen(!isAuroraOpen)} 
      />

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-2">IGNIS</h3>
            <p className="text-gray-400 mb-4">Conectando dados, salvando vidas</p>
            <div className="flex justify-center space-x-6 text-sm">
              <span>Dados: INPE • SIPAM • Meteorologia</span>
              <span>•</span>
              <span>Sistema 24/7</span>
              <span>•</span>
              <span>Emergência: 193</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
