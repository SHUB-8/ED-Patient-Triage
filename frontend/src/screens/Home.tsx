import React from "react";
import { useAuth } from "../context/AuthContext";
import Dashboard from "../components/Dashboard";

function Home() {
  const { logout } = useAuth();

  return (
    <div>
      <button onClick={logout}>Logout</button>
      <div className="min-h-screen bg-gray-50">
        <Dashboard />
      </div>
    </div>
  );
}

export default Home;
