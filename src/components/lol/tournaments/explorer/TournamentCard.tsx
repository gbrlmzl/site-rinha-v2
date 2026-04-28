'use client';

import { TournamentPublicSummaryData } from '@/types/lol/tournaments/tournament';
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded';

import { Box, Button, LinearProgress, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import TournamentStatusBadge from './TournamentStatusBadge';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function formatPrize(value: number) {
  return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}`;
}

interface TournamentCardProps {
  tournament: TournamentPublicSummaryData;
}

export default function TournamentCard({ tournament }: TournamentCardProps) {
  const router = useRouter();
  const teamsPercent = Math.round(
    (tournament.confirmedTeamsCount / tournament.maxTeams) * 100
  );

  return (
    <Box
      sx={{
        minWidth: { xs: 280, sm: 320 },
        maxWidth: 360,
        flexShrink: 0,
        backgroundColor: '#0E1241',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 3,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Image */}
      <Box sx={{ position: 'relative', height: 160 }}>
        <img
          src={tournament.imageUrl}
          alt={tournament.name}
          referrerPolicy="no-referrer"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to top, rgba(14,18,65,0.85) 0%, transparent 60%)',
          }}
        />
        <Box sx={{ position: 'absolute', top: 10, left: 10 }}>
          <TournamentStatusBadge status={tournament.status} variant="solid" />
        </Box>
      </Box>

      {/* Content */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 1.2,
          flex: 1,
        }}
      >
        <Typography
          sx={{
            color: '#ffffff',
            fontWeight: 700,
            fontSize: '1rem',
            lineHeight: 1.3,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {tournament.name}
        </Typography>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <CalendarTodayRoundedIcon
              sx={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}
            />
            <Typography
              sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem' }}
            >
              {formatDate(tournament.startsAt)}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <EmojiEventsRoundedIcon sx={{ fontSize: 13, color: '#E07F0A' }} />
            <Typography
              sx={{ color: '#E07F0A', fontSize: '0.75rem', fontWeight: 600 }}
            >
              {formatPrize(tournament.prizePool)}
            </Typography>
          </Box>
        </Box>

        {/* Teams progress */}
        <Box>
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}
          >
            <Typography
              sx={{
                color: 'rgba(255,255,255,0.5)',
                fontSize: '0.68rem',
                letterSpacing: 0.6,
                textTransform: 'uppercase',
              }}
            >
              Equipes
            </Typography>
            <Typography
              sx={{ color: '#ffffff', fontSize: '0.75rem', fontWeight: 700 }}
            >
              {tournament.confirmedTeamsCount}/{tournament.maxTeams}
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={teamsPercent}
            sx={{
              height: 4,
              borderRadius: 2,
              backgroundColor: 'rgba(255,255,255,0.1)',
              '& .MuiLinearProgress-bar': {
                backgroundColor: '#11B5E4',
                borderRadius: 2,
              },
            }}
          />
        </Box>

        {/* Buttons */}
        <Box sx={{ display: 'flex', gap: 1, mt: 'auto', pt: 0.5 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<DescriptionRoundedIcon fontSize="small" />}
            href={tournament.rulesUrl}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              flex: 1,
              borderColor: 'rgba(255,255,255,0.2)',
              color: 'rgba(255,255,255,0.8)',
              fontSize: '0.75rem',
              py: 0.8,
              '&:hover': {
                borderColor: 'rgba(255,255,255,0.4)',
                backgroundColor: 'rgba(255,255,255,0.05)',
              },
            }}
          >
            Regras
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={() => router.push(`/lol/torneios/${tournament.slug}`)}
            sx={{
              flex: 1,
              backgroundColor: '#11B5E4',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.75rem',
              py: 0.8,
              '&:hover': { backgroundColor: '#0b80a0' },
            }}
          >
            Inscrever
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
