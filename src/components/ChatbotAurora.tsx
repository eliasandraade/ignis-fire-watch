
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ChatMessage {
  id: string;
  type: 'user' | 'aurora';
  message: string;
  timestamp: Date;
}

interface ChatbotAuroraProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

const ChatbotAurora = ({ isOpen: externalIsOpen, onToggle }: ChatbotAuroraProps) => {
  const { toast } = useToast();
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'aurora',
      message: 'Olá! Eu sou a AURORA, sua assistente virtual da Plataforma IGNIS. Como posso ajudá-lo hoje?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const quickActions = [
    'Reportar novo foco de incêndio',
    'Consultar focos ativos',
    'Solicitar apoio de emergência',
    'Orientações de segurança',
    'Status do sistema'
  ];

  const handleToggle = () => {
    if (onToggle) {
      onToggle();
    } else {
      setInternalIsOpen(!internalIsOpen);
    }
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      message: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Simular resposta da AURORA
    setTimeout(() => {
      const auroraResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'aurora',
        message: getAuroraResponse(inputMessage),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, auroraResponse]);
      setIsTyping(false);
    }, 1500);

    setInputMessage('');
  };

  const getAuroraResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('foco') || input.includes('incêndio')) {
      return 'Entendi que você quer reportar um foco de incêndio. Preciso de algumas informações: 1) Localização exata (coordenadas GPS ou endereço) 2) Tamanho aproximado do foco 3) Presença de fumaça 4) Recursos próximos. Você pode me fornecer essas informações?';
    } else if (input.includes('ajuda') || input.includes('socorro') || input.includes('emergência')) {
      toast({
        title: "🚨 Emergência Acionada",
        description: "Serviços de emergência foram notificados automaticamente",
        variant: "destructive"
      });
      return 'EMERGÊNCIA ACIONADA! 🚨 Notifiquei imediatamente os serviços de emergência. Bombeiros e equipes de resgate foram alertados da sua localização. Mantenha-se em local seguro e afastado das chamas. Número de protocolo: #EMG-' + Date.now().toString().slice(-6);
    } else if (input.includes('segurança') || input.includes('orientação')) {
      return 'Principais orientações de segurança em caso de incêndio florestal: 1) Mantenha-se longe de áreas com fumaça densa 2) Tenha sempre uma rota de fuga planejada 3) Nunca tente combater o fogo sozinho 4) Molhe roupas e cubra nariz/boca 5) Ligue 193 em emergências 6) Siga orientações das autoridades locais.';
    } else if (input.includes('status') || input.includes('sistema')) {
      return 'Status do Sistema IGNIS: ✅ Todos os sistemas operacionais | 🛰️ 47 sensores ativos | 🔥 7 focos em monitoramento | 🚁 12 recursos mobilizados | 📡 Conectividade 98% | Última atualização: ' + new Date().toLocaleTimeString('pt-BR');
    } else if (input.includes('recursos') || input.includes('bombeiros')) {
      return 'Recursos disponíveis na região: 🚁 7 aeronaves (4 helicópteros, 3 aviões) | 🚒 12 equipes terrestres | 🚛 5 caminhões-pipa | 🏥 8 hospitais de apoio | ⛑️ 45 bombeiros especializados. Tempo médio de resposta: 12 minutos.';
    } else {
      return 'Obrigada pela sua mensagem. Como assistente da Plataforma IGNIS, posso ajudá-lo com: 🔥 Reportes de incêndio | ⚠️ Orientações de segurança | 📊 Informações sobre focos ativos | 🚨 Acionamento de emergência | 📍 Localização de recursos. Como posso auxiliá-lo especificamente?';
    }
  };

  const handleQuickAction = (action: string) => {
    setInputMessage(action);
    setTimeout(() => handleSendMessage(), 100);
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={handleToggle}
          className="w-16 h-16 rounded-full bg-gradient-to-r from-fire-500 to-warning-500 hover:from-fire-600 hover:to-warning-600 shadow-lg animate-pulse"
        >
          <MessageCircle className="h-6 w-6 text-white" />
        </Button>
        <Badge className="absolute -top-2 -left-2 bg-forest-500 text-white animate-bounce">
          AURORA
        </Badge>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96">
      <Card className="shadow-2xl border-0 bg-white">
        <CardHeader className="bg-gradient-to-r from-fire-500 to-warning-500 text-white rounded-t-lg">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-fire-500 font-bold">🤖</span>
              </div>
              <div>
                <CardTitle className="text-white text-lg">AURORA</CardTitle>
                <p className="text-white/90 text-sm">Assistente Virtual IGNIS</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggle}
              className="text-white hover:bg-white/20"
            >
              ✕
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* Chat Messages */}
          <div className="h-64 overflow-y-auto p-4 space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs p-3 rounded-lg text-sm ${
                    msg.type === 'user'
                      ? 'bg-fire-500 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  {msg.message}
                  <div className="text-xs opacity-70 mt-1">
                    {msg.timestamp.toLocaleTimeString('pt-BR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-900 p-3 rounded-lg text-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="p-3 border-t bg-gray-50">
            <p className="text-xs text-gray-600 mb-2">Ações rápidas:</p>
            <div className="flex flex-wrap gap-1">
              {quickActions.slice(0, 3).map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => handleQuickAction(action)}
                >
                  {action}
                </Button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-3 border-t">
            <div className="flex space-x-2">
              <Input
                placeholder="Digite sua mensagem..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="text-sm"
              />
              <Button onClick={handleSendMessage} size="sm" disabled={!inputMessage.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatbotAurora;
