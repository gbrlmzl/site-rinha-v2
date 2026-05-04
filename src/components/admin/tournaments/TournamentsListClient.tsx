'use client';

import { useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Snackbar,
  TablePagination,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import TournamentsToolbar, {
  SORT_OPTIONS,
  TournamentsSort,
} from '@/components/admin/tournaments/toolbar/TournamentsToolbar';
import TournamentsTable from '@/components/admin/tournaments/table/TournamentsTable';
import TournamentsCardList from '@/components/admin/tournaments/cards/TournamentsCardList';
import TournamentCancelDialog from '@/components/admin/tournaments/cancel/TournamentCancelDialog';
import { useAdminTournaments } from '@/hooks/admin/useAdminTournaments';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { tournamentStyles } from '@/components/admin/tournaments/tournamentStyles';
import type { GameType } from '@/types/admin/tournament';

const DEFAULT_PAGE_SIZE = 10;
const SEARCH_DEBOUNCE_MS = 300;
const SNACKBAR_AUTO_HIDE_MS = 4000;

export default function TournamentsListClient() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [search, setSearch] = useState('');
  const [game, setGame] = useState<GameType | ''>('');
  const [sort, setSort] = useState<TournamentsSort>(SORT_OPTIONS[0].value);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const debouncedSearch = useDebouncedValue(search, SEARCH_DEBOUNCE_MS);

  const queryParams = useMemo(
    () => ({
      game: game || undefined,
      page,
      size: pageSize,
      sort,
    }),
    [game, page, pageSize, sort]
  );

  const { data, isLoading, isError, error } = useAdminTournaments(queryParams);

  const filteredContent = useMemo(() => {
    if (!data?.content) return [];
    if (!debouncedSearch.trim()) return data.content;
    const needle = debouncedSearch.toLowerCase();
    return data.content.filter((t) => t.name.toLowerCase().includes(needle));
  }, [data, debouncedSearch]);

  const [cancelTargetId, setCancelTargetId] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'info';
  }>({ open: false, message: '', severity: 'success' });

  const cancelTarget = useMemo(
    () =>
      cancelTargetId != null
        ? filteredContent.find((t) => t.id === cancelTargetId) ?? null
        : null,
    [cancelTargetId, filteredContent]
  );

  const handleCancelClick = (tournamentId: number) => {
    setCancelTargetId(tournamentId);
  };

  const handleCancelClose = () => setCancelTargetId(null);

  const handleCancelSuccess = (mode: 'deleted' | 'canceled') => {
    setFeedback({
      open: true,
      severity: mode === 'deleted' ? 'success' : 'info',
      message:
        mode === 'deleted'
          ? 'Torneio excluído com sucesso.'
          : 'Torneio cancelado. Pagamentos pendentes foram cancelados no Mercado Pago.',
    });
  };

  return (
    <Box>
      <TournamentsToolbar
        search={search}
        onSearchChange={(v) => {
          setSearch(v);
          setPage(0);
        }}
        game={game}
        onGameChange={(v) => {
          setGame(v);
          setPage(0);
        }}
        sort={sort}
        onSortChange={(v) => {
          setSort(v);
          setPage(0);
        }}
      />

      {isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {(error as Error)?.message ?? 'Falha ao carregar torneios.'}
        </Alert>
      )}

      {isMobile ? (
        <TournamentsCardList
          tournaments={filteredContent}
          isLoading={isLoading}
          onCancelClick={handleCancelClick}
        />
      ) : (
        <TournamentsTable
          tournaments={filteredContent}
          isLoading={isLoading}
          onCancelClick={handleCancelClick}
        />
      )}

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
        rowsPerPageOptions={[10, 20, 50]}
        labelRowsPerPage="Por página:"
        labelDisplayedRows={({ from, to, count }) => `${from}–${to} de ${count}`}
        sx={tournamentStyles.paginationContainer}
      />

      <TournamentCancelDialog
        open={cancelTargetId != null}
        tournamentId={cancelTargetId}
        totalTeamsCount={cancelTarget?.totalTeamsCount ?? 0}
        activeTeamsCount={cancelTarget?.activeTeamsCount ?? 0}
        onClose={handleCancelClose}
        onSuccess={handleCancelSuccess}
      />

      <Snackbar
        open={feedback.open}
        autoHideDuration={SNACKBAR_AUTO_HIDE_MS}
        onClose={() => setFeedback((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={feedback.severity}
          onClose={() => setFeedback((s) => ({ ...s, open: false }))}
        >
          {feedback.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
