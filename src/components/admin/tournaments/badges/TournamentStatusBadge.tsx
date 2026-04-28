'use client';

import { Box } from '@mui/material';
import {
  TOURNAMENT_STATUS_PALETTE,
  tournamentStyles,
} from '@/components/admin/tournaments/tournamentStyles';
import type { TournamentStatus } from '@/types/admin/tournament';

interface TournamentStatusBadgeProps {
  status: TournamentStatus;
}

export default function TournamentStatusBadge({
  status,
}: TournamentStatusBadgeProps) {
  return (
    <Box component="span" sx={tournamentStyles.statusBadge(status)}>
      {TOURNAMENT_STATUS_PALETTE[status]?.label ?? status}
    </Box>
  );
}
