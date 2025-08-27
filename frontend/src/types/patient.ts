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
