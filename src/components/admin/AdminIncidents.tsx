
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';

interface AdminIncidentsProps {
  activeIncidents: Array<{
    id: string;
    location: string;
    severity: 'critical' | 'high' | 'medium';
    startTime: string;
    resources: number;
    status: string;
  }>;
  onIncidentManagement: () => void;
  onEditIncident: (incidentId: string) => void;
  onGoToCrisisRoom: (incidentId: string) => void;
}

const AdminIncidents = ({
  activeIncidents,
  onIncidentManagement,
  onEditIncident,
  onGoToCrisisRoom
}: AdminIncidentsProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Gestão de Incidentes</CardTitle>
            <Button onClick={onIncidentManagement}>
              <Settings className="h-4 w-4 mr-2" />
              Configurações Avançadas
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">Controle completo de todos os incidentes do sistema</p>
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
                    <Button size="sm" variant="outline" onClick={() => onEditIncident(incident.id)}>
                      Editar
                    </Button>
                    <Button size="sm" onClick={() => onGoToCrisisRoom(incident.id)}>
                      Sala de Crise
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminIncidents;
