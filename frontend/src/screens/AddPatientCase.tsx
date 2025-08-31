import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { insertPatientCase } from "../services/priorityService";
import { fetchAllPatients } from "../services/patientService";
import type { PatientData } from "../types/patient";

const AddPatientCase = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<PatientData[]>([]);
  const [loading, setLoading] = useState(true);
  const [patientId, setPatientId] = useState("");
  const [news2, setNews2] = useState(0);
  const [si, setSi] = useState(1);
  const [resourceScore, setResourceScore] = useState(0);
  const [age, setAge] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all patients for the dropdown
  useEffect(() => {
    const loadPatients = async () => {
      try {
        setLoading(true);
        const data = await fetchAllPatients();
        setPatients(data);
        if (data.length > 0) {
          setPatientId(data[0].id);
          setAge(data[0].age);
        }
      } catch (err) {
        setError("Failed to load patients");
        console.error("Error loading patients:", err);
      } finally {
        setLoading(false);
      }
    };

    loadPatients();
  }, []);

  // Update age when patient changes
  useEffect(() => {
    if (patients.length > 0 && patientId) {
      const selectedPatient = patients.find(p => p.id === patientId);
      if (selectedPatient) {
        setAge(selectedPatient.age);
      }
    }
  }, [patientId, patients]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await insertPatientCase({
        id: patientId,
        NEWS2: news2,
        SI: si,
        resourceScore: resourceScore,
        age: age
      });
      
      alert("Patient case added successfully!");
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add patient case");
      console.error("Error adding patient case:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Add Patient Case
          </h1>
          <p className="text-gray-600">
            Add a new case to the triage priority queue
          </p>
        </div>

        {/* Add Patient Case Form Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            Case Information
          </h2>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="patient"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Patient
              </label>
              <select
                id="patient"
                name="patient"
                required
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-gray-50 focus:bg-white"
              >
                {patients.map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.name} (Age: {patient.age})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="news2"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  NEWS2 Score
                </label>
                <input
                  type="number"
                  id="news2"
                  name="news2"
                  required
                  min="0"
                  max="20"
                  value={news2}
                  onChange={(e) => setNews2(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-gray-50 focus:bg-white"
                  placeholder="Enter NEWS2 score (0-20)"
                />
              </div>

              <div>
                <label
                  htmlFor="si"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Severity Index (SI)
                </label>
                <select
                  id="si"
                  name="si"
                  required
                  value={si}
                  onChange={(e) => setSi(parseInt(e.target.value) || 1)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-gray-50 focus:bg-white"
                >
                  <option value="1">1 - Minor</option>
                  <option value="2">2 - Moderate</option>
                  <option value="3">3 - Severe</option>
                  <option value="4">4 - Critical</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="resourceScore"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Resource Score
                </label>
                <input
                  type="number"
                  id="resourceScore"
                  name="resourceScore"
                  required
                  min="0"
                  max="10"
                  value={resourceScore}
                  onChange={(e) => setResourceScore(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-gray-50 focus:bg-white"
                  placeholder="Enter resource score (0-10)"
                />
              </div>

              <div>
                <label
                  htmlFor="age"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Age
                </label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  required
                  min="0"
                  max="150"
                  value={age}
                  onChange={(e) => setAge(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-gray-50 focus:bg-white"
                  placeholder="Enter patient age"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-md hover:shadow-lg disabled:opacity-50"
              >
                {submitting ? "Adding Case..." : "Add Patient Case"}
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-gray-500">
            © 2025 Healthcare Triage System. Secure patient management.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AddPatientCase;