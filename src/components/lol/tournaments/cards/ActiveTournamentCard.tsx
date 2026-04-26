'use client';

import { MyTournamentsSummaryData } from '@/types/lol/tournaments/tournament';
import AppsRoundedIcon from '@mui/icons-material/AppsRounded';
import { Box, Button, Chip, Typography } from '@mui/material';

const C = {
  surface: '#0E1241',
  border: 'rgba(255,255,255,0.08)',
  ongoingBorder: 'rgba(17,181,228,0.35)',
  gold: '#C9A227',
  text: '#ffffff',
  textMuted: 'rgba(255,255,255,0.5)',
  tournamentLabel: 'rgba(255,255,255,0.6)',
  readyGreen: '#37963c',
  readyGreenBg: 'rgba(55,150,60,0.12)',
  ongoingBlue: '#11B5E4',
  ongoingBlueBg: 'rgba(17,181,228,0.12)',
} as const;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

interface ActiveTournamentCardProps {
  data: MyTournamentsSummaryData;
  onView?: () => void;
}

export default function ActiveTournamentCard({ data, onView }: ActiveTournamentCardProps) {
  const isOngoing = data.status === 'ONGOING';

  const badgeColor = isOngoing ? C.ongoingBlue : C.readyGreen;
  const badgeBg = isOngoing ? C.ongoingBlueBg : C.readyGreenBg;

  const dateDisplay = isOngoing
    ? data.endsAt
      ? formatDate(data.endsAt)
      : '—'
    : formatDate(data.startsAt);

  const subLabel = isOngoing ? 'TÉRMINO' : `INÍCIO · ${formatTime(data.startsAt)}`;

  return (
    <Box
      sx={{
        backgroundColor: C.surface,
        border: `1px solid ${isOngoing ? C.ongoingBorder : C.border}`,
        borderRadius: 3,
        p: 2.5,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        width: '100%',
        maxWidth: 360,
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8 }}>
          <Chip
            label={isOngoing ? 'ONGOING' : 'READY'}
            size="small"
            sx={{
              backgroundColor: badgeBg,
              color: badgeColor,
              fontWeight: 700,
              fontSize: '0.62rem',
              letterSpacing: 0.6,
              border: `1px solid ${badgeColor}`,
              height: 22,
              alignSelf: 'flex-start',
            }}
          />
          {isOngoing && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
              {/* pulsing dot */}
              <Box
                sx={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  backgroundColor: C.ongoingBlue,
                  '@keyframes pulse': {
                    '0%, 100%': { opacity: 1, transform: 'scale(1)' },
                    '50%': { opacity: 0.4, transform: 'scale(0.7)' },
                  },
                  animation: 'pulse 1.6s ease-in-out infinite',
                }}
              />
              <Typography
                sx={{
                  color: C.ongoingBlue,
                  fontSize: '0.6rem',
                  fontWeight: 700,
                  letterSpacing: 0.8,
                  textTransform: 'uppercase',
                }}
              >
                Em andamento
              </Typography>
            </Box>
          )}
        </Box>

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
        <Typography
          sx={{
            color: C.tournamentLabel,
            fontSize: '0.68rem',
            letterSpacing: 0.8,
            textTransform: 'uppercase',
            mb: 0.5,
          }}
        >
          {data.tournamentName}
        </Typography>
        <Typography sx={{ color: C.text, fontWeight: 700, fontSize: '1.1rem', lineHeight: 1.3 }}>
          {data.teamName}
        </Typography>
      </Box>

      <Button
        variant="contained"
        startIcon={<AppsRoundedIcon />}
        onClick={onView}
        fullWidth
        sx={{
          backgroundColor: C.ongoingBlue,
          color: '#ffffff',
          fontWeight: 700,
          fontSize: '0.9rem',
          letterSpacing: 0.5,
          borderRadius: 2,
          py: 1.3,
          '&:hover': { backgroundColor: '#0b80a0' },
        }}
      >
        VER TORNEIO
      </Button>
    </Box>
  );
}
