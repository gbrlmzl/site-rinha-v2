// src/app/(autenticado)/layout.tsx
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { isAuthenticated } from '@/utils/auth';

export default async function AuthenticationGuardedLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    const authenticated = await isAuthenticated();

    if (!authenticated) {
        redirect('/login');
    }

    return <>{children}</>;
}