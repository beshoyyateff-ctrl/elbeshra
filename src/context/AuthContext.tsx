import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types.js';
import { api, getStoredToken, setStoredToken, removeStoredToken } from '../services/api.js';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAdmin: boolean;
  isManager: boolean;
  isAssistant: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  adminLogin: (identifier: string, password: string) => Promise<void>;
  quickAdminLogin: (password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  updateUserContext: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(getStoredToken());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    const currentToken = getStoredToken();
    if (!currentToken) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const me = await api.auth.getMe();
      setUser(me);
    } catch {
      removeStoredToken();
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (identifier: string, password: string) => {
    const res = await api.auth.login(identifier, password);
    setStoredToken(res.token);
    setToken(res.token);
    setUser(res.user);
  };

  const adminLogin = async (identifier: string, password: string) => {
    const res = await api.auth.adminLogin(identifier, password);
    setStoredToken(res.token);
    setToken(res.token);
    setUser(res.user);
  };

  const quickAdminLogin = async (password: string) => {
    const res = await api.auth.quickAdminLogin(password);
    setStoredToken(res.token);
    setToken(res.token);
    setUser(res.user);
  };

  const logout = () => {
    removeStoredToken();
    setToken(null);
    setUser(null);
  };

  const updateUserContext = (updated: User) => {
    setUser(updated);
  };

  const isAdmin = user?.role === 'manager' || user?.role === 'assistant';
  const isManager = user?.role === 'manager';
  const isAssistant = user?.role === 'assistant';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAdmin,
        isManager,
        isAssistant,
        login,
        adminLogin,
        quickAdminLogin,
        logout,
        refreshUser,
        updateUserContext,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
