import AppThemeProvider from '@/app/theme-provider';
import Navbar from '@/components/ResponsiveAppBar';
import { ReactNode } from 'react';

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
