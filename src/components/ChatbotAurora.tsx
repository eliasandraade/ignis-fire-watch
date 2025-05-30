
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Message } from 'lucide-react';

interface ChatMessage {
  id: string;
  type: 'user' | 'aurora';
  message: string;
  timestamp: Date;
}

const ChatbotAurora = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'aurora',
      message: 'Olá! Eu sou a AURORA, sua assistente virtual da Plataforma IGNIS. Como posso ajudá-lo hoje?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const quickActions = [
    'Reportar novo foco de incêndio',
    'Consultar focos ativos',
    'Solicitar apoio de emergência',
    'Orientações de segurança',
    'Status do sistema'
  ];

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      message: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // Simular resposta da AURORA
    setTimeout(() => {
      const auroraResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'aurora',
        message: getAuroraResponse(inputMessage),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, auroraResponse]);
    }, 1000);

    setInputMessage('');
  };

  const getAuroraResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('foco') || input.includes('incêndio')) {
      return 'Entendi que você quer reportar um foco de incêndio. Preciso de algumas informações: 1) Localização exata 2) Tamanho aproximado 3) Presença de fumaça. Você pode me fornecer essas informações?';
    } else if (input.includes('ajuda') || input.includes('socorro')) {
      return 'Vou acionar imediatamente os serviços de emergência. Mantenha-se em local seguro e afastado das chamas. Os bombeiros foram notificados da sua localização.';
    } else if (input.includes('segurança')) {
      return 'Principais orientações de segurança: 1) Mantenha-se longe de áreas com fumaça 2) Tenha sempre uma rota de fuga 3) Não tente combater o fogo sozinho 4) Ligue 193 em emergências.';
    } else {
      return 'Obrigada pela sua mensagem. Como assistente da Plataforma IGNIS, posso ajudá-lo com reportes de incêndio, orientações de segurança e informações sobre focos ativos. Como posso auxiliá-lo?';
    }
  };

  const handleQuickAction = (action: string) => {
    setInputMessage(action);
    handleSendMessage();
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 rounded-full bg-gradient-to-r from-fire-500 to-warning-500 hover:from-fire-600 hover:to-warning-600 shadow-lg animate-pulse"
        >
          <Message className="h-6 w-6 text-white" />
        </Button>
        <Badge className="absolute -top-2 -left-2 bg-forest-500 text-white">
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
              onClick={() => setIsOpen(false)}
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
                </div>
              </div>
            ))}
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
              <Button onClick={handleSendMessage} size="sm">
                Enviar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatbotAurora;
