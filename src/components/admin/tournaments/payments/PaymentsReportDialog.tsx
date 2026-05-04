'use client';

import { useState } from 'react';
import {
  Alert,
  Box,
  Dialog,
  IconButton,
  Skeleton,
  Stack,
  Tab,
  TablePagination,
  Tabs,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PaymentRowCard from '@/components/admin/tournaments/payments/PaymentRowCard';
import { useRouter } from 'next/navigation';
import { ADMIN_TOKENS } from '@/components/admin/adminTheme';
import { paymentStyles } from '@/components/admin/tournaments/payments/paymentStyles';
import { tournamentStyles } from '@/components/admin/tournaments/tournamentStyles';
import { useAdminTournament } from '@/hooks/admin/useAdminTournaments';
import { useAdminTournamentPayments } from '@/hooks/admin/useAdminTournamentPayments';
import type { PaymentStatus } from '@/types/admin/payment';

interface PaymentsReportDialogProps {
  tournamentId: number;
}

type StatusFilter = 'ALL' | PaymentStatus;

const FILTER_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: 'ALL', label: 'Todos' },
  { value: 'PENDING', label: 'Pendentes' },
  { value: 'APPROVED', label: 'Aprovados' },
  { value: 'CANCELED', label: 'Cancelados' },
];

export default function PaymentsReportDialog({
  tournamentId,
}: PaymentsReportDialogProps) {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [expandedPaymentId, setExpandedPaymentId] = useState<number | null>(
    null
  );

  const toggleTimeline = (paymentId: number) => {
    setExpandedPaymentId((current) =>
      current === paymentId ? null : paymentId
    );
  };

  const { data: tournament } = useAdminTournament(tournamentId);

  const {
    data: paymentsPage,
    isLoading,
    isError,
    error,
  } = useAdminTournamentPayments({
    tournamentId,
    status: statusFilter === 'ALL' ? undefined : statusFilter,
    page,
    size: pageSize,
  });

  const handleClose = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/admin/torneios');
    }
  };

  const payments = paymentsPage?.content ?? [];

  return (
    <Dialog
      open
      onClose={handleClose}
      slotProps={{ paper: { sx: paymentStyles.modalPaper } }}
      fullWidth
      fullScreen={isMobile}
    >
      <Box sx={ADMIN_TOKENS.sx.modalHeader}>
        <Box sx={{ minWidth: 0 }}>
          <Typography
            sx={{ fontWeight: 700, fontSize: '1.1rem', color: '#fff' }}
            noWrap
          >
            Relatório de Pagamentos
          </Typography>
          {tournament && (
            <Typography
              sx={{
                ...ADMIN_TOKENS.typography.sectionLabel,
                color: 'rgba(255,255,255,0.55)',
                mt: 0.25,
              }}
              noWrap
            >
              {tournament.name}
            </Typography>
          )}
        </Box>
        <IconButton
          onClick={handleClose}
          sx={{ color: 'rgba(255,255,255,0.7)' }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <Box sx={{ paddingInline: { xs: 2, md: 3 }, paddingTop: 2 }}>
        <Tabs
          value={statusFilter}
          onChange={(_, value) => {
            setStatusFilter(value as StatusFilter);
            setPage(0);
            setExpandedPaymentId(null);
          }}
          sx={paymentStyles.filterTabs}
          variant="scrollable"
          allowScrollButtonsMobile
        >
          {FILTER_OPTIONS.map((opt) => (
            <Tab key={opt.value} value={opt.value} label={opt.label} />
          ))}
        </Tabs>
      </Box>

      <Box
        sx={{
          paddingInline: { xs: 2, md: 3 },
          py: 2,
          ...paymentStyles.scrollArea,
          flex: 1,
        }}
      >
        {isError ? (
          <Alert severity="error">
            {(error as Error)?.message ?? 'Falha ao carregar pagamentos.'}
          </Alert>
        ) : (
          <Stack spacing={1.25}>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Skeleton
                  key={`skel-${i}`}
                  variant="rounded"
                  height={92}
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.05)',
                    borderRadius: 1.5,
                  }}
                />
              ))
            ) : payments.length === 0 ? (
              <Box sx={paymentStyles.emptyState}>
                Nenhum pagamento encontrado
                {statusFilter === 'ALL' ? '' : ' para esse filtro'}.
              </Box>
            ) : (
              payments.map((p) => (
                <PaymentRowCard
                  key={p.paymentId}
                  payment={p}
                  expanded={expandedPaymentId === p.paymentId}
                  onToggleTimeline={() => toggleTimeline(p.paymentId)}
                />
              ))
            )}
          </Stack>
        )}
      </Box>

      {!isError && (
        <TablePagination
          component="div"
          count={paymentsPage?.totalElements ?? 0}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={pageSize}
          onRowsPerPageChange={(e) => {
            setPageSize(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[10, 20, 50]}
          labelRowsPerPage="Por página:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}–${to} de ${count}`
          }
          sx={tournamentStyles.paginationContainer}
        />
      )}
    </Dialog>
  );
}
