import React from 'react';
import { Users, Clock, Bed, Activity } from 'lucide-react';
import QueueSection from './QueueSection';
import { ZoneData } from '../types/patient';

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
}

const ZoneCard: React.FC<ZoneCardProps> = ({ zone, data, isLoading }) => {
  const totalPatients = data.waitingQueue.length + data.treatmentQueue.length;
  const availableBeds = data.totalBeds - data.treatmentQueue.length;

  return (
    <div className={`bg-white rounded-xl shadow-lg border-t-4 ${zone.borderColor} overflow-hidden transition-all duration-300 hover:shadow-xl`}>
      {/* Zone Header */}
      <div className={`${zone.color} text-white p-4`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{zone.name} ZONE</h2>
            <p className="text-white/80 text-sm">Priority Level {zone.id.toUpperCase()}</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 mb-1">
              <Users className="h-4 w-4" />
              <span className="font-semibold">{totalPatients}</span>
            </div>
            <div className="flex items-center gap-2">
              <Bed className="h-4 w-4" />
              <span className="text-sm">{availableBeds}/{data.totalBeds} beds</span>
            </div>
          </div>
        </div>
      </div>

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