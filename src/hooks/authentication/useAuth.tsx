// src/hooks/useAuth.ts
import { useAuthContext } from '@/contexts/AuthContext';

export function useAuth() {
  const { user, isLoading, isAuthenticated, refreshUser, logout } = useAuthContext();

  return {
    user,
    isLoading,
    isAuthenticated,
    refreshUser,
    logout,
  };
}