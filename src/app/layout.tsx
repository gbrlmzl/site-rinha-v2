import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import "./globals.css";
import Navbar from "../components/ResponsiveAppBar";
import AppThemeProvider from "./theme-provider";

import { AuthProvider } from '@/contexts/AuthContext';
import { isAuthenticated } from '@/utils/auth';

const hasToken = await isAuthenticated();

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "Rinha do Campus IV",
  description: "Site oficial da maior rinha da UFPB!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={roboto.variable}>
      <body>
        <AppRouterCacheProvider>
          <AppThemeProvider>
            <AuthProvider hasToken={hasToken}>
              <header>
                <Navbar></Navbar>
              </header>
              {children}
            </AuthProvider>
          </AppThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
