'use client';

import { useState } from 'react';
import {
  Alert,
  Box,
  Skeleton,
  Stack,
  TablePagination,
} from '@mui/material';
import PaymentRowCard from '@/components/admin/tournaments/payments/PaymentRowCard';
import { paymentStyles } from '@/components/admin/tournaments/payments/paymentStyles';
import { tournamentStyles } from '@/components/admin/tournaments/tournamentStyles';
import { useAdminTeamPayments } from '@/hooks/admin/useAdminTournamentTeams';

interface TeamPaymentsListProps {
  tournamentId: number;
  teamId: number;
  enabled: boolean;
}

export default function TeamPaymentsList({
  tournamentId,
  teamId,
  enabled,
}: TeamPaymentsListProps) {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [expandedPaymentId, setExpandedPaymentId] = useState<number | null>(
    null
  );

  const { data, isLoading, isError, error } = useAdminTeamPayments(
    { tournamentId, teamId, page, size: pageSize },
    enabled
  );

  if (isError) {
    return (
      <Alert severity="error">
        {(error as Error)?.message ?? 'Falha ao carregar pagamentos da equipe.'}
      </Alert>
    );
  }

  const payments = data?.content ?? [];

  return (
    <Box>
      <Stack spacing={1}>
        {isLoading ? (
          Array.from({ length: 2 }).map((_, i) => (
            <Skeleton
              key={`team-pay-skel-${i}`}
              variant="rounded"
              height={88}
              sx={{ bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 1.5 }}
            />
          ))
        ) : payments.length === 0 ? (
          <Box sx={paymentStyles.emptyState}>
            Nenhum pagamento registrado para esta equipe.
          </Box>
        ) : (
          payments.map((p) => (
            <PaymentRowCard
              key={p.paymentId}
              payment={p}
              hideTeam
              expanded={expandedPaymentId === p.paymentId}
              onToggleTimeline={() =>
                setExpandedPaymentId((cur) =>
                  cur === p.paymentId ? null : p.paymentId
                )
              }
            />
          ))
        )}
      </Stack>

      {(data?.totalElements ?? 0) > pageSize && (
        <TablePagination
          component="div"
          count={data?.totalElements ?? 0}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={pageSize}
          onRowsPerPageChange={(e) => {
            setPageSize(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[5, 10, 20]}
          labelRowsPerPage="Por página:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}–${to} de ${count}`
          }
          sx={tournamentStyles.paginationContainer}
        />
      )}
    </Box>
  );
}
