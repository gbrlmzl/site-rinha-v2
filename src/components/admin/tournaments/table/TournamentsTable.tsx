'use client';

import { Box, Skeleton, Stack, Typography } from '@mui/material';
import { tournamentStyles } from '@/components/admin/tournaments/tournamentStyles';
import TournamentTableRow from './TournamentTableRow';
import type { AdminTournamentSummary } from '@/types/admin/tournament';
import { getAdminTournamentById } from '@/services/admin/adminTournamentService';

interface TournamentsTableProps {
  tournaments: AdminTournamentSummary[];
  isLoading: boolean;
  onCancelClick: (tournamentId: number) => void;
}

const COLUMNS = [
  { label: 'Torneio' },
  { label: 'Jogo' },
  { label: 'Status' },
  { label: 'Início' },
  { label: 'Equipes' },
  { label: 'Ações', alignRight: true },
];

export default function TournamentsTable({
  tournaments,
  isLoading,
  onCancelClick,
}: TournamentsTableProps) {
  const detailsLoader = async (id: number) => {
    const detail = await getAdminTournamentById(id);
    return {
      description: detail.description ?? null,
      createdAt: detail.createdAt,
      rulesUrl: detail.rulesUrl,
    };
  };

  if (!isLoading && tournaments.length === 0) {
    return (
      <Box sx={{ py: 6, textAlign: 'center' }}>
        <Typography sx={{ color: 'rgba(255,255,255,0.55)' }}>
          Nenhum torneio encontrado.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ overflowX: 'auto' }}>
      <Box sx={{ minWidth: 900 }}>
      <Box sx={{ ...tournamentStyles.gridColumns, ...tournamentStyles.gridHeaderRow }}>
        {COLUMNS.map((col) => (
          <Box
            key={col.label}
            sx={col.alignRight ? tournamentStyles.gridHeaderActionsCell : undefined}
          >
            {col.label.toUpperCase()}
          </Box>
        ))}
      </Box>

      <Stack spacing={1}>
        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => (
              <Skeleton
                key={`skel-${i}`}
                variant="rounded"
                height={64}
                sx={{ bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 1.5 }}
              />
            ))
          : tournaments.map((tournament) => (
              <TournamentTableRow
                key={tournament.id}
                tournament={tournament}
                detailsLoader={detailsLoader}
                onCancelClick={onCancelClick}
              />
            ))}
      </Stack>
      </Box>
    </Box>
  );
}
