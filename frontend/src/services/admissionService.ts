import { admitTopPriorityCase } from './priorityService';
import { assignPatientToBed } from './bedService';

/**
 * Admit the top priority patient from a zone and assign them to a bed
 */
export const admitTopPatientFromZone = async (
  zone: 'RED' | 'ORANGE' | 'YELLOW' | 'GREEN',
  bedId: string
): Promise<any> => {
  try {
    // First, get the top priority case from the zone
    const admissionResult = await admitTopPriorityCase(zone);
    
    // Then assign the patient to the specified bed
    if (admissionResult.case) {
      const assignmentResult = await assignPatientToBed(admissionResult.case.id, bedId);
      return {
        ...admissionResult,
        bedAssignment: assignmentResult
      };
    }
    
    return admissionResult;
  } catch (error) {
    console.error(`Error admitting top patient from ${zone} zone:`, error);
    throw error;
  }
};