'use client';

import { useAuthContext } from '@/contexts/AuthContext';
import { useTournament } from '@/hooks/lol/tournaments/useTournament';
import { MyTournamentsSummaryData } from '@/types/lol/tournaments/tournament';
import { toTournamentSlug } from '@/utils/tournament-slug';
import { Box, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { JSX, useEffect, useState } from 'react';
import ActiveTournamentCard from './cards/ActiveTournamentCard';
import MyTournamentsCarousel from './MyTournamentsCarousel';
import PendingPaymentCard from './cards/PendingPaymentCard';
import TournamentExplorer from './explorer/TournamentExplorer';

export default function TorneioHome() {
  const { isAuthenticated } = useAuthContext();
  const { getMyTournaments } = useTournament();
  const router = useRouter();
  const [myTournaments, setMyTournaments] = useState<
    MyTournamentsSummaryData[]
  >([]);

  useEffect(() => {
    if (!isAuthenticated) return;

    getMyTournaments('LEAGUE_OF_LEGENDS').then((page) => {
      if (page) setMyTournaments(page.content);
    });
  }, [isAuthenticated]);

  function updateMyTournaments() {
    getMyTournaments('LEAGUE_OF_LEGENDS').then((page) => {
      if (page) setMyTournaments(page.content);
    });
  }

  useEffect(() => {
    window.addEventListener('tournament-payment-approved', updateMyTournaments);
    return () =>
      window.removeEventListener(
        'tournament-payment-approved',
        updateMyTournaments
      );
  }, []);

  function renderCard(tournament: MyTournamentsSummaryData) {
    const inscricoesPath = `/lol/torneios/${tournament.slug}/pagamentos`;
    const detailPath = `/lol/torneios/${tournament.slug}`;

    if (tournament.teamStatus === 'PENDING_PAYMENT') {
      return (
        <PendingPaymentCard
          key={tournament.id}
          data={tournament}
          onPay={() => router.push(inscricoesPath)}
        />
      );
    }
    if (tournament.teamStatus === 'READY') {
      return (
        <ActiveTournamentCard
          key={tournament.id}
          data={tournament}
          onView={() => router.push(detailPath)}
        />
      );
    }
    return null;
  }

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto', px: { xs: 2, md: 6 }, pt: '13vh', pb: '5vh' }}>
      {isAuthenticated && myTournaments.length > 0 && (
        <Box sx={{ mb: 5 }}>
          <Typography
            sx={{
              color: '#ffffff',
              fontWeight: 800,
              fontSize: { xs: '1.4rem', md: '1.8rem' },
              letterSpacing: -0.3,
              mb: 0.5,
            }}
          >
            Minhas Competições
          </Typography>
          <Typography
            sx={{
              color: 'rgba(255,255,255,0.5)',
              fontSize: '0.85rem',
              mb: 2.5,
            }}
          >
            Torneios em que você está inscrito.
          </Typography>
          <MyTournamentsCarousel
            items={myTournaments
              .map(renderCard)
              .filter((c): c is JSX.Element => c !== null)}
          />
        </Box>
      )}

      <TournamentExplorer game="LEAGUE_OF_LEGENDS" />
    </Box>
  );
}
