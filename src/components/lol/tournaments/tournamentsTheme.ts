import type { SxProps, Theme } from '@mui/material';
import { APP_PALETTES, FONT, GLOBAL_TOKENS } from '@/theme';

/**
 * Tokens do módulo público de torneios — League of Legends.
 *
 * Reutiliza GLOBAL_TOKENS (paleta semântica do site) e a paleta LoL
 * de `theme.ts`. A intenção é replicar este arquivo para CS e Valorant
 * trocando apenas a paleta base, mantendo a mesma estrutura de chaves.
 */

const LOL = APP_PALETTES.leagueOfLegends;
const { surface, surfaceHigh, border, text, textMuted, danger, success } =
  GLOBAL_TOKENS;

export const LOL_TOURNAMENT_COLORS = {
  ...GLOBAL_TOKENS,
  primary: LOL.primary,
  primaryHover: LOL.primaryHover,
  surface: LOL.cardBackground,
  /** Dourado usado em premiação e destaques de pagamento pendente */
  gold: '#C9A227',
  goldBright: '#FFB800',
  /** Cor que diferencia "minha equipe" no detalhe do torneio */
  enrolledAccent: '#7C3AED',
  /** Status do torneio (mantém paridade com o badge compartilhado) */
  statusOpen: success,
  statusOngoing: LOL.primary,
  statusFull: '#E07F0A',
  statusFinished: 'rgba(255,255,255,0.5)',
  statusCanceled: danger,
  /** Status da equipe do usuário */
  teamReady: success,
  teamPending: '#FFB800',
} as const;

const c = LOL_TOURNAMENT_COLORS;

export const LOL_TOURNAMENT_TYPOGRAPHY = {
  sectionTitle: {
    color: text,
    fontWeight: 800,
    fontSize: { xs: '1.4rem', md: '1.8rem' },
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: '0.85rem',
  },
  /** Label pequeno em caixa-alta usado em headers de bloco */
  microLabel: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: '0.65rem',
    fontWeight: 700,
    letterSpacing: 1.2,
    textTransform: 'uppercase' as const,
  },
  /** Label de campo sobre fundo destacado (usado na coluna de info) */
  infoLabel: {
    color: c.primary,
    fontSize: '0.6rem',
    fontWeight: 700,
    letterSpacing: 1,
    textTransform: 'uppercase' as const,
  },
  cardTournamentName: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: '0.68rem',
    letterSpacing: 0.8,
    textTransform: 'uppercase' as const,
  },
  /** Título grande de hero (detalhe / carousel desktop) */
  heroTitle: {
    color: text,
    fontWeight: 900,
    lineHeight: 1.05,
    textTransform: 'uppercase' as const,
    fontStyle: 'italic',
    textShadow: '0 2px 16px rgba(0,0,0,0.5)',
  },
} as const;

const sx = {
  /** Container central das páginas do módulo */
  pageContainer: {
    maxWidth: 1400,
    mx: 'auto',
    px: { xs: 2, md: 6 },
    pt: '13vh',
    pb: '5vh',
  },

  /** Card padrão (fundo do site + borda translúcida) */
  panelCard: {
    backgroundColor: surface,
    border: `1px solid ${border}`,
    borderRadius: 3,
  },

  /** Botão CTA primário (azul LoL) */
  primaryCta: {
    backgroundColor: c.primary,
    color: text,
    fontWeight: 800,
    letterSpacing: 1,
    textTransform: 'uppercase',
    fontStyle: 'italic',
    '&:hover': { backgroundColor: c.primaryHover },
    '&.Mui-disabled': {
      backgroundColor: 'rgba(255,255,255,0.08)',
      color: 'rgba(255,255,255,0.3)',
    },
  },

  /** Botão dourado (PAGAR AGORA) */
  goldCta: {
    backgroundColor: c.goldBright,
    color: '#111827',
    fontWeight: 700,
    letterSpacing: 0.5,
    borderRadius: 2,
    transition: 'background-color 0.2s ease',
    '&:hover': { backgroundColor: c.gold },
    '&:disabled': { opacity: 0.5 },
  },

  /** Botão secundário com borda translúcida */
  outlinedSecondary: {
    borderColor: 'rgba(255,255,255,0.15)',
    color: 'rgba(255,255,255,0.7)',
    fontWeight: 600,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    '&:hover': {
      borderColor: 'rgba(255,255,255,0.35)',
      backgroundColor: 'rgba(255,255,255,0.04)',
    },
  },

  /** Botão circular de navegação (carousels) */
  navButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    color: text,
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '50%',
    width: 40,
    height: 40,
    backdropFilter: 'blur(4px)',
    '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' },
    '&.Mui-disabled': { opacity: 0.25, pointerEvents: 'none' },
  },

  /** Caixinha translúcida usada nos chips de stats sobre imagem */
  glassStatChip: {
    display: 'flex',
    alignItems: 'center',
    gap: 0.7,
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderRadius: 2,
    px: 1.5,
    py: 0.8,
    backdropFilter: 'blur(8px)',
  },

  /** Empty state pontilhado */
  emptyState: {
    textAlign: 'center',
    py: 8,
    border: '1px dashed rgba(255,255,255,0.12)',
    borderRadius: 3,
  },

  /** Esconde scrollbar (carrossel mobile com swipe) */
  hScrollNoScrollbar: {
    display: 'flex',
    overflowX: 'auto',
    scrollSnapType: 'x mandatory',
    scrollbarWidth: 'none',
    '&::-webkit-scrollbar': { display: 'none' },
  },
} as const satisfies Record<string, SxProps<Theme>>;

export const LOL_TOURNAMENT_SX = sx;

export const LOL_TOURNAMENT_TOKENS = {
  colors: LOL_TOURNAMENT_COLORS,
  typography: LOL_TOURNAMENT_TYPOGRAPHY,
  sx,
  fonts: FONT,
  /** Aliases convenientes pra acessar tokens globais sem novo import */
  shared: { surface, surfaceHigh, border, text, textMuted, danger, success },
} as const;
