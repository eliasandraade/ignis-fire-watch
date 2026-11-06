import type { CSSProperties, ReactNode } from 'react';
import {
  PRIVACY_DATA_ROWS,
  PRIVACY_LEGAL_FIELDS,
  PRIVACY_LEGAL_FIELD_LABELS,
  PRIVACY_THIRD_PARTIES,
  pendingPrivacyFields,
  privacyNoticeVisible,
  type PrivacyLegalField,
} from '@/content/privacyNotice';
import NotFoundPage from '@/pages/shared/NotFoundPage';

const paragraph: CSSProperties = { fontSize: 14.5, lineHeight: 1.65, color: 'var(--text-mid)', margin: '0 0 12px' };
const cell: CSSProperties = {
  padding: '10px 12px', fontSize: 13, lineHeight: 1.5, color: 'var(--text-mid)',
  borderBottom: '1px solid var(--bg-raised)', textAlign: 'left', verticalAlign: 'top',
};

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section style={{ marginTop: 32 }}>
      <h2 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-hi)', margin: '0 0 10px' }}>{title}</h2>
      {children}
    </section>
  );
}

function LegalField({ field }: { field: PrivacyLegalField }) {
  const value = PRIVACY_LEGAL_FIELDS[field];
  if (value) return <p style={paragraph}>{value}</p>;
  return (
    <p style={{ ...paragraph, color: 'var(--text-hi)', border: '1px dashed var(--text-ghost)', borderRadius: 4, padding: '8px 12px' }}>
      Pendente de aprovação: {PRIVACY_LEGAL_FIELD_LABELS[field]}
    </p>
  );
}

function ContactLink({ address }: { address: string }) {
  return <a href={`mailto:${address}`} style={{ color: 'var(--orbital)' }}>{address}</a>;
}

export default function PrivacyPage() {
  if (!privacyNoticeVisible) return <NotFoundPage />;

  const pending = pendingPrivacyFields(PRIVACY_LEGAL_FIELDS);
  const contact = PRIVACY_LEGAL_FIELDS.contact;

  return (
    <main style={{ maxWidth: 780, margin: '0 auto', padding: '40px 24px 64px' }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-hi)', margin: '0 0 8px' }}>Aviso de privacidade</h1>
      <p style={paragraph}>Como o IGNIS Orbital trata dados nesta versão inicial.</p>

      {pending.length > 0 && (
        <p role="status" style={{ ...paragraph, color: 'var(--text-hi)', border: '1px solid var(--orbital)', borderRadius: 4, padding: '10px 12px' }}>
          Pré-visualização de desenvolvimento. Faltam {pending.length} campos jurídicos, e esta página não aparece no site publicado até a aprovação.
        </p>
      )}

      <Section title="Quem opera a plataforma">
        <p style={paragraph}>O IGNIS Orbital é operado pela Andrade Systems.</p>
        <LegalField field="controller" />
        {contact ? (
          <p style={paragraph}>Canal de contato e privacidade: <ContactLink address={contact} /></p>
        ) : (
          <LegalField field="contact" />
        )}
        <LegalField field="dataProtectionOfficer" />
      </Section>

      <Section title="O que é esta versão">
        <p style={paragraph}>
          Uma plataforma de validação e consulta ambiental, com dados públicos de focos de calor do INPE. Consultar o painel e o mapa públicos não exige conta, e esses dados de focos não identificam pessoas.
        </p>
        <p style={paragraph}>
          A plataforma não recebe denúncias, não envia comunicações automáticas a órgãos públicos e não faz despacho nem operação de emergência. Em caso de incêndio, acione o Corpo de Bombeiros (193) ou a Defesa Civil (199).
        </p>
      </Section>

      <Section title="Dados tratados e por quanto tempo">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 560 }}>
            <thead>
              <tr>
                {['Dado', 'Para quê', 'Por quanto tempo'].map((heading) => (
                  <th key={heading} scope="col" style={{ ...cell, color: 'var(--text-hi)', fontWeight: 700 }}>{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PRIVACY_DATA_ROWS.map((row) => (
                <tr key={row.data}>
                  <td style={cell}>{row.data}</td>
                  <td style={cell}>{row.purpose}</td>
                  <td style={cell}>{row.period}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ ...paragraph, marginTop: 12 }}>
          A plataforma não usa cookies, nem ferramentas de publicidade ou de análise de audiência.
        </p>
        <LegalField field="retention" />
      </Section>

      <Section title="Hipóteses legais">
        <LegalField field="legalBases" />
      </Section>

      <Section title="Quem mais recebe dados">
        <ul style={{ ...paragraph, paddingLeft: 20 }}>
          {PRIVACY_THIRD_PARTIES.map((party) => (
            <li key={party.name} style={{ marginBottom: 6 }}>
              <strong style={{ color: 'var(--text-hi)' }}>{party.name}.</strong> {party.role}
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Transferência internacional">
        <p style={paragraph}>Os dados da plataforma ficam hospedados nos Estados Unidos.</p>
        <LegalField field="internationalTransfer" />
      </Section>

      <Section title="Seus direitos">
        <p style={paragraph}>
          A Lei Geral de Proteção de Dados garante, entre outros, os direitos de confirmar o tratamento, acessar e corrigir dados.
          {contact && <> Para exercê-los, escreva para <ContactLink address={contact} />.</>}
        </p>
      </Section>

      <Section title="Vigência">
        <LegalField field="effectiveDate" />
      </Section>
    </main>
  );
}
