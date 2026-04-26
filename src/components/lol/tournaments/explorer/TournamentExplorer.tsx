'use client';

import { useTournament } from '@/hooks/lol/tournaments/useTournament';
import {
  GameType,
  TournamentPublicSummaryData,
  TournamentStatus,
} from '@/types/lol/tournaments/tournament';
import { Box, Button, CircularProgress, Stack, Typography } from '@mui/material';
import { useEffect, useMemo, useRef, useState } from 'react';
import DesktopCarousel from './DesktopCarousel';
import MobileCarousel from './MobileCarousel';

const FILTER_OPTIONS: { status: TournamentStatus; label: string; color: string }[] = [
  { status: 'OPEN', label: 'OPEN', color: '#37963c' },
  { status: 'ONGOING', label: 'ONGOING', color: '#11B5E4' },
  { status: 'FULL', label: 'FULL', color: '#E07F0A' },
];

interface TournamentExplorerProps {
  game: GameType;
}

export default function TournamentExplorer({ game }: TournamentExplorerProps) {
  const { getPublicTournaments } = useTournament();
  const [tournaments, setTournaments] = useState<TournamentPublicSummaryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeStatuses, setActiveStatuses] = useState<TournamentStatus[]>([
    'OPEN',
    'ONGOING',
    'FULL',
  ]);
  const [carouselIndex, setCarouselIndex] = useState(0);

  useEffect(() => {
    setLoading(true);
    getPublicTournaments(game).then((page) => {
      if (page) setTournaments(page.content);
      setLoading(false);
    });
  }, [game]);

  const filtered = useMemo(
    () => tournaments.filter((t) => activeStatuses.includes(t.status)),
    [tournaments, activeStatuses]
  );

  // safeIndex é calculado no próprio render — nunca chega ao carousel com índice fora dos limites
  const safeIndex = filtered.length > 0 ? Math.min(carouselIndex, filtered.length - 1) : 0;

  // Mantém o índice bruto sincronizado quando a lista encolhe
  const prevFilteredLength = useRef(filtered.length);
  if (filtered.length !== prevFilteredLength.current) {
    prevFilteredLength.current = filtered.length;
    if (carouselIndex >= filtered.length) {
      setCarouselIndex(0);
    }
  }

  function toggleStatus(status: TournamentStatus) {
    setActiveStatuses((prev) => {
      if (prev.includes(status)) {
        if (prev.length === 1) return prev;
        return prev.filter((s) => s !== status);
      }
      return [...prev, status];
    });
  }

  function prevSlide() {
    setCarouselIndex((i) => {
      const current = Math.min(i, filtered.length - 1);
      return current === 0 ? filtered.length - 1 : current - 1;
    });
  }

  function nextSlide() {
    setCarouselIndex((i) => {
      const current = Math.min(i, filtered.length - 1);
      return current === filtered.length - 1 ? 0 : current + 1;
    });
  }

  return (
    <Box sx={{ mt: 6 }}>
      {/* Section header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: { xs: 'flex-start', sm: 'center' },
          justifyContent: 'space-between',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography
            sx={{
              color: '#ffffff',
              fontWeight: 800,
              fontSize: { xs: '1.4rem', md: '1.8rem' },
              letterSpacing: -0.3,
            }}
          >
            Explorar Torneios
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', mt: 0.2 }}>
            As melhores competições de LOL em um só lugar.
          </Typography>
        </Box>

        {/* Filter buttons */}
        <Stack direction="row" spacing={1}>
          {FILTER_OPTIONS.map(({ status, label }) => {
            const active = activeStatuses.includes(status);
            return (
              <Button
                key={status}
                variant={active ? 'contained' : 'outlined'}
                size="small"
                onClick={() => toggleStatus(status)}
                sx={{
                  fontWeight: 700,
                  fontSize: '0.7rem',
                  letterSpacing: 0.8,
                  px: 1.5,
                  py: 0.6,
                  borderRadius: 1.5,
                  minWidth: 0,
                  ...(active
                    ? {
                        backgroundColor: '#7C3AED',
                        color: '#ffffff',
                        border: '1px solid #7C3AED',
                        '&:hover': { backgroundColor: '#6d28d9' },
                      }
                    : {
                        backgroundColor: 'transparent',
                        borderColor: '#11B5E4',
                        color: '#11B5E4',
                        '&:hover': {
                          backgroundColor: 'rgba(17,181,228,0.08)',
                        },
                      }),
                }}
              >
                {label}
              </Button>
            );
          })}
        </Stack>
      </Box>

      {/* Content */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={36} sx={{ color: '#11B5E4' }} />
        </Box>
      )}

      {!loading && filtered.length === 0 && (
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
            border: '1px dashed rgba(255,255,255,0.12)',
            borderRadius: 3,
          }}
        >
          <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>
            Nenhum torneio encontrado com os filtros selecionados.
          </Typography>
        </Box>
      )}

      {!loading && filtered.length > 0 && (
        <>
          {/* Desktop */}
          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            <DesktopCarousel
              tournaments={filtered}
              index={safeIndex}
              onPrev={prevSlide}
              onNext={nextSlide}
            />
          </Box>

          {/* Mobile */}
          <Box sx={{ display: { xs: 'block', md: 'none' } }}>
            <MobileCarousel tournaments={filtered} />
          </Box>
        </>
      )}
    </Box>
  );
}
