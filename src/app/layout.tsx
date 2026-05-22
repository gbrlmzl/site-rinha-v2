import type { Metadata } from 'next';
import { Roboto, Russo_One } from 'next/font/google';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import AppThemeProvider from './theme-provider';

import { AuthContextProvider } from '@/contexts/AuthContext';
import { SnackbarProvider } from '@/contexts/SnackbarContext';
import { ReactNode } from 'react';

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
  metadataBase: new URL('https://rinhacampusiv.org'),
  title: {
    default: 'Rinha do Campus IV',
    template: '%s | Rinha do Campus IV',
  },
  description:
    'Site oficial da Rinha do Campus IV — torneios de League of Legends, CS2 e Valorant.',
  keywords: [
    'rinha',
    'campus iv',
    'UFPB',
    'esports',
    'League of Legends',
    'CS2',
    'Valorant',
    'torneio universitário',
  ],
  authors: [{ name: 'Rinha do Campus IV', url: 'https://rinhacampusiv.org' }],
  creator: 'Rinha do Campus IV',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://rinhacampusiv.org',
    siteName: 'Rinha do Campus IV',
    title: 'Rinha do Campus IV',
    description:
      'Site oficial da Rinha do Campus IV — torneios de League of Legends, CS2 e Valorant.',
    images: [
      {
        url: '/logoPng.png',
        alt: 'Logo da Rinha do Campus IV',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rinha do Campus IV',
    description:
      'Site oficial da Rinha do Campus IV — torneios de League of Legends, CS2 e Valorant.',
    images: ['/logoPng.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/logoPng.png',
  },
  manifest: '/site.webmanifest',
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
                {children}
              </SnackbarProvider>
            </AuthContextProvider>
          </AppThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
