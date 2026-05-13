'use client';

import { Box, Typography } from '@mui/material';
import type { ReactNode } from 'react';
import { LOL_TOURNAMENT_SX } from '../tournamentsTheme';

interface StatChipProps {
  icon: ReactNode;
  /** Texto principal exibido em destaque */
  children: ReactNode;
  /** Texto pequeno em caixa-alta (opcional) — quando ausente, vira chip simples */
  caption?: ReactNode;
  /** Cor do texto principal (default: branco) */
  valueColor?: string;
}

/**
 * Chip translúcido usado sobre imagens de torneio (carrossel desktop, hero
 * do detalhe). Aceita ícone + valor e, opcionalmente, um caption pequeno.
 */
export default function StatChip({
  icon,
  children,
  caption,
  valueColor,
}: StatChipProps) {
  return (
    <Box sx={LOL_TOURNAMENT_SX.glassStatChip}>
      {icon}
      {caption ? (
        <Box>
          <Typography
            sx={{
              color: valueColor ?? '#ffffff',
              fontWeight: 700,
              fontSize: '0.95rem',
              lineHeight: 1.1,
            }}
          >
            {children}
          </Typography>
          <Typography
            sx={{
              color: 'rgba(255,255,255,0.5)',
              fontSize: '0.6rem',
              letterSpacing: 0.8,
              textTransform: 'uppercase',
            }}
          >
            {caption}
          </Typography>
        </Box>
      ) : (
        <Typography
          sx={{
            color: valueColor ?? '#ffffff',
            fontWeight: 600,
            fontSize: '0.85rem',
          }}
        >
          {children}
        </Typography>
      )}
    </Box>
  );
}
