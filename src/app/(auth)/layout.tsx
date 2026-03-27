// src/app/(autenticado)/layout.tsx
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { existsJWT } from '@/utils/auth';
export default async function AuthenticationGuardedLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    const authenticated = await existsJWT();

    if (authenticated) {
        redirect('/');
    }

    return <>{children}</>;
}