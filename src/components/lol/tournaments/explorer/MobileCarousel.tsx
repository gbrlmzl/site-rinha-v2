'use client';

import { TournamentPublicSummaryData } from '@/types/lol/tournaments/tournament';
import { Box } from '@mui/material';
import TournamentCard from './TournamentCard';

interface MobileCarouselProps {
  tournaments: TournamentPublicSummaryData[];
}

export default function MobileCarousel({ tournaments }: MobileCarouselProps) {
  if (tournaments.length === 0) return null;

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        overflowX: 'auto',
        scrollSnapType: 'x mandatory',
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': { display: 'none' },
      }}
    >
      {tournaments.map((t) => (
        <Box key={t.id} sx={{ scrollSnapAlign: 'start' }}>
          <TournamentCard tournament={t} />
        </Box>
      ))}
    </Box>
  );
}
