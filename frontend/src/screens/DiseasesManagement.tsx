import { useState, useEffect } from "react";
import { fetchAllDiseases, createDisease, updateDisease } from "../services/diseaseService";
import type { Disease } from "../types/disease";

const DiseasesManagement = () => {
  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingDisease, setEditingDisease] = useState<Disease | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [treatmentTime, setTreatmentTime] = useState(0);
  const [maxWaitTime, setMaxWaitTime] = useState(0);
  const [severity, setSeverity] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  // Fetch diseases
  useEffect(() => {
    const loadDiseases = async () => {
      try {
        setLoading(true);
        const data = await fetchAllDiseases();
        setDiseases(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load diseases");
      } finally {
        setLoading(false);
      }
    };

    loadDiseases();
  }, []);

  const resetForm = () => {
    setName("");
    setDescription("");
    setTreatmentTime(0);
    setMaxWaitTime(0);
    setSeverity(1);
    setEditingDisease(null);
    setError(null);
  };

  const handleCreateOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      if (editingDisease) {
        // Update existing disease
        const updatedDisease = await updateDisease({
          id: editingDisease.id,
          name,
          description,
          treatment_time: treatmentTime,
          max_wait_time: maxWaitTime,
          severity
        });
        
        setDiseases(diseases.map(d => d.id === updatedDisease.id ? updatedDisease : d));
        alert("Disease updated successfully!");
      } else {
        // Create new disease
        const newDisease = await createDisease({
          name,
          description,
          treatment_time: treatmentTime,
          max_wait_time: maxWaitTime,
          severity
        });
        
        setDiseases([...diseases, newDisease]);
        alert("Disease created successfully!");
      }
      
      setShowForm(false);
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save disease");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (disease: Disease) => {
    setEditingDisease(disease);
    setName(disease.name);
    setDescription(disease.description);
    setTreatmentTime(disease.treatment_time);
    setMaxWaitTime(disease.max_wait_time);
    setSeverity(disease.severity);
    setShowForm(true);
  };

  const getSeverityColor = (severity: number) => {
    if (severity >= 4) return "bg-red-100 text-red-800";
    if (severity >= 3) return "bg-orange-100 text-orange-800";
    if (severity >= 2) return "bg-yellow-100 text-yellow-800";
    return "bg-green-100 text-green-800";
  };

  const getSeverityText = (severity: number) => {
    if (severity === 1) return "Minor";
    if (severity === 2) return "Moderate";
    if (severity === 3) return "Severe";
    if (severity === 4) return "Critical";
    return "Unknown";
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
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Diseases Management</h1>
        <p className="text-gray-600 mb-6">Manage disease categories and their parameters</p>

        <div className="flex flex-wrap gap-4 mb-6">
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Add New Disease
          </button>
        </div>
      </div>

      {/* Disease Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl">
            <h2 className="text-2xl font-bold mb-4">
              {editingDisease ? "Edit Disease" : "Add New Disease"}
            </h2>
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleCreateOrUpdate}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                    Disease Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter disease name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="severity">
                    Severity Level
                  </label>
                  <select
                    id="severity"
                    value={severity}
                    onChange={(e) => setSeverity(parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="1">1 - Minor</option>
                    <option value="2">2 - Moderate</option>
                    <option value="3">3 - Severe</option>
                    <option value="4">4 - Critical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="treatmentTime">
                    Treatment Time (minutes)
                  </label>
                  <input
                    type="number"
                    id="treatmentTime"
                    value={treatmentTime}
                    onChange={(e) => setTreatmentTime(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter treatment time"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="maxWaitTime">
                    Max Wait Time (minutes)
                  </label>
                  <input
                    type="number"
                    id="maxWaitTime"
                    value={maxWaitTime}
                    onChange={(e) => setMaxWaitTime(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter max wait time"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter disease description"
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
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
                  {submitting ? "Saving..." : (editingDisease ? "Update Disease" : "Create Disease")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Diseases Table */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Disease Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Severity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Treatment Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Max Wait Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {diseases.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  No diseases found
                </td>
              </tr>
            ) : (
              diseases.map((disease) => (
                <tr key={disease.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{disease.name}</div>
                    {disease.description && (
                      <div className="text-sm text-gray-500 mt-1">{disease.description}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getSeverityColor(disease.severity)}`}>
                      {getSeverityText(disease.severity)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {disease.treatment_time} minutes
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {disease.max_wait_time} minutes
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(disease)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DiseasesManagement;