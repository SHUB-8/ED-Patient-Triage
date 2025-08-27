import React, { useState } from 'react';
import { Clock, User, Bed, TrendingUp } from 'lucide-react';
import PatientTooltip from './PatientTooltip';
import { WaitingPatient, TreatmentPatient } from '../types/patient';

interface PatientCardProps {
  patient: WaitingPatient | TreatmentPatient;
  queueType: 'waiting' | 'treatment';
}

const PatientCard: React.FC<PatientCardProps> = ({ patient, queueType }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const handleMouseEnter = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 10
    });
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  const isWaitingPatient = (p: WaitingPatient | TreatmentPatient): p is WaitingPatient => {
    return 'priorityScore' in p;
  };

  const getPriorityColor = (score: number) => {
    if (score >= 90) return 'text-red-600 bg-red-50';
    if (score >= 70) return 'text-orange-600 bg-orange-50';
    if (score >= 50) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  const formatRemainingTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <>
      <div
        className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-all duration-200 cursor-pointer"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-600" />
              <span className="font-semibold text-gray-900">
                {patient.patientId}
              </span>
            </div>
            
            {queueType === 'waiting' && isWaitingPatient(patient) && (
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(patient.priorityScore)}`}>
                <TrendingUp className="h-3 w-3" />
                {patient.priorityScore}
              </div>
            )}
            
            {queueType === 'treatment' && !isWaitingPatient(patient) && (
              <div className="flex items-center gap-2">
                <Bed className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-600">
                  Bed {patient.bedNumber}
                </span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {queueType === 'treatment' && !isWaitingPatient(patient) && (
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span className="font-medium">
                  {formatRemainingTime(patient.remainingTime)}
                </span>
              </div>
            )}
            
            {queueType === 'waiting' && isWaitingPatient(patient) && (
              <div className="text-xs text-gray-500">
                Wait: {Math.floor((Date.now() - new Date(patient.arrivalTime).getTime()) / 60000)}m
              </div>
            )}
          </div>
        </div>
      </div>

      {showTooltip && (
        <PatientTooltip
          patientId={patient.patientId}
          position={tooltipPosition}
          onClose={() => setShowTooltip(false)}
        />
      )}
    </>
  );
};

export default PatientCard;