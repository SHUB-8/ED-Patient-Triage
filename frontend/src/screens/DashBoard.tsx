import { useState, useEffect } from "react";
import { Clock, Users, Activity, AlertTriangle } from "lucide-react";
import ZoneCard from "../components/ZoneCard";
import { formatTime } from "../utils/timeUtils";
import { fetchAllQueues } from "../services/priorityService";
import { fetchAllBeds } from "../services/bedService";
import { admitTopPatientFromZone } from "../services/admissionService";
import { initSocket, onQueueUpdate, offQueueUpdate } from "../services/socketService";
import type { PatientCase } from "../types/priority";
import type { Bed } from "../types/bed";

// =============================================================================
// Constants and Type Definitions
// =============================================================================

/**
 * Configuration for each triage zone.
 */
const zones = [
  {
    id: "RED",
    name: "RED",
    color: "bg-red-500",
    borderColor: "border-red-500",
    textColor: "text-red-600",
  },
  {
    id: "ORANGE",
    name: "ORANGE",
    color: "bg-orange-500",
    borderColor: "border-orange-500",
    textColor: "text-orange-600",
  },
  {
    id: "YELLOW",
    name: "YELLOW",
    color: "bg-yellow-500",
    borderColor: "border-yellow-500",
    textColor: "text-yellow-600",
  },
  {
    id: "GREEN",
    name: "GREEN",
    color: "bg-green-500",
    borderColor: "border-green-500",
    textColor: "text-green-600",
  },
];

/**
 * Data structure for a single zone, separating waiting and treatment queues.
 */
interface ZoneData {
  waitingQueue: PatientCase[];
  treatmentQueue: PatientCase[];
}

/**
 * The main data structure for storing patient data in the component's state.
 */
interface PatientsData {
  RED: ZoneData;
  ORANGE: ZoneData;
  YELLOW: ZoneData;
  GREEN: ZoneData;
}

// =============================================================================
// Dashboard Component
// =============================================================================

const Dashboard = () => {
  // ===========================================================================
  // State Management
  // ===========================================================================

  const [currentTime, setCurrentTime] = useState(new Date());
  const [patientsData, setPatientsData] = useState<PatientsData>({
    RED: { waitingQueue: [], treatmentQueue: [] },
    ORANGE: { waitingQueue: [], treatmentQueue: [] },
    YELLOW: { waitingQueue: [], treatmentQueue: [] },
    GREEN: { waitingQueue: [], treatmentQueue: [] },
  });
  const [beds, setBeds] = useState<Bed[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [admitting, setAdmitting] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);

  // ===========================================================================
  // Data Fetching and Processing
  // ===========================================================================

  /**
   * Fetches patient queue data from the API and updates the component's state.
   */
  const fetchQueueData = async () => {
    setIsLoading(true);
    try {
      const queueData = await fetchAllQueues();

      // Transform the raw API data into the structure needed by the component
      const transformedData = Object.keys(queueData).reduce((acc, zone) => {
        const patients = queueData[zone as keyof typeof queueData];
        acc[zone as keyof PatientsData] = {
          waitingQueue: patients.filter((p) => p.status === "WAITING"),
          treatmentQueue: patients.filter((p) => p.status === "IN_TREATMENT"),
        };
        return acc;
      }, {} as PatientsData);

      setPatientsData(transformedData);
    } catch (error) {
      console.error("Error fetching queue data:", error);
      setError("Failed to fetch queue data");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Fetches bed data from the API
   */
  const fetchBedData = async () => {
    try {
      const bedData = await fetchAllBeds();
      setBeds(bedData);
    } catch (error) {
      console.error("Error fetching bed data:", error);
      setError("Failed to fetch bed data");
    }
  };

  /**
   * Handle real-time queue updates from socket
   */
  const handleQueueUpdate = (data: any) => {
    console.log("Received queue update from socket:", data);
    
    // Transform the raw API data into the structure needed by the component
    const transformedData = Object.keys(data).reduce((acc, zone) => {
      const patients = data[zone as keyof typeof data];
      acc[zone as keyof PatientsData] = {
        waitingQueue: patients.filter((p: PatientCase) => p.status === "WAITING"),
        treatmentQueue: patients.filter((p: PatientCase) => p.status === "IN_TREATMENT"),
      };
      return acc;
    }, {} as PatientsData);

    setPatientsData(transformedData);
  };

  /**
   * Manually triggers a data refresh.
   */
  const refreshData = () => {
    fetchQueueData();
    fetchBedData();
  };

  /**
   * Admit the top patient from a specific zone
   */
  const handleAdmitTopPatient = async (zone: string) => {
    // Find the first available bed in the same zone
    const availableBed = beds.find(
      bed => bed.zone === zone && !bed.case_id
    );
    
    if (!availableBed) {
      setError(`No available beds in ${zone} zone`);
      return;
    }
    
    setAdmitting(prev => ({ ...prev, [zone]: true }));
    setError(null);
    
    try {
      await admitTopPatientFromZone(
        zone as 'RED' | 'ORANGE' | 'YELLOW' | 'GREEN',
        availableBed.id
      );
      
      // Refresh data after admission
      await Promise.all([fetchQueueData(), fetchBedData()]);
    } catch (error) {
      console.error(`Error admitting patient from ${zone} zone:`, error);
      setError(`Failed to admit patient from ${zone} zone`);
    } finally {
      setAdmitting(prev => ({ ...prev, [zone]: false }));
    }
  };

  // ===========================================================================
  // Effects
  // ===========================================================================

  useEffect(() => {
    // Update the clock every second
    const clockInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Initialize socket connection
    initSocket();
    
    // Set up socket listener for queue updates
    onQueueUpdate(handleQueueUpdate);
    
    // Fetch initial data
    refreshData();
    
    // Set up auto-refresh as fallback
    const refreshInterval = setInterval(() => {
      fetchQueueData();
      fetchBedData();
    }, 30000); // Refresh every 30 seconds

    // Cleanup intervals and socket listeners on component unmount
    return () => {
      clearInterval(clockInterval);
      clearInterval(refreshInterval);
      offQueueUpdate(handleQueueUpdate);
    };
  }, []);

  // ===========================================================================
  // Memoized Calculations
  // ===========================================================================

  const totalPatients = Object.values(patientsData).reduce(
    (acc, zone) => acc + zone.waitingQueue.length + zone.treatmentQueue.length,
    0
  );

  const totalWaiting = Object.values(patientsData).reduce(
    (acc, zone) => acc + zone.waitingQueue.length,
    0
  );

  const totalInTreatment = Object.values(patientsData).reduce(
    (acc, zone) => acc + zone.treatmentQueue.length,
    0
  );

  // Count available beds by zone
  const availableBedsByZone = beds.reduce((acc, bed) => {
    if (!bed.case_id) {
      acc[bed.zone] = (acc[bed.zone] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  // ===========================================================================
  // Render Logic
  // ===========================================================================

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header Section */}
      <header className="mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Emergency Department Dashboard
            </h1>
            <p className="text-gray-600">
              Real-time patient flow monitoring and management
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-4 lg:mt-0">
            {/* Live Clock */}
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm">
              <Clock className="h-5 w-5 text-blue-600" />
              <span className="font-mono text-lg font-semibold">
                {formatTime(currentTime)}
              </span>
            </div>

            {/* Refresh Button */}
            <button
              onClick={refreshData}
              disabled={isLoading}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <Activity
                className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
              />
              {isLoading ? "Refreshing..." : "Refresh Data"}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Patients</p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalPatients}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-yellow-500">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">Waiting</p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalWaiting}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-500">
            <div className="flex items-center gap-3">
              <Activity className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">In Treatment</p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalInTreatment}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-red-500">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">Critical (RED)</p>
                <p className="text-2xl font-bold text-gray-900">
                  {patientsData.RED?.waitingQueue.length +
                    patientsData.RED?.treatmentQueue.length || 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Triage Zones Section */}
      <main className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {zones.map((zone) => (
          <ZoneCard
            key={zone.id}
            zone={zone}
            data={patientsData[zone.id as keyof typeof patientsData]}
            isLoading={isLoading}
            onAdmitTopPatient={() => handleAdmitTopPatient(zone.id)}
            isAdmitting={admitting[zone.id] || false}
            availableBeds={availableBedsByZone[zone.id] || 0}
          />
        ))}
      </main>
    </div>
  );
};

export default Dashboard;
