import type { Metadata } from 'next';
import AppThemeProvider from '@/app/theme-provider';
import Navbar from '@/components/ResponsiveAppBar';

export const metadata: Metadata = {
  title: 'Valorant',
  description:
    'Torneios de Valorant da Rinha do Campus IV na UFPB. Inscreva-se e represente o seu time!',
  openGraph: {
    title: 'Valorant — Rinha do Campus IV',
    description:
      'Torneios de Valorant da Rinha do Campus IV na UFPB. Inscreva-se e represente o seu time!',
  },
};


export default function ValorantLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <AppThemeProvider palette="valorant">
      <Navbar gameRoute="valorant" />
      {children}
    </AppThemeProvider>
  );
}
