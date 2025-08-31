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
      </Routes>
    </Router>
  );
};

export default App;
