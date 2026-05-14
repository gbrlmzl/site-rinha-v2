'use client';

import { useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  IconButton,
  Tab,
  Tabs,
  Tooltip,
  Typography,
} from '@mui/material';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import BlockIcon from '@mui/icons-material/Block';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import {
  TEAM_STATUS_PALETTE,
  formatPlayerRole,
  teamStyles,
} from '@/components/admin/tournaments/teams/teamStyles';
import TeamPaymentsList from '@/components/admin/tournaments/teams/TeamPaymentsList';
import type { AdminTeamSummary, TeamStatus } from '@/types/admin/team';

const BANNABLE_STATUSES = new Set<TeamStatus>(['PENDING_PAYMENT', 'READY']);

interface TeamAccordionItemProps {
  team: AdminTeamSummary;
  tournamentId: number;
  onBanClick: (team: AdminTeamSummary) => void;
}

export default function TeamAccordionItem({
  team,
  tournamentId,
  onBanClick,
}: TeamAccordionItemProps) {
  const [expanded, setExpanded] = useState(false);
  const [tab, setTab] = useState<'players' | 'payments'>('players');

  const palette =
    TEAM_STATUS_PALETTE[team.status] ?? TEAM_STATUS_PALETTE.PENDING_PAYMENT;
  const canBan = BANNABLE_STATUSES.has(team.status);

  return (
    <Box sx={teamStyles.accordionWrapper}>
      <Accordion
        disableGutters
        elevation={0}
        expanded={expanded}
        onChange={(_, value) => setExpanded(value)}
        sx={teamStyles.accordion}
      >
        <AccordionSummary
          expandIcon={
            <ExpandMoreRoundedIcon sx={{ color: 'rgba(255,255,255,0.5)' }} />
          }
          sx={teamStyles.accordionSummary}
        >
          <Box sx={teamStyles.shieldBox}>
            {team.shieldUrl ? (
              <img
                src={team.shieldUrl}
                alt={team.name}
                referrerPolicy="no-referrer"
                style={{ width: 32, height: 32, objectFit: 'contain' }}
              />
            ) : (
              <Typography
                sx={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem' }}
              >
                ?
              </Typography>
            )}
          </Box>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                flexWrap: 'wrap',
              }}
            >
              <Typography sx={teamStyles.teamName} noWrap>
                {team.name}
              </Typography>
              <Box component="span" sx={teamStyles.badge(palette.color)}>
                {palette.label}
              </Box>
            </Box>
            <Box sx={teamStyles.captainLine}>
              <PersonOutlineIcon sx={{ fontSize: 14 }} />
              <span>
                Capitão: <strong>@{team.captainUsername}</strong>
              </span>
              <Box
                component="span"
                sx={{
                  color: 'rgba(255,255,255,0.3)',
                  mx: 0.5,
                }}
              >
                •
              </Box>
              <span>
                {team.playersCount} jogador
                {team.playersCount === 1 ? '' : 'es'}
              </span>
            </Box>
          </Box>
        </AccordionSummary>

        <AccordionDetails sx={teamStyles.accordionDetails}>
          <Tabs
            value={tab}
            onChange={(_, value) => setTab(value as 'players' | 'payments')}
            sx={teamStyles.innerTabs}
          >
            <Tab value="players" label="Jogadores" />
            <Tab value="payments" label="Histórico de Pagamentos" />
          </Tabs>

          {tab === 'players' && (
            <Box sx={teamStyles.innerTabPanel}>
              {team.players.length === 0 ? (
                <Typography
                  sx={{
                    color: 'rgba(255,255,255,0.5)',
                    fontSize: '0.85rem',
                    textAlign: 'center',
                    py: 2,
                  }}
                >
                  Nenhum jogador cadastrado.
                </Typography>
              ) : (
                <Box sx={teamStyles.playersGrid}>
                  {team.players.map((player, idx) => (
                    <Box key={`${player.nickname}-${idx}`}>
                      <Typography sx={teamStyles.playerNickname}>
                        {player.nickname}
                      </Typography>
                      <Typography sx={teamStyles.playerRole}>
                        {formatPlayerRole(player.role)}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          )}

          {tab === 'payments' && (
            <Box sx={teamStyles.innerTabPanel}>
              <TeamPaymentsList
                tournamentId={tournamentId}
                teamId={team.id}
                enabled={expanded && tab === 'payments'}
              />
            </Box>
          )}
        </AccordionDetails>
      </Accordion>

      <Box sx={teamStyles.banSlot}>
        <Tooltip
          title={
            canBan ? 'Banir equipe' : 'Equipe não pode ser banida neste status'
          }
        >
          <span>
            <IconButton
              size="small"
              disabled={!canBan}
              onClick={() => onBanClick(team)}
              sx={teamStyles.banButton}
              aria-label="Banir equipe"
            >
              <BlockIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
      </Box>
    </Box>
  );
}
