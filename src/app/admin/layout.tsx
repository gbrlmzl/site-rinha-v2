import { ReactNode } from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AdminShell from '@/components/admin/shell/AdminShell';
import { ReactQueryProvider } from '@/lib/queryClient';

interface AdminLayoutProps {
  children: ReactNode;
}

async function fetchAuthenticatedUserRole(): Promise<string | null> {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiBaseUrl) return null;

  const cookieHeader = (await cookies()).toString();
  if (!cookieHeader) return null;

  try {
    const response = await fetch(`${apiBaseUrl}/auth/me`, {
      method: 'GET',
      headers: { cookie: cookieHeader },
      cache: 'no-store',
    });

    if (!response.ok) return null;

    const data = await response.json();
    return typeof data?.role === 'string' ? data.role : null;
  } catch {
    return null;
  }
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const role = await fetchAuthenticatedUserRole();

  if (role !== 'ADMIN') {
    redirect('/inicio');
  }

  return (
    <ReactQueryProvider>
      <AdminShell>{children}</AdminShell>
    </ReactQueryProvider>
  );
}
