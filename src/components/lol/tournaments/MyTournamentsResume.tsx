'use client';

import { Box } from '@mui/material';
import {
  SubscribeTournamentPendent,
  SubscribeTournamentResume,
} from '@/types/lol/tournaments/tournament';

interface MyTournamentsResumeProps {
  data: SubscribeTournamentResume | SubscribeTournamentPendent;
  buttonAction: () => void;
}

export default function MyTournamentsResume({
  data,
  buttonAction,
}: MyTournamentsResumeProps) {
  return (
    <Box>
      <Box>
        {/**
                 * DTO retornado pela API:
                 * public record MyTournamentsSummaryData(
                    Long id,
                    String name,
                    TournamentGame game,
                    TournamentStatus status,
                    OffsetDateTime startsAt)
                 * Utilize esses dados como props
                 */}
      </Box>
    </Box>
  );
}
