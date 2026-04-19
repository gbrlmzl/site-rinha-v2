// src/contexts/AuthContext.tsx
'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { User } from '@/types/User';
import { getUser } from '@/services/authService';
import { isAuthenticated } from '@/utils/auth';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
  //hasToken: boolean; // vem do servidor — sem tocar no cookie no cliente
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthContextProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  // Se não há token, já inicia como false — sem loading desnecessário
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const refreshUser = useCallback(async () => {
    //useCalback para evitar recriar a função desnecessariamente
    setIsLoading(true);

    try {
      const hasToken = await isAuthenticated();
      if (!hasToken) {
        setUser(null);
        return;
      }
      const userData = await getUser();
      setUser(userData);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = async () => {
    try {
      await fetch('http://localhost:8080/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } finally {
      setUser(null);
    }
  };

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  return (
    <AuthContext.Provider
      value={{ user, isLoading, isAuthenticated: !!user, refreshUser, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(
      'useAuthContext deve ser usado dentro de <AuthContextProvider>'
    );
  }
  return context;
}
