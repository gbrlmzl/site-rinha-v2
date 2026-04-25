'use client';
import {
  CssBaseline,
  ThemeProvider,
} from '@mui/material';
import { useMemo } from 'react';

import { AppPaletteName, createAppTheme } from '@/theme';

type AppThemeProviderProps = {
  children: React.ReactNode;
  palette?: AppPaletteName;
};

export default function AppThemeProvider({
  children,
  palette = 'neutral',
}: AppThemeProviderProps) {
  const theme = useMemo(() => createAppTheme(palette), [palette]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
