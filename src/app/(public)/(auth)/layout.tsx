// src/app/(autenticado)/layout.tsx
export default async function AuthenticationGuardedLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {


    return <>{children}</>;
}