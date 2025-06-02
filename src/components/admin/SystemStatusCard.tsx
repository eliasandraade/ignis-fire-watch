
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const SystemStatusCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Status do Sistema</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between items-center">
          <span>Banco de Dados</span>
          <Badge className="bg-green-600">Online</Badge>
        </div>
        <div className="flex justify-between items-center">
          <span>API Externa (INPE)</span>
          <Badge className="bg-green-600">Conectado</Badge>
        </div>
        <div className="flex justify-between items-center">
          <span>Chatbot AURORA</span>
          <Badge className="bg-green-600">Ativo</Badge>
        </div>
        <div className="flex justify-between items-center">
          <span>Sistema de Alertas</span>
          <Badge className="bg-green-600">Operacional</Badge>
        </div>
        <div className="flex justify-between items-center">
          <span>Backup Automático</span>
          <Badge className="bg-blue-600">Executado 03:00</Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemStatusCard;
