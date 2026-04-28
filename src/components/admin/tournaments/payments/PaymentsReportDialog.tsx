'use client';

import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Collapse,
  Dialog,
  IconButton,
  Skeleton,
  Stack,
  Tab,
  TablePagination,
  Tabs,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import HistoryIcon from '@mui/icons-material/History';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import PaymentTimeline from '@/components/admin/tournaments/payments/PaymentTimeline';
import { useRouter } from 'next/navigation';
import { ADMIN_TOKENS } from '@/components/admin/adminTheme';
import { GLOBAL_TOKENS } from '@/theme';
import {
  paymentStyles,
  PAYMENT_STATUS_PALETTE,
  STATUS_DETAIL_LABELS,
} from '@/components/admin/tournaments/payments/paymentStyles';
import { tournamentStyles } from '@/components/admin/tournaments/tournamentStyles';
import { useAdminTournament } from '@/hooks/admin/useAdminTournaments';
import { useAdminTournamentPayments } from '@/hooks/admin/useAdminTournamentPayments';
import {
  formatDateOnly,
  formatPrize,
} from '@/components/admin/tournaments/formatters';
import type { PaymentStatus } from '@/types/admin/payment';

interface PaymentsReportDialogProps {
  tournamentId: number;
}

type StatusFilter = 'ALL' | PaymentStatus;

const FILTER_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: 'ALL', label: 'Todos' },
  { value: 'PENDING', label: 'PENDING' },
  { value: 'APPROVED', label: 'APPROVED' },
  { value: 'CANCELED', label: 'CANCELED' },
];

const COLUMNS = [
  'Equipe / Capitão',
  'Valor',
  'Status',
  'Detalhe',
  'Criado / Expira',
  'Pago em',
  'Ação',
];

export default function PaymentsReportDialog({
  tournamentId,
}: PaymentsReportDialogProps) {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [expandedPaymentId, setExpandedPaymentId] = useState<number | null>(null);

  const toggleTimeline = (paymentId: number) => {
    setExpandedPaymentId((current) => (current === paymentId ? null : paymentId));
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
    >
      <Box sx={ADMIN_TOKENS.sx.modalHeader}>
        <Box>
          <Typography sx={{ fontWeight: 700, fontSize: '1.1rem', color: '#fff' }}>
            Relatório de Pagamentos
          </Typography>
          {tournament && (
            <Typography
              sx={{ ...ADMIN_TOKENS.typography.sectionLabel, color: 'rgba(255,255,255,0.55)', mt: 0.25 }}
            >
              Torneio: {tournament.name}
            </Typography>
          )}
        </Box>
        <IconButton onClick={handleClose} sx={{ color: 'rgba(255,255,255,0.7)' }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Box sx={{ paddingInline: { xs: 2.5, md: 3 }, paddingTop: 2 }}>
        <Tabs
          value={statusFilter}
          onChange={(_, value) => {
            setStatusFilter(value as StatusFilter);
            setPage(0);
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

      <Box sx={{ paddingInline: { xs: 2.5, md: 3 }, py: 2, ...paymentStyles.scrollArea }}>
        {isError ? (
          <Alert severity="error">
            {(error as Error)?.message ?? 'Falha ao carregar pagamentos.'}
          </Alert>
        ) : (
          <>
            <Box sx={{ minWidth: 920 }}>
              <Box sx={{ ...paymentStyles.gridColumns, ...paymentStyles.gridHeaderRow }}>
                {COLUMNS.map((label, idx) => (
                  <Box
                    key={label}
                    sx={{
                      textAlign: idx === COLUMNS.length - 1 ? 'right' : 'left',
                    }}
                  >
                    {label.toUpperCase()}
                  </Box>
                ))}
              </Box>

              <Stack spacing={1}>
                {isLoading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton
                      key={`skel-${i}`}
                      variant="rounded"
                      height={56}
                      sx={{ bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 1.5 }}
                    />
                  ))
                ) : payments.length === 0 ? (
                  <Box sx={paymentStyles.emptyState}>
                    Nenhum pagamento encontrado{statusFilter === 'ALL' ? '' : ' para esse filtro'}.
                  </Box>
                ) : (
                  payments.map((p) => {
                    const statusEntry = PAYMENT_STATUS_PALETTE[p.status];
                    const detailLabel = p.statusDetail
                      ? STATUS_DETAIL_LABELS[p.statusDetail] ?? p.statusDetail
                      : '—';
                    const isExpanded = expandedPaymentId === p.paymentId;
                    return (
                      <Box key={p.paymentId}>
                      <Box
                        sx={{ ...paymentStyles.gridColumns, ...paymentStyles.rowCard }}
                      >
                        <Box>
                          <Typography sx={paymentStyles.summaryName}>{p.teamName}</Typography>
                          <Typography sx={paymentStyles.summaryUsername}>
                            @{p.captainUsername}
                          </Typography>
                        </Box>
                        <Box sx={{ color: ADMIN_TOKENS.colors.adminAccent, fontWeight: 700 }}>
                          {formatPrize(Number(p.value))}
                        </Box>
                        <Box>
                          <Box component="span" sx={paymentStyles.badge(statusEntry.color)}>
                            {statusEntry.label}
                          </Box>
                        </Box>
                        <Box>
                          <Box
                            component="span"
                            sx={paymentStyles.badge(GLOBAL_TOKENS.textMuted as unknown as string)}
                          >
                            {detailLabel}
                          </Box>
                        </Box>
                        <Box sx={{ fontSize: '0.78rem' }}>
                          <Box>
                            <Box component="span" sx={{ color: 'rgba(255,255,255,0.55)' }}>
                              Criado:{' '}
                            </Box>
                            <strong>{formatDateOnly(p.createdAt)}</strong>
                          </Box>
                          {p.expiresAt && (
                            <Box>
                              <Box component="span" sx={{ color: 'rgba(255,255,255,0.55)' }}>
                                Expira:{' '}
                              </Box>
                              <strong style={{ color: GLOBAL_TOKENS.danger }}>
                                {formatDateOnly(p.expiresAt)}
                              </strong>
                            </Box>
                          )}
                        </Box>
                        <Box>
                          {p.paidAt ? (
                            <Box
                              component="span"
                              sx={{
                                color: ADMIN_TOKENS.colors.paymentApproved,
                                fontWeight: 600,
                              }}
                            >
                              {formatDateOnly(p.paidAt)}
                            </Box>
                          ) : (
                            <Box component="span" sx={{ color: 'rgba(255,255,255,0.4)', fontStyle: 'italic' }}>
                              Pendente
                            </Box>
                          )}
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                          <Button
                            size="small"
                            sx={paymentStyles.timelineButton}
                            onClick={() => toggleTimeline(p.paymentId)}
                            startIcon={
                              isExpanded ? (
                                <KeyboardArrowUpIcon sx={{ fontSize: 16 }} />
                              ) : (
                                <HistoryIcon sx={{ fontSize: 16 }} />
                              )
                            }
                          >
                            {isExpanded ? 'FECHAR' : 'LINHA DO TEMPO'}
                          </Button>
                        </Box>
                      </Box>
                      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                        <Box
                          sx={{
                            mt: 1,
                            paddingInline: { xs: 2, md: 3 },
                            paddingBlock: 2.5,
                            borderRadius: 1.5,
                            backgroundColor: 'rgba(139, 92, 246, 0.04)',
                            border: '1px solid rgba(139, 92, 246, 0.18)',
                            borderLeft: '3px solid #8B5CF6',
                          }}
                        >
                          <PaymentTimeline paymentId={p.paymentId} />
                        </Box>
                      </Collapse>
                      </Box>
                    );
                  })
                )}
              </Stack>
            </Box>

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
              labelDisplayedRows={({ from, to, count }) => `${from}–${to} de ${count}`}
              sx={tournamentStyles.paginationContainer}
            />
          </>
        )}
      </Box>
    </Dialog>
  );
}
