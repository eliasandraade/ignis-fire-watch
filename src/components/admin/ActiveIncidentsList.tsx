
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Incident {
  id: string;
  location: string;
  severity: 'critical' | 'high' | 'medium';
  startTime: string;
  resources: number;
  status: string;
}

interface ActiveIncidentsListProps {
  incidents: Incident[];
  onGoToCrisisRoom: (incidentId: string) => void;
}

const ActiveIncidentsList = ({ incidents, onGoToCrisisRoom }: ActiveIncidentsListProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Incidentes em Andamento</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {incidents.map((incident) => (
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
                <Button size="sm" variant="outline" onClick={() => onGoToCrisisRoom(incident.id)}>
                  Sala de Crise
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActiveIncidentsList;
