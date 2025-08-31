import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

function Home() {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Healthcare Triage System
          </h1>
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Dashboard Card */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-4 bg-blue-500">
              <h2 className="text-xl font-bold text-white">Dashboard</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                View real-time patient flow and priority queues across all
                triage zones.
              </p>
              <Link
                to="/dashboard"
                className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>

          {/* Patients Card */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-4 bg-green-500">
              <h2 className="text-xl font-bold text-white">Patients</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Manage patient records, add new patients, and view patient
                lists.
              </p>
              <div className="space-y-2">
                <Link
                  to="/add-patient"
                  className="block text-center bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                  Add Patient
                </Link>
                <Link
                  to="/patients"
                  className="block text-center bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                  View Patients
                </Link>
              </div>
            </div>
          </div>

          {/* Triage Card */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-4 bg-yellow-500">
              <h2 className="text-xl font-bold text-white">Triage</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Add new patient cases to the priority queue and manage triage
                workflows.
              </p>
              <Link
                to="/add-patient-case"
                className="inline-block bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
              >
                Add Patient Case
              </Link>
            </div>
          </div>

          {/* Beds Management Card */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-4 bg-purple-500">
              <h2 className="text-xl font-bold text-white">Beds Management</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Manage hospital beds, assign patients to beds, and track bed
                occupancy.
              </p>
              <Link
                to="/beds"
                className="inline-block bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
              >
                Manage Beds
              </Link>
            </div>
          </div>

          {/* Diseases Management Card */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-4 bg-indigo-500">
              <h2 className="text-xl font-bold text-white">Diseases</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Manage disease categories and their parameters for triage
                scoring.
              </p>
              <Link
                to="/diseases"
                className="inline-block bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
              >
                Manage Diseases
              </Link>
            </div>
          </div>

          {/* Reports Card */}
          {/* <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-4 bg-red-500">
              <h2 className="text-xl font-bold text-white">Reports</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                View system reports and analytics for patient flow and resource utilization.
              </p>
              <button
                disabled
                className="inline-block bg-gray-400 text-white font-bold py-2 px-4 rounded cursor-not-allowed"
              >
                Coming Soon
              </button>
            </div>
          </div> */}
        </div>
      </main>
    </div>
  );
}

export default Home;
