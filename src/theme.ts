import { createTheme, darkScrollbar } from "@mui/material";

const theme = createTheme({
  typography: {
    fontFamily: "var(--font-roboto)",
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: (themeParam) => ({
        ':root': {
          '--background': '#0A122A',
          '--foreground': '#171717',
        },
        html: {
          scrollbarGutter: 'stable',
          colorScheme: 'dark',
          backgroundColor: '#0A122A',
        },
        body: {
          margin: 0,
          maxWidth: '100vw',
          overflowX: 'hidden',
          color: 'var(--foreground)',
          background: 'var(--background)',
          transition: 'background-color 0.2s ease, color 0.2s ease',
          ...(themeParam.palette.mode === 'dark' ? darkScrollbar() : {}),
        },
        '*': {
          boxSizing: 'border-box',
        },
        a: {
          textDecoration: 'none',
          color: 'inherit',
          transition: 'all 0.2s ease-in-out',
        },
        'a:hover': {
          textDecoration: 'underline',
          color: 'var(--mui-palette-primary-main, #1976d2)',
        },
        'body[style*="overflow: hidden"]': {
          backgroundColor: '#071022',
        },
        'body[style*="padding-right"]': {
          paddingRight: '0px !important',
        },
        '@media (prefers-color-scheme: dark)': {
          html: {
            colorScheme: 'dark',
          },
        },
      }),
    },
  },
});

export default theme;