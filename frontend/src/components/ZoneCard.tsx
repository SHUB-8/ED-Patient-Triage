import React from "react";
import { Users, Clock, Bed, Activity, ArrowRight } from "lucide-react";
import QueueSection from "./QueueSection";
import type { PatientCase } from "../types/priority";

interface ZoneData {
  waitingQueue: PatientCase[];
  treatmentQueue: PatientCase[];
}

interface ZoneCardProps {
  zone: {
    id: string;
    name: string;
    color: string;
    borderColor: string;
    textColor: string;
  };
  data: ZoneData;
  isLoading: boolean;
  onAdmitTopPatient?: () => void;
  isAdmitting?: boolean;
  availableBeds?: number;
}

const ZoneCard: React.FC<ZoneCardProps> = ({ 
  zone, 
  data, 
  isLoading, 
  onAdmitTopPatient,
  isAdmitting = false,
  availableBeds = 0
}) => {
  // Add null check to prevent accessing properties of undefined
  if (!data) {
    return (
      <div
        className={`bg-white rounded-xl shadow-lg border-t-4 ${zone.borderColor} overflow-hidden`}
      >
        <div className={`${zone.color} text-white p-4`}>
          <h2 className="text-2xl font-bold">{zone.name} ZONE</h2>
          <p className="text-white/80 text-sm">Loading...</p>
        </div>
        <div className="p-4">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const totalPatients = data.waitingQueue.length + data.treatmentQueue.length;
  // Using fixed bed counts for each zone as defined in the backend
  const totalBeds = zone.id === "RED" ? 6 : zone.id === "ORANGE" ? 8 : zone.id === "YELLOW" ? 10 : 12;
  const occupiedBeds = data.treatmentQueue.length;
  const freeBeds = totalBeds - occupiedBeds;

  return (
    <div
      className={`bg-white rounded-xl shadow-lg border-t-4 ${zone.borderColor} overflow-hidden transition-all duration-300 hover:shadow-xl`}
    >
      {/* Zone Header */}
      <div className={`${zone.color} text-white p-4`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{zone.name} ZONE</h2>
            <p className="text-white/80 text-sm">
              Priority Level {zone.id.toUpperCase()}
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 mb-1">
              <Users className="h-4 w-4" />
              <span className="font-semibold">{totalPatients}</span>
            </div>
            <div className="flex items-center gap-2">
              <Bed className="h-4 w-4" />
              <span className="text-sm">
                {freeBeds}/{totalBeds} beds
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Admission Button */}
      {onAdmitTopPatient && data.waitingQueue.length > 0 && (
        <div className="px-4 pt-2">
          <button
            onClick={onAdmitTopPatient}
            disabled={isAdmitting || availableBeds === 0}
            className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg font-medium transition-colors ${
              isAdmitting 
                ? "bg-gray-300 text-gray-600" 
                : availableBeds === 0
                ? "bg-gray-300 text-gray-600"
                : "bg-green-500 hover:bg-green-600 text-white"
            }`}
          >
            <ArrowRight className="h-4 w-4" />
            {isAdmitting 
              ? "Admitting..." 
              : availableBeds === 0
              ? "No Beds Available"
              : `Admit Top Patient (${availableBeds} beds free)`}
          </button>
        </div>
      )}

      {/* Zone Content */}
      <div className="p-4 space-y-4">
        {/* Waiting Queue */}
        <QueueSection
          title="Waiting Queue"
          icon={<Clock className="h-5 w-5" />}
          queue={data.waitingQueue}
          queueType="waiting"
          zoneColor={zone.textColor}
          isLoading={isLoading}
        />

        {/* Treatment Queue */}
        <QueueSection
          title="Treatment Queue"
          icon={<Activity className="h-5 w-5" />}
          queue={data.treatmentQueue}
          queueType="treatment"
          zoneColor={zone.textColor}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default ZoneCard;
