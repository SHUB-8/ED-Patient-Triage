import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./screens/Login";
import Register from "./screens/Register";
import { useAuth } from "./context/AuthContext";
import Home from "./screens/Home";
import Dashboard from "./screens/DashBoard";
import AddPatient from "./screens/AddPatient";
import AddPatientCase from "./screens/AddPatientCase";
import PatientsList from "./screens/PatientsList";
import BedsManagement from "./screens/BedsManagement";
import DiseasesManagement from "./screens/DiseasesManagement";

const App = () => {
  const { token } = useAuth();

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={token ? <Home></Home> : <Navigate to={"/login"} />}
        />
        <Route
          path="/login"
          element={token ? <Navigate to="/" /> : <Login />}
        />
        <Route
          path="/register"
          element={token ? <Navigate to="/" /> : <Register />}
        />
        <Route
          path="/dashboard"
          element={token ? <Dashboard /> : <Navigate to="/" />}
        />
        <Route
          path="/add-patient"
          element={token ? <AddPatient /> : <Navigate to="/" />}
        />
        <Route
          path="/add-patient-case"
          element={token ? <AddPatientCase /> : <Navigate to="/" />}
        />
        <Route
          path="/patients"
          element={token ? <PatientsList /> : <Navigate to="/" />}
        />
        <Route
          path="/beds"
          element={token ? <BedsManagement /> : <Navigate to="/" />}
        />
        <Route
          path="/diseases"
          element={token ? <DiseasesManagement /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
};

export default App;
