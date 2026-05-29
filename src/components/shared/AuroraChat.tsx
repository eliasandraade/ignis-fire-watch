import { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  role: 'user' | 'aurora';
  text: string;
}

const QUICK_ACTIONS = [
  'Resumir incidente ativo',
  'Classificar risco da área',
  'Gerar rascunho de relatório',
  'Explicar dado orbital',
  'Recomendar próxima ação operacional',
];

const MOCK_RESPONSES: Record<string, string> = {
  'Resumir incidente ativo':
    'Incidente IGN-CE-2026-0041 — Incêndio florestal ativo na RPPN Elias Andrade (42ha afetados). Status: Protocolo Ativado. Condições meteorológicas críticas (T:36°C, UR:18%, Vento:22km/h NNE). Brigada BRG-CE-01 no local. Risco de propagação direção norte nas próximas 2h.',
  'Classificar risco da área':
    'RPPN Elias Andrade — Risco CRÍTICO. Fatores: vegetação densa seca, histórico de focos na região, vento favorável à propagação, acesso difícil para combate terrestre. Confiança da avaliação: 91% — dados demonstrativos.',
  'Gerar rascunho de relatório':
    'SITREP 001 — 26/05/2026 11:00 UTC\nOcorrência: Incêndio florestal em RPPN.\nÁrea afetada: ~42ha (estimado orbital simulado).\nEquipes: BRG-CE-01 (combate), DRN-CE-02 (reconhecimento).\nSituação: T 36°C, UR 18%, vento NNE 22km/h.\nPróximas ações: contenção setor norte, SITREP+1h.',
  'Explicar dado orbital':
    'Dados orbitais simulados no IGNIS são baseados na lógica de funcionamento do MODIS (NASA/INPE) e Sentinel-2 (ESA). O índice de confiança indica probabilidade do foco detectado ser real. No protótipo, todos os dados são estimados para fins demonstrativos — FIAP GS 2026.',
  'Recomendar próxima ação operacional':
    'Prioridade imediata: (1) Acionar reforço BRG-CE-02. (2) Estabelecer aceiro no setor sul. (3) Solicitar SITREP aéreo a cada 30min. (4) Notificar comunidades no raio de 5km. Confiança: 91% — análise demonstrativa.',
};

function getMockResponse(input: string): string {
  const key = Object.keys(MOCK_RESPONSES).find(k =>
    input.toLowerCase().includes(k.toLowerCase())
  );
  return (key ? MOCK_RESPONSES[key] : 'Análise em processamento... Para esta consulta específica, recomendo verificar os dados do incidente ativo e cruzar com as condições meteorológicas atuais. Sistema demonstrativo — respostas são simuladas para fins acadêmicos (FIAP GS 2026).')
    + '\n\n— Resposta simulada — protótipo demonstrativo';
}

export function AuroraChat() {
  const [messages, setMessages] = useState<Message[]>([{
    id: 'init',
    role: 'aurora',
    text: 'Olá. Sou a Aurora — inteligência analítica do IGNIS. Posso resumir incidentes, classificar riscos e apoiar decisões operacionais.\n\n⚠ Sistema demonstrativo — todas as respostas são simuladas para fins acadêmicos (FIAP GS 2026).',
  }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = (text: string) => {
    if (!text.trim() || loading) return;
    setMessages(prev => [...prev, { id: crypto.randomUUID(), role: 'user', text: text.trim() }]);
    setInput('');
    setLoading(true);
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        role: 'aurora',
        text: getMockResponse(text),
      }]);
      setLoading(false);
    }, 900);
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
              color: msg.role === 'user' ? 'white' : 'var(--text-mid)',
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
