import { AUTH_SX } from '@/theme';

export default async function AuthenticationGuardedLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div style={AUTH_SX.pageContainerWithTopSpacing}>{children}</div>;
}
