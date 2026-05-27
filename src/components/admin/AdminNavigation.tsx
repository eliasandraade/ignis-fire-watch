
import React from 'react';
import { Button } from '@/components/ui/button';
import { BarChart, AlertTriangle, Shield, MapPin } from 'lucide-react';

interface AdminNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const AdminNavigation = ({ activeTab, onTabChange }: AdminNavigationProps) => {
  return (
    <div className="mb-6">
      <div className="flex space-x-2">
        <Button 
          variant={activeTab === 'overview' ? 'default' : 'outline'}
          onClick={() => onTabChange('overview')}
        >
          <BarChart className="h-4 w-4 mr-2" />
          Visão Geral
        </Button>
        <Button 
          variant={activeTab === 'incidents' ? 'default' : 'outline'}
          onClick={() => onTabChange('incidents')}
        >
          <AlertTriangle className="h-4 w-4 mr-2" />
          Incidentes
        </Button>
        <Button 
          variant={activeTab === 'resources' ? 'default' : 'outline'}
          onClick={() => onTabChange('resources')}
        >
          <Shield className="h-4 w-4 mr-2" />
          Recursos
        </Button>
        <Button 
          variant={activeTab === 'map' ? 'default' : 'outline'}
          onClick={() => onTabChange('map')}
        >
          <MapPin className="h-4 w-4 mr-2" />
          Mapa Geral
        </Button>
      </div>
    </div>
  );
};

export default AdminNavigation;
