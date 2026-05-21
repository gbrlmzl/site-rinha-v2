import type { Metadata } from 'next';
import AppThemeProvider from '@/app/theme-provider';
import Navbar from '@/components/ResponsiveAppBar';

export const metadata: Metadata = {
  title: 'Counter-Strike 2',
  description:
    'Torneios de Counter-Strike 2 da Rinha do Campus IV na UFPB. Inscreva-se e represente o seu time!',
  openGraph: {
    title: 'CS2 — Rinha do Campus IV',
    description:
      'Torneios de Counter-Strike 2 da Rinha do Campus IV na UFPB. Inscreva-se e represente o seu time!',
  },
};


export default function CsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <AppThemeProvider palette="cs">
      <Navbar gameRoute="cs" />
      {children}
    </AppThemeProvider>
  );
}
