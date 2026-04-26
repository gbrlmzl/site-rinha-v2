'use client';

import { Chip } from '@mui/material';
import { TournamentStatus } from '@/types/lol/tournaments/tournament';

const STATUS_CONFIG: Record<
  TournamentStatus,
  { label: string; color: string; bg: string }
> = {
  OPEN: { label: 'OPEN', color: '#37963c', bg: 'rgba(55,150,60,0.18)' },
  ONGOING: { label: 'ONGOING', color: '#11B5E4', bg: 'rgba(17,181,228,0.18)' },
  FULL: { label: 'FULL', color: '#E07F0A', bg: 'rgba(224,127,10,0.18)' },
  FINISHED: { label: 'FINISHED', color: 'rgba(255,255,255,0.5)', bg: 'rgba(255,255,255,0.1)' },
  CANCELED: { label: 'CANCELED', color: '#fc2c2c', bg: 'rgba(252,44,44,0.18)' },
};

interface TournamentStatusBadgeProps {
  status: TournamentStatus;
  size?: 'small' | 'medium';
}

export default function TournamentStatusBadge({
  status,
  size = 'small',
}: TournamentStatusBadgeProps) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.OPEN;

  return (
    <Chip
      label={cfg.label}
      size={size}
      sx={{
        backgroundColor: cfg.bg,
        color: cfg.color,
        fontWeight: 700,
        fontSize: '0.62rem',
        letterSpacing: 0.8,
        border: `1px solid ${cfg.color}`,
        height: 22,
      }}
    />
  );
}
