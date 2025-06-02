
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Settings } from 'lucide-react';

interface AdminHeaderProps {
  onCreateIncident: () => void;
  onSystemSettings: () => void;
}

const AdminHeader = ({ onCreateIncident, onSystemSettings }: AdminHeaderProps) => {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Administrativo</h1>
          <p className="text-gray-600">Controle Central da Plataforma IGNIS</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={onSystemSettings}>
            <Settings className="h-4 w-4 mr-2" />
            Configurações
          </Button>
          <Button onClick={onCreateIncident}>
            <AlertTriangle className="h-4 w-4 mr-2" />
            Novo Incidente
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
