'use client';

import { useState } from 'react';
import { Box, Collapse, Stack, Typography } from '@mui/material';
import { tournamentStyles } from '@/components/admin/tournaments/tournamentStyles';
import { formatDateOnly } from '@/components/admin/tournaments/formatters';
import TournamentStatusBadge from '@/components/admin/tournaments/badges/TournamentStatusBadge';
import TournamentGameBadge from '@/components/admin/tournaments/badges/TournamentGameBadge';
import TournamentRowActions from '@/components/admin/tournaments/actions/TournamentRowActions';
import TournamentExpandedDetails from '@/components/admin/tournaments/TournamentExpandedDetails';
import type { AdminTournamentSummary } from '@/types/admin/tournament';

interface TournamentTableRowProps {
  tournament: AdminTournamentSummary;
  detailsLoader?: (id: number) => Promise<{
    description: string | null;
    createdAt: string;
    rulesUrl: string;
  } | null>;
  onCancelClick: (tournamentId: number) => void;
}

export default function TournamentTableRow({
  tournament,
  detailsLoader,
  onCancelClick,
}: TournamentTableRowProps) {
  const [expanded, setExpanded] = useState(false);
  const [extra, setExtra] = useState<{
    description: string | null;
    createdAt: string;
    rulesUrl: string;
  } | null>(null);

  const toggleExpanded = async () => {
    const next = !expanded;
    setExpanded(next);
    if (next && !extra && detailsLoader) {
      const result = await detailsLoader(tournament.id);
      if (result) setExtra(result);
    }
  };

  return (
    <Box
      sx={{ ...tournamentStyles.rowCard, ...tournamentStyles.rowCardClickable }}
      onClick={toggleExpanded}
    >
      <Box sx={{ ...tournamentStyles.gridColumns, ...tournamentStyles.rowMain }}>
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ minWidth: 0 }}>
          {tournament.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <Box component="img" src={tournament.imageUrl} alt="" sx={tournamentStyles.rowThumbnail} />
          ) : (
            <Box sx={tournamentStyles.rowThumbnail} />
          )}
          <Typography sx={{ ...tournamentStyles.rowName, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {tournament.name}
          </Typography>
        </Stack>

        <Box>
          <TournamentGameBadge game={tournament.game} />
        </Box>
        <Box>
          <TournamentStatusBadge status={tournament.status} />
        </Box>

        <Box sx={{ fontWeight: 600 }}>{formatDateOnly(tournament.startsAt)}</Box>

        <Box sx={{ fontWeight: 600 }}>
          {tournament.confirmedTeamsCount}/{tournament.maxTeams}
        </Box>

        <TournamentRowActions
          tournamentId={tournament.id}
          onCancelClick={onCancelClick}
        />
      </Box>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <TournamentExpandedDetails
          description={extra?.description ?? null}
          createdAt={extra?.createdAt ?? tournament.startsAt}
          startsAt={tournament.startsAt}
          endsAt={tournament.endsAt}
          rulesUrl={extra?.rulesUrl ?? '#'}
          prizePool={tournament.prizePool}
        />
      </Collapse>
    </Box>
  );
}
