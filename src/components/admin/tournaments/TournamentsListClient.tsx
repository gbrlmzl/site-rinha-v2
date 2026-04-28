'use client';

import { useMemo, useState } from 'react';
import {
  Alert,
  Box,
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
import { useAdminTournaments } from '@/hooks/admin/useAdminTournaments';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { tournamentStyles } from '@/components/admin/tournaments/tournamentStyles';
import type { TournamentGame } from '@/types/admin/tournament';

const DEFAULT_PAGE_SIZE = 10;

export default function TournamentsListClient() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [search, setSearch] = useState('');
  const [game, setGame] = useState<TournamentGame | ''>('');
  const [sort, setSort] = useState<TournamentsSort>(SORT_OPTIONS[0].value);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const debouncedSearch = useDebouncedValue(search, 300);

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

  const handleCancelClick = (tournamentId: number) => {
    // TODO: abrir TournamentCancelDialog (próximo passo)
    void tournamentId;
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
    </Box>
  );
}
