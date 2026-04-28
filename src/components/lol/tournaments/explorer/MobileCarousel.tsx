'use client';

import {
  TeamStatus,
  TournamentPublicSummaryData,
} from '@/types/lol/tournaments/tournament';
import { Box } from '@mui/material';
import TournamentCard from './TournamentCard';
import { LOL_TOURNAMENT_SX } from '../tournamentsTheme';

interface MobileCarouselProps {
  tournaments: TournamentPublicSummaryData[];
  enrolledIds: Map<number, TeamStatus>;
}

export default function MobileCarousel({
  tournaments,
  enrolledIds,
}: MobileCarouselProps) {
  if (tournaments.length === 0) return null;

  return (
    <Box sx={{ ...LOL_TOURNAMENT_SX.hScrollNoScrollbar, gap: 2 }}>
      {tournaments.map((t) => (
        <Box key={t.id} sx={{ scrollSnapAlign: 'start' }}>
          <TournamentCard tournament={t} teamStatus={enrolledIds.get(t.id)} />
        </Box>
      ))}
    </Box>
  );
}
