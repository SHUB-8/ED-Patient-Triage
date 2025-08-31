/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { fetchAllQueues } from "../services/priorityService";
import type { PatientCase } from "../types/priority";

interface ZoneData {
  waitingQueue: PatientCase[];
  treatmentQueue: PatientCase[];
}

interface PatientsData {
  red: ZoneData;
  orange: ZoneData;
  yellow: ZoneData;
  green: ZoneData;
}

interface PatientContextType {
  patientsData: PatientsData;
  isLoading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
}

const PatientContext = createContext<PatientContextType | undefined>(undefined);

export const usePatientData = () => {
  const context = useContext(PatientContext);
  if (!context) {
    throw new Error("usePatientData must be used within a PatientProvider");
  }
  return context;
};

interface PatientProviderProps {
  children: ReactNode;
}

export const PatientProvider: React.FC<PatientProviderProps> = ({
  children,
}) => {
  const [patientsData, setPatientsData] = useState<PatientsData>({
    red: { waitingQueue: [], treatmentQueue: [] },
    orange: { waitingQueue: [], treatmentQueue: [] },
    yellow: { waitingQueue: [], treatmentQueue: [] },
    green: { waitingQueue: [], treatmentQueue: [] },
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const queueData = await fetchAllQueues();
      
      // Transform the raw API data into the structure needed by the component
      const transformedData = Object.keys(queueData).reduce((acc, zone) => {
        const patients = queueData[zone as keyof typeof queueData];
        acc[zone.toLowerCase() as keyof PatientsData] = {
          waitingQueue: patients.filter((p) => p.status === "WAITING"),
          treatmentQueue: patients.filter((p) => p.status === "IN_TREATMENT"),
        };
        return acc;
      }, {} as PatientsData);

      setPatientsData(transformedData);
    } catch (err) {
      setError("Failed to fetch patient data");
      console.error("Error fetching patient data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initial data load
    refreshData();

    // Set up auto-refresh every 30 seconds
    const interval = setInterval(refreshData, 30000);

    return () => clearInterval(interval);
  }, []);

  const value: PatientContextType = {
    patientsData,
    isLoading,
    error,
    refreshData,
  };

  return (
    <PatientContext.Provider value={value}>{children}</PatientContext.Provider>
  );
};
