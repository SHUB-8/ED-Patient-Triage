import { useState, useEffect } from "react";
import { Search, UserPlus, Edit, Activity } from "lucide-react";
import { fetchAllPatients, searchPatients } from "../services/patientService";
import { useNavigate } from "react-router-dom";
import type { PatientData } from "../types/patient";

const PatientsList = () => {
  const [patients, setPatients] = useState<PatientData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Filter patients based on search term
  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm) ||
      (patient.email && patient.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Fetch patients from API
  useEffect(() => {
    const loadPatients = async () => {
      try {
        setLoading(true);
        const data = await fetchAllPatients();
        setPatients(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    loadPatients();
  }, []);

  // Handle search
  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    if (term.length > 2) {
      try {
        const results = await searchPatients(term);
        setPatients(results);
      } catch (err) {
        console.error("Search error:", err);
      }
    } else if (term.length === 0) {
      // Reload all patients when search is cleared
      try {
        const data = await fetchAllPatients();
        setPatients(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      }
    }
  };

  const handleAdmit = (patientId: string) => {
    // Navigate to add patient case form
    navigate(`/add-patient-case?patientId=${patientId}`);
  };

  const handleEdit = (patientId: string) => {
    // Navigate to edit form
    console.log("Editing patient:", patientId);
    // TODO: Implement edit functionality
  };

  const handleViewMedicalHistory = (patientId: string) => {
    // Implement view medical history logic
    console.log("Viewing medical history for patient:", patientId);
    // TODO: Implement medical history view
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
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500 text-lg">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Patients List</h1>

        {/* Search Bar */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by name, phone, or email..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        {/* Add New Patient Button */}
        <div className="mb-6">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
            onClick={() => navigate("/add-patient")}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add New Patient
          </button>
        </div>
      </div>

      {/* Patients Table */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Age
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Gender
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPatients.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  No patients found
                </td>
              </tr>
            ) : (
              filteredPatients.map((patient) => (
                <tr key={patient.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {patient.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{patient.age}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {patient.gender}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{patient.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{patient.email || "N/A"}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleAdmit(patient.id)}
                        className="bg-green-500 hover:bg-green-700 text-white px-3 py-1 rounded text-xs flex items-center"
                      >
                        <Activity className="h-3 w-3 mr-1" />
                        Admit
                      </button>
                      <button
                        onClick={() => handleEdit(patient.id)}
                        className="bg-blue-500 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs flex items-center"
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleViewMedicalHistory(patient.id)}
                        className="bg-purple-500 hover:bg-purple-700 text-white px-3 py-1 rounded text-xs"
                      >
                        History
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Results Summary */}
      <div className="mt-4 text-sm text-gray-600">
        Showing {filteredPatients.length} of {patients.length} patients
      </div>
    </div>
  );
};

export default PatientsList;
