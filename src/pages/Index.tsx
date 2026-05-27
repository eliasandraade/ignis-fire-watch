
import React, { useState } from 'react';
import Header from '@/components/Header';
import InteractiveMap from '@/components/InteractiveMap';
import FireStatusCards from '@/components/FireStatusCards';
import MetricsDashboard from '@/components/MetricsDashboard';
import ChatbotAurora from '@/components/ChatbotAurora';
import WeatherConditions from '@/components/WeatherConditions';
import QuickActions from '@/components/QuickActions';
import AvailableResources from '@/components/AvailableResources';
import PublicInformation from '@/components/PublicInformation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const Index = () => {
  const [isAuroraOpen, setIsAuroraOpen] = useState(false);

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
            <WeatherConditions />
            <QuickActions />
            <AvailableResources />
          </div>
        </div>

        {/* Cards de Status dos Focos */}
        <section className="mb-8">
          <FireStatusCards />
        </section>

        {/* Informações Públicas */}
        <section>
          <PublicInformation />
        </section>
      </main>

      {/* Chatbot AURORA */}
      <ChatbotAurora 
        isOpen={isAuroraOpen} 
        onToggle={() => setIsAuroraOpen(!isAuroraOpen)} 
      />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
