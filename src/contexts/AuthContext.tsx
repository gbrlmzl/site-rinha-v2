// src/contexts/AuthContext.tsx
'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { User } from '@/types/User';
import { getUser } from '@/services/authService';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // começa true para evitar flash de conteúdo

  const refreshUser = useCallback(async () => {
    setIsLoading(true);
    try {
      const userData = await getUser();
      setUser(userData);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch('http://localhost:8080/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } finally {
      setUser(null); // limpa o estado independente da resposta
    }
  }, []);

  // Busca o usuário UMA única vez ao montar a aplicação
  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated: !!user, refreshUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext deve ser usado dentro de <AuthProvider>');
  }
  return context;
}