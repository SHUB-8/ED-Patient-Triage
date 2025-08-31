import React from 'react';
import PatientCard from './PatientCard';
import type { PatientCase } from '../types/priority';

interface QueueSectionProps {
  title: string;
  icon: React.ReactNode;
  queue: PatientCase[];
  queueType: 'waiting' | 'treatment';
  zoneColor: string;
  isLoading: boolean;
}

const QueueSection: React.FC<QueueSectionProps> = ({
  title,
  icon,
  queue,
  queueType,
  zoneColor,
  isLoading
}) => {
  if (isLoading) {
    return (
      <div className="space-y-2">
        <div className={`flex items-center gap-2 ${zoneColor} font-semibold`}>
          {icon}
          <h3>{title}</h3>
        </div>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse bg-gray-100 h-16 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className={`flex items-center gap-2 ${zoneColor} font-semibold`}>
        {icon}
        <h3>{title}</h3>
        <span className="text-sm text-gray-500">({queue.length})</span>
      </div>
      
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {queue.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">∅</div>
            <p>No patients in queue</p>
          </div>
        ) : (
          queue.map((patient) => (
            <PatientCard
              key={`${queueType}-${patient.id}`}
              patient={patient}
              queueType={queueType}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default QueueSection;