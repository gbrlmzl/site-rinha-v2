'use client';

import {
  Alert,
  Box,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material';
import { ADMIN_TOKENS } from '@/components/admin/adminTheme';
import { GLOBAL_TOKENS } from '@/theme';
import { useAdminPaymentEvents } from '@/hooks/admin/useAdminPaymentEvents';
import { formatDateTime } from '@/components/admin/tournaments/formatters';
import { paymentStyles } from '@/components/admin/tournaments/payments/paymentStyles';
import type {
  AdminPaymentEvent,
  PaymentEventType,
} from '@/types/admin/payment';

interface PaymentTimelineProps {
  paymentId: number;
}

const c = ADMIN_TOKENS.colors;

const EVENT_PALETTE: Record<PaymentEventType, { color: string; label: string }> = {
  PAYMENT_GENERATED: { color: c.statusOpen, label: 'PAYMENT GENERATED' },
  PROCESSED: { color: c.paymentApproved, label: 'PROCESSED' },
  IGNORED: { color: c.statusFinished, label: 'IGNORED' },
  ERROR: { color: GLOBAL_TOKENS.danger, label: 'ERROR' },
  EXPIRED_BY_JOB: { color: c.paymentPending, label: 'EXPIRED BY JOB' },
  CANCELED_BY_USER: { color: c.paymentCanceled, label: 'CANCELED BY USER' },
  CANCELED_BY_ADMIN: { color: c.paymentCanceled, label: 'CANCELED BY ADMIN' },
};

export default function PaymentTimeline({ paymentId }: PaymentTimelineProps) {
  const { data, isLoading, isError, error } = useAdminPaymentEvents(paymentId);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
        <CircularProgress size={24} sx={{ color: ADMIN_TOKENS.colors.adminAccent }} />
      </Box>
    );
  }

  if (isError) {
    return (
      <Alert severity="error" sx={{ my: 1 }}>
        {(error as Error)?.message ?? 'Falha ao carregar eventos.'}
      </Alert>
    );
  }

  const events = data ?? [];

  if (events.length === 0) {
    return (
      <Typography sx={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.85rem', py: 1 }}>
        Nenhum evento registrado para este pagamento.
      </Typography>
    );
  }

  // Mais recentes primeiro (back ordena ASC por receivedAt; reordeno aqui pra UX descendente).
  const sorted = [...events].sort((a, b) =>
    a.receivedAt < b.receivedAt ? 1 : -1
  );

  return (
    <Box>
      <Typography
        sx={{
          ...ADMIN_TOKENS.typography.sectionLabel,
          mb: 2,
          color: ADMIN_TOKENS.colors.adminAccent,
        }}
      >
        Linha do Tempo — pagamento #{paymentId}
      </Typography>
      <Stack spacing={0} sx={{ position: 'relative', pl: 1 }}>
        {sorted.map((event, idx) => (
          <TimelineItem
            key={event.id}
            event={event}
            isLast={idx === sorted.length - 1}
          />
        ))}
      </Stack>
    </Box>
  );
}

function TimelineItem({
  event,
  isLast,
}: {
  event: AdminPaymentEvent;
  isLast: boolean;
}) {
  const palette = EVENT_PALETTE[event.eventType] ?? {
    color: '#9CA3AF',
    label: event.eventType,
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, position: 'relative' }}>
      {/* Coluna do bullet + linha */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          flexShrink: 0,
        }}
      >
        <Box
          sx={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            backgroundColor: palette.color,
            border: `2px solid ${ADMIN_TOKENS.colors.adminAccent}`,
            mt: 0.75,
          }}
        />
        {!isLast && (
          <Box
            sx={{
              flex: 1,
              width: 2,
              backgroundColor: `${ADMIN_TOKENS.colors.adminAccent}40`,
              mt: 0.5,
              minHeight: 24,
            }}
          />
        )}
      </Box>

      {/* Conteúdo do evento */}
      <Box sx={{ flex: 1, pb: isLast ? 0 : 2.5 }}>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: 1.5,
            mb: 0.5,
          }}
        >
          <Box component="span" sx={paymentStyles.badge(palette.color)}>
            {palette.label}
          </Box>
          <Typography
            sx={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.78rem' }}
          >
            {formatDateTime(event.receivedAt)}
          </Typography>
        </Box>

        {(event.statusFromMp || event.statusDetailFromMp) && (
          <Box
            sx={{
              backgroundColor: 'rgba(255,255,255,0.04)',
              borderRadius: 1,
              paddingInline: 1.5,
              paddingBlock: 0.75,
              fontSize: '0.78rem',
              display: 'flex',
              gap: 3,
              flexWrap: 'wrap',
            }}
          >
            {event.statusFromMp && (
              <span>
                <strong style={{ color: ADMIN_TOKENS.colors.textMuted }}>STATUS MP:</strong>{' '}
                <span style={{ color: '#fff' }}>{event.statusFromMp}</span>
              </span>
            )}
            {event.statusDetailFromMp && (
              <span>
                <strong style={{ color: ADMIN_TOKENS.colors.textMuted }}>DETAIL MP:</strong>{' '}
                <span style={{ color: '#fff' }}>{event.statusDetailFromMp}</span>
              </span>
            )}
          </Box>
        )}

        {event.errorMessage && (
          <Box
            sx={{
              mt: 0.75,
              fontSize: '0.78rem',
              color: GLOBAL_TOKENS.danger,
              fontFamily: 'monospace',
              backgroundColor: `${GLOBAL_TOKENS.danger}14`,
              borderRadius: 1,
              padding: 1,
              whiteSpace: 'pre-wrap',
            }}
          >
            {event.errorMessage}
          </Box>
        )}
      </Box>
    </Box>
  );
}
