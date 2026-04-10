"use client";
import { CssBaseline, ThemeProvider, createTheme, darkScrollbar } from "@mui/material";

import theme from "@/theme";

type AppThemeProviderProps = {
  children: React.ReactNode;
};

export default function AppThemeProvider({ children }: AppThemeProviderProps) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}