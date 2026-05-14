'use client';

import { Box, Skeleton, Stack, Typography } from '@mui/material';
import TournamentMobileCard from './TournamentMobileCard';
import type { AdminTournamentSummary } from '@/types/admin/tournament';

interface TournamentsCardListProps {
  tournaments: AdminTournamentSummary[];
  isLoading: boolean;
  onCancelClick: (tournamentId: number) => void;
}

export default function TournamentsCardList({
  tournaments,
  isLoading,
  onCancelClick,
}: TournamentsCardListProps) {
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
    <Stack spacing={2}>
      {isLoading
        ? Array.from({ length: 3 }).map((_, i) => (
            <Skeleton
              key={`skel-${i}`}
              variant="rounded"
              height={280}
              sx={{ bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 3 }}
            />
          ))
        : tournaments.map((tournament) => (
            <TournamentMobileCard
              key={tournament.id}
              tournament={tournament}
              onCancelClick={onCancelClick}
            />
          ))}
    </Stack>
  );
}
