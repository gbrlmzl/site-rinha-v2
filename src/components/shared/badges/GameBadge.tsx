'use client';

import { Box } from '@mui/material';
import type { GameType } from '@/types/tournaments/common';

export const GAME_PALETTE: Record<GameType, { color: string; label: string }> = {
  LEAGUE_OF_LEGENDS: { color: '#11B5E4', label: 'LOL' },
  VALORANT: { color: '#F34251', label: 'VALORANT' },
  COUNTER_STRIKE: { color: '#E07F0A', label: 'CS2' },
};

interface GameBadgeProps {
  game: GameType;
}

export default function GameBadge({ game }: GameBadgeProps) {
  const { color, label } = GAME_PALETTE[game] ?? { color: '#9CA3AF', label: game };

  return (
    <Box
      component="span"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        paddingInline: 1.25,
        height: 24,
        borderRadius: 1,
        fontSize: '0.7rem',
        fontWeight: 700,
        letterSpacing: '0.05em',
        color,
        backgroundColor: `${color}1F`,
        border: `1px solid ${color}40`,
      }}
    >
      {label}
    </Box>
  );
}
