import React, { useState, useEffect } from 'react';
import { X, Heart, Thermometer, Droplets, Wind, Activity } from 'lucide-react';
import { fetchPatientVitals } from '../services/patientService';
import { PatientVitals } from '../types/patient';

interface PatientTooltipProps {
  patientId: string;
  position: { x: number; y: number };
  onClose: () => void;
}

const PatientTooltip: React.FC<PatientTooltipProps> = ({ patientId, position, onClose }) => {
  const [vitals, setVitals] = useState<PatientVitals | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadVitals = async () => {
      setIsLoading(true);
      try {
        const data = await fetchPatientVitals(patientId);
        setVitals(data);
      } catch (error) {
        console.error('Failed to load patient vitals:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadVitals();
  }, [patientId]);

  const getVitalStatus = (value: number, normal: [number, number]) => {
    if (value < normal[0] || value > normal[1]) {
      return 'text-red-600 bg-red-50';
    }
    return 'text-green-600 bg-green-50';
  };

  return (
    <div 
      className="fixed z-50 bg-white border border-gray-200 rounded-lg shadow-xl p-4 w-80 transform -translate-x-1/2 -translate-y-full"
      style={{ left: position.x, top: position.y }}
    >
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-gray-900">Patient {patientId}</h4>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      
      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse bg-gray-100 h-8 rounded"></div>
          ))}
        </div>
      ) : vitals ? (
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-red-500" />
              <span>Heart Rate</span>
            </div>
            <span className={`px-2 py-1 rounded text-xs font-medium ${getVitalStatus(vitals.heartRate, [60, 100])}`}>
              {vitals.heartRate} bpm
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-500" />
              <span>Blood Pressure</span>
            </div>
            <span className={`px-2 py-1 rounded text-xs font-medium ${getVitalStatus(vitals.systolicBP, [90, 140])}`}>
              {vitals.systolicBP}/{vitals.diastolicBP}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Thermometer className="h-4 w-4 text-orange-500" />
              <span>Temperature</span>
            </div>
            <span className={`px-2 py-1 rounded text-xs font-medium ${getVitalStatus(vitals.temperature, [36.1, 37.2])}`}>
              {vitals.temperature}°C
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wind className="h-4 w-4 text-purple-500" />
              <span>Respiratory Rate</span>
            </div>
            <span className={`px-2 py-1 rounded text-xs font-medium ${getVitalStatus(vitals.respiratoryRate, [12, 20])}`}>
              {vitals.respiratoryRate} /min
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Droplets className="h-4 w-4 text-blue-600" />
              <span>Oxygen Saturation</span>
            </div>
            <span className={`px-2 py-1 rounded text-xs font-medium ${getVitalStatus(vitals.oxygenSaturation, [95, 100])}`}>
              {vitals.oxygenSaturation}%
            </span>
          </div>
          
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between text-xs text-gray-600">
              <span>NEWS2 Score: <span className="font-semibold">{vitals.news2Score}</span></span>
              <span>Last Updated: {new Date(vitals.lastUpdated).toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-4 text-gray-500">
          <p>Unable to load patient vitals</p>
        </div>
      )}
    </div>
  );
};

export default PatientTooltip;