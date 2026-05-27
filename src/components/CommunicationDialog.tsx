
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Radio, Phone, Users, MessageSquare, Volume2, Mic } from 'lucide-react';

interface CommunicationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'radio' | 'phone' | null;
}

const CommunicationDialog = ({ isOpen, onClose, type }: CommunicationDialogProps) => {
  const { toast } = useToast();
  const [activeChannel, setActiveChannel] = useState<string | null>(null);

  const radioChannels = [
    { id: 'tac1', name: 'Tático 1', frequency: '154.265', status: 'active', users: 8 },
    { id: 'tac2', name: 'Tático 2', frequency: '154.280', status: 'active', users: 5 },
    { id: 'cmd', name: 'Comando', frequency: '154.295', status: 'active', users: 3 },
    { id: 'log', name: 'Logística', frequency: '154.310', status: 'standby', users: 2 },
    { id: 'med', name: 'Emergência Médica', frequency: '154.325', status: 'active', users: 4 },
  ];

  const phoneContacts = [
    { id: 'coord', name: 'Coordenador Geral', number: '(11) 9999-0001', status: 'available' },
    { id: 'defesa', name: 'Defesa Civil', number: '(11) 9999-0002', status: 'busy' },
    { id: 'samu', name: 'SAMU Central', number: '192', status: 'available' },
    { id: 'pm', name: 'Polícia Militar', number: '190', status: 'available' },
    { id: 'cb', name: 'Corpo de Bombeiros', number: '193', status: 'available' },
    { id: 'cesp', name: 'CESP - Energia', number: '(11) 0800-010-196', status: 'available' },
  ];

  const handleChannelSelect = (channelId: string) => {
    setActiveChannel(channelId);
    const channel = radioChannels.find(c => c.id === channelId);
    toast({
      title: "📻 Canal Conectado",
      description: `Conectado ao ${channel?.name} - ${channel?.frequency} MHz`,
    });
  };

  const handleCall = (contact: any) => {
    toast({
      title: "📞 Chamada Iniciada",
      description: `Chamando ${contact.name} - ${contact.number}`,
    });
  };

  const handleBroadcast = () => {
    toast({
      title: "📢 Transmissão Geral",
      description: "Mensagem enviada para todos os canais ativos - 8 equipes notificadas",
    });
  };

  const handlePTT = () => {
    if (!activeChannel) return;
    const channel = radioChannels.find(c => c.id === activeChannel);
    toast({
      title: "🎙️ Transmitindo",
      description: `Falando no canal ${channel?.name} - ${channel?.users} ouvintes`,
    });
  };

  const handleTextMessage = () => {
    toast({
      title: "💬 Mensagem de Texto",
      description: "Mensagem enviada para todas as equipes no campo",
    });
  };

  const getTitle = () => {
    return type === 'radio' ? 'Comunicação de Rádio' : 'Comunicação Telefônica';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            {type === 'radio' ? <Radio className="h-5 w-5" /> : <Phone className="h-5 w-5" />}
            <span>{getTitle()}</span>
          </DialogTitle>
        </DialogHeader>

        {type === 'radio' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Radio className="h-4 w-4" />
                    <span>Canais de Rádio</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {radioChannels.map((channel) => (
                    <div 
                      key={channel.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-all ${
                        activeChannel === channel.id ? 'bg-blue-50 border-blue-300' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => handleChannelSelect(channel.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">{channel.name}</h4>
                          <p className="text-sm text-gray-600">{channel.frequency} MHz</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={
                            channel.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }>
                            {channel.status === 'active' ? 'Ativo' : 'Standby'}
                          </Badge>
                          <div className="flex items-center space-x-1">
                            <Users className="h-3 w-3" />
                            <span className="text-xs">{channel.users}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Controles de Comunicação</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {activeChannel && (
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm font-medium">Canal Ativo:</p>
                      <p className="text-lg font-bold">
                        {radioChannels.find(c => c.id === activeChannel)?.name}
                      </p>
                    </div>
                  )}
                  
                  <div className="space-y-3">
                    <Button 
                      className="w-full justify-start" 
                      disabled={!activeChannel}
                      onClick={handlePTT}
                    >
                      <Mic className="h-4 w-4 mr-2" />
                      Pressionar para Falar (PTT)
                    </Button>
                    <Button 
                      className="w-full justify-start" 
                      variant="outline"
                      onClick={handleBroadcast}
                    >
                      <Volume2 className="h-4 w-4 mr-2" />
                      Transmissão Geral
                    </Button>
                    <Button 
                      className="w-full justify-start" 
                      variant="outline"
                      onClick={handleTextMessage}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Mensagem de Texto
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {type === 'phone' && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Contatos de Emergência</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {phoneContacts.map((contact) => (
                    <div key={contact.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-semibold">{contact.name}</h4>
                        <p className="text-sm text-gray-600">{contact.number}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge className={
                          contact.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }>
                          {contact.status === 'available' ? 'Disponível' : 'Ocupado'}
                        </Badge>
                        <Button 
                          size="sm" 
                          onClick={() => handleCall(contact)}
                          disabled={contact.status === 'busy'}
                        >
                          <Phone className="h-3 w-3 mr-1" />
                          Ligar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button onClick={onClose} variant="outline">
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommunicationDialog;
