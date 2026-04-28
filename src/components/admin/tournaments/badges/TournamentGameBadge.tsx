'use client';

import { Box } from '@mui/material';
import {
  TOURNAMENT_GAME_PALETTE,
  tournamentStyles,
} from '@/components/admin/tournaments/tournamentStyles';
import type { TournamentGame } from '@/types/admin/tournament';

interface TournamentGameBadgeProps {
  game: TournamentGame;
}

export default function TournamentGameBadge({ game }: TournamentGameBadgeProps) {
  return (
    <Box component="span" sx={tournamentStyles.gameBadge(game)}>
      {TOURNAMENT_GAME_PALETTE[game]?.label ?? game}
    </Box>
  );
}
