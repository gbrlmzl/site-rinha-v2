'use client';

import {
  TeamStatus,
  TournamentPublicSummaryData,
} from '@/types/lol/tournaments/tournament';
import { Box } from '@mui/material';
import TournamentCard from './TournamentCard';
import HScrollSnap from '@/components/shared/HScrollSnap';

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
    <HScrollSnap sx={{ gap: 2 }}>
      {tournaments.map((t) => (
        <Box key={t.id} sx={{ scrollSnapAlign: 'start', flex: '0 0 auto' }}>
          <TournamentCard tournament={t} teamStatus={enrolledIds.get(t.id)} />
        </Box>
      ))}
    </HScrollSnap>
  );
}
