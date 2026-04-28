'use client';

import { useState } from 'react';
import {
  Box,
  Button,
  Collapse,
  Stack,
  Typography,
} from '@mui/material';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded';
import Link from 'next/link';
import { tournamentStyles } from '@/components/admin/tournaments/tournamentStyles';
import {
  formatDateOnly,
  formatDateTime,
  formatPrize,
} from '@/components/admin/tournaments/formatters';
import TournamentStatusBadge from '@/components/admin/tournaments/badges/TournamentStatusBadge';
import TournamentGameBadge from '@/components/admin/tournaments/badges/TournamentGameBadge';
import { getAdminTournamentById } from '@/services/admin/adminTournamentService';
import { ADMIN_TOKENS } from '@/theme';
import type { AdminTournamentSummary } from '@/types/admin/tournament';

interface TournamentMobileCardProps {
  tournament: AdminTournamentSummary;
  onCancelClick: (tournamentId: number) => void;
}

export default function TournamentMobileCard({
  tournament,
  onCancelClick,
}: TournamentMobileCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [extra, setExtra] = useState<{
    description: string | null;
    createdAt: string;
    rulesUrl: string;
  } | null>(null);

  const toggleExpanded = async () => {
    const next = !expanded;
    setExpanded(next);
    if (next && !extra) {
      const detail = await getAdminTournamentById(tournament.id);
      setExtra({
        description: detail.description ?? null,
        createdAt: detail.createdAt,
        rulesUrl: detail.rulesUrl,
      });
    }
  };

  return (
    <Box sx={tournamentStyles.mobileCard} onClick={toggleExpanded}>
      <Box sx={{ position: 'relative' }}>
        {tournament.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <Box component="img" src={tournament.imageUrl} alt="" sx={tournamentStyles.mobileCardThumbnail} />
        ) : (
          <Box sx={tournamentStyles.mobileCardThumbnail} />
        )}
        <Box sx={tournamentStyles.mobileCardThumbnailOverlayBadges}>
          <TournamentStatusBadge status={tournament.status} />
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.5,
              paddingInline: 1,
              height: 24,
              borderRadius: 1,
              backgroundColor: 'rgba(0,0,0,0.6)',
              color: '#fff',
              fontSize: '0.75rem',
              fontWeight: 600,
            }}
          >
            <GroupsRoundedIcon sx={{ fontSize: 16 }} />
            {tournament.confirmedTeamsCount}/{tournament.maxTeams}
          </Box>
        </Box>
      </Box>

      <Box sx={{ p: 2 }}>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
          <EmojiEventsRoundedIcon sx={{ color: ADMIN_TOKENS.colors.adminAccent, fontSize: 18 }} />
          <TournamentGameBadge game={tournament.game} />
        </Stack>

        <Typography sx={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff', mb: 1.5 }}>
          {tournament.name}
        </Typography>

        <Stack direction="row" spacing={3}>
          <Box>
            <Typography sx={ADMIN_TOKENS.typography.sectionLabel}>Início</Typography>
            <Typography sx={{ color: '#fff', fontWeight: 600 }}>
              {formatDateOnly(tournament.startsAt)}
            </Typography>
          </Box>
          <Box>
            <Typography sx={ADMIN_TOKENS.typography.sectionLabel}>Premiação</Typography>
            <Typography sx={{ color: '#FBBF24', fontWeight: 700 }}>
              {formatPrize(tournament.prizePool)}
            </Typography>
          </Box>
        </Stack>

        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <Typography sx={{ ...ADMIN_TOKENS.typography.sectionLabel, mb: 1 }}>
              Cronograma do torneio
            </Typography>
            <Stack spacing={0.5} sx={{ fontSize: '0.85rem', mb: 1.5 }}>
              <Row label="Início:" value={formatDateTime(tournament.startsAt)} />
              <Row label="Término:" value={formatDateTime(tournament.endsAt)} />
              {extra?.createdAt && (
                <Row label="Criado em:" value={formatDateTime(extra.createdAt)} />
              )}
            </Stack>

            {extra?.description && (
              <>
                <Typography sx={{ ...ADMIN_TOKENS.typography.sectionLabel, mb: 0.5 }}>
                  Descrição
                </Typography>
                <Typography
                  sx={{
                    color: 'rgba(255,255,255,0.85)',
                    fontStyle: 'italic',
                    fontSize: '0.9rem',
                  }}
                >
                  &ldquo;{extra.description}&rdquo;
                </Typography>
              </>
            )}
          </Box>

          <Box sx={tournamentStyles.mobileCardActionsGrid} onClick={(e) => e.stopPropagation()}>
            <Button
              component={Link}
              href={`/admin/tournaments/${tournament.id}/equipes`}
              sx={tournamentStyles.mobileActionButton('teams')}
            >
              <PeopleAltOutlinedIcon />
              EQUIPES
            </Button>
            <Button
              component={Link}
              href={`/admin/tournaments/${tournament.id}/pagamentos`}
              sx={tournamentStyles.mobileActionButton('payments')}
            >
              <ReceiptLongOutlinedIcon />
              PAGAMENTOS
            </Button>
            <Button
              component={Link}
              href={`/admin/tournaments/${tournament.id}/editar`}
              sx={tournamentStyles.mobileActionButton('edit')}
            >
              <EditOutlinedIcon />
              EDITAR
            </Button>
            <Button
              onClick={() => onCancelClick(tournament.id)}
              sx={tournamentStyles.mobileActionButton('cancel')}
            >
              <DeleteOutlineIcon />
              CANCELAR
            </Button>
          </Box>
        </Collapse>
      </Box>
    </Box>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
      <span style={{ color: 'rgba(255,255,255,0.55)' }}>{label}</span>
      <span style={{ color: ADMIN_TOKENS.colors.adminAccent, fontWeight: 600 }}>
        {value}
      </span>
    </Box>
  );
}
