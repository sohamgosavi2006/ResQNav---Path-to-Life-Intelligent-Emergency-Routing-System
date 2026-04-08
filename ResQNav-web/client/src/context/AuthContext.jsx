import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('resqnav_token');
    const savedUser = localStorage.getItem('resqnav_user');

    if (savedToken && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setUserRole(parsedUser.role || 'commuter');
      } catch (err) {
        console.error('Failed to parse saved user:', err);
        localStorage.removeItem('resqnav_token');
        localStorage.removeItem('resqnav_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { email, password });
      const { token, user: userData } = res.data;
      
      localStorage.setItem('resqnav_token', token);
      localStorage.setItem('resqnav_user', JSON.stringify(userData));
      
      setUser(userData);
      setUserRole(userData.role);
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.error || 'Failed to login. Please check your credentials.' 
      };
    }
  };

  const register = async (email, password, name, role = 'commuter') => {
    try {
      const res = await axios.post(`${API_URL}/auth/register`, { 
        email, 
        password, 
        name, 
        role 
      });
      const { token, user: userData } = res.data;
      
      localStorage.setItem('resqnav_token', token);
      localStorage.setItem('resqnav_user', JSON.stringify(userData));
      
      setUser(userData);
      setUserRole(userData.role);
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.error || 'Failed to register account.' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('resqnav_token');
    localStorage.removeItem('resqnav_user');
    setUser(null);
    setUserRole(null);
  };

  const value = {
    user,
    userRole,
    loading,
    login,
    register,
    logout,
    setUserRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
