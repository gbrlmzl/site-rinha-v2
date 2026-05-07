'use client';

import { Box, Collapse, Stack, Typography } from '@mui/material';
import { tournamentStyles } from '@/components/admin/tournaments/tournamentStyles';
import { formatDateOnly } from '@/components/admin/tournaments/formatters';
import TournamentStatusBadge from '@/components/shared/badges/TournamentStatusBadge';
import GameBadge from '@/components/shared/badges/GameBadge';
import TournamentRowActions from '@/components/admin/tournaments/actions/TournamentRowActions';
import TournamentExpandedDetails from '@/components/admin/tournaments/TournamentExpandedDetails';
import { useTournamentExpandedDetails } from '@/hooks/admin/useTournamentExpandedDetails';
import type { AdminTournamentSummary } from '@/types/admin/tournament';

interface TournamentTableRowProps {
  tournament: AdminTournamentSummary;
  onCancelClick: (tournamentId: number) => void;
}

export default function TournamentTableRow({
  tournament,
  onCancelClick,
}: TournamentTableRowProps) {
  const { expanded, extra, toggle } = useTournamentExpandedDetails(
    tournament.id
  );

  return (
    <Box
      sx={{ ...tournamentStyles.rowCard, ...tournamentStyles.rowCardClickable }}
      onClick={toggle}
    >
      <Box
        sx={{ ...tournamentStyles.gridColumns, ...tournamentStyles.rowMain }}
      >
        <Stack
          direction="row"
          alignItems="center"
          spacing={1.5}
          sx={{ minWidth: 0 }}
        >
          {tournament.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <Box
              component="img"
              src={tournament.imageUrl}
              alt=""
              sx={tournamentStyles.rowThumbnail}
            />
          ) : (
            <Box sx={tournamentStyles.rowThumbnail} />
          )}
          <Typography
            sx={{
              ...tournamentStyles.rowName,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {tournament.name}
          </Typography>
        </Stack>

        <Box>
          <GameBadge game={tournament.game} />
        </Box>
        <Box>
          <TournamentStatusBadge status={tournament.status} />
        </Box>

        <Box sx={{ fontWeight: 600 }}>
          {formatDateOnly(tournament.startsAt)}
        </Box>

        <Box sx={{ fontWeight: 600 }}>
          {tournament.confirmedTeamsCount}/{tournament.maxTeams}
        </Box>

        <TournamentRowActions
          tournamentId={tournament.id}
          totalTeamsCount={tournament.totalTeamsCount}
          isCanceled={tournament.status === 'CANCELED'}
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
