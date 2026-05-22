import type { Metadata } from 'next';
import AppThemeProvider from '@/app/theme-provider';
import Navbar from '@/components/ResponsiveAppBar';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Início',
  description:
    'Confira os torneios e novidades da Rinha do Campus IV na UFPB.',
};


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
