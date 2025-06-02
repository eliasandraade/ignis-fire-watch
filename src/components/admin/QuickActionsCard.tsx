
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Users, Settings, Activity } from 'lucide-react';

interface QuickActionsCardProps {
  onGenerateReport: () => void;
  onManageUsers: () => void;
  onSystemMaintenance: () => void;
  onSystemMonitor: () => void;
}

const QuickActionsCard = ({ 
  onGenerateReport, 
  onManageUsers, 
  onSystemMaintenance, 
  onSystemMonitor 
}: QuickActionsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ações Rápidas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button className="w-full justify-start" variant="outline" onClick={onGenerateReport}>
          <FileText className="h-4 w-4 mr-2" />
          Gerar Relatório Diário
        </Button>
        <Button className="w-full justify-start" variant="outline" onClick={onManageUsers}>
          <Users className="h-4 w-4 mr-2" />
          Gerenciar Usuários
        </Button>
        <Button className="w-full justify-start" variant="outline" onClick={onSystemMaintenance}>
          <Settings className="h-4 w-4 mr-2" />
          Programar Manutenção
        </Button>
        <Button className="w-full justify-start" variant="outline" onClick={onSystemMonitor}>
          <Activity className="h-4 w-4 mr-2" />
          Monitor de Sistema
        </Button>
      </CardContent>
    </Card>
  );
};

export default QuickActionsCard;
