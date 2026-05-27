
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ResourcesStructure from '@/components/ResourcesStructure';
import InteractiveMap from '@/components/InteractiveMap';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminNavigation from '@/components/admin/AdminNavigation';
import AdminOverview from '@/components/admin/AdminOverview';
import AdminIncidents from '@/components/admin/AdminIncidents';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const activeIncidents = [
    {
      id: 'SP-GRU-30052501',
      location: 'Cantareira, SP',
      severity: 'critical' as const,
      startTime: '14:25',
      resources: 4,
      status: 'active'
    },
    {
      id: 'RJ-TIJ-30052502',
      location: 'Tijuca, RJ',
      severity: 'high' as const,
      startTime: '15:10',
      resources: 3,
      status: 'contained'
    },
    {
      id: 'MG-CUR-30052503',
      location: 'Serra do Curral, MG',
      severity: 'medium' as const,
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
      title: "🚨 Novo Incidente Criado",
      description: "ID: SP-ABC-30052504 - Status: Ativo - Coordenadas definidas",
    });
  };

  const handleSystemMaintenance = () => {
    toast({
      title: "🔧 Manutenção do Sistema",
      description: "Manutenção programada para 02:00 - Notificações enviadas para todas as equipes",
    });
  };

  const handleGenerateReport = () => {
    toast({
      title: "📊 Relatório Diário Gerado",
      description: "Relatório completo das últimas 24 horas - Download iniciado",
    });
  };

  const handleManageUsers = () => {
    toast({
      title: "👥 Painel de Usuários",
      description: "Acessando controle de usuários e permissões - 47 usuários ativos",
    });
  };

  const handleSystemMonitor = () => {
    toast({
      title: "📈 Monitor de Sistema",
      description: "Dashboard de performance ativo - CPU: 23%, RAM: 45%, Uptime: 99.7%",
    });
  };

  const handleSystemSettings = () => {
    toast({
      title: "⚙️ Configurações do Sistema",
      description: "Acessando painel de configurações avançadas do IGNIS",
    });
  };

  const handleEditIncident = (incidentId: string) => {
    toast({
      title: "✏️ Editando Incidente",
      description: `Editor aberto para ${incidentId} - Atualizando dados em tempo real`,
    });
  };

  const handleGoToCrisisRoom = (incidentId: string) => {
    navigate('/crisis-room');
    toast({
      title: "🚨 Sala de Crise Ativa",
      description: `Entrando na coordenação do incidente ${incidentId}`,
    });
  };

  const handleIncidentManagement = () => {
    toast({
      title: "🔥 Sistema de Gestão",
      description: "Acessando módulo completo de gestão de incidentes e recursos",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <AdminHeader 
        onCreateIncident={handleCreateIncident}
        onSystemSettings={handleSystemSettings}
      />

      <AdminNavigation 
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {activeTab === 'overview' && (
        <AdminOverview 
          systemStats={systemStats}
          activeIncidents={activeIncidents}
          onGoToCrisisRoom={handleGoToCrisisRoom}
          onGenerateReport={handleGenerateReport}
          onManageUsers={handleManageUsers}
          onSystemMaintenance={handleSystemMaintenance}
          onSystemMonitor={handleSystemMonitor}
        />
      )}

      {activeTab === 'incidents' && (
        <AdminIncidents 
          activeIncidents={activeIncidents}
          onIncidentManagement={handleIncidentManagement}
          onEditIncident={handleEditIncident}
          onGoToCrisisRoom={handleGoToCrisisRoom}
        />
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
