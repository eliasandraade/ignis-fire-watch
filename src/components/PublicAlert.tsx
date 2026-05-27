
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle, MessageSquare, Phone, Radio, Globe } from 'lucide-react';

interface PublicAlertProps {
  isOpen: boolean;
  onClose: () => void;
  incidentId?: string;
}

const PublicAlert = ({ isOpen, onClose, incidentId }: PublicAlertProps) => {
  const { toast } = useToast();
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [alertType, setAlertType] = useState<string>('evacuation');

  const channels = [
    { id: 'sms', name: 'SMS em Massa', icon: MessageSquare, coverage: '15.000 pessoas', status: 'ativo' },
    { id: 'radio', name: 'Rádio Municipal', icon: Radio, coverage: 'Região Metropolitana', status: 'ativo' },
    { id: 'app', name: 'App Defesa Civil', icon: Phone, coverage: '8.500 usuários', status: 'ativo' },
    { id: 'web', name: 'Portal da Cidade', icon: Globe, coverage: 'Público Geral', status: 'ativo' },
  ];

  const alertTypes = {
    evacuation: {
      title: 'Ordem de Evacuação',
      message: 'ATENÇÃO: Evacuação imediata necessária na região devido a incêndio florestal. Siga as rotas de fuga estabelecidas.',
      priority: 'crítica'
    },
    warning: {
      title: 'Alerta de Risco',
      message: 'AVISO: Incêndio florestal nas proximidades. Mantenha-se atento às orientações e evite a área.',
      priority: 'alta'
    },
    info: {
      title: 'Informação Pública',
      message: 'INFORMAÇÃO: Operações de combate a incêndio em andamento. Tráfego pode ser afetado na região.',
      priority: 'média'
    }
  };

  const handleChannelToggle = (channelId: string) => {
    setSelectedChannels(prev => 
      prev.includes(channelId) 
        ? prev.filter(id => id !== channelId)
        : [...prev, channelId]
    );
  };

  const handleSendAlert = () => {
    if (selectedChannels.length === 0) {
      toast({
        title: "⚠️ Seleção Necessária",
        description: "Selecione pelo menos um canal para enviar o alerta",
        variant: "destructive"
      });
      return;
    }

    const channelNames = channels
      .filter(c => selectedChannels.includes(c.id))
      .map(c => c.name)
      .join(', ');

    toast({
      title: "📢 Alerta Público Emitido",
      description: `${alertTypes[alertType].title} enviado via ${channelNames}`,
      variant: alertTypes[alertType].priority === 'crítica' ? 'destructive' : 'default'
    });

    setSelectedChannels([]);
    onClose();
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'crítica': return <Badge className="bg-fire-600 text-white animate-pulse">Crítica</Badge>;
      case 'alta': return <Badge className="bg-warning-600 text-white">Alta</Badge>;
      case 'média': return <Badge className="bg-blue-600 text-white">Média</Badge>;
      default: return <Badge variant="secondary">Normal</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-warning-500" />
            <span>Emitir Alerta Público</span>
            {incidentId && <Badge variant="outline">{incidentId}</Badge>}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Tipo de Alerta */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tipo de Alerta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(alertTypes).map(([key, alert]) => (
                <div 
                  key={key}
                  className={`p-3 border rounded-lg cursor-pointer transition-all ${
                    alertType === key ? 'border-blue-400 bg-blue-50' : 'border-gray-200'
                  }`}
                  onClick={() => setAlertType(key)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{alert.title}</h4>
                    {getPriorityBadge(alert.priority)}
                  </div>
                  <p className="text-sm text-gray-600">{alert.message}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Canais de Comunicação */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Canais de Comunicação</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {channels.map((channel) => {
                  const IconComponent = channel.icon;
                  return (
                    <Card 
                      key={channel.id}
                      className={`cursor-pointer transition-all ${
                        selectedChannels.includes(channel.id) ? 'ring-2 ring-blue-400 bg-blue-50' : ''
                      }`}
                      onClick={() => handleChannelToggle(channel.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <IconComponent className="h-5 w-5 text-blue-500" />
                            <div>
                              <h4 className="font-semibold">{channel.name}</h4>
                              <p className="text-sm text-gray-600">Alcance: {channel.coverage}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className="bg-green-100 text-green-800">Ativo</Badge>
                            {selectedChannels.includes(channel.id) && (
                              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Preview do Alerta */}
          {selectedChannels.length > 0 && (
            <Card className="bg-yellow-50 border-yellow-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-2 text-yellow-600" />
                  Preview do Alerta
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{alertTypes[alertType].title}</span>
                    {getPriorityBadge(alertTypes[alertType].priority)}
                  </div>
                  <div className="p-3 bg-white border rounded">
                    <p className="text-sm">{alertTypes[alertType].message}</p>
                  </div>
                  <div className="text-xs text-gray-600">
                    Será enviado via: {channels
                      .filter(c => selectedChannels.includes(c.id))
                      .map(c => c.name)
                      .join(', ')}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="flex space-x-3 pt-4 border-t">
          <Button 
            onClick={handleSendAlert} 
            disabled={selectedChannels.length === 0}
            className="flex-1"
            variant={alertTypes[alertType].priority === 'crítica' ? 'destructive' : 'default'}
          >
            📢 Enviar Alerta ({selectedChannels.length} canais)
          </Button>
          <Button onClick={onClose} variant="outline">
            Cancelar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PublicAlert;
