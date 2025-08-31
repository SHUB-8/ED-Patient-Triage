import { useState, useEffect } from "react";
import { fetchAllBeds, createBed, assignPatientToBed, dischargePatientFromBed } from "../services/bedService";
import { fetchAllPatients } from "../services/patientService";
import { initSocket, onBedUpdate, offBedUpdate } from "../services/socketService";
import type { Bed } from "../types/bed";
import type { PatientData } from "../types/patient";

const BedsManagement = () => {
  const [beds, setBeds] = useState<Bed[]>([]);
  const [patients, setPatients] = useState<PatientData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showAssignForm, setShowAssignForm] = useState(false);
  const [selectedBed, setSelectedBed] = useState<Bed | null>(null);
  const [zone, setZone] = useState<"RED" | "ORANGE" | "YELLOW" | "GREEN">("RED");
  const [bedNumber, setBedNumber] = useState("");
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Fetch beds and patients
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [bedsData, patientsData] = await Promise.all([
          fetchAllBeds(),
          fetchAllPatients()
        ]);
        setBeds(bedsData);
        setPatients(patientsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    // Initialize socket connection
    initSocket();
    
    // Set up socket listener for bed updates
    onBedUpdate((data: any) => {
      console.log("Received bed update from socket:", data);
      // Refresh bed data when we receive an update
      fetchAllBeds().then(setBeds).catch(err => {
        setError(err instanceof Error ? err.message : "Failed to refresh bed data");
      });
    });
    
    loadData();

    // Cleanup socket listener on component unmount
    return () => {
      offBedUpdate(() => {});
    };
  }, []);

  const handleCreateBed = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const newBed = await createBed(zone, bedNumber);
      setBeds([...beds, newBed]);
      setShowCreateForm(false);
      setZone("RED");
      setBedNumber("");
      alert("Bed created successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create bed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAssignPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBed || !selectedPatientId) return;

    setSubmitting(true);
    setError(null);

    try {
      const updatedBed = await assignPatientToBed(selectedPatientId, selectedBed.id);
      setBeds(beds.map(bed => bed.id === updatedBed.id ? updatedBed : bed));
      setShowAssignForm(false);
      setSelectedBed(null);
      setSelectedPatientId("");
      alert("Patient assigned to bed successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to assign patient to bed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDischargePatient = async (bedId: string) => {
    try {
      const updatedBed = await dischargePatientFromBed(bedId);
      setBeds(beds.map(bed => bed.id === updatedBed.id ? updatedBed : bed));
      alert("Patient discharged from bed successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to discharge patient from bed");
    }
  };

  const getZoneColor = (zone: string) => {
    switch (zone) {
      case "RED": return "bg-red-100 text-red-800 border-red-300";
      case "ORANGE": return "bg-orange-100 text-orange-800 border-orange-300";
      case "YELLOW": return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "GREEN": return "bg-green-100 text-green-800 border-green-300";
      default: return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Beds Management</h1>
        <p className="text-gray-600 mb-6">Manage hospital beds and patient assignments</p>

        <div className="flex flex-wrap gap-4 mb-6">
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Create New Bed
          </button>
        </div>
      </div>

      {/* Create Bed Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Create New Bed</h2>
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleCreateBed}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="zone">
                  Zone
                </label>
                <select
                  id="zone"
                  value={zone}
                  onChange={(e) => setZone(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="RED">Red (Critical)</option>
                  <option value="ORANGE">Orange (Severe)</option>
                  <option value="YELLOW">Yellow (Moderate)</option>
                  <option value="GREEN">Green (Minor)</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="bedNumber">
                  Bed Number
                </label>
                <input
                  type="text"
                  id="bedNumber"
                  value={bedNumber}
                  onChange={(e) => setBedNumber(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter bed number"
                  required
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setError(null);
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                  disabled={submitting}
                >
                  {submitting ? "Creating..." : "Create Bed"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Patient Form Modal */}
      {showAssignForm && selectedBed && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Assign Patient to Bed</h2>
            <p className="text-gray-600 mb-4">Bed: {selectedBed.zone}-{selectedBed.bed_number}</p>
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleAssignPatient}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="patient">
                  Select Patient
                </label>
                <select
                  id="patient"
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a patient</option>
                  {patients.map(patient => (
                    <option key={patient.id} value={patient.id}>
                      {patient.name} (Age: {patient.age})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAssignForm(false);
                    setSelectedBed(null);
                    setError(null);
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                  disabled={submitting}
                >
                  {submitting ? "Assigning..." : "Assign Patient"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Beds Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {beds.map(bed => (
          <div key={bed.id} className="bg-white rounded-lg shadow-md border p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {bed.zone}-{bed.bed_number}
                </h3>
                <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold border ${getZoneColor(bed.zone)}`}>
                  {bed.zone} Zone
                </span>
              </div>
              <div className="text-right">
                <div className={`w-3 h-3 rounded-full ${bed.case_id ? 'bg-red-500' : 'bg-green-500'}`}></div>
                <span className="text-xs text-gray-500">
                  {bed.case_id ? 'Occupied' : 'Available'}
                </span>
              </div>
            </div>

            {bed.case_id ? (
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Occupied by:</span>
                  <span className="font-medium">
                    {patients.find(p => p.id === bed.patient_case?.patient_id)?.name || 'Unknown Patient'}
                  </span>
                </div>
                <button
                  onClick={() => handleDischargePatient(bed.id)}
                  className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md transition-colors"
                >
                  Discharge Patient
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setSelectedBed(bed);
                  setShowAssignForm(true);
                }}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md transition-colors"
              >
                Assign Patient
              </button>
            )}

            <div className="mt-4 text-xs text-gray-500">
              Created: {new Date(bed.created_at).toLocaleDateString()}
            </div>
          </div>
        ))}

        {beds.length === 0 && (
          <div className="col-span-full text-center py-12">
            <div className="text-gray-400 mb-4">No beds found</div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="text-blue-500 hover:text-blue-700 font-medium"
            >
              Create your first bed
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BedsManagement;