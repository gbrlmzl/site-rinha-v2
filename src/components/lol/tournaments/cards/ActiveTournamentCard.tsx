'use client';

import {
  MyTournamentsSummaryData,
  TEAM_STATUS_LABELS,
  TOURNAMENT_STATUS_LABELS,
} from '@/types/lol/tournaments/tournament';
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

export default function ActiveTournamentCard({
  data,
  onView,
}: ActiveTournamentCardProps) {
  const isOngoing = data.status === 'ONGOING';

  const badgeColor = isOngoing ? C.ongoingBlue : C.readyGreen;
  const badgeBg = isOngoing ? C.ongoingBlueBg : C.readyGreenBg;

  const dateDisplay = isOngoing
    ? data.endsAt
      ? formatDate(data.endsAt)
      : '—'
    : formatDate(data.startsAt);

  const subLabel = isOngoing
    ? 'TÉRMINO'
    : `INÍCIO · ${formatTime(data.startsAt)}`;

  return (
    <Box
      sx={{
        backgroundColor: C.surface,
        border: `1px solid ${isOngoing ? C.ongoingBorder : C.border}`,
        borderRadius: 3,
        p: 2.5,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      {/* --- GRUPO DE TEXTO E INFORMAÇÕES (Tudo junto no topo) --- */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Bloco Superior: Chip/Bolinha e Data */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8 }}>
            <Chip
              size="small"
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
                  {/* A bolinha piscando só aparece se for Ongoing */}
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
                  {/* O Texto muda conforme o status */}
                  <span>
                    {isOngoing
                      ? TOURNAMENT_STATUS_LABELS.ONGOING
                      : TEAM_STATUS_LABELS[data.teamStatus]}
                  </span>
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
                // Ajuste fino para o label ficar perfeitamente alinhado com a bolinha
                '& .MuiChip-label': {
                  px: 1.2,
                },
              }}
            />
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

        {/* Bloco Inferior: Nome do Torneio e Equipe */}
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

      {/* --- BOTÃO (Isolado, empurrado para a base) --- */}
      <Button
        variant="contained"
        onClick={onView}
        fullWidth
        sx={{
          backgroundColor: C.ongoingBlue,
          color: '#ffffff',
          fontWeight: 700,
          fontSize: '0.9rem',
          letterSpacing: 0.5,
          borderRadius: 2,
          py: '14px',
          mt: 2,
          '&:hover': { backgroundColor: '#0b80a0' },
        }}
      >
        IR PARA TORNEIO
      </Button>
    </Box>
  );
}
