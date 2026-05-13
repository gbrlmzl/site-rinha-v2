import { FONT, GLOBAL_TOKENS, INPUT_SX } from '@/theme';

const { surface, border, text, textMuted } = GLOBAL_TOKENS;

export const ADMIN_TOKENS = {
  colors: {
    ...GLOBAL_TOKENS,
    adminAccent: '#8B5CF6',
    adminAccentHover: '#7C3AED',
    panelBg: '#0a0f33',
    panelHeaderBg: 'rgba(14, 18, 65, 0.97)',
    statusOpen: '#3B82F6',
    statusFull: '#8B5CF6',
    statusOngoing: '#22C55E',
    statusFinished: '#94A3B8',
    statusCanceled: '#EF4444',
    paymentApproved: '#22C55E',
    paymentPending: '#F59E0B',
    paymentCanceled: '#EF4444',
  },

  typography: {
    pageTitle: {
      fontFamily: FONT.roboto,
      fontWeight: 700,
      fontSize: { xs: '1.75rem', md: '2.25rem' },
      color: text,
      letterSpacing: '-0.01em',
    },
    pageSubtitle: {
      fontFamily: FONT.roboto,
      fontSize: '0.95rem',
      color: textMuted,
    },
    sectionLabel: {
      fontFamily: FONT.roboto,
      fontSize: '0.7rem',
      fontWeight: 600,
      color: textMuted,
      letterSpacing: '0.08em',
      textTransform: 'uppercase' as const,
    },
  },

  sx: {
    pageContainer: {
      minHeight: '100vh',
      backgroundColor: GLOBAL_TOKENS.bg,
      pt: { xs: 9, md: 11 },
      pb: { xs: 4, md: 6 },
      px: { xs: 2, md: 3 },
      maxWidth: 1280,
      mx: 'auto',
    },

    panelSection: {
      backgroundColor: surface,
      border: `1px solid ${border}`,
      borderRadius: 3,
      p: { xs: 2, md: 3 },
    },

    shellAppBar: {
      backgroundColor: 'rgba(14, 18, 65, 0.97)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      boxShadow: '0 2px 20px rgba(0,0,0,0.4)',
    },

    shellBrand: {
      display: 'flex',
      alignItems: 'center',
      gap: 1.5,
    },

    shellBrandIcon: {
      width: 40,
      height: 40,
      borderRadius: 1.5,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#8B5CF6',
      color: '#fff',
    },

    shellExitButton: {
      borderRadius: 2,
      paddingInline: 2,
      backgroundColor: 'rgba(255,255,255,0.06)',
      color: text,
      fontWeight: 500,
      '&:hover': { backgroundColor: 'rgba(255,255,255,0.12)' },
    },

    panelCard: {
      backgroundColor: surface,
      borderRadius: 2,
      border: `1px solid ${border}`,
    },

    toolbar: {
      display: 'flex',
      flexDirection: { xs: 'column', md: 'row' },
      gap: 1.5,
      alignItems: { xs: 'stretch', md: 'center' },
      mb: 3,
    },

    primaryCta: {
      backgroundColor: '#8B5CF6',
      color: '#fff',
      fontWeight: 600,
      borderRadius: 2,
      paddingInline: 3,
      height: 44,
      '&:hover': { backgroundColor: '#7C3AED' },
    },

    modalPaper: {
      backgroundColor: surface,
      borderRadius: 3,
      border: `1px solid ${border}`,
      backgroundImage: 'none',
    },

    modalHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      px: 3,
      py: 2,
      borderBottom: `1px solid ${border}`,
    },

    input: INPUT_SX,

    scrollableNoScrollbar: {
      overflowY: 'auto' as const,
      scrollbarWidth: 'none' as const,
      '&::-webkit-scrollbar': { display: 'none' },
    },
  },
} as const;
