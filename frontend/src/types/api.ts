// Enhanced type definitions for API responses

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    hospital: string;
    type: string;
  };
}

export interface RegisterResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    hospital: string;
    type: string;
  };
}

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

export interface Bed {
  id: string;
  zone: string;
  case_id: string | null;
  occupied: boolean;
}

export interface Disease {
  id: string;
  name: string;
  description: string;
  severity_level: number;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  medical_history: string;
}