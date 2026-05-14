import AppThemeProvider from '@/app/theme-provider';
import Navbar from '@/components/ResponsiveAppBar';
import { ReactNode } from 'react';

export default function HomeLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <AppThemeProvider palette="neutral">
      <Navbar gameRoute="inicio"/>
        {children}
    </AppThemeProvider>
  );
}
