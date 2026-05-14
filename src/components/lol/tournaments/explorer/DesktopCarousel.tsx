'use client';

import {
  TeamStatus,
  TournamentPublicSummaryData,
} from '@/types/lol/tournaments/tournament';
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import { Box, Button, IconButton, Stack, Typography } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import EnrolledBadge from '@/components/shared/badges/EnrolledBadge';
import TournamentStatusBadge from '@/components/shared/badges/TournamentStatusBadge';
import StatChip from '../shared/StatChip';
import {
  LOL_TOURNAMENT_COLORS as C,
  LOL_TOURNAMENT_SX,
  LOL_TOURNAMENT_TYPOGRAPHY as T,
} from '../tournamentsTheme';
import { formatDateShort, formatPrize } from '@/utils/tournaments/formatters';

interface DesktopCarouselProps {
  tournaments: TournamentPublicSummaryData[];
  index: number;
  onPrev: () => void;
  onNext: () => void;
  enrolledIds: Map<number, TeamStatus>;
}

export default function DesktopCarousel({
  tournaments,
  index,
  onPrev,
  onNext,
  enrolledIds,
}: DesktopCarouselProps) {
  const router = useRouter();
  if (tournaments.length === 0) return null;

  const t = tournaments[index];
  const enrolledStatus = enrolledIds.get(t.id);

  return (
    <Box>
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
        <Image
          key={t.id}
          src={t.imageUrl}
          alt={t.name}
          fill
          sizes="100vw"
          referrerPolicy="no-referrer"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'top center',
          }}
        />

        {/* Sobreposições para legibilidade do texto sobre a imagem */}
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
            background:
              'linear-gradient(to top, rgba(8,13,46,0.5) 0%, transparent 40%)',
          }}
        />

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
          <Stack direction="row" spacing={1} alignItems="center">
            <TournamentStatusBadge status={t.status} />
            {enrolledStatus && (
              <EnrolledBadge variant="soft" teamStatus={enrolledStatus} />
            )}
          </Stack>

          <Typography
            sx={{
              ...T.heroTitle,
              fontSize: { md: '2.8rem', lg: '3.8rem' },
              mt: 1.5,
              mb: 2.5,
            }}
          >
            {t.name}
          </Typography>

          <Stack
            direction="row"
            spacing={1.5}
            sx={{ mb: 3, flexWrap: 'wrap', gap: 1 }}
          >
            <StatChip
              icon={
                <EmojiEventsRoundedIcon
                  sx={{ fontSize: 18, color: C.statusFull }}
                />
              }
              caption="Premiação Total"
              valueColor={C.statusFull}
            >
              {formatPrize(t.prizePool)}
            </StatChip>
            <StatChip
              icon={
                <GroupsRoundedIcon sx={{ fontSize: 18, color: C.primary }} />
              }
              caption="Equipes Confirmadas"
              valueColor={C.primary}
            >
              {t.confirmedTeamsCount}/{t.maxTeams}
            </StatChip>
            <StatChip
              icon={
                <CalendarTodayRoundedIcon
                  sx={{ fontSize: 18, color: 'rgba(255,255,255,0.7)' }}
                />
              }
              caption="Início da Competição"
            >
              {formatDateShort(t.startsAt)}
            </StatChip>
          </Stack>

          <Stack direction="row" spacing={1.5}>
            <Button
              variant="contained"
              onClick={() => router.push(`/lol/torneios/${t.slug}`)}
              sx={{
                ...LOL_TOURNAMENT_SX.primaryCta,
                fontSize: '0.95rem',
                px: 3,
                py: 1.3,
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
                color: C.text,
                fontWeight: 600,
                fontSize: '0.9rem',
                px: 2.5,
                py: 1.3,
                backgroundColor: 'rgba(0,0,0,0.35)',
                '&:hover': {
                  borderColor: 'rgba(255,255,255,0.6)',
                  backgroundColor: 'rgba(0,0,0,0.5)',
                },
              }}
            >
              Ver Regras
            </Button>
          </Stack>
        </Box>
      </Box>

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
          <IconButton onClick={onPrev} sx={LOL_TOURNAMENT_SX.navButton}>
            <ChevronLeftRoundedIcon />
          </IconButton>

          <Box sx={{ display: 'flex', gap: 0.8, alignItems: 'center' }}>
            {tournaments.map((_, i) => (
              <Box
                key={i}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  backgroundColor:
                    i === index ? C.primary : 'rgba(255,255,255,0.25)',
                  width: i === index ? 28 : 8,
                  transition: 'all 0.3s ease',
                }}
              />
            ))}
          </Box>

          <IconButton onClick={onNext} sx={LOL_TOURNAMENT_SX.navButton}>
            <ChevronRightRoundedIcon />
          </IconButton>
        </Box>
      )}
    </Box>
  );
}
