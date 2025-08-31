export interface Disease {
  id: string;
  name: string;
  description: string;
  treatment_time: number;
  max_wait_time: number;
  severity: number;
  created_at: string;
  updated_at: string;
}