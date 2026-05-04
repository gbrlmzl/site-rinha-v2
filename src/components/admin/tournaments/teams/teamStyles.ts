import { ADMIN_TOKENS } from '@/components/admin/adminTheme';
import { GLOBAL_TOKENS } from '@/theme';
import type { TeamStatus } from '@/types/admin/team';

const c = ADMIN_TOKENS.colors;
const { border, textMuted } = GLOBAL_TOKENS;

export const TEAM_STATUS_PALETTE: Record<
  TeamStatus,
  { color: string; label: string }
> = {
  PENDING_PAYMENT: { color: c.paymentPending, label: 'PENDENTE' },
  READY: { color: c.paymentApproved, label: 'PRONTA' },
  FINISHED: { color: c.statusFinished, label: 'FINALIZADA' },
  EXPIRED_PAYMENT: { color: c.paymentCanceled, label: 'EXPIRADA' },
  EXPIRED_PAYMENT_PROBLEM: { color: c.paymentCanceled, label: 'PROBLEMA' },
  CANCELED: { color: c.paymentCanceled, label: 'CANCELADA' },
  BANNED: { color: c.paymentCanceled, label: 'BANIDA' },
};

export const teamStyles = {
  modalPaper: {
    ...ADMIN_TOKENS.sx.modalPaper,
    width: '100%',
    maxWidth: 980,
    maxHeight: { xs: '100dvh', md: '92vh' },
  },

  filterTabs: {
    minHeight: 40,
    '& .MuiTab-root': {
      minHeight: 40,
      paddingInline: 2.5,
      paddingBlock: 0.75,
      borderRadius: 2,
      textTransform: 'none' as const,
      fontWeight: 600,
      fontSize: '0.85rem',
      color: textMuted,
      letterSpacing: '0.04em',
      mr: 0.75,
      '&.Mui-selected': {
        color: '#fff',
        backgroundColor: c.adminAccent,
      },
    },
    '& .MuiTabs-indicator': { display: 'none' },
  },

  scrollArea: {
    overflowY: 'auto' as const,
    scrollbarWidth: 'none' as const,
    '&::-webkit-scrollbar': { display: 'none' },
  },

  emptyState: {
    py: 6,
    textAlign: 'center' as const,
    color: textMuted,
  },

  accordionWrapper: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 1,
  },

  accordion: {
    flex: 1,
    minWidth: 0,
    backgroundColor: 'rgba(255,255,255,0.02)',
    border: `1px solid ${border}`,
    borderRadius: '12px !important',
    overflow: 'hidden',
    transition: 'border-color 0.15s, background-color 0.15s',
    '&:before': { display: 'none' },
    '&.Mui-expanded': { mt: 0 },
    '&:hover': {
      borderColor: `${c.adminAccent}66`,
    },
  },

  accordionSummary: {
    px: { xs: 1.5, md: 2.5 },
    py: 1,
    minHeight: 72,
    '& .MuiAccordionSummary-content': {
      alignItems: 'center',
      gap: 1.5,
      my: 1,
    },
  },

  banSlot: {
    flexShrink: 0,
    mt: '18px',
  },

  accordionDetails: {
    borderTop: `1px solid ${border}`,
    backgroundColor: 'rgba(0,0,0,0.2)',
    p: 0,
  },

  shieldBox: {
    width: 44,
    height: 44,
    borderRadius: 1.5,
    border: `1px solid ${border}`,
    overflow: 'hidden',
    flexShrink: 0,
    backgroundColor: GLOBAL_TOKENS.bg,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  teamName: {
    color: '#fff',
    fontWeight: 700,
    fontSize: '0.95rem',
    lineHeight: 1.3,
  },

  captainLine: {
    color: textMuted,
    fontSize: '0.75rem',
    mt: 0.25,
    display: 'flex',
    alignItems: 'center',
    gap: 0.5,
  },

  badge: (color: string) => ({
    display: 'inline-flex',
    alignItems: 'center',
    paddingInline: 1.25,
    height: 22,
    borderRadius: 1,
    fontSize: '0.65rem',
    fontWeight: 700,
    letterSpacing: '0.05em',
    color,
    backgroundColor: `${color}1F`,
    border: `1px solid ${color}55`,
  }),

  banButton: {
    color: c.paymentCanceled,
    border: `1px solid ${c.paymentCanceled}55`,
    backgroundColor: `${c.paymentCanceled}14`,
    borderRadius: 1.5,
    width: 36,
    height: 36,
    flexShrink: 0,
    '&:hover': {
      backgroundColor: `${c.paymentCanceled}2E`,
      borderColor: `${c.paymentCanceled}AA`,
    },
    '&.Mui-disabled': {
      opacity: 0.35,
      color: c.paymentCanceled,
    },
  },

  innerTabs: {
    minHeight: 38,
    px: { xs: 1.5, md: 2.5 },
    pt: 1.5,
    borderBottom: `1px solid ${border}`,
    '& .MuiTab-root': {
      minHeight: 38,
      paddingInline: 1.5,
      textTransform: 'none' as const,
      fontWeight: 600,
      fontSize: '0.8rem',
      color: textMuted,
      letterSpacing: '0.03em',
      '&.Mui-selected': { color: '#fff' },
    },
    '& .MuiTabs-indicator': { backgroundColor: c.adminAccent, height: 2 },
  },

  innerTabPanel: {
    px: { xs: 1.5, md: 2.5 },
    py: 2,
  },

  playersGrid: {
    display: 'grid',
    gridTemplateColumns: {
      xs: 'repeat(2, 1fr)',
      sm: 'repeat(3, 1fr)',
      md: 'repeat(5, 1fr)',
    },
    gap: 2,
  },

  playerNickname: {
    color: '#fff',
    fontWeight: 700,
    fontSize: '0.85rem',
    lineHeight: 1.3,
  },

  playerRole: {
    color: c.adminAccent,
    fontSize: '0.62rem',
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase' as const,
    mt: 0.2,
  },
} as const;

const ROLE_LABELS: Record<string, string> = {
  TOP_LANER: 'Top',
  JUNGLER: 'Jungle',
  MID_LANER: 'Mid',
  AD_CARRY: 'ADC',
  SUPPORT: 'Suporte',
  FILL: 'Fill',
};

export function formatPlayerRole(role: string): string {
  return ROLE_LABELS[role] ?? role;
}
