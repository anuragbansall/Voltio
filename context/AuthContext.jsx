import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../utils/api";
import {
  clearAuth,
  loadAuth,
  saveAuth,
  subscribeAuth,
} from "../utils/authStorage";
import { clearDevice } from "../utils/deviceStorage";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth from storage
  useEffect(() => {
    const initAuth = async () => {
      const { token, user } = await loadAuth();
      if (token && user) {
        setToken(token);
        setUser(user);
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }
      setIsLoading(false);
    };
    initAuth();

    const unsubscribe = subscribeAuth(({ token, user }) => {
      setToken(token);
      setUser(user);
    });

    return unsubscribe;
  }, []);

  // Handle login
  const login = async ({ email, password }) => {
    const response = await api.post("/auth/login", { email, password });
    const { token, user } = response.data;

    setToken(token);
    setUser(user);
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    await saveAuth(token, user);
    return user;
  };

  // Handle registration
  const register = async ({ username, email, password }) => {
    const response = await api.post("/auth/register", {
      username,
      email,
      password,
    });
    const { token, user } = response.data;

    setToken(token);
    setUser(user);
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    await saveAuth(token, user);
    return user;
  };

  // Handle logout
  const logout = async () => {
    setToken(null);
    setUser(null);
    delete api.defaults.headers.common["Authorization"];
    await clearAuth();
    await clearDevice();
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, register, logout, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easier consumption
export const useAuth = () => useContext(AuthContext);
