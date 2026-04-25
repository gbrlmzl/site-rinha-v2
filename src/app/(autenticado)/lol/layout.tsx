import AppThemeProvider from '@/app/theme-provider';

export default function LolLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <AppThemeProvider palette="leagueOfLegends">{children}</AppThemeProvider>;
}