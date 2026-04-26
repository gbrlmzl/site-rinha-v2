import AppThemeProvider from '@/app/theme-provider';
import Navbar from '@/components/ResponsiveAppBar';

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
