import AppThemeProvider from '@/app/theme-provider';

export default function ValorantLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <AppThemeProvider palette="valorant">{children}</AppThemeProvider>;
}