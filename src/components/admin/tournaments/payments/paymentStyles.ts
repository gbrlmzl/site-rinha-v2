import { ADMIN_TOKENS } from '@/components/admin/adminTheme';
import { GLOBAL_TOKENS } from '@/theme';
import type { PaymentStatus } from '@/types/admin/payment';

const { border, surface, text, textMuted } = GLOBAL_TOKENS;
const c = ADMIN_TOKENS.colors;

export const PAYMENT_STATUS_PALETTE: Record<
  PaymentStatus,
  { color: string; label: string }
> = {
  PENDING: { color: c.paymentPending, label: 'PENDING' },
  APPROVED: { color: c.paymentApproved, label: 'APPROVED' },
  CANCELED: { color: c.paymentCanceled, label: 'CANCELED' },
};

export const STATUS_DETAIL_LABELS: Record<string, string> = {
  WAITING_TRANSFER: 'WAITING TRANSFER',
  ACCREDITED: 'ACCREDITED',
  EXPIRED: 'EXPIRED',
  CANCELED_BY_USER: 'CANCELED BY USER',
  CANCELED_BY_ADMIN: 'CANCELED BY ADMIN',
};

export const paymentStyles = {
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

  gridColumns: {
    display: 'grid',
    gridTemplateColumns:
      'minmax(180px, 1.4fr) 100px 110px 130px 160px 130px 110px',
    alignItems: 'center',
    gap: 2,
  },

  gridHeaderRow: {
    paddingInline: 2.5,
    paddingBlock: 1,
    ...ADMIN_TOKENS.typography.sectionLabel,
    color: textMuted,
  },

  rowCard: {
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 1.5,
    border: `1px solid ${border}`,
    paddingInline: 2.5,
    paddingBlock: 1.5,
    color: text,
    fontSize: '0.85rem',
    transition: 'border-color 0.15s, background-color 0.15s',
    '&:hover': {
      borderColor: `${c.adminAccent}66`,
      backgroundColor: `${c.adminAccent}0A`,
    },
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

  timelineButton: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    color: '#fff',
    fontSize: '0.7rem',
    fontWeight: 700,
    letterSpacing: '0.04em',
    paddingInline: 1.5,
    paddingBlock: 0.5,
    borderRadius: 1.5,
    minWidth: 0,
    '&:hover': { backgroundColor: `${c.adminAccent}2E` },
  },

  summaryName: { fontWeight: 700, color: '#fff', fontSize: '0.9rem' },
  summaryUsername: { color: textMuted, fontSize: '0.75rem' },

  emptyState: {
    py: 6,
    textAlign: 'center' as const,
    color: textMuted,
  },

  scrollArea: {
    overflowY: 'auto' as const,
    scrollbarWidth: 'none' as const,
    '&::-webkit-scrollbar': { display: 'none' },
  },
} as const;
