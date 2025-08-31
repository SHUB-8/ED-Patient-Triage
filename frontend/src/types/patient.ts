export interface Patient {
  id?: string;
  name: string;
  age: number;
  gender: "MALE" | "FEMALE" | "OTHER";
  phone: string;
  email?: string;
  medical_history?: unknown;
  created_at?: string;
  updated_at?: string;
}

export interface PatientData {
  id: string;
  name: string;
  age: number;
  gender: "MALE" | "FEMALE" | "OTHER";
  phone: string;
  email?: string;
  medical_history?: unknown;
  created_at: string;
  updated_at: string;
}

export interface WaitingPatient {
  patientId: string;
  priorityScore: number;
  arrivalTime: string;
}

export interface TreatmentPatient {
  patientId: string;
  bedNumber: string;
  remainingTime: number; // in minutes
}

export interface ZoneData {
  waitingQueue: WaitingPatient[];
  treatmentQueue: TreatmentPatient[];
  totalBeds: number;
}

export interface PatientsData {
  red: ZoneData;
  orange: ZoneData;
  yellow: ZoneData;
  green: ZoneData;
}

export interface PatientVitals {
  heartRate: number; // bpm
  systolicBP: number; // mmHg
  diastolicBP: number; // mmHg
  temperature: number; // Celsius
  respiratoryRate: number; // breaths per minute
  oxygenSaturation: number; // percentage
  news2Score: number;
  lastUpdated: string;
}
