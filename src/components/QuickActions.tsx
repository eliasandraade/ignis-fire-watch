
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const QuickActions = () => {
  const { toast } = useToast();

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
  );
};

export default QuickActions;
