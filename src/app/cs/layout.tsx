import AppThemeProvider from '@/app/theme-provider';
import Navbar from '@/components/ResponsiveAppBar';

export default function CsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <AppThemeProvider palette="cs">
      <Navbar gameRoute="cs" />
      {children}
    </AppThemeProvider>
  );
}
