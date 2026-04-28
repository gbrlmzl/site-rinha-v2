'use client';

import {
  MyTournamentsSummaryData,
  TEAM_STATUS_LABELS,
  TOURNAMENT_STATUS_LABELS,
} from '@/types/lol/tournaments/tournament';
import { Box, Button, Chip, Typography } from '@mui/material';
import {
  LOL_TOURNAMENT_COLORS as C,
  LOL_TOURNAMENT_TYPOGRAPHY as T,
  LOL_TOURNAMENT_SX,
} from '../tournamentsTheme';
import { formatDate, formatTime } from '@/utils/tournaments/formatters';

interface ActiveTournamentCardProps {
  data: MyTournamentsSummaryData;
  onView?: () => void;
}

export default function ActiveTournamentCard({
  data,
  onView,
}: ActiveTournamentCardProps) {
  const isOngoing = data.status === 'ONGOING';
  const badgeColor = isOngoing ? C.statusOngoing : C.teamReady;
  const badgeBg = isOngoing ? 'rgba(17,181,228,0.12)' : 'rgba(55,150,60,0.12)';

  const dateDisplay = isOngoing
    ? data.endsAt
      ? formatDate(data.endsAt)
      : '—'
    : formatDate(data.startsAt);

  const subLabel = isOngoing
    ? 'TÉRMINO'
    : `INÍCIO · ${formatTime(data.startsAt)}`;
  const statusLabel = isOngoing
    ? TOURNAMENT_STATUS_LABELS.ONGOING
    : TEAM_STATUS_LABELS[data.teamStatus];

  return (
    <Box
      sx={{
        ...LOL_TOURNAMENT_SX.panelCard,
        borderColor: isOngoing ? 'rgba(17,181,228,0.35)' : C.border,
        p: 2.5,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <Chip
            size="small"
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
                {isOngoing && (
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      backgroundColor: badgeColor,
                      '@keyframes pulse': {
                        '0%, 100%': { opacity: 1, transform: 'scale(1)' },
                        '50%': { opacity: 0.4, transform: 'scale(0.7)' },
                      },
                      animation: 'pulse 1.6s ease-in-out infinite',
                    }}
                  />
                )}
                <span>{statusLabel}</span>
              </Box>
            }
            sx={{
              backgroundColor: badgeBg,
              color: badgeColor,
              fontWeight: 700,
              fontSize: '0.62rem',
              letterSpacing: 0.6,
              border: `1px solid ${badgeColor}`,
              height: 22,
              alignSelf: 'flex-start',
              textTransform: 'uppercase',
              '& .MuiChip-label': { px: 1.2 },
            }}
          />

          <Box sx={{ textAlign: 'right' }}>
            <Typography
              sx={{
                color: C.text,
                fontWeight: 700,
                fontSize: '1rem',
                lineHeight: 1.2,
              }}
            >
              {dateDisplay}
            </Typography>
            <Typography
              sx={{
                color: C.gold,
                fontSize: '0.65rem',
                letterSpacing: 0.6,
                fontWeight: 600,
                mt: 0.3,
              }}
            >
              {subLabel}
            </Typography>
          </Box>
        </Box>

        <Box>
          <Typography sx={{ ...T.cardTournamentName, mb: 0.5 }}>
            {data.tournamentName}
          </Typography>
          <Typography
            sx={{
              color: C.text,
              fontWeight: 700,
              fontSize: '1.1rem',
              lineHeight: 1.3,
            }}
          >
            Equipe: {data.teamName}
          </Typography>
        </Box>
      </Box>

      <Button
        variant="contained"
        onClick={onView}
        fullWidth
        sx={{
          ...LOL_TOURNAMENT_SX.primaryCta,
          fontSize: '0.9rem',
          borderRadius: 2,
          py: '14px',
          mt: 2,
          fontStyle: 'normal',
          letterSpacing: 0.5,
        }}
      >
        IR PARA TORNEIO
      </Button>
    </Box>
  );
}
