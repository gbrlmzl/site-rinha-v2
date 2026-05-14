'use client';

import { Box } from '@mui/material';
import { ADMIN_TOKENS } from '@/components/admin/adminTheme';

interface LabeledRowProps {
  label: string;
  value: string;
}

/**
 * Linha "rótulo neutro à esquerda, valor destacado à direita" usada nos
 * cards/expanded de torneios do admin.
 */
export default function LabeledRow({ label, value }: LabeledRowProps) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
      <span style={{ color: 'rgba(255,255,255,0.55)' }}>{label}</span>
      <span style={{ color: ADMIN_TOKENS.colors.adminAccent, fontWeight: 600 }}>
        {value}
      </span>
    </Box>
  );
}
