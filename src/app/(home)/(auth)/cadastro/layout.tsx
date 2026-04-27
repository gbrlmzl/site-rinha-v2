import { AUTH_TOKENS } from '@/theme';

export default function RegisterLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div style={AUTH_TOKENS.sx.pageContainer}>{children}</div>;
}
