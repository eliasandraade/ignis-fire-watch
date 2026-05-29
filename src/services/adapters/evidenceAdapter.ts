import type { Evidence } from '@/types/domain';
import type { ApiEvidenceRead } from '@/services/api/evidenceService';

const API_TYPE_MAP: Record<string, Evidence['type']> = {
  image: 'image',
  satellite: 'satellite',
  field_photo: 'field-photo',
  document: 'document',
};

export function adaptApiEvidence(e: ApiEvidenceRead): Evidence {
  return {
    id: e.id,
    type: API_TYPE_MAP[e.type] ?? 'image',
    url: e.url,
    caption: e.description ?? e.type,
    source: e.source ?? 'campo',
    timestamp: e.created_at,
  };
}
