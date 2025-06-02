
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface SystemStatsProps {
  stats: {
    totalIncidents: number;
    activePersonnel: number;
    availableResources: number;
    responseCenters: number;
    averageResponseTime: string;
    systemUptime: string;
  };
}

const SystemStats = ({ stats }: SystemStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-fire-600">{stats.totalIncidents}</div>
          <div className="text-sm text-gray-600">Incidentes Ativos</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{stats.activePersonnel}</div>
          <div className="text-sm text-gray-600">Pessoal Ativo</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.availableResources}</div>
          <div className="text-sm text-gray-600">Recursos Disponíveis</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{stats.responseCenters}</div>
          <div className="text-sm text-gray-600">Centros de Resposta</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">{stats.averageResponseTime}</div>
          <div className="text-sm text-gray-600">Tempo Médio</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-forest-600">{stats.systemUptime}</div>
          <div className="text-sm text-gray-600">Uptime Sistema</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemStats;
