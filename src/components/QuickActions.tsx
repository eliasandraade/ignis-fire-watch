
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import ResourceMobilization from './ResourceMobilization';
import PublicAlert from './PublicAlert';

const QuickActions = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showMobilization, setShowMobilization] = useState(false);
  const [mobilizationType, setMobilizationType] = useState<'aircraft' | 'ground' | 'water' | null>(null);
  const [showAlert, setShowAlert] = useState(false);

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'aircraft':
        setMobilizationType('aircraft');
        setShowMobilization(true);
        break;
      case 'ground':
        setMobilizationType('ground');
        setShowMobilization(true);
        break;
      case 'alert':
        setShowAlert(true);
        break;
      case 'crisis':
        navigate('/crisis-room');
        break;
    }
  };

  return (
    <>
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

      {/* Modais */}
      <ResourceMobilization 
        isOpen={showMobilization}
        onClose={() => {
          setShowMobilization(false);
          setMobilizationType(null);
        }}
        type={mobilizationType}
      />

      <PublicAlert 
        isOpen={showAlert}
        onClose={() => setShowAlert(false)}
      />
    </>
  );
};

export default QuickActions;
