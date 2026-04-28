'use client';

import { TeamStatus } from '@/types/lol/tournaments/tournament';
import { Chip } from '@mui/material';

interface EnrolledBadgeProps {
  variant?: 'soft' | 'solid';
  size?: 'small' | 'medium';
  teamStatus?: TeamStatus;
}

const PENDING_COLOR = '#E07F0A';
const ENROLLED_COLOR = '#7C3AED';

export default function EnrolledBadge({
  variant = 'soft',
  size = 'small',
  teamStatus = 'READY',
}: EnrolledBadgeProps) {
  const isPending = teamStatus === 'PENDING_PAYMENT';
  const baseColor = isPending ? PENDING_COLOR : ENROLLED_COLOR;
  const label = isPending ? 'Aguardando Pagamento' : 'Já Inscrito';

  const isSolid = variant === 'solid';

  return (
    <Chip
      label={label}
      size={size}
      sx={{
        backgroundColor: isSolid ? baseColor : `${baseColor}1F`,
        color: isSolid ? '#ffffff' : baseColor,
        fontWeight: 800,
        fontSize: '0.62rem',
        letterSpacing: 0.8,
        border: isSolid ? 'none' : `1px solid ${baseColor}55`,
        height: 22,
        textTransform: 'uppercase',
        ...(variant === 'soft' && {
          backdropFilter: 'blur(4px)',
        }),
      }}
    />
  );
}
