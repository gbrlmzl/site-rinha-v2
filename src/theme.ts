import { Height } from '@mui/icons-material';
import { createTheme, darkScrollbar } from '@mui/material';

export const AUTH_PALETTE = {
  pageBackground: '#080d2e',
  cardBackground: '#ffffff',
  border: 'rgba(0, 0, 0, 0.12)',
  textPrimary: '#111827',
  textSecondary: '#6b7280',
  primary: '#1976d2',
  primaryHover: '#1565c0',
  success: '#2e7d32',
  error: '#d32f2f',
};

export const AUTH_SX = {
  pageContainer: {
    display: 'flex',
    justifyContent: 'center',
    //minHeight: '100vh',
    paddingInline: '1rem',
    backgroundColor: AUTH_PALETTE.pageBackground,
  },
  pageContainerWithTopSpacing: {
    display: 'flex',
    justifyContent: 'center',
    //minHeight: '50vh',
    paddingTop: '13vh',
    paddingInline: '1rem',
    backgroundColor: AUTH_PALETTE.pageBackground,
  },
  card: {
    width: { xs: '90vw', sm: '70vw', md: '50vw', lg: '40vw' },
    //maxWidth: 500,
    mx: 'auto',
    p: 3,
    paddingInline: { xs: '2rem', md: '4rem', lg: '8rem' },
    backgroundColor: AUTH_PALETTE.cardBackground,
  },
  wideCard: {
    width: '100%',
    maxWidth: 600,
    mx: 'auto',
    p: 3,
    paddingInline: { xs: '2rem', md: '4rem' },
    backgroundColor: AUTH_PALETTE.cardBackground,
  },
  title: {
    typography: 'h4',
    textAlign: 'center',
    fontWeight: 500,
    color: AUTH_PALETTE.textPrimary,
  },
  submitButton: {
    mt: 1,
    height: { xs: 35, sm: 38, md: 40 },
    backgroundColor: AUTH_PALETTE.primary,
    '&:hover': { backgroundColor: AUTH_PALETTE.primaryHover },
  },
  centeredLinks: {
    mt: 1,
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: 0.5,
  },
} as const;

export const AUTH_BUTTON_CLASSES = {
  primary: 'auth-btn-primary',
  secondary: 'auth-btn-secondary',
  ghost: 'auth-btn-ghost',
} as const;

const theme = createTheme({
  palette: {
    primary: {
      main: AUTH_PALETTE.primary,
      dark: AUTH_PALETTE.primaryHover,
    },
    success: {
      main: AUTH_PALETTE.success,
    },
    error: {
      main: AUTH_PALETTE.error,
    },
    background: {
      default: AUTH_PALETTE.pageBackground,
      paper: AUTH_PALETTE.cardBackground,
    },
    text: {
      primary: AUTH_PALETTE.textPrimary,
      secondary: AUTH_PALETTE.textSecondary,
    },
  },
  typography: {
    fontFamily: 'var(--font-roboto)',
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
          backgroundColor: AUTH_PALETTE.pageBackground,
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
    MuiButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          textTransform: 'none',
          borderRadius: 10,
          fontWeight: 600,
          fontSize: '1rem',
          '&.auth-btn-primary': {
            backgroundColor: AUTH_PALETTE.primary,
            color: '#fff',
            '&:hover': {
              backgroundColor: AUTH_PALETTE.primaryHover,
            },
            '&.Mui-disabled': {
              backgroundColor: '#d3d3d3',
              color: '#f5f5f5',
            },
          },
          '&.auth-btn-secondary': {
            borderColor: AUTH_PALETTE.primary,
            backgroundColor: 'transparent',
            color: AUTH_PALETTE.primary,
            '&:hover': {
              borderColor: AUTH_PALETTE.primaryHover,
              color: AUTH_PALETTE.primaryHover,
              backgroundColor: 'rgba(25, 118, 210, 0.06)',
            },
          },
          '&.auth-btn-ghost': {
            color: theme.palette.text.secondary,
            '&:hover': {
              color: theme.palette.text.primary,
              backgroundColor: 'transparent',
            },
          },
        }),
      },
    },
  },
});

export default theme;
