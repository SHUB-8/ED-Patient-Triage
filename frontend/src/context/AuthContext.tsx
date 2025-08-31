/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";
import api from "../services/api";

interface AuthContextType {
  token: string | null;
  register: (
    name: string,
    email: string,
    password: string,
    hospital: string,
    type: string
  ) => void;
  login: (email: string, password: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setToken(token);
  }, []);

  const register = async (
    name: string,
    email: string,
    password: string,
    hospital: string,
    type: string
  ) => {
    console.log("Registering user:", { name, email, password, hospital, type });
    try {
      const response = await api.post("/signup", {
        name,
        email,
        password,
        hospital,
        type,
      });
      console.log(response.data);
      localStorage.setItem("token", response.data.token);
      setToken(response.data.token);
      alert("Registration successful");
    } catch (error) {
      console.error("Error in registration:", error);
      alert("Registration failed");
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post("/login", {
        email,
        password,
      });
      console.log(response.data);
      localStorage.setItem("token", response.data.token);
      setToken(response.data.token);
      alert("Login successful");
    } catch (error) {
      console.error("Error in login:", error);
      alert("Login failed");
    }
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ token, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
