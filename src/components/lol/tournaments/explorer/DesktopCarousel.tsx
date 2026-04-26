'use client';

import { TournamentPublicSummaryData } from '@/types/lol/tournaments/tournament';
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import { toTournamentSlug } from '@/utils/tournament-slug';
import { Box, Button, IconButton, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import TournamentStatusBadge from './TournamentStatusBadge';

function formatDateLong(iso: string) {
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatPrize(value: number) {
  return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}`;
}

interface DesktopCarouselProps {
  tournaments: TournamentPublicSummaryData[];
  index: number;
  onPrev: () => void;
  onNext: () => void;
}

const NAV_BTN_SX = {
  backgroundColor: 'rgba(255,255,255,0.1)',
  color: '#ffffff',
  border: '1px solid rgba(255,255,255,0.15)',
  borderRadius: '50%',
  width: 40,
  height: 40,
  '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' },
};

export default function DesktopCarousel({
  tournaments,
  index,
  onPrev,
  onNext,
}: DesktopCarouselProps) {
  const router = useRouter();

  if (tournaments.length === 0) return null;

  const t = tournaments[index];

  return (
    <Box>
      {/* Hero card */}
      <Box
        sx={{
          position: 'relative',
          borderRadius: 3,
          overflow: 'hidden',
          minHeight: 420,
          display: 'flex',
          alignItems: 'flex-end',
        }}
      >
        {/* Background image */}
        <img
          key={t.id}
          src={t.imageUrl}
          alt={t.name}
          referrerPolicy="no-referrer"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />

        {/* Gradient overlay — dark from left, transparent to right */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to right, rgba(8,13,46,0.97) 38%, rgba(8,13,46,0.5) 65%, transparent 100%)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(8,13,46,0.5) 0%, transparent 40%)',
          }}
        />

        {/* Animated content */}
        <Box
          key={`content-${index}`}
          sx={{
            position: 'relative',
            zIndex: 1,
            p: { xs: 3, md: 5 },
            maxWidth: '55%',
            '@keyframes slideIn': {
              from: { opacity: 0, transform: 'translateX(-20px)' },
              to: { opacity: 1, transform: 'translateX(0)' },
            },
            animation: 'slideIn 0.35s ease',
          }}
        >
          <TournamentStatusBadge status={t.status} />

          <Typography
            sx={{
              color: '#ffffff',
              fontWeight: 900,
              fontSize: { md: '2.8rem', lg: '3.8rem' },
              lineHeight: 1.05,
              textTransform: 'uppercase',
              fontStyle: 'italic',
              mt: 1.5,
              mb: 2.5,
              textShadow: '0 2px 16px rgba(0,0,0,0.5)',
            }}
          >
            {t.name}
          </Typography>

          {/* Stats row */}
          <Stack direction="row" spacing={1.5} sx={{ mb: 3, flexWrap: 'wrap', gap: 1 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.8,
                backgroundColor: 'rgba(0,0,0,0.45)',
                borderRadius: 2,
                px: 1.5,
                py: 1,
              }}
            >
              <EmojiEventsRoundedIcon sx={{ fontSize: 18, color: '#E07F0A' }} />
              <Box>
                <Typography sx={{ color: '#E07F0A', fontWeight: 700, fontSize: '0.95rem', lineHeight: 1.1 }}>
                  {formatPrize(t.prizePool)}
                </Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.6rem', letterSpacing: 0.8, textTransform: 'uppercase' }}>
                  Premiação Total
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.8,
                backgroundColor: 'rgba(0,0,0,0.45)',
                borderRadius: 2,
                px: 1.5,
                py: 1,
              }}
            >
              <GroupsRoundedIcon sx={{ fontSize: 18, color: '#11B5E4' }} />
              <Box>
                <Typography sx={{ color: '#11B5E4', fontWeight: 700, fontSize: '0.95rem', lineHeight: 1.1 }}>
                  {t.confirmedTeamsCount}/{t.maxTeams}
                </Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.6rem', letterSpacing: 0.8, textTransform: 'uppercase' }}>
                  Equipes Confirmadas
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.8,
                backgroundColor: 'rgba(0,0,0,0.45)',
                borderRadius: 2,
                px: 1.5,
                py: 1,
              }}
            >
              <CalendarTodayRoundedIcon sx={{ fontSize: 18, color: 'rgba(255,255,255,0.7)' }} />
              <Box>
                <Typography sx={{ color: '#ffffff', fontWeight: 700, fontSize: '0.95rem', lineHeight: 1.1 }}>
                  {formatDateLong(t.startsAt)}
                </Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.6rem', letterSpacing: 0.8, textTransform: 'uppercase' }}>
                  Início da Competição
                </Typography>
              </Box>
            </Box>
          </Stack>

          {/* Action buttons */}
          <Stack direction="row" spacing={1.5}>
            <Button
              variant="contained"
              onClick={() => router.push(`/lol/torneios/${toTournamentSlug(t.id, t.name)}`)}
              sx={{
                backgroundColor: '#11B5E4',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '0.95rem',
                letterSpacing: 1,
                textTransform: 'uppercase',
                fontStyle: 'italic',
                px: 3,
                py: 1.3,
                '&:hover': { backgroundColor: '#0b80a0' },
              }}
            >
              Participar Agora
            </Button>
            <Button
              variant="outlined"
              startIcon={<DescriptionRoundedIcon />}
              href={t.rulesUrl}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                borderColor: 'rgba(255,255,255,0.3)',
                color: '#ffffff',
                fontWeight: 600,
                fontSize: '0.9rem',
                px: 2.5,
                py: 1.3,
                backgroundColor: 'rgba(0,0,0,0.35)',
                '&:hover': { borderColor: 'rgba(255,255,255,0.6)', backgroundColor: 'rgba(0,0,0,0.5)' },
              }}
            >
              Ver Regras
            </Button>
          </Stack>
        </Box>
      </Box>

      {/* Navigation row */}
      {tournaments.length > 1 && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
            mt: 2,
          }}
        >
          <IconButton onClick={onPrev} sx={NAV_BTN_SX}>
            <ChevronLeftRoundedIcon />
          </IconButton>

          <Box sx={{ display: 'flex', gap: 0.8, alignItems: 'center' }}>
            {tournaments.map((_, i) => (
              <Box
                key={i}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: i === index ? '#11B5E4' : 'rgba(255,255,255,0.25)',
                  width: i === index ? 28 : 8,
                  transition: 'all 0.3s ease',
                }}
              />
            ))}
          </Box>

          <IconButton onClick={onNext} sx={NAV_BTN_SX}>
            <ChevronRightRoundedIcon />
          </IconButton>
        </Box>
      )}
    </Box>
  );
}
