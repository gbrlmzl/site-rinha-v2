// src/components/AuthInitializer.tsx
import { cookies } from 'next/headers';
import { AuthProvider } from '@/contexts/AuthContext';
import { ReactNode } from 'react';

export async function AuthInitializer({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const hasToken  = !!cookieStore.get('JWT');

  return (
    <AuthProvider hasToken={hasToken}>
      {children}
    </AuthProvider>
  );
}