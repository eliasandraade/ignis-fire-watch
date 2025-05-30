
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, MessageCircle, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface HeaderProps {
  onOpenAurora: () => void;
}

const Header = ({ onOpenAurora }: HeaderProps) => {
  const { toast } = useToast();
  const [alerts] = useState(3);

  const handleAlertsClick = () => {
    toast({
      title: "Central de Alertas",
      description: "3 novos alertas de emergência disponíveis",
    });
  };

  const handleCrisisRoomClick = () => {
    toast({
      title: "Sala de Crise Virtual",
      description: "Acessando painel de coordenação de emergência...",
    });
  };

  return (
    <header className="bg-white shadow-lg border-b-4 border-fire-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo e Título */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 fire-gradient rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">🔥</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">IGNIS</h1>
                <p className="text-sm text-gray-600">Conectando dados, salvando vidas</p>
              </div>
            </div>
          </div>

          {/* Status e Alertas */}
          <div className="flex items-center space-x-6">
            {/* Contador de Focos Ativos */}
            <div className="flex items-center space-x-2">
              <Badge variant="destructive" className="animate-pulse">
                7 Focos Ativos
              </Badge>
              <Badge variant="secondary" className="bg-warning-100 text-warning-800">
                3 Em Monitoramento
              </Badge>
            </div>

            {/* Botões de Ação */}
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="relative"
                onClick={handleAlertsClick}
              >
                <Bell className="h-4 w-4 mr-2" />
                Alertas
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-fire-500 text-white text-xs flex items-center justify-center">
                  {alerts}
                </Badge>
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={onOpenAurora}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                AURORA
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleCrisisRoomClick}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Sala de Crise
              </Button>
            </div>

            {/* Status do Sistema */}
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-forest-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Sistema Online</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
