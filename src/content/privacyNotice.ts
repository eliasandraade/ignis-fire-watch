/**
 * Privacy notice of the first production version. The factual sections below
 * were checked against the code and the infrastructure (ignis-orbital-api
 * docs/IGNIS/PRIVACY-DATA-MAP.md).
 *
 * Legal fields stay null until the owner provides and approves them: never fill
 * them with a guess. While any is null, or the approval is false, the production
 * build answers /privacidade with "not found" and shows no link to it. An
 * incomplete notice cannot go live by accident, even if this code is merged.
 */

export type PrivacyLegalField =
  | 'controller'
  | 'contact'
  | 'dataProtectionOfficer'
  | 'legalBases'
  | 'retention'
  | 'internationalTransfer'
  | 'effectiveDate';

export type PrivacyLegalFields = Record<PrivacyLegalField, string | null>;

export const PRIVACY_LEGAL_FIELDS: PrivacyLegalFields = {
  controller: null,
  // Institutional contact and privacy channel. It does not appoint a data
  // protection officer: dataProtectionOfficer stays a separate formal decision.
  contact: 'contato@andradesystems.com.br',
  dataProtectionOfficer: null,
  legalBases: null,
  retention: null,
  internationalTransfer: null,
  effectiveDate: null,
};

/** Set to true only with the owner's explicit approval of the final text. */
export const PRIVACY_NOTICE_APPROVED = false;

export const PRIVACY_LEGAL_FIELD_LABELS: Record<PrivacyLegalField, string> = {
  controller: 'Controlador: identificação e papéis confirmados',
  contact: 'Canal de contato e privacidade',
  dataProtectionOfficer: 'Encarregado (DPO)',
  legalBases: 'Hipóteses legais por finalidade',
  retention: 'Prazos de retenção definidos',
  internationalTransfer: 'Mecanismo de transferência internacional',
  effectiveDate: 'Data de vigência',
};

export function pendingPrivacyFields(fields: PrivacyLegalFields): PrivacyLegalField[] {
  return (Object.keys(fields) as PrivacyLegalField[]).filter((key) => !fields[key]?.trim());
}

export function isPrivacyNoticePublishable(fields: PrivacyLegalFields, approved: boolean): boolean {
  return approved && pendingPrivacyFields(fields).length === 0;
}

/** In development the page opens, with the pending fields marked, for review. */
export function isPrivacyNoticeVisible(
  fields: PrivacyLegalFields,
  approved: boolean,
  isDevelopment: boolean,
): boolean {
  return isDevelopment || isPrivacyNoticePublishable(fields, approved);
}

export const privacyNoticeVisible = isPrivacyNoticeVisible(
  PRIVACY_LEGAL_FIELDS,
  PRIVACY_NOTICE_APPROVED,
  import.meta.env.DEV,
);

export interface PrivacyDataRow {
  data: string;
  purpose: string;
  period: string;
}

export const PRIVACY_DATA_ROWS: PrivacyDataRow[] = [
  {
    data: 'Conta de acesso restrito: nome, e-mail, papel, equipe, senha em formato de hash e datas de criação, atualização e último acesso',
    purpose: 'Autenticar quem acessa a área restrita e controlar o que cada pessoa pode fazer',
    period: 'Não há exclusão automática. A conta pode ser desativada e continua guardada',
  },
  {
    data: 'Registros de auditoria: nome de quem agiu, ação, item afetado e detalhes, como o motivo informado e os campos alterados',
    purpose: 'Segurança e rastreabilidade das ações administrativas',
    period: 'Não há exclusão automática',
  },
  {
    data: 'Registros técnicos de acesso: endereço IP, página solicitada, data e hora e, no servidor web, o navegador usado',
    purpose: 'Operar a plataforma, investigar falhas e identificar abuso',
    period: 'Até 30 dias no provedor de hospedagem, conforme o plano contratado',
  },
  {
    data: 'Contador de tentativas por endereço IP',
    purpose: 'Limitar tentativas de acesso',
    period: 'Na memória do servidor, por uma janela curta; é descartado ao reiniciar',
  },
  {
    data: 'Sessão no navegador: token de acesso e nome, e-mail e papel do usuário, guardados no armazenamento local do navegador',
    purpose: 'Manter a sessão aberta depois do login',
    period: 'Até sair da conta ou a sessão ser recusada; o token vale por até 8 horas',
  },
  {
    data: 'Cópias de segurança do banco de dados, com as contas e os registros de auditoria',
    purpose: 'Recuperar a plataforma em caso de falha',
    period: 'Diárias por 6 dias, semanais por 27 dias e mensais por 89 dias. Um dado apagado pode permanecer nas cópias até esses prazos',
  },
];

export interface PrivacyThirdParty {
  name: string;
  role: string;
}

export const PRIVACY_THIRD_PARTIES: PrivacyThirdParty[] = [
  {
    name: 'Railway',
    role: 'Hospeda a aplicação, o banco de dados e as cópias de segurança, nos Estados Unidos.',
  },
  {
    name: 'OpenStreetMap',
    role: 'Fornece as imagens do mapa. O navegador as solicita diretamente, e o serviço recebe o endereço IP do visitante.',
  },
  {
    name: 'Google Fonts',
    role: 'Fornece as fontes do site. O navegador as solicita diretamente, e o serviço recebe o endereço IP do visitante.',
  },
];
