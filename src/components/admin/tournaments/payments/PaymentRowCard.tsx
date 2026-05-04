'use client';

import {
  Box,
  Button,
  Collapse,
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { ADMIN_TOKENS } from '@/components/admin/adminTheme';
import { GLOBAL_TOKENS } from '@/theme';
import {
  PAYMENT_STATUS_PALETTE,
  STATUS_DETAIL_LABELS,
  paymentStyles,
} from '@/components/admin/tournaments/payments/paymentStyles';
import {
  formatDateOnly,
  formatPrize,
} from '@/components/admin/tournaments/formatters';
import PaymentTimeline from '@/components/admin/tournaments/payments/PaymentTimeline';
import type { AdminPaymentSummary } from '@/types/admin/payment';

interface PaymentRowCardProps {
  payment: AdminPaymentSummary;
  expanded: boolean;
  onToggleTimeline: () => void;
  /** Esconde a coluna de equipe/capitão (útil em listas escopadas a uma equipe). */
  hideTeam?: boolean;
}

const c = ADMIN_TOKENS.colors;

const labelSx = {
  ...ADMIN_TOKENS.typography.sectionLabel,
  fontSize: '0.6rem',
  color: 'rgba(255,255,255,0.45)',
  mb: 0.4,
  display: 'block',
};

export default function PaymentRowCard({
  payment,
  expanded,
  onToggleTimeline,
  hideTeam = false,
}: PaymentRowCardProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const statusEntry = PAYMENT_STATUS_PALETTE[payment.status];
  const detailLabel = payment.statusDetail
    ? (STATUS_DETAIL_LABELS[payment.statusDetail] ?? payment.statusDetail)
    : null;

  return (
    <Box
      sx={{
        borderRadius: 1.5,
        border: `1px solid ${GLOBAL_TOKENS.border}`,
        backgroundColor: 'rgba(255,255,255,0.02)',
        transition: 'border-color 0.15s, background-color 0.15s',
        '&:hover': {
          borderColor: `${c.adminAccent}66`,
          backgroundColor: `${c.adminAccent}0A`,
        },
      }}
    >
      {isMobile ? (
        <MobileLayout
          payment={payment}
          expanded={expanded}
          onToggleTimeline={onToggleTimeline}
          hideTeam={hideTeam}
          statusColor={statusEntry.color}
          statusLabel={statusEntry.label}
          detailLabel={detailLabel}
        />
      ) : (
        <DesktopLayout
          payment={payment}
          expanded={expanded}
          onToggleTimeline={onToggleTimeline}
          hideTeam={hideTeam}
          statusColor={statusEntry.color}
          statusLabel={statusEntry.label}
          detailLabel={detailLabel}
        />
      )}

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Box
          sx={{
            mx: { xs: 1.5, md: 2 },
            mb: 2,
            paddingInline: { xs: 2, md: 3 },
            paddingBlock: 2.5,
            borderRadius: 1.5,
            backgroundColor: 'rgba(139, 92, 246, 0.04)',
            border: '1px solid rgba(139, 92, 246, 0.18)',
            borderLeft: `3px solid ${c.adminAccent}`,
          }}
        >
          <PaymentTimeline paymentId={payment.paymentId} />
        </Box>
      </Collapse>
    </Box>
  );
}

interface LayoutProps {
  payment: AdminPaymentSummary;
  expanded: boolean;
  onToggleTimeline: () => void;
  hideTeam: boolean;
  statusColor: string;
  statusLabel: string;
  detailLabel: string | null;
}

function DesktopLayout({
  payment,
  expanded,
  onToggleTimeline,
  hideTeam,
  statusColor,
  statusLabel,
  detailLabel,
}: LayoutProps) {
  const gridTemplate = hideTeam
    ? '90px 1.4fr 1.6fr 1fr 130px'
    : '1.3fr 90px 1.4fr 1.6fr 1fr 130px';

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: gridTemplate,
        alignItems: 'center',
        gap: 2,
        paddingInline: 2.5,
        paddingBlock: 1.75,
      }}
    >
      {!hideTeam && (
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={labelSx}>EQUIPE</Typography>
          <Typography
            sx={{ fontWeight: 700, color: '#fff', fontSize: '0.9rem' }}
            noWrap
          >
            {payment.teamName}
          </Typography>
          <Typography
            sx={{ color: GLOBAL_TOKENS.textMuted, fontSize: '0.75rem' }}
            noWrap
          >
            @{payment.captainUsername}
          </Typography>
        </Box>
      )}

      <Box>
        <Typography sx={labelSx}>VALOR</Typography>
        <Typography
          sx={{
            color: c.adminAccent,
            fontWeight: 700,
            fontSize: '0.95rem',
            lineHeight: 1.2,
          }}
        >
          {formatPrize(Number(payment.value))}
        </Typography>
      </Box>

      <Box sx={{ minWidth: 0 }}>
        <Typography sx={labelSx}>STATUS</Typography>
        <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
          <Box component="span" sx={paymentStyles.badge(statusColor)}>
            {statusLabel}
          </Box>
          {detailLabel && (
            <Box
              component="span"
              sx={paymentStyles.badge(
                GLOBAL_TOKENS.textMuted as unknown as string
              )}
            >
              {detailLabel}
            </Box>
          )}
        </Stack>
      </Box>

      <Box sx={{ minWidth: 0 }}>
        <Typography sx={labelSx}>CRIADO / EXPIRA</Typography>
        <Box sx={{ fontSize: '0.78rem', lineHeight: 1.4 }}>
          <Box>
            <Box component="span" sx={{ color: 'rgba(255,255,255,0.55)' }}>
              Criado:{' '}
            </Box>
            <strong style={{ color: '#fff' }}>
              {formatDateOnly(payment.createdAt)}
            </strong>
          </Box>
          {payment.expiresAt && (
            <Box>
              <Box component="span" sx={{ color: 'rgba(255,255,255,0.55)' }}>
                Expira:{' '}
              </Box>
              <strong style={{ color: GLOBAL_TOKENS.danger }}>
                {formatDateOnly(payment.expiresAt)}
              </strong>
            </Box>
          )}
        </Box>
      </Box>

      <Box sx={{ minWidth: 0 }}>
        <Typography sx={labelSx}>PAGO EM</Typography>
        {payment.paidAt ? (
          <Typography
            sx={{
              color: c.paymentApproved,
              fontWeight: 600,
              fontSize: '0.82rem',
            }}
          >
            {formatDateOnly(payment.paidAt)}
          </Typography>
        ) : (
          <Typography
            sx={{
              color: 'rgba(255,255,255,0.4)',
              fontStyle: 'italic',
              fontSize: '0.82rem',
            }}
          >
            Pendente
          </Typography>
        )}
      </Box>

      <Box sx={{ justifySelf: 'flex-end' }}>
        <Button
          size="small"
          sx={paymentStyles.timelineButton}
          onClick={onToggleTimeline}
          startIcon={
            expanded ? (
              <KeyboardArrowUpIcon sx={{ fontSize: 16 }} />
            ) : (
              <HistoryIcon sx={{ fontSize: 16 }} />
            )
          }
        >
          {expanded ? 'FECHAR' : 'LINHA DO TEMPO'}
        </Button>
      </Box>
    </Box>
  );
}

function MobileLayout({
  payment,
  expanded,
  onToggleTimeline,
  hideTeam,
  statusColor,
  statusLabel,
  detailLabel,
}: LayoutProps) {
  return (
    <Box
      role="button"
      tabIndex={0}
      onClick={onToggleTimeline}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onToggleTimeline();
        }
      }}
      sx={{
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        paddingInline: 1.75,
        paddingBlock: 1.5,
        userSelect: 'none',
      }}
    >
      <Box sx={{ flex: 1, minWidth: 0 }}>
        {/* Linha 1: Equipe + status badges + valor à direita */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            mb: 0.4,
          }}
        >
          {hideTeam ? (
            <Typography
              sx={{
                color: 'rgba(255,255,255,0.65)',
                fontSize: '0.75rem',
                flexShrink: 0,
              }}
            >
              ID #{payment.paymentId}
            </Typography>
          ) : (
            <Typography
              sx={{
                fontWeight: 700,
                color: '#fff',
                fontSize: '0.9rem',
                lineHeight: 1.2,
                flexShrink: 1,
                minWidth: 0,
              }}
              noWrap
            >
              {payment.teamName}
            </Typography>
          )}

          <Stack
            direction="row"
            spacing={0.5}
            flexWrap="wrap"
            useFlexGap
            sx={{ flexShrink: 0 }}
          >
            <Box component="span" sx={paymentStyles.badge(statusColor)}>
              {statusLabel}
            </Box>
            {detailLabel && (
              <Box
                component="span"
                sx={paymentStyles.badge(
                  GLOBAL_TOKENS.textMuted as unknown as string
                )}
              >
                {detailLabel}
              </Box>
            )}
          </Stack>

          <Typography
            sx={{
              color: c.adminAccent,
              fontWeight: 700,
              fontSize: '0.95rem',
              flexShrink: 0,
              ml: 'auto',
            }}
          >
            {formatPrize(Number(payment.value))}
          </Typography>
        </Box>

        {/* Linha 2: capitão */}
        {!hideTeam && (
          <Typography
            sx={{
              color: GLOBAL_TOKENS.textMuted,
              fontSize: '0.72rem',
              mb: 0.6,
            }}
            noWrap
          >
            @{payment.captainUsername}
          </Typography>
        )}

        {/* Linha 3: datas compactas */}
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1.25,
            fontSize: '0.7rem',
            color: 'rgba(255,255,255,0.55)',
          }}
        >
          <span>
            Criado{' '}
            <strong style={{ color: '#fff' }}>
              {formatDateOnly(payment.createdAt)}
            </strong>
          </span>
          {payment.expiresAt && !payment.paidAt && (
            <span>
              Expira{' '}
              <strong style={{ color: GLOBAL_TOKENS.danger }}>
                {formatDateOnly(payment.expiresAt)}
              </strong>
            </span>
          )}
          {payment.paidAt && (
            <span>
              Pago{' '}
              <strong style={{ color: c.paymentApproved }}>
                {formatDateOnly(payment.paidAt)}
              </strong>
            </span>
          )}
        </Box>
      </Box>

      <IconButton
        size="small"
        sx={{
          color: 'rgba(255,255,255,0.6)',
          flexShrink: 0,
          transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.2s',
        }}
        onClick={(e) => {
          e.stopPropagation();
          onToggleTimeline();
        }}
        aria-label={expanded ? 'Fechar linha do tempo' : 'Abrir linha do tempo'}
      >
        <KeyboardArrowDownIcon />
      </IconButton>
    </Box>
  );
}
