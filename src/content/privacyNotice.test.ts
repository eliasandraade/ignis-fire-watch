import { describe, expect, it } from 'vitest';
import {
  PRIVACY_DATA_ROWS,
  PRIVACY_LEGAL_FIELDS,
  PRIVACY_NOTICE_APPROVED,
  PRIVACY_THIRD_PARTIES,
  isPrivacyNoticePublishable,
  isPrivacyNoticeVisible,
  pendingPrivacyFields,
  type PrivacyLegalFields,
} from './privacyNotice';

const complete: PrivacyLegalFields = {
  controller: 'a',
  contact: 'b',
  dataProtectionOfficer: 'c',
  legalBases: 'd',
  retention: 'e',
  internationalTransfer: 'f',
  effectiveDate: 'g',
};

describe('aviso de privacidade', () => {
  it('não publica enquanto faltar a aprovação ou um campo jurídico', () => {
    expect(isPrivacyNoticePublishable(complete, true)).toBe(true);
    expect(isPrivacyNoticePublishable(complete, false)).toBe(false);
    expect(isPrivacyNoticePublishable({ ...complete, retention: null }, true)).toBe(false);
    expect(isPrivacyNoticePublishable({ ...complete, retention: '   ' }, true)).toBe(false);
  });

  it('fica oculto no build de produção e aberto só para revisão em desenvolvimento', () => {
    expect(isPrivacyNoticeVisible(PRIVACY_LEGAL_FIELDS, PRIVACY_NOTICE_APPROVED, false)).toBe(
      isPrivacyNoticePublishable(PRIVACY_LEGAL_FIELDS, PRIVACY_NOTICE_APPROVED),
    );
    expect(isPrivacyNoticeVisible({ ...complete, contact: null }, true, false)).toBe(false);
    expect(isPrivacyNoticeVisible({ ...complete, contact: null }, false, true)).toBe(true);
  });

  it('só marca como aprovado com todos os campos preenchidos', () => {
    if (PRIVACY_NOTICE_APPROVED) {
      expect(pendingPrivacyFields(PRIVACY_LEGAL_FIELDS)).toEqual([]);
    }
  });

  it('usa o canal institucional sem tratá-lo como encarregado', () => {
    expect(PRIVACY_LEGAL_FIELDS.contact).toBe('contato@andradesystems.com.br');
    expect(PRIVACY_LEGAL_FIELDS.dataProtectionOfficer).not.toBe(PRIVACY_LEGAL_FIELDS.contact);
    expect(pendingPrivacyFields(PRIVACY_LEGAL_FIELDS)).not.toContain('contact');
  });

  it('mantém o aviso bloqueado enquanto houver campo pendente', () => {
    if (pendingPrivacyFields(PRIVACY_LEGAL_FIELDS).length > 0) {
      expect(PRIVACY_NOTICE_APPROVED).toBe(false);
      expect(isPrivacyNoticeVisible(PRIVACY_LEGAL_FIELDS, PRIVACY_NOTICE_APPROVED, false)).toBe(false);
    }
  });

  it('informa finalidade e prazo técnico de cada dado e os terceiros que recebem o IP', () => {
    for (const row of PRIVACY_DATA_ROWS) {
      expect(row.purpose.length).toBeGreaterThan(0);
      expect(row.period.length).toBeGreaterThan(0);
    }
    expect(PRIVACY_THIRD_PARTIES.map((party) => party.name)).toEqual([
      'Railway',
      'OpenStreetMap',
      'Google Fonts',
    ]);
  });
});
