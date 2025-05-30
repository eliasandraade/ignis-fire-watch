
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const MetricsDashboard = () => {
  const metrics = [
    {
      title: 'Focos Ativos',
      value: '7',
      change: '+2',
      changeType: 'increase',
      description: 'Últimas 24h',
      color: 'fire'
    },
    {
      title: 'Área Afetada',
      value: '1.247',
      unit: 'hectares',
      change: '+89',
      changeType: 'increase',
      description: 'Últimas 6h',
      color: 'warning'
    },
    {
      title: 'Recursos Mobilizados',
      value: '28',
      change: '+5',
      changeType: 'increase',
      description: 'Equipes ativas',
      color: 'safe'
    },
    {
      title: 'Tempo Médio Resposta',
      value: '12',
      unit: 'min',
      change: '-3',
      changeType: 'decrease',
      description: 'Últimas 24h',
      color: 'forest'
    }
  ];

  const alerts = [
    {
      type: 'critical',
      message: 'Foco crítico detectado em SP-GRU-30052501',
      time: '2 min atrás'
    },
    {
      type: 'warning',
      message: 'Ventos fortes previstos para região da Tijuca',
      time: '15 min atrás'
    },
    {
      type: 'info',
      message: 'Novo relatório meteorológico disponível',
      time: '1h atrás'
    }
  ];

  const getMetricColor = (color: string) => {
    switch (color) {
      case 'fire': return 'from-fire-500 to-fire-600';
      case 'warning': return 'from-warning-500 to-warning-600';
      case 'safe': return 'from-safe-500 to-safe-600';
      case 'forest': return 'from-forest-500 to-forest-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getChangeColor = (changeType: string) => {
    return changeType === 'increase' ? 'text-fire-600' : 'text-forest-600';
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'critical': return 'border-l-fire-500 bg-fire-50';
      case 'warning': return 'border-l-warning-500 bg-warning-50';
      case 'info': return 'border-l-safe-500 bg-safe-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <Card key={index} className="relative overflow-hidden">
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${getMetricColor(metric.color)}`}></div>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {metric.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-bold text-gray-900">
                  {metric.value}
                </span>
                {metric.unit && (
                  <span className="text-sm text-gray-500">{metric.unit}</span>
                )}
                <Badge 
                  variant="secondary" 
                  className={`text-xs ${getChangeColor(metric.changeType)}`}
                >
                  {metric.change}
                </Badge>
              </div>
              <p className="text-xs text-gray-500 mt-1">{metric.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Alertas Recentes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Alertas Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alerts.map((alert, index) => (
              <div
                key={index}
                className={`p-3 border-l-4 rounded-r-lg ${getAlertColor(alert.type)}`}
              >
                <div className="flex justify-between items-start">
                  <p className="text-sm font-medium text-gray-900">
                    {alert.message}
                  </p>
                  <span className="text-xs text-gray-500">{alert.time}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Status do Sistema */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Conectividade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-forest-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-900">Todos os sistemas online</span>
            </div>
            <div className="mt-2 space-y-1">
              <div className="flex justify-between text-xs">
                <span>INPE</span>
                <span className="text-forest-600">●</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>SIPAM</span>
                <span className="text-forest-600">●</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Meteorologia</span>
                <span className="text-forest-600">●</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Última Sincronização</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold text-gray-900">14:32</p>
            <p className="text-xs text-gray-500">30 de Maio, 2024</p>
            <Badge variant="secondary" className="mt-2 bg-forest-100 text-forest-800">
              Sincronizado
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Próxima Atualização</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold text-gray-900">15:00</p>
            <p className="text-xs text-gray-500">Em 28 minutos</p>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div className="bg-safe-500 h-2 rounded-full" style={{ width: '75%' }}></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MetricsDashboard;
