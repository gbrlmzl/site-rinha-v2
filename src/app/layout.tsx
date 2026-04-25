import type { Metadata } from 'next';
import { Roboto, Russo_One } from 'next/font/google';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import Navbar from '../components/ResponsiveAppBar';
import AppThemeProvider from './theme-provider';

import { AuthContextProvider } from '@/contexts/AuthContext';
import { SnackbarProvider } from '@/contexts/SnackbarContext';
import { ReactNode } from 'react';

//const hasToken = await isAuthenticated();

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  display: 'swap',
  variable: '--font-roboto',
});

const russoOne = Russo_One({
  subsets: ['latin'],
  weight: ['400'],
  display: 'swap',
  variable: '--font-russo-one',
});

export const metadata: Metadata = {
  title: 'Rinha da UFPB',
  description: 'Site oficial da maior rinha da UFPB!',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="pt-br" className={`${roboto.variable} ${russoOne.variable}`}>
      <body>
        <AppRouterCacheProvider>
          <AppThemeProvider>
            <AuthContextProvider>
              <SnackbarProvider>
                <Navbar></Navbar>
                <main>
                  {children}
                </main>
              </SnackbarProvider>
            </AuthContextProvider>
          </AppThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
