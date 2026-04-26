'use client';

import { TeamPublicData, PLAYER_ROLE_LABELS } from '@/types/lol/tournaments/tournament';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Chip,
  Typography,
} from '@mui/material';

interface Props {
  team: TeamPublicData;
  highlighted?: boolean;
  highlightLabel?: string;
  statusNote?: string;
}

export default function TeamAccordionItem({ team, highlighted, highlightLabel, statusNote }: Props) {
  return (
    <Accordion
      disableGutters
      elevation={0}
      sx={{
        backgroundColor: highlighted ? 'rgba(124,58,237,0.07)' : '#0E1241',
        border: highlighted
          ? '1px solid rgba(124,58,237,0.4)'
          : '1px solid rgba(255,255,255,0.07)',
        borderRadius: '12px !important',
        overflow: 'hidden',
        '&:before': { display: 'none' },
        '&.Mui-expanded': { mt: 0 },
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreRoundedIcon sx={{ color: 'rgba(255,255,255,0.5)' }} />}
        sx={{
          px: 2,
          py: 1,
          minHeight: 64,
          '& .MuiAccordionSummary-content': { alignItems: 'center', gap: 1.5, my: 1 },
        }}
      >
        {/* Shield */}
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 1.5,
            border: '1px solid rgba(255,255,255,0.12)',
            overflow: 'hidden',
            flexShrink: 0,
            backgroundColor: '#080d2e',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {team.shieldUrl ? (
            <img
              src={team.shieldUrl}
              alt={team.name}
              referrerPolicy="no-referrer"
              style={{ width: 28, height: 28, objectFit: 'contain' }}
            />
          ) : (
            <Typography sx={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem' }}>?</Typography>
          )}
        </Box>

        {/* Name + caption */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Typography
              sx={{
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.95rem',
                lineHeight: 1.3,
              }}
            >
              [{team.captainNickname}] {team.name}
            </Typography>
            {highlighted && highlightLabel && (
              <Chip
                label={highlightLabel}
                size="small"
                sx={{
                  backgroundColor: '#7C3AED',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '0.6rem',
                  height: 18,
                  letterSpacing: 0.5,
                }}
              />
            )}
          </Box>
          <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem', mt: 0.2 }}>
            Capitão: {team.captainNickname}
          </Typography>
          {statusNote && (
            <Typography sx={{ color: '#E07F0A', fontSize: '0.7rem', fontWeight: 600, mt: 0.3 }}>
              {statusNote}
            </Typography>
          )}
        </Box>
      </AccordionSummary>

      <AccordionDetails
        sx={{
          borderTop: '1px solid rgba(255,255,255,0.07)',
          backgroundColor: 'rgba(0,0,0,0.2)',
          px: 2,
          py: 2,
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(2, 1fr)',
              sm: 'repeat(3, 1fr)',
              md: 'repeat(5, 1fr)',
            },
            gap: 2,
          }}
        >
          {team.players.map((player, idx) => (
            <Box key={idx}>
              <Typography
                sx={{ color: '#ffffff', fontWeight: 700, fontSize: '0.85rem', lineHeight: 1.3 }}
              >
                {player.nickname}
              </Typography>
              <Typography
                sx={{
                  color: '#11B5E4',
                  fontSize: '0.62rem',
                  fontWeight: 700,
                  letterSpacing: 0.8,
                  textTransform: 'uppercase',
                  mt: 0.2,
                }}
              >
                {PLAYER_ROLE_LABELS[player.role] ?? player.role}
              </Typography>
            </Box>
          ))}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}
