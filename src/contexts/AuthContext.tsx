import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  _id: string;
  email: string;
  name: string;
  college: string;
  major: string;
  year: string;
  avatar?: string;
  joinDate: string;
  verified: boolean;
  rating: number;
  totalSales: number;
  location: string;
  token: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  college: string;
  major: string;
  year: string;
  location: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('marketplace_user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      axios.defaults.headers.common['Authorization'] = `Bearer ${parsedUser.token}`;
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data } = await axios.post('http://localhost:5000/api/users/login', { email, password });
      if (data) {
        setUser(data);
        localStorage.setItem('marketplace_user', JSON.stringify(data));
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    try {
      const { data } = await axios.post('http://localhost:5000/api/users/register', userData);
      if (data) {
        setUser(data);
        localStorage.setItem('marketplace_user', JSON.stringify(data));
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        return true;
      }
      return false;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('marketplace_user');
    delete axios.defaults.headers.common['Authorization'];
  };

  const value = {
    user,
    login,
    register,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
