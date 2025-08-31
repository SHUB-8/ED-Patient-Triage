export interface PatientCase {
  id: string;
  zone: 'RED' | 'ORANGE' | 'YELLOW' | 'GREEN';
  si: number;
  news2: number;
  resource_score: number;
  age_flag: boolean;
  arrival_time: string;
  last_eval_time: string;
  priority: number;
  patient_id: string;
  status: 'WAITING' | 'IN_TREATMENT';
  time_served?: string | null;
}

export interface QueueData {
  RED: PatientCase[];
  ORANGE: PatientCase[];
  YELLOW: PatientCase[];
  GREEN: PatientCase[];
}