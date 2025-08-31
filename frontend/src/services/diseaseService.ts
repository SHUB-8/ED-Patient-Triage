import api from './api';

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

/**
 * Fetch all diseases
 */
export const fetchAllDiseases = async (): Promise<Disease[]> => {
  try {
    const response = await api.get<Disease[]>('/diseases');
    return response.data;
  } catch (error) {
    console.error('Error fetching diseases:', error);
    throw error;
  }
};

/**
 * Create a new disease
 */
export const createDisease = async (diseaseData: Omit<Disease, 'id' | 'created_at' | 'updated_at'>): Promise<Disease> => {
  try {
    const response = await api.post<Disease>('/diseases', diseaseData);
    return response.data;
  } catch (error) {
    console.error('Error creating disease:', error);
    throw error;
  }
};

/**
 * Update a disease
 */
export const updateDisease = async (diseaseData: Partial<Disease> & { id: string }): Promise<Disease> => {
  try {
    const response = await api.put<Disease>('/diseases', diseaseData);
    return response.data;
  } catch (error) {
    console.error('Error updating disease:', error);
    throw error;
  }
};