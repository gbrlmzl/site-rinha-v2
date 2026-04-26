import { AUTH_SX } from '@/theme';

export default function RegisterLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div style={AUTH_SX.pageContainer}>{children}</div>;
}
