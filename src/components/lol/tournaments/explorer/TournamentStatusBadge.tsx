'use client';

import { Chip } from '@mui/material';
import {
  TOURNAMENT_STATUS_LABELS,
  TournamentStatus,
} from '@/types/lol/tournaments/tournament';

const STATUS_COLORS: Record<TournamentStatus, { color: string; bg: string }> = {
  OPEN: { color: '#37963c', bg: 'rgba(55,150,60,0.18)' },
  ONGOING: { color: '#11B5E4', bg: 'rgba(17,181,228,0.18)' },
  FULL: { color: '#E07F0A', bg: 'rgba(224,127,10,0.18)' },
  FINISHED: { color: 'rgba(255,255,255,0.5)', bg: 'rgba(255,255,255,0.1)' },
  CANCELED: { color: '#fc2c2c', bg: 'rgba(252,44,44,0.18)' },
};

interface TournamentStatusBadgeProps {
  status: TournamentStatus;
  size?: 'small' | 'medium';
  variant?: 'soft' | 'solid'; // Define as duas opções
}

export default function TournamentStatusBadge({
  status,
  size = 'small',
  variant = 'soft', // O "jeito antigo" é o padrão!
}: TournamentStatusBadgeProps) {
  const cfg = STATUS_COLORS[status] ?? STATUS_COLORS.OPEN;
  const label =
    TOURNAMENT_STATUS_LABELS[status] ?? TOURNAMENT_STATUS_LABELS.OPEN;

  // Lógica de cores baseada na variante escolhida
  const isSolid = variant === 'solid';
  const bgColor = isSolid ? cfg.color : cfg.bg;
  const textColor = isSolid ? '#ffffff' : cfg.color;
  const borderRule = isSolid ? 'none' : `1px solid ${cfg.color}`;

  return (
    <Chip
      label={label}
      size={size}
      sx={{
        backgroundColor: bgColor,
        color: textColor,
        fontWeight: 700,
        fontSize: '0.62rem',
        letterSpacing: 0.8,
        border: borderRule,
        height: 22,
        textTransform: 'uppercase',
      }}
    />
  );
}
