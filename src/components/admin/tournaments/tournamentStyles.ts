import { ADMIN_TOKENS, GLOBAL_TOKENS } from '@/theme';
import type { TournamentGame, TournamentStatus } from '@/types/admin/tournament';
import { TOURNAMENT_STATUS_LABELS } from '@/types/lol/tournaments/tournament';

const { border, surface, surfaceHigh, text, textMuted } = GLOBAL_TOKENS;
const c = ADMIN_TOKENS.colors;

export const TOURNAMENT_STATUS_PALETTE: Record<
  TournamentStatus,
  { color: string; label: string }
> = {
  OPEN: { color: c.statusOpen, label: TOURNAMENT_STATUS_LABELS.OPEN },
  FULL: { color: c.statusFull, label: TOURNAMENT_STATUS_LABELS.FULL },
  ONGOING: { color: c.statusOngoing, label: TOURNAMENT_STATUS_LABELS.ONGOING },
  FINISHED: { color: c.statusFinished, label: TOURNAMENT_STATUS_LABELS.FINISHED },
  CANCELED: { color: c.statusCanceled, label: TOURNAMENT_STATUS_LABELS.CANCELED },
};

export const TOURNAMENT_GAME_PALETTE: Record<
  TournamentGame,
  { color: string; label: string }
> = {
  LEAGUE_OF_LEGENDS: { color: '#11B5E4', label: 'LOL' },
  VALORANT: { color: '#F34251', label: 'VALORANT' },
  COUNTER_STRIKE: { color: '#E07F0A', label: 'CS2' },
};

const FALLBACK_PALETTE_ENTRY = { color: '#9CA3AF', label: '—' };

function safeStatusEntry(status: TournamentStatus) {
  return TOURNAMENT_STATUS_PALETTE[status] ?? FALLBACK_PALETTE_ENTRY;
}

function safeGameEntry(game: TournamentGame) {
  return TOURNAMENT_GAME_PALETTE[game] ?? FALLBACK_PALETTE_ENTRY;
}

export const tournamentStyles = {
  toolbarSearch: {
    flex: { xs: '1 1 100%', md: '0 1 320px' },
    '& .MuiOutlinedInput-root': {
      backgroundColor: surfaceHigh,
      borderRadius: 2,
      color: text,
      '& fieldset': { borderColor: border },
      '&:hover fieldset': { borderColor: c.adminAccent },
      '&.Mui-focused fieldset': { borderColor: c.adminAccent },
    },
    '& input::placeholder': { color: textMuted, opacity: 1 },
  },

  toolbarSelect: {
    flex: { xs: '1 1 100%', md: '0 0 180px' },
    '& .MuiOutlinedInput-root': {
      backgroundColor: surfaceHigh,
      borderRadius: 2,
      color: text,
      '& fieldset': { borderColor: border },
      '&:hover fieldset': { borderColor: c.adminAccent },
      '&.Mui-focused fieldset': { borderColor: c.adminAccent },
    },
    '& .MuiSelect-icon': { color: textMuted },
  },

  selectMenuPaper: {
    backgroundColor: surface,
    border: `1px solid ${border}`,
    color: text,
    '& .MuiMenuItem-root': {
      '&:hover': { backgroundColor: 'rgba(139, 92, 246, 0.12)' },
      '&.Mui-selected': {
        backgroundColor: 'rgba(139, 92, 246, 0.18)',
        '&:hover': { backgroundColor: 'rgba(139, 92, 246, 0.24)' },
      },
    },
  },

  statusBadge: (status: TournamentStatus) => {
    const { color } = safeStatusEntry(status);
    return {
      display: 'inline-flex',
      alignItems: 'center',
      paddingInline: 1.25,
      height: 24,
      borderRadius: 1,
      fontSize: '0.7rem',
      fontWeight: 700,
      letterSpacing: '0.05em',
      color,
      backgroundColor: `${color}1F`,
      border: `1px solid ${color}55`,
    };
  },

  gameBadge: (game: TournamentGame) => {
    const { color } = safeGameEntry(game);
    return {
      display: 'inline-flex',
      alignItems: 'center',
      paddingInline: 1.25,
      height: 24,
      borderRadius: 1,
      fontSize: '0.7rem',
      fontWeight: 700,
      letterSpacing: '0.05em',
      color,
      backgroundColor: `${color}1F`,
      border: `1px solid ${color}55`,
    };
  },

  /** Layout de 6 colunas — usado tanto no header quanto em cada row */
  gridColumns: {
    display: 'grid',
    gridTemplateColumns:
      'minmax(220px, 2.4fr) 110px 130px 130px 100px 180px',
    alignItems: 'center',
    gap: 2,
  },

  gridHeaderRow: {
    paddingInline: 2.5,
    paddingBlock: 1,
    ...ADMIN_TOKENS.typography.sectionLabel,
    color: textMuted,
  },

  gridHeaderActionsCell: {
    textAlign: 'right' as const,
  },

  rowCard: {
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 1.5,
    border: `1px solid ${border}`,
    overflow: 'hidden',
    transition: 'border-color 0.15s, background-color 0.15s',
    '&:hover': {
      borderColor: 'rgba(139, 92, 246, 0.4)',
      backgroundColor: 'rgba(139, 92, 246, 0.04)',
    },
  },

  rowCardClickable: {
    cursor: 'pointer',
  },

  rowMain: {
    paddingInline: 2.5,
    paddingBlock: 1.5,
    color: text,
    fontSize: '0.875rem',
  },

  rowThumbnail: {
    width: 44,
    height: 44,
    borderRadius: 1,
    objectFit: 'cover' as const,
    backgroundColor: surfaceHigh,
  },

  rowName: {
    fontSize: '0.95rem',
    fontWeight: 700,
    color: text,
    lineHeight: 1.25,
  },

  rowActionsContainer: {
    display: 'flex',
    gap: 0.5,
    justifyContent: 'flex-end',
  },

  iconAction: {
    width: 32,
    height: 32,
    color: textMuted,
    transition: 'all 0.15s',
    '&:hover': {
      color: c.adminAccent,
      backgroundColor: 'rgba(139, 92, 246, 0.12)',
    },
  },

  iconActionDanger: {
    width: 32,
    height: 32,
    color: textMuted,
    transition: 'all 0.15s',
    '&:hover': {
      color: c.statusCanceled,
      backgroundColor: 'rgba(239, 68, 68, 0.12)',
    },
  },

  expandedDetails: {
    backgroundColor: 'rgba(139, 92, 246, 0.06)',
    paddingInline: { xs: 2.5, md: 3.5 },
    paddingBlock: { xs: 2.5, md: 3 },
    borderTop: `1px solid ${border}`,
    borderLeft: `3px solid ${c.adminAccent}`,
    display: 'grid',
    gridTemplateColumns: { xs: '1fr', md: '1.6fr 1fr 1fr' },
    gap: { xs: 2.5, md: 4 },
    color: text,
    alignItems: 'flex-start',
  },

  expandedFieldLabel: {
    ...ADMIN_TOKENS.typography.sectionLabel,
    color: c.adminAccent,
    mb: 0.5,
  },

  mobileCard: {
    backgroundColor: surface,
    borderRadius: 3,
    border: `1px solid ${border}`,
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'border-color 0.15s',
    '&:hover': { borderColor: c.adminAccent },
  },

  mobileCardThumbnail: {
    width: '100%',
    aspectRatio: '16/9',
    objectFit: 'cover' as const,
    backgroundColor: surfaceHigh,
    display: 'block',
  },

  mobileCardThumbnailOverlayBadges: {
    position: 'absolute' as const,
    top: 12,
    left: 12,
    right: 12,
    display: 'flex',
    justifyContent: 'space-between',
    pointerEvents: 'none' as const,
  },

  mobileCardActionsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 1.5,
    pt: 2,
  },

  mobileActionButton: (variant: 'teams' | 'payments' | 'edit' | 'cancel') => {
    const map = {
      teams: { color: '#3B82F6', icon: '#60A5FA' },
      payments: { color: '#F59E0B', icon: '#FBBF24' },
      edit: { color: text, icon: text },
      cancel: { color: c.statusCanceled, icon: c.statusCanceled },
    } as const;
    const palette = map[variant];
    return {
      flexDirection: 'column' as const,
      gap: 0.5,
      paddingBlock: 1.5,
      backgroundColor: `${palette.color}14`,
      color: palette.color,
      borderRadius: 2,
      border: `1px solid ${palette.color}33`,
      fontSize: '0.75rem',
      fontWeight: 700,
      letterSpacing: '0.05em',
      '&:hover': { backgroundColor: `${palette.color}26` },
      '& .MuiSvgIcon-root': { color: palette.icon, fontSize: 28 },
    };
  },

  paginationContainer: {
    color: text,
    '& .MuiTablePagination-toolbar': {
      paddingInline: 0,
    },
    '& .MuiTablePagination-actions .MuiIconButton-root': {
      color: textMuted,
      '&:hover': { color: c.adminAccent },
      '&.Mui-disabled': { color: 'rgba(255,255,255,0.18)' },
    },
    '& .MuiTablePagination-selectIcon': { color: textMuted },
  },
} as const;
