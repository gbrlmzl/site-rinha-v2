"use client";
import { CssBaseline, ThemeProvider, createTheme, darkScrollbar } from "@mui/material";

const theme = createTheme({
    typography: {
        fontFamily: "var(--font-roboto)",
    },
    components: {
    MuiCssBaseline: {
      styleOverrides: (themeParam) => ({
        body: themeParam.palette.mode === 'dark' ? darkScrollbar() : null,
      }),
    },
  },
});

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