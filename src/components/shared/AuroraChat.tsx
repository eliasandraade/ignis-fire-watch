import { useState, useRef, useEffect } from 'react';
import { chatWithAurora } from '@/services/api/auroraService';

interface Message {
  id: string;
  role: 'user' | 'aurora';
  text: string;
  error?: boolean;
}

const QUICK_ACTIONS = [
  'Resumir incidente ativo',
  'Classificar risco da área',
  'Gerar rascunho de relatório',
  'Explicar dado orbital',
  'Recomendar próxima ação operacional',
];

export function AuroraChat() {
  const [messages, setMessages] = useState<Message[]>([{
    id: 'init',
    role: 'aurora',
    text: 'Olá. Sou a Aurora, assistente analítica do IGNIS. As respostas vêm da API e são geradas por regras a partir dos dados registrados; confira sempre antes de decidir.',
  }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    const userText = text.trim();
    setMessages(prev => [...prev, { id: crypto.randomUUID(), role: 'user', text: userText }]);
    setInput('');
    setLoading(true);

    try {
      const res = await chatWithAurora({ message: userText });
      const actions = res.suggested_actions?.length > 0
        ? '\n\nAções sugeridas:\n' + res.suggested_actions.map(a => `• ${a}`).join('\n')
        : '';
      setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        role: 'aurora',
        text: res.response + actions + `\n\n— Confiança informada pela API: ${Math.round(res.confidence * 100)}% · análise baseada em regras`,
      }]);
    } catch {
      // Sem resposta da API: nenhuma resposta é inventada.
      setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        role: 'aurora',
        text: 'Serviço temporariamente indisponível: a Aurora não respondeu. Tente novamente em instantes.',
        error: true,
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%',
                  background: 'var(--bg-surface)', borderRadius: 8, overflow: 'hidden' }}>
      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 16,
                    display: 'flex', flexDirection: 'column', gap: 12 }}>
        {messages.map(msg => (
          <div key={msg.id} style={{ maxWidth: '85%',
                                     alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
            {msg.role === 'aurora' && (
              <div style={{ fontSize: 10, color: 'var(--orbital)', fontWeight: 700,
                            textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>
                Aurora IA
              </div>
            )}
            <div style={{
              padding: '10px 14px',
              borderRadius: msg.role === 'user' ? '12px 12px 4px 12px' : '4px 12px 12px 12px',
              background: msg.role === 'user' ? 'var(--orbital)' : 'var(--bg-raised)',
              color: msg.role === 'user' ? 'white' : msg.error ? 'var(--risk-high)' : 'var(--text-mid)',
              fontSize: 13, lineHeight: 1.5, whiteSpace: 'pre-wrap',
            }}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ alignSelf: 'flex-start' }}>
            <div style={{ fontSize: 10, color: 'var(--orbital)', fontWeight: 700,
                          textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>
              Aurora IA
            </div>
            <div style={{ padding: '10px 14px', background: 'var(--bg-raised)',
                          borderRadius: '4px 12px 12px 12px', fontSize: 13,
                          color: 'var(--text-ghost)' }}>
              Analisando...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick actions */}
      <div style={{ padding: '8px 12px', borderTop: '1px solid var(--bg-raised)',
                    display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {QUICK_ACTIONS.map(action => (
          <button key={action} onClick={() => send(action)} style={{
            padding: '4px 10px', borderRadius: 4, fontSize: 11, cursor: 'pointer',
            background: 'var(--orbital-dim)', color: 'var(--orbital)',
            border: '1px solid color-mix(in oklch, var(--orbital) 30%, transparent)',
            fontFamily: 'inherit',
          }}>
            {action}
          </button>
        ))}
      </div>

      {/* Input */}
      <div style={{ padding: '8px 12px', borderTop: '1px solid var(--bg-raised)',
                    display: 'flex', gap: 8 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input); } }}
          placeholder="Pergunte à Aurora..."
          style={{
            flex: 1, background: 'var(--bg-raised)', border: '1px solid var(--bg-void)',
            borderRadius: 6, padding: '8px 12px', fontSize: 13, color: 'var(--text-hi)',
            fontFamily: 'inherit', outline: 'none',
          }}
        />
        <button onClick={() => send(input)} disabled={!input.trim() || loading} style={{
          padding: '8px 16px', borderRadius: 6, fontSize: 13, cursor: 'pointer',
          background: 'var(--orbital)', color: 'white', border: 'none',
          fontFamily: 'inherit', fontWeight: 600,
          opacity: !input.trim() || loading ? 0.5 : 1,
        }}>
          Enviar
        </button>
      </div>
    </div>
  );
}
