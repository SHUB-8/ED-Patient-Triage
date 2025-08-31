import api from './api';
import type { Zone } from '../types/bed';

export interface Bed {
  id: string;
  zone: Zone;
  bed_number: string;
  case_id: string | null;
  created_at: string;
  updated_at: string;
  patient_case?: any;
}

/**
 * Fetch all beds
 */
export const fetchAllBeds = async (): Promise<Bed[]> => {
  try {
    const response = await api.get<{ beds: Bed[] }>('/beds');
    return response.data.beds;
  } catch (error) {
    console.error('Error fetching beds:', error);
    throw error;
  }
};

/**
 * Fetch beds by zone
 */
export const fetchBedsByZone = async (zone: Zone): Promise<Bed[]> => {
  try {
    const response = await api.get<{ beds: Bed[] }>(`/beds/zone/${zone}`);
    return response.data.beds;
  } catch (error) {
    console.error(`Error fetching ${zone} beds:`, error);
    throw error;
  }
};

/**
 * Fetch a specific bed by ID
 */
export const fetchBedById = async (id: string): Promise<Bed> => {
  try {
    const response = await api.get<{ bed: Bed }>(`/beds/${id}`);
    return response.data.bed;
  } catch (error) {
    console.error(`Error fetching bed ${id}:`, error);
    throw error;
  }
};

/**
 * Assign a patient case to a bed
 */
export const assignPatientToBed = async (case_id: string, bed_id: string): Promise<Bed> => {
  try {
    const response = await api.post<{ bed: Bed }>('/beds/assign', { case_id, bed_id });
    return response.data.bed;
  } catch (error) {
    console.error('Error assigning patient to bed:', error);
    throw error;
  }
};

/**
 * Discharge a patient from a bed
 */
export const dischargePatientFromBed = async (bed_id: string): Promise<Bed> => {
  try {
    const response = await api.post<{ bed: Bed }>('/beds/discharge', { bed_id });
    return response.data.bed;
  } catch (error) {
    console.error('Error discharging patient from bed:', error);
    throw error;
  }
};

/**
 * Create a new bed
 */
export const createBed = async (zone: Zone, bed_number: string): Promise<Bed> => {
  try {
    const response = await api.post<{ bed: Bed }>('/beds/create', { zone, bed_number });
    return response.data.bed;
  } catch (error) {
    console.error('Error creating bed:', error);
    throw error;
  }
};