import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

interface User {
  username: string;
  email?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if we have a token (simple check, ideally verify token validity)
    const token = localStorage.getItem('access_token');
    const savedUser = localStorage.getItem('smash2026_user');
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('smash2026_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    try {
      setError(null);
      const response = await api.post('token/', { username, password }); // Django uses username by default
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);

      // Since simplejwt doesn't return user info, we store what we entered or fetch profile
      // For simplicity, assuming username is correct
      const userInfo = { username };
      setUser(userInfo);
      localStorage.setItem('smash2026_user', JSON.stringify(userInfo));
    } catch (err: any) {
      setError('Login failed. Check credentials.');
      console.error(err);
      throw err;
    }
  };

  const signup = async (username: string, email: string, password: string) => {
    try {
      setError(null);
      await api.post('register/', { username, email, password });
      // Auto login after signup? Or require explicit login. 
      // Let's auto login
      await login(username, password);
    } catch (err: any) {
      setError('Signup failed. Username might be taken.');
      console.error(err);
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('smash2026_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated: !!user, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
