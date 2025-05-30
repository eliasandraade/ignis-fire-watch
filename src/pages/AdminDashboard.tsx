
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ResourcesStructure from '@/components/ResourcesStructure';
import InteractiveMap from '@/components/InteractiveMap';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  Shield, 
  AlertTriangle, 
  Activity, 
  Clock, 
  MapPin,
  Phone,
  Settings,
  FileText,
  BarChart
} from 'lucide-react';

const AdminDashboard = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');

  const activeIncidents = [
    {
      id: 'SP-GRU-30052501',
      location: 'Cantareira, SP',
      severity: 'critical',
      startTime: '14:25',
      resources: 4,
      status: 'active'
    },
    {
      id: 'RJ-TIJ-30052502',
      location: 'Tijuca, RJ',
      severity: 'high',
      startTime: '15:10',
      resources: 3,
      status: 'contained'
    },
    {
      id: 'MG-CUR-30052503',
      location: 'Serra do Curral, MG',
      severity: 'medium',
      startTime: '16:45',
      resources: 2,
      status: 'monitoring'
    }
  ];

  const systemStats = {
    totalIncidents: 3,
    activePersonnel: 293,
    availableResources: 45,
    responseCenters: 6,
    averageResponseTime: '8.5 min',
    systemUptime: '99.7%'
  };

  const handleCreateIncident = () => {
    toast({
      title: "Novo Incidente Criado",
      description: "ID: SP-ABC-30052504 - Status: Ativo",
    });
  };

  const handleSystemMaintenance = () => {
    toast({
      title: "Manutenção Agendada",
      description: "Manutenção do sistema programada para 02:00",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Administrativo</h1>
            <p className="text-gray-600">Controle Central da Plataforma IGNIS</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Configurações
            </Button>
            <Button onClick={handleCreateIncident}>
              <AlertTriangle className="h-4 w-4 mr-2" />
              Novo Incidente
            </Button>
          </div>
        </div>
      </div>

      {/* Navegação */}
      <div className="mb-6">
        <div className="flex space-x-2">
          <Button 
            variant={activeTab === 'overview' ? 'default' : 'outline'}
            onClick={() => setActiveTab('overview')}
          >
            <BarChart className="h-4 w-4 mr-2" />
            Visão Geral
          </Button>
          <Button 
            variant={activeTab === 'incidents' ? 'default' : 'outline'}
            onClick={() => setActiveTab('incidents')}
          >
            <AlertTriangle className="h-4 w-4 mr-2" />
            Incidentes
          </Button>
          <Button 
            variant={activeTab === 'resources' ? 'default' : 'outline'}
            onClick={() => setActiveTab('resources')}
          >
            <Shield className="h-4 w-4 mr-2" />
            Recursos
          </Button>
          <Button 
            variant={activeTab === 'map' ? 'default' : 'outline'}
            onClick={() => setActiveTab('map')}
          >
            <MapPin className="h-4 w-4 mr-2" />
            Mapa Geral
          </Button>
        </div>
      </div>

      {/* Conteúdo */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Estatísticas do Sistema */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-fire-600">{systemStats.totalIncidents}</div>
                <div className="text-sm text-gray-600">Incidentes Ativos</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{systemStats.activePersonnel}</div>
                <div className="text-sm text-gray-600">Pessoal Ativo</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{systemStats.availableResources}</div>
                <div className="text-sm text-gray-600">Recursos Disponíveis</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">{systemStats.responseCenters}</div>
                <div className="text-sm text-gray-600">Centros de Resposta</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-yellow-600">{systemStats.averageResponseTime}</div>
                <div className="text-sm text-gray-600">Tempo Médio</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-forest-600">{systemStats.systemUptime}</div>
                <div className="text-sm text-gray-600">Uptime Sistema</div>
              </CardContent>
            </Card>
          </div>

          {/* Incidentes Ativos */}
          <Card>
            <CardHeader>
              <CardTitle>Incidentes em Andamento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeIncidents.map((incident) => (
                  <div key={incident.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Badge 
                        className={
                          incident.severity === 'critical' ? 'bg-fire-600' :
                          incident.severity === 'high' ? 'bg-warning-600' :
                          'bg-yellow-600'
                        }
                      >
                        {incident.severity === 'critical' ? 'Crítico' :
                         incident.severity === 'high' ? 'Alto' : 'Médio'}
                      </Badge>
                      <div>
                        <p className="font-semibold">{incident.id}</p>
                        <p className="text-sm text-gray-600">{incident.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right text-sm">
                        <p>Início: {incident.startTime}</p>
                        <p>{incident.resources} recursos mobilizados</p>
                      </div>
                      <Button size="sm" variant="outline">
                        Sala de Crise
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Ações Administrativas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Gerar Relatório Diário
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  Gerenciar Usuários
                </Button>
                <Button className="w-full justify-start" variant="outline" onClick={handleSystemMaintenance}>
                  <Settings className="h-4 w-4 mr-2" />
                  Programar Manutenção
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Activity className="h-4 w-4 mr-2" />
                  Monitor de Sistema
                </Button>
              </CardContent>
            </Card>

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
          </div>
        </div>
      )}

      {activeTab === 'incidents' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Gestão de Incidentes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Controle completo de todos os incidentes do sistema</p>
              {/* Aqui seria implementada a gestão completa de incidentes */}
              <div className="space-y-4">
                {activeIncidents.map((incident) => (
                  <div key={incident.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{incident.id}</h3>
                        <p className="text-sm text-gray-600">{incident.location}</p>
                        <p className="text-xs text-gray-500">Iniciado às {incident.startTime}</p>
                      </div>
                      <div className="space-x-2">
                        <Button size="sm" variant="outline">Editar</Button>
                        <Button size="sm">Sala de Crise</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'resources' && (
        <ResourcesStructure />
      )}

      {activeTab === 'map' && (
        <Card>
          <CardHeader>
            <CardTitle>Mapa Geral do Sistema</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <InteractiveMap />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminDashboard;
