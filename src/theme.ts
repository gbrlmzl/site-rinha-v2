import { createTheme, darkScrollbar, responsiveFontSizes } from '@mui/material';
import { size } from 'zod';

// ─────────────────────────────────────────────────────────────────────────────
// Tipos
// ─────────────────────────────────────────────────────────────────────────────

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

declare module '@mui/material/styles' {
  interface Theme {
    appPalette: AppPalette;
  }
  interface ThemeOptions {
    appPalette?: AppPalette;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Paletas de cores brutas (design tokens primitivos)
// ─────────────────────────────────────────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────────────────────────
// Tokens de fonte
// Cada variável CSS deve ser registrada no RootLayout via next/font/google.
// ─────────────────────────────────────────────────────────────────────────────

export const FONT = {
  /** Fonte padrão de textos e UI */
  roboto: 'var(--font-roboto)',
  /** Títulos principais das seções LoL */
  russoOne: 'var(--font-russo-one)',
  /**
   * Fonte de botões — adicione no RootLayout:
   *   const robotoCondensed = Roboto_Condensed({
   *     subsets: ['latin'], weight: ['400','700'], variable: '--font-roboto-condensed'
   *   })
   */
  robotoCondensed: 'var(--font-roboto-condensed)',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Tokens semânticos globais
// ─────────────────────────────────────────────────────────────────────────────

export const GLOBAL_TOKENS = {
  bg: '#080d2e',
  surface: '#0E1241',
  surfaceHigh: '#151a54',
  border: 'rgba(255,255,255,0.08)',
  accent: '#11B5E4',
  accentHover: '#0b80a0',
  danger: '#fc2c2c',
  dangerHover: 'rgba(252, 44, 44, 0.73)',
  success: '#37963c',
  successHover: '#2e7d32',
  text: '#ffffff',
  textMuted: 'rgba(255,255,255,0.45)',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Helpers de sx reutilizáveis
// ─────────────────────────────────────────────────────────────────────────────

const { accent, accentHover, border, surface, surfaceHigh, text, textMuted } =
  GLOBAL_TOKENS;

export const INPUT_SX = {
  '& .MuiOutlinedInput-root': {
    backgroundColor: surfaceHigh,
    borderRadius: 1.5,
    color: text,
    '& fieldset': { borderColor: border },
    '&:hover fieldset': { borderColor: accent },
    '&.Mui-focused fieldset': { borderColor: accent },
  },
  '& .MuiInputLabel-root': { color: textMuted },
  '& .MuiInputLabel-root.Mui-focused': { color: accent },
  '& .MuiFormHelperText-root': { color: GLOBAL_TOKENS.danger },
} as const;

export const SURFACE_CARD_SX = {
  backgroundColor: surface,
  borderRadius: 2,
  border: `1px solid ${border}`,
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Tokens de componente — Auth
// ─────────────────────────────────────────────────────────────────────────────

export const AUTH_TOKENS = (() => {
  const palette = APP_PALETTES.neutral;
  return {
    colors: {
      bg: palette.authPageBackground ?? palette.pageBackground,
      card: palette.cardBackground,
      text: palette.textPrimary,
      textMuted: palette.textSecondary,
      primary: palette.primary,
      primaryHover: palette.primaryHover,
    },
    sx: {
      pageContainer: {
        display: 'flex',
        justifyContent: 'center',
        minHeight: '100vh',
        paddingInline: '1rem',
        backgroundColor: palette.authPageBackground,
      },
      pageContainerWithTopSpacing: {
        display: 'flex',
        justifyContent: 'center',
        minHeight: '100vh',
        paddingTop: '13vh',
        paddingInline: '1rem',
        backgroundColor: palette.authPageBackground,
      },
      card: {
        width: { xs: '90vw', sm: '70vw', md: '50vw', lg: '40vw', xl: '30vw' },
        height: 'fit-content',
        mx: 'auto',
        p: 3,
        paddingInline: { xs: '2rem', md: '4rem', lg: '6rem' },
        backgroundColor: palette.cardBackground,
      },
      wideCard: {
        width: { xs: '90vw', sm: '70vw', md: '50vw', lg: '40vw' },
        height: 'fit-content',
        mx: 'auto',
        p: 3,
        paddingInline: { xs: '2rem', md: '4rem', lg: '8rem' },
        backgroundColor: palette.cardBackground,
      },
      title: {
        typography: 'h4',
        textAlign: 'center',
        fontWeight: 500,
        color: palette.textPrimary,
      },
      submitButton: {
        mt: 1,
        height: { xs: 35, sm: 38, md: 40 },
        backgroundColor: palette.primary,
        '&:hover': { backgroundColor: palette.primaryHover },
      },
      centeredLinks: {
        mt: 1,
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        gap: 0.5,
      },
    },
  } as const;
})();

// ─────────────────────────────────────────────────────────────────────────────
// Tokens de componente — Perfil autenticado
// ─────────────────────────────────────────────────────────────────────────────

export const AUTHENTICATED_PROFILE_TOKENS = {
  colors: GLOBAL_TOKENS,
  sx: {
    input: INPUT_SX,
    pageContainer: {
      minHeight: '100vh',
      backgroundColor: GLOBAL_TOKENS.bg,
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      px: 2,
    },
    card: {
      width: '100%',
      maxWidth: 480,
      ...SURFACE_CARD_SX,
      borderRadius: 4,
      p: { xs: 3, md: 4 },
      position: 'relative',
      overflow: 'hidden',
    },
    primaryActionButton: {
      py: 1.4,
      backgroundColor: accent,
      borderRadius: 3,
      borderColor: border,
      color: text,
      fontWeight: 600,
      height: { xs: 40, sm: 50, md: 50 },
      letterSpacing: 0.5,
      '&:hover': { backgroundColor: accentHover },
      '&:disabled': {
        borderColor: border,
        color: textMuted,
        backgroundColor: 'transparent',
      },
      transition: 'all 0.2s',
    },
    dangerActionButton: {
      py: 1.4,
      height: { xs: 40, sm: 50, md: 50 },
      borderRadius: 3,
      borderColor: border,
      color: text,
      fontWeight: 600,
      letterSpacing: 0.5,
      backgroundColor: GLOBAL_TOKENS.danger,
      '&:hover': { backgroundColor: GLOBAL_TOKENS.dangerHover },
      transition: 'all 0.2s',
    },
  },
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Tokens de componente — Cadastro de equipe
// ─────────────────────────────────────────────────────────────────────────────

export const TEAM_REGISTRATION_TOKENS = {
  colors: GLOBAL_TOKENS,
  sx: {
    input: INPUT_SX,
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
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Tokens de componente — Formulário de jogador
// ─────────────────────────────────────────────────────────────────────────────

export const PLAYER_FORM_TOKENS = {
  colors: GLOBAL_TOKENS,
  sx: {
    formContainer: { p: 2, ...SURFACE_CARD_SX },
    input: INPUT_SX,
    schoolIdRow: {
      width: '100%',
      display: 'flex',
      alignItems: 'flex-start',
      gap: 1.5,
      flexDirection: { xs: 'column', md: 'row' },
    },
    schoolIdField: { width: { xs: '100%', md: '66%' } },
    externalCheckboxWrapper: {
      width: { xs: '100%', md: '34%' },
      minHeight: 56,
      display: 'flex',
      alignItems: 'center',
      justifyContent: { xs: 'flex-start', md: 'flex-end' },
    },
    positionRow: { width: '100%', display: 'flex', justifyContent: 'center' },
    checkbox: {
      color: '#d0d3d3',
      '&.Mui-checked': { color: 'primary.main' },
    },
    stepContainer: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    stepStack: { width: '100%', maxWidth: 600, p: { xs: 2, md: 3 } },
    stepTitleRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 2,
      flexDirection: { xs: 'column', md: 'row' },
    },
    stepTitle: {
      color: accent,
      fontWeight: 700,
      textAlign: 'center',
      fontSize: '1.4rem',
    },
    positionTriggerButton: {
      backgroundColor: surfaceHigh,
      borderRadius: '50%',
      padding: '10px',
      border: `2px solid ${border}`,
      transition: 'all 0.2s',
      '&:hover:not(:disabled)': {
        backgroundColor: accent,
        borderColor: accent,
      },
      '&:disabled': { opacity: 0.5 },
    },
    positionMenuPaper: {
      backgroundColor: surface,
      border: `1px solid ${border}`,
      borderRadius: 2,
      overflow: 'hidden',
    },
    positionMenuItem: (isSelected: boolean) => ({
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: 60,
      height: 60,
      padding: '8px !important',
      borderRadius: 2,
      backgroundColor: isSelected ? accent : 'transparent',
      border: `2px solid ${isSelected ? accent : border}`,
      cursor: 'pointer',
      transition: 'all 0.2s',
      '&.Mui-focusVisible': { outline: `2px solid ${text}`, outlineOffset: 2 },
      '&:hover': { backgroundColor: accent, borderColor: accent },
    }),
  },
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Tokens de componente — LoL Home Page
//
// Tipografia:
//   Títulos principais → Russo One        (var(--font-russo-one))
//   Textos secundários → Roboto           (var(--font-roboto))
//   Botões             → Roboto Condensed (var(--font-roboto-condensed))
// ─────────────────────────────────────────────────────────────────────────────

const LOL = APP_PALETTES.leagueOfLegends;

export const LOL_HOME_TOKENS = {
  colors: {
    ...GLOBAL_TOKENS,
    primary: LOL.primary,
    primaryHover: LOL.primaryHover,
    /** Usado em datas e palavras de destaque inline */
    highlight: '#00e5ff',
  },

  /**
   * Objetos de tipografia prontos para usar como prop `sx` em <Typography>.
   * Não são sx completos — combinam com outras props conforme necessário.
   */
  typography: {
    /** Título principal da seção (ex: "A SEGUNDA EDIÇÃO VEM AÍ!") */
    heroTitle: {
      fontFamily: FONT.russoOne,
      fontWeight: 400, // Russo One só tem weight regular
      color: '#ffffff',
      lineHeight: 1.15,
      letterSpacing: '0.02em',
    },
    /** Subtítulo / lead */
    subtitle: {
      fontFamily: FONT.roboto,
      fontWeight: 400,
      color: '#ffffff',
    },
    /** Corpo de texto padrão */
    body: {
      fontFamily: FONT.roboto,
      color: '#ffffff',
    },
    /** Textos de apoio com menor destaque */
    caption: {
      fontFamily: FONT.roboto,
      color: 'rgba(255,255,255,0.65)',
    },
    /** Palavra/frase de destaque inline (datas, nomes, etc.) */
    highlight: {
      fontFamily: FONT.roboto,
      fontWeight: 700,
      color: '#00e5ff',
    },
  },

  sx: {
    /** Wrapper externo da seção — ocupa o viewport inteiro */
    heroSection: {
      position: 'relative',
      width: '100vw',
      height: { xs: '100dvh', md: '100vh' },
      overflowX: 'hidden',
      overflowY: { xs: 'hidden', md: 'visible' },
    },

    /**
     * Overlay de conteúdo sobre a imagem.
     * O mesmo Box usa display responsivo para cobrir os dois breakpoints —
     * elimina a duplicação mobile/desktop do componente original.
     */
    heroContent: {
      position: 'absolute',
      top: 0,
      left: 0,
      // Desktop: ocupa metade da tela; mobile: largura total
      width: { xs: '100vw', md: '55vw', lg: '50vw' },
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      // Desktop: alinha à esquerda; mobile: centraliza
      alignItems: { xs: 'center', md: 'flex-start' },
      justifyContent: 'flex-start',
      pt: { xs: 14, sm: 16, md: 12, lg: 16, xl: 18 },
      px: { xs: 3, sm: 5, md: 6, lg: 8 },
      color: 'white',
      textAlign: { xs: 'center', md: 'left' },
    },

    /** Bloco de regras (bullet points) */
    rulesList: {
      display: 'flex',
      flexDirection: 'column',
      textAlign: 'left',
      gap: 0.5,
    },

    /** Botão CTA principal */
    ctaButton: {
      borderRadius: 5,
      mt: { xs: 2, md: 0 },
      px: { xs: 4, md: 5 },
      py: { xs: 1, md: 1.25 },
      fontSize: { xs: '1rem', md: '1.2rem' },
      fontFamily: FONT.robotoCondensed,
      fontWeight: 700,
      letterSpacing: '0.06em',
      backgroundColor: LOL.primary,
      color: '#ffffff',
      textTransform: 'uppercase',
      '&:hover': {
        backgroundColor: LOL.primaryHover,
        color: '#ffffff',
      },
    },
  },
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Aliases de retrocompatibilidade
// ─────────────────────────────────────────────────────────────────────────────

/** @deprecated Use AUTHENTICATED_PROFILE_TOKENS.colors */
export const THEME_COLORS = AUTHENTICATED_PROFILE_TOKENS.colors;
/** @deprecated Use INPUT_SX */
export const inputSx = INPUT_SX;
/** @deprecated Use AUTH_TOKENS.sx */
export const AUTH_SX = AUTH_TOKENS.sx;

export const AUTH_BUTTON_CLASSES = {
  primary: 'auth-btn-primary',
  secondary: 'auth-btn-secondary',
  ghost: 'auth-btn-ghost',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Criação do tema MUI
// ─────────────────────────────────────────────────────────────────────────────

export function createAppTheme(paletteName: AppPaletteName = 'neutral') {
  const appPalette = APP_PALETTES[paletteName];

  return createTheme({
    appPalette,
    palette: {
      primary: { main: appPalette.primary, dark: appPalette.primaryHover },
      success: { main: appPalette.success },
      error: { main: appPalette.error },
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
      fontFamily: FONT.roboto,
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
          '*': { boxSizing: 'border-box' },
          a: {
            textDecoration: 'none',
            color: 'inherit',
            transition: 'all 0.2s ease-in-out',
          },
          'a:hover': {
            textDecoration: 'none',
          },
          'body[style*="overflow: hidden"]': {
            backgroundColor: themeParam.appPalette.pageBackground,
          },
          'body[style*="padding-right"]': { paddingRight: '0px !important' },
          'header[style*="padding-right"]': { paddingRight: '0px !important' },
          '@media (prefers-color-scheme: dark)': {
            html: { colorScheme: 'dark' },
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
            paddingInline: 20,
            '&.auth-btn-primary': {
              backgroundColor: AUTH_TOKENS.colors.primary,
              color: '#fff',
              '&:hover': { backgroundColor: AUTH_TOKENS.colors.primaryHover },
              '&.Mui-disabled': {
                backgroundColor: '#d3d3d3',
                color: '#f5f5f5',
              },
            },
            '&.auth-btn-secondary': {
              borderColor: AUTH_TOKENS.colors.primary,
              backgroundColor: 'transparent',
              color: AUTH_TOKENS.colors.primary,
              '&:hover': {
                borderColor: AUTH_TOKENS.colors.primaryHover,
                color: AUTH_TOKENS.colors.primaryHover,
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
            borderRadius: 4,
          },
        },
      },
      MuiTypography: {
        styleOverrides: {
          root: ({ theme }) => ({
            '&.auth-primary-title': {
              ...theme.typography.h4,
              fontWeight: 700,
              color: AUTH_TOKENS.colors.text,
            },
            '&.auth-secondary-text': {
              ...theme.typography.body1,
              color: AUTH_TOKENS.colors.textMuted,
              fontSize: '0.9rem',
              whiteSpace: 'pre-line',
              lineHeight: 1.4,
            },
          }),
        },
      },
    },
  });
}

const theme = createAppTheme();
export default theme;
