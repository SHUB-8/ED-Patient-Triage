import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import { PatientProvider } from "./context/PatientContext.tsx";
import "./App.css";

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <PatientProvider>
      <App />
    </PatientProvider>
  </AuthProvider>
);
