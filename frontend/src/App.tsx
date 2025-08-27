import React from 'react';
import Dashboard from './components/Dashboard';
import { PatientProvider } from './context/PatientContext';

function App() {
  return (
    <PatientProvider>
      <div className="min-h-screen bg-gray-50">
        <Dashboard />
      </div>
    </PatientProvider>
  );
}

export default App;