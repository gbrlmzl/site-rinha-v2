import type { Metadata } from 'next';
import AppThemeProvider from '@/app/theme-provider';
import Navbar from '@/components/ResponsiveAppBar';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'League of Legends',
  description:
    'Torneios de League of Legends da Rinha do Campus IV. Inscreva-se e represente o seu time!',
  openGraph: {
    title: 'LoL — Rinha do Campus IV',
    description:
      'Torneios de League of Legends da Rinha do Campus IV. Inscreva-se e represente o seu time!',
  },
};


export default function LolLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <AppThemeProvider palette="leagueOfLegends">
      <Navbar gameRoute="lol" />
      {children}
    </AppThemeProvider>
  );
}
