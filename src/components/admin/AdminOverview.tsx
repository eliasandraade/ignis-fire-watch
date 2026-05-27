
import React from 'react';
import SystemStats from './SystemStats';
import ActiveIncidentsList from './ActiveIncidentsList';
import QuickActionsCard from './QuickActionsCard';
import SystemStatusCard from './SystemStatusCard';

interface AdminOverviewProps {
  systemStats: {
    totalIncidents: number;
    activePersonnel: number;
    availableResources: number;
    responseCenters: number;
    averageResponseTime: string;
    systemUptime: string;
  };
  activeIncidents: Array<{
    id: string;
    location: string;
    severity: 'critical' | 'high' | 'medium';
    startTime: string;
    resources: number;
    status: string;
  }>;
  onGoToCrisisRoom: (incidentId: string) => void;
  onGenerateReport: () => void;
  onManageUsers: () => void;
  onSystemMaintenance: () => void;
  onSystemMonitor: () => void;
}

const AdminOverview = ({
  systemStats,
  activeIncidents,
  onGoToCrisisRoom,
  onGenerateReport,
  onManageUsers,
  onSystemMaintenance,
  onSystemMonitor
}: AdminOverviewProps) => {
  return (
    <div className="space-y-6">
      <SystemStats stats={systemStats} />
      <ActiveIncidentsList incidents={activeIncidents} onGoToCrisisRoom={onGoToCrisisRoom} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <QuickActionsCard 
          onGenerateReport={onGenerateReport}
          onManageUsers={onManageUsers}
          onSystemMaintenance={onSystemMaintenance}
          onSystemMonitor={onSystemMonitor}
        />
        <SystemStatusCard />
      </div>
    </div>
  );
};

export default AdminOverview;
