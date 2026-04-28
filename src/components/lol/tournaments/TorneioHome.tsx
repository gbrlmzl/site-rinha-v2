'use client';

import { useAuthContext } from '@/contexts/AuthContext';
import { useTournament } from '@/hooks/lol/tournaments/useTournament';
import { useTournamentPaymentApproved } from '@/hooks/lol/tournaments/useTournamentPaymentApproved';
import { MyTournamentsSummaryData } from '@/types/lol/tournaments/tournament';
import { Box, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { JSX, useEffect, useMemo, useState } from 'react';
import ActiveTournamentCard from './cards/ActiveTournamentCard';
import MyTournamentsCarousel from './MyTournamentsCarousel';
import PendingPaymentCard from './cards/PendingPaymentCard';
import TournamentExplorer from './explorer/TournamentExplorer';
import {
  LOL_TOURNAMENT_SX,
  LOL_TOURNAMENT_TYPOGRAPHY,
} from './tournamentsTheme';

export default function TorneioHome() {
  const { isAuthenticated } = useAuthContext();
  const { getMyTournaments } = useTournament();
  const router = useRouter();
  const [myTournaments, setMyTournaments] = useState<
    MyTournamentsSummaryData[]
  >([]);

  const updateMyTournaments = () => {
    getMyTournaments('LEAGUE_OF_LEGENDS').then((page) => {
      if (page) setMyTournaments(page.content);
    });
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    updateMyTournaments();
  }, [isAuthenticated]);

  useTournamentPaymentApproved(updateMyTournaments);

  const renderCard = (tournament: MyTournamentsSummaryData) => {
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
  };

  const enrolledTournamentIds = useMemo(
    () =>
      new Map(
        myTournaments
          .filter(
            (t) =>
              t.teamStatus === 'READY' || t.teamStatus === 'PENDING_PAYMENT'
          )
          .map((t) => [t.id, t.teamStatus])
      ),
    [myTournaments]
  );

  return (
    <Box sx={LOL_TOURNAMENT_SX.pageContainer}>
      {isAuthenticated && myTournaments.length > 0 && (
        <Box sx={{ mb: 5 }}>
          <Typography
            sx={{ ...LOL_TOURNAMENT_TYPOGRAPHY.sectionTitle, mb: 0.5 }}
          >
            Minhas Competições
          </Typography>
          <Typography
            sx={{ ...LOL_TOURNAMENT_TYPOGRAPHY.sectionSubtitle, mb: 2.5 }}
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

      <TournamentExplorer
        game="LEAGUE_OF_LEGENDS"
        enrolledTournamentIds={enrolledTournamentIds}
      />
    </Box>
  );
}
