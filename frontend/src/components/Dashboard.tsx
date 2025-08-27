import React, { useState, useEffect } from 'react';
import { Clock, Users, Activity, AlertTriangle } from 'lucide-react';
import ZoneCard from './ZoneCard';
import { usePatientData } from '../context/PatientContext';
import { formatTime } from '../utils/timeUtils';

const zones = [
  { id: 'red', name: 'RED', color: 'bg-red-500', borderColor: 'border-red-500', textColor: 'text-red-600' },
  { id: 'orange', name: 'ORANGE', color: 'bg-orange-500', borderColor: 'border-orange-500', textColor: 'text-orange-600' },
  { id: 'yellow', name: 'YELLOW', color: 'bg-yellow-500', borderColor: 'border-yellow-500', textColor: 'text-yellow-600' },
  { id: 'green', name: 'GREEN', color: 'bg-green-500', borderColor: 'border-green-500', textColor: 'text-green-600' },
  { id: 'blue', name: 'BLUE', color: 'bg-blue-500', borderColor: 'border-blue-500', textColor: 'text-blue-600' }
];

const Dashboard: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { patientsData, isLoading, refreshData } = usePatientData();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const totalPatients = Object.values(patientsData).reduce((acc, zone) => 
    acc + zone.waitingQueue.length + zone.treatmentQueue.length, 0
  );

  const totalWaiting = Object.values(patientsData).reduce((acc, zone) => 
    acc + zone.waitingQueue.length, 0
  );

  const totalInTreatment = Object.values(patientsData).reduce((acc, zone) => 
    acc + zone.treatmentQueue.length, 0
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Emergency Department Dashboard
            </h1>
            <p className="text-gray-600">Real-time patient flow monitoring and management</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-4 lg:mt-0">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm">
              <Clock className="h-5 w-5 text-blue-600" />
              <span className="font-mono text-lg font-semibold">
                {formatTime(currentTime)}
              </span>
            </div>
            
            <button
              onClick={refreshData}
              disabled={isLoading}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <Activity className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Refreshing...' : 'Refresh Data'}
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Patients</p>
                <p className="text-2xl font-bold text-gray-900">{totalPatients}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-yellow-500">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">Waiting</p>
                <p className="text-2xl font-bold text-gray-900">{totalWaiting}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-500">
            <div className="flex items-center gap-3">
              <Activity className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">In Treatment</p>
                <p className="text-2xl font-bold text-gray-900">{totalInTreatment}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-red-500">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">Critical (RED)</p>
                <p className="text-2xl font-bold text-gray-900">
                  {patientsData.red?.waitingQueue.length + patientsData.red?.treatmentQueue.length || 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Zones Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {zones.map((zone) => (
          <ZoneCard
            key={zone.id}
            zone={zone}
            data={patientsData[zone.id as keyof typeof patientsData]}
            isLoading={isLoading}
          />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;