'use client';

import { Box, Link as MuiLink, Stack, Typography } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { ADMIN_TOKENS } from '@/components/admin/adminTheme';
import { tournamentStyles } from '@/components/admin/tournaments/tournamentStyles';
import {
  formatDateTime,
  formatPrize,
} from '@/components/admin/tournaments/formatters';

interface TournamentExpandedDetailsProps {
  description: string | null;
  createdAt: string;
  startsAt: string;
  endsAt: string;
  rulesUrl: string;
  prizePool: number;
}

export default function TournamentExpandedDetails({
  description,
  createdAt,
  startsAt,
  endsAt,
  rulesUrl,
  prizePool,
}: TournamentExpandedDetailsProps) {
  return (
    <Box sx={tournamentStyles.expandedDetails}>
      <Box>
        <Typography sx={tournamentStyles.expandedFieldLabel}>Descrição</Typography>
        <Typography
          sx={{ color: 'rgba(255,255,255,0.85)', fontStyle: 'italic', fontSize: '0.9rem' }}
        >
          {description ? `"${description}"` : '—'}
        </Typography>
      </Box>

      <Box>
        <Typography sx={tournamentStyles.expandedFieldLabel}>
          Prazos e histórico
        </Typography>
        <Stack spacing={0.5} sx={{ fontSize: '0.85rem' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
            <span style={{ color: 'rgba(255,255,255,0.55)' }}>Criado em:</span>
            <span style={{ color: ADMIN_TOKENS.colors.adminAccent, fontWeight: 600 }}>
              {formatDateTime(createdAt)}
            </span>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
            <span style={{ color: 'rgba(255,255,255,0.55)' }}>Início:</span>
            <span style={{ color: ADMIN_TOKENS.colors.adminAccent, fontWeight: 600 }}>
              {formatDateTime(startsAt)}
            </span>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
            <span style={{ color: 'rgba(255,255,255,0.55)' }}>Término:</span>
            <span style={{ color: ADMIN_TOKENS.colors.adminAccent, fontWeight: 600 }}>
              {formatDateTime(endsAt)}
            </span>
          </Box>
        </Stack>
      </Box>

      <Box>
        <Typography sx={tournamentStyles.expandedFieldLabel}>
          Regras e premiação
        </Typography>
        <Stack spacing={0.75}>
          <MuiLink
            href={rulesUrl}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              color: ADMIN_TOKENS.colors.adminAccent,
              fontSize: '0.85rem',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            Link das regras <OpenInNewIcon sx={{ fontSize: 14 }} />
          </MuiLink>
          <Typography sx={{ fontSize: '0.85rem' }}>
            <Box component="span" sx={{ color: 'rgba(255,255,255,0.55)' }}>
              Prêmio total:{' '}
            </Box>
            <Box
              component="span"
              sx={{ color: '#FBBF24', fontWeight: 700 }}
            >
              {formatPrize(prizePool)}
            </Box>
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
}
