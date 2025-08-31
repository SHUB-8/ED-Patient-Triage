import api from './api';
import type { PatientCase } from '../types/priority';

export interface QueueData {
  RED: PatientCase[];
  ORANGE: PatientCase[];
  YELLOW: PatientCase[];
  GREEN: PatientCase[];
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

/**
 * Fetch all priority queues
 */
export const fetchAllQueues = async (): Promise<QueueData> => {
  try {
    const response = await api.get<QueueData>('/queues');
    return response.data;
  } catch (error) {
    console.error('Error fetching queues:', error);
    throw error;
  }
};

/**
 * Fetch a specific priority queue by zone
 */
export const fetchQueueByZone = async (zone: 'RED' | 'ORANGE' | 'YELLOW' | 'GREEN'): Promise<PatientCase[]> => {
  try {
    const response = await api.get<PatientCase[]>(`/queues/${zone}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${zone} queue:`, error);
    throw error;
  }
};

/**
 * Admit the top priority case from a specific zone
 */
export const admitTopPriorityCase = async (zone: 'RED' | 'ORANGE' | 'YELLOW' | 'GREEN'): Promise<any> => {
  try {
    const response = await api.delete(`/queues/top/${zone}`);
    return response.data;
  } catch (error) {
    console.error(`Error admitting top priority case from ${zone} zone:`, error);
    throw error;
  }
};

/**
 * Insert a new patient case into the priority queue
 */
export const insertPatientCase = async (patientData: {
  id: string;
  NEWS2: number;
  SI: number;
  resourceScore: number;
  age: number;
}): Promise<any> => {
  try {
    const response = await api.post('/queues', patientData);
    return response.data;
  } catch (error) {
    console.error('Error inserting patient case:', error);
    throw error;
  }
};