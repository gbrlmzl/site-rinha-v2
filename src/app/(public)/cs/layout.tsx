import AppThemeProvider from '@/app/theme-provider';

export default function CsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <AppThemeProvider palette="cs">{children}</AppThemeProvider>;
}