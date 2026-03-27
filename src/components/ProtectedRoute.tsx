'use client';

import { useAuth } from '@/hooks/authentication/useAuth';
import { redirect } from 'next/navigation';
import { useEffect, ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode; // componente opcional para exibir enquanto carrega
}

export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      redirect('/login');
    }
  }, [isLoading, isAuthenticated]);

  if (isLoading) {
    return fallback ?? <div>Carregando...</div>;
  }

  if (!isAuthenticated) {
    return null; // evita flash de conteúdo protegido antes do redirect
  }

  return <>{children}</>;
}