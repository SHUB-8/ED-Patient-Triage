import api from './api';
import type { Patient } from '../types/patient';

export interface PatientData {
  id: string;
  name: string;
  age: number;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  phone: string;
  email: string;
  medical_history?: unknown;
  created_at: string;
  updated_at: string;
}

export interface PatientCase {
  id: string;
  zone: string;
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
  created_at: string;
  updated_at: string;
}

/**
 * Fetch all patients
 */
export const fetchAllPatients = async (): Promise<PatientData[]> => {
  try {
    const response = await api.get<{ patients: PatientData[] }>('/patients');
    return response.data.patients;
  } catch (error) {
    console.error('Error fetching patients:', error);
    throw error;
  }
};

/**
 * Fetch a patient by ID
 */
export const fetchPatientById = async (id: string): Promise<PatientData> => {
  try {
    const response = await api.get<{ patient: PatientData }>(`/patients/${id}`);
    return response.data.patient;
  } catch (error) {
    console.error(`Error fetching patient ${id}:`, error);
    throw error;
  }
};

/**
 * Add a new patient
 */
export const addPatient = async (patientData: Omit<Patient, 'id' | 'created_at' | 'updated_at'>): Promise<PatientData> => {
  try {
    const response = await api.post<{ patient: PatientData }>('/patients', patientData);
    return response.data.patient;
  } catch (error) {
    console.error('Error adding patient:', error);
    throw error;
  }
};

/**
 * Update a patient
 */
export const updatePatient = async (id: string, patientData: Partial<Patient>): Promise<PatientData> => {
  try {
    const response = await api.put<{ patient: PatientData }>(`/patients/${id}`, patientData);
    return response.data.patient;
  } catch (error) {
    console.error(`Error updating patient ${id}:`, error);
    throw error;
  }
};

/**
 * Fetch patient cases
 */
export const fetchPatientCases = async (patientId: string): Promise<PatientCase[]> => {
  try {
    const response = await api.get<{ cases: PatientCase[] }>(`/patients/${patientId}/cases`);
    return response.data.cases;
  } catch (error) {
    console.error(`Error fetching cases for patient ${patientId}:`, error);
    throw error;
  }
};

/**
 * Search patients
 */
export const searchPatients = async (query: string, limit: number = 10): Promise<PatientData[]> => {
  try {
    const response = await api.get<{ patients: PatientData[] }>(`/patients/search?q=${query}&limit=${limit}`);
    return response.data.patients;
  } catch (error) {
    console.error('Error searching patients:', error);
    throw error;
  }
};

// Keep the mock vitals function for now (could be replaced with real data later)
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

export const fetchPatientVitals = async (
  patientId: string
): Promise<PatientVitals> => {
  // Simulate API call delay
  await new Promise((resolve) =>
    setTimeout(resolve, 200 + Math.random() * 300)
  );

  // Generate mock vitals data
  const baseVitals = {
    heartRate: 70 + Math.floor(Math.random() * 50),
    systolicBP: 110 + Math.floor(Math.random() * 40),
    diastolicBP: 70 + Math.floor(Math.random() * 20),
    temperature: 36.5 + Math.random() * 2,
    respiratoryRate: 16 + Math.floor(Math.random() * 8),
    oxygenSaturation: 95 + Math.floor(Math.random() * 5),
    news2Score: Math.floor(Math.random() * 12),
    lastUpdated: new Date(
      Date.now() - Math.random() * 30 * 60 * 1000
    ).toISOString(),
  };

  // Add some realistic variations based on patient priority
  const priorityVariation = patientId.includes("P00") ? 1.2 : 1;

  return {
    ...baseVitals,
    heartRate: Math.round(baseVitals.heartRate * priorityVariation),
    systolicBP: Math.round(baseVitals.systolicBP * priorityVariation),
    temperature:
      Math.round(baseVitals.temperature * priorityVariation * 10) / 10,
    news2Score: Math.min(
      Math.round(baseVitals.news2Score * priorityVariation),
      20
    ),
  };
};
