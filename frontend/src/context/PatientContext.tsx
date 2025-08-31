/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { fetchAllPatientsData } from "../services/patientService";
import { PatientsData } from "../types/patient";

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
    red: { waitingQueue: [], treatmentQueue: [], totalBeds: 6 },
    orange: { waitingQueue: [], treatmentQueue: [], totalBeds: 8 },
    yellow: { waitingQueue: [], treatmentQueue: [], totalBeds: 10 },
    green: { waitingQueue: [], treatmentQueue: [], totalBeds: 12 },
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchAllPatientsData();
      setPatientsData(data);
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

    // Set up auto-refresh every 10 seconds
    const interval = setInterval(refreshData, 10000);

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
