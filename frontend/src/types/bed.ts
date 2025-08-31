export type Zone = 'RED' | 'ORANGE' | 'YELLOW' | 'GREEN';

export interface Bed {
  id: string;
  zone: Zone;
  bed_number: string;
  case_id: string | null;
  created_at: string;
  updated_at: string;
  patient_case?: any;
}