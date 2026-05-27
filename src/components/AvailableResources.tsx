
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const AvailableResources = () => {
  return (
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
  );
};

export default AvailableResources;
