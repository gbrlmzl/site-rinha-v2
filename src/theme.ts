import { createTheme, darkScrollbar } from '@mui/material';
import { info } from 'console';
import { success } from 'zod';

export type AppPaletteName = 'neutral' | 'leagueOfLegends' | 'valorant' | 'cs';

export type AppPalette = {
  pageBackground: string;
  cardBackground: string;
  authPageBackground?: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
  primary: string;
  primaryHover: string;
  success: string;
  error: string;
};

export const APP_PALETTES: Record<AppPaletteName, AppPalette> = {
  neutral: {
    pageBackground: '#080d2e',
    cardBackground: '#ffffff',
    authPageBackground: '#08295a',
    border: 'rgba(0, 0, 0, 0.12)',
    textPrimary: '#111827',
    textSecondary: '#6b7280',
    primary: '#1976d2',
    primaryHover: '#145fb4',
    success: '#2e7d32',
    error: '#d32f2f',
  },
  leagueOfLegends: {
    pageBackground: '#080d2e',
    cardBackground: '#0E1241',
    //authPageBackground: '#080d2e',
    border: 'rgba(17, 181, 228, 0.18)',
    textPrimary: '#F5F8FF',
    textSecondary: 'rgba(245, 248, 255, 0.72)',
    primary: '#11B5E4',
    primaryHover: '#0E98C0',
    success: '#2e7d32',
    error: '#d32f2f',
  },
  valorant: {
    pageBackground: '#0D1117',
    cardBackground: '#E5E5E5',
    //authPageBackground: '#A62D37',
    border: 'rgba(255, 255, 255, 0.18)',
    textPrimary: '#111827',
    textSecondary: '#4b5563',
    primary: '#F34251',
    primaryHover: '#D93443',
    success: '#2e7d32',
    error: '#d32f2f',
  },
  cs: {
    pageBackground: '#0D1117',
    cardBackground: '#161B22',
    authPageBackground: '#0D1117',
    border: 'rgba(224, 127, 10, 0.18)',
    textPrimary: '#F5F7FA',
    textSecondary: 'rgba(245, 247, 250, 0.74)',
    primary: '#E07F0A',
    primaryHover: '#B86806',
    success: '#2e7d32',
    error: '#d32f2f',
  },
};

declare module '@mui/material/styles' {
  interface Theme {
    appPalette: AppPalette;
  }

  interface ThemeOptions {
    appPalette?: AppPalette;
  }
}

export const MAIN_PALETTE = APP_PALETTES.neutral;

export const AUTH_PALETTE = APP_PALETTES.neutral;

export const THEME_SECTIONS = {
  authenticatedProfile: {
    colors: {
      bg: '#080d2e',
      surface: '#0E1241',
      surfaceHigh: '#151a54',
      border: 'rgba(255,255,255,0.08)',
      accent: '#11B5E4',
      accentHover: '#0b80a0',
      danger: '#fc2c2c',
      dangerHover: '#fc2c2cbb',
      text: '#ffffff',
      textMuted: 'rgba(255,255,255,0.45)',
    },
    sx: {
      input: {
        '& .MuiOutlinedInput-root': {
          backgroundColor: '#151a54',
          borderRadius: 2,
          color: '#ffffff',
          '& fieldset': { borderColor: 'rgba(255,255,255,0.08)' },
          '&:hover fieldset': { borderColor: '#11B5E4' },
          '&.Mui-focused fieldset': {
            borderColor: '#11B5E4',
          },
        },
        '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.45)' },
        '& .MuiInputLabel-root.Mui-focused': {
          color: '#11B5E4',
        },
        '& .MuiFormHelperText-root': { color: '#fc2c2c' },
      },
      pageContainer: {
        minHeight: '100vh',
        backgroundColor: '#080d2e',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        px: 2,
      },
      card: {
        width: '100%',
        maxWidth: 480,
        backgroundColor: '#0E1241',
        borderRadius: 4,
        border: '1px solid rgba(255,255,255,0.08)',
        p: { xs: 3, md: 4 },
        position: 'relative',
        overflow: 'hidden',
      },
      primaryActionButton: {
        py: 1.4,
        backgroundColor: '#11B5E4',
        borderRadius: 3,
        borderColor: 'rgba(255,255,255,0.08)',
        color: '#ffffff',
        fontWeight: 600,
        height: { xs: 40, sm: 50, md: 50 },
        letterSpacing: 0.5,

        '&:hover': {
          //borderColor: '#11B5E4',
          backgroundColor: '#0b80a0',
        },
        '&:disabled': {
          borderColor: 'rgba(255,255,255,0.08)',
          color: 'rgba(255,255,255,0.45)',
          backgroundColor: 'transparent',
        },
        transition: 'all 0.2s',
      },
      dangerActionButton: {
        py: 1.4,
        height: { xs: 40, sm: 50, md: 50 },
        borderRadius: 3,
        borderColor: 'rgba(255,255,255,0.08)',
        color: '#ffffff',
        fontWeight: 600,
        letterSpacing: 0.5,
        backgroundColor: '#fc2c2c',
        '&:hover': {
          //borderColor: '#fc2c2c',
          backgroundColor: '#fc2c2cbb',
        },
        transition: 'all 0.2s',
      },
    },
  },
  teamRegistration: {
    colors: {
      bg: '#080d2e',
      surface: '#0E1241',
      surfaceHigh: '#151a54',
      border: 'rgba(255,255,255,0.08)',
      accent: '#11B5E4',
      accentHover: '#0b80a0',
      success: '#37963c',
      successHover: '#2e7d32',
      danger: '#ff6b6b',
      dangerHover: '#ff6b6bbb',
      text: '#ffffff',
      textMuted: 'rgba(255,255,255,0.45)',
    },
    sx: {
      input: {
        '& .MuiOutlinedInput-root': {
          backgroundColor: '#151a54',
          borderRadius: 2,
          color: '#ffffff',
          '& fieldset': { borderColor: 'rgba(255,255,255,0.08)' },
          '&:hover fieldset': { borderColor: '#11B5E4' },
          '&.Mui-focused fieldset': { borderColor: '#11B5E4' },
        },
        '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.45)' },
        '& .MuiInputLabel-root.Mui-focused': { color: '#11B5E4' },
        '& .MuiFormHelperText-root': { color: '#ff6b6b' },
      },
      expiredPaymentPageContainer: {
        width: '100%',
        minHeight: '100vh',
        px: 2,
        py: { xs: 3, md: 4 },
        display: 'flex',
        alignItems: { xs: 'center', md: 'flex-start' },
        justifyContent: 'center',
      },
      expiredPaymentCard: {
        mt: { xs: 0, md: '10vh' },
        width: '100%',
        maxWidth: { xs: '100%', md: '30vw', lg: '33vw' },
        boxShadow: 3,
        borderRadius: 3,
        overflow: 'hidden',
      },
    },
    
  },
} as const;

export const AUTHENTICATED_PROFILE_COLORS = THEME_SECTIONS.authenticatedProfile.colors;
export const AUTHENTICATED_PROFILE_SX = THEME_SECTIONS.authenticatedProfile.sx;

export const TEAM_REGISTRATION_COLORS = THEME_SECTIONS.teamRegistration.colors;
export const TEAM_REGISTRATION_SX = THEME_SECTIONS.teamRegistration.sx;

export const THEME_COLORS = AUTHENTICATED_PROFILE_COLORS;
export const inputSx = AUTHENTICATED_PROFILE_SX.input;

export const AUTH_SX = {
  pageContainer: {
    display: 'flex',
    justifyContent: 'center',
    minHeight: '100vh',
    paddingInline: '1rem',
    backgroundColor: AUTH_PALETTE.authPageBackground,
  },
  pageContainerWithTopSpacing: {
    display: 'flex',
    justifyContent: 'center',
    minHeight: '100vh',
    paddingTop: '13vh',
    paddingInline: '1rem',
    backgroundColor: AUTH_PALETTE.authPageBackground,
  },
  card: {
    width: { xs: '90vw', sm: '70vw', md: '50vw', lg: '40vw', xl: '30vw' },
    height: 'fit-content',
    mx: 'auto',
    p: 3,
    paddingInline: { xs: '2rem', md: '4rem', lg: '6rem' },
    backgroundColor: AUTH_PALETTE.cardBackground,
  },
  wideCard: {
    width: '100%',
    maxWidth: 600,
    mx: 'auto',
    p: 3,
    paddingInline: { xs: '2rem', md: '4rem', lg: '8rem' },
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

export function createAppTheme(paletteName: AppPaletteName = 'neutral') {
  const appPalette = APP_PALETTES[paletteName];

  return createTheme({
    appPalette,
    palette: {
      primary: {
        main: appPalette.primary,
        dark: appPalette.primaryHover,
      },
      success: {
        main: appPalette.success,
      },
      error: {
        main: appPalette.error,
      },
      background: {
        default: appPalette.pageBackground,
        paper: appPalette.cardBackground,
      },
      text: {
        primary: appPalette.textPrimary,
        secondary: appPalette.textSecondary,
      },
      divider: appPalette.border,
    },
    typography: {
      fontFamily: 'var(--font-roboto)',
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: (themeParam) => ({
          ':root': {
            '--background': themeParam.appPalette.pageBackground,
            '--foreground': themeParam.appPalette.textPrimary,
          },
          html: {
            scrollbarGutter: 'stable',
            colorScheme: 'dark',
            backgroundColor: themeParam.appPalette.pageBackground,
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
            backgroundColor: themeParam.appPalette.pageBackground,
          },
          'body[style*="padding-right"]': {
            paddingRight: '0px !important',
          },
          'header[style*="padding-right"]': {
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
            color: 'white',
            minHeight: 40,
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
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: APP_PALETTES[paletteName].cardBackground,
            borderRadius: 4
          },
        },
      },
    },
  });
}

const theme = createAppTheme();

export default theme;
