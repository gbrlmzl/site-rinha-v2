'use client';

import {
  MyTournamentsSummaryData,
  TEAM_STATUS_LABELS,
} from '@/types/lol/tournaments/tournament';
import { useCountdown } from '@/hooks/lol/tournaments/useCountdown';
import BoltIcon from '@mui/icons-material/Bolt';
import { Box, Button, Chip, Typography } from '@mui/material';
import {
  LOL_TOURNAMENT_COLORS as C,
  LOL_TOURNAMENT_TYPOGRAPHY as T,
  LOL_TOURNAMENT_SX,
} from '../tournamentsTheme';

interface PendingPaymentCardProps {
  data: MyTournamentsSummaryData;
  onPay?: () => void;
}

export default function PendingPaymentCard({
  data,
  onPay,
}: PendingPaymentCardProps) {
  const timeLeft = useCountdown(data.expiresAtPayment);

  return (
    <Box
      sx={{
        ...LOL_TOURNAMENT_SX.panelCard,
        borderColor: 'rgba(255,184,0,0.35)',
        p: 2.5,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        justifyContent: 'space-between',
        width: '100%',
        maxWidth: 360,
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <Chip
            label={TEAM_STATUS_LABELS[data.teamStatus]}
            size="small"
            sx={{
              backgroundColor: 'rgba(255,184,0,0.12)',
              color: C.goldBright,
              fontWeight: 700,
              fontSize: '0.62rem',
              letterSpacing: 0.6,
              border: `1px solid ${C.gold}`,
              height: 22,
              textTransform: 'uppercase',
            }}
          />
          <Box sx={{ textAlign: 'right' }}>
            <Typography
              sx={{
                color: C.goldBright,
                fontWeight: 700,
                fontSize: '1.3rem',
                lineHeight: 1.1,
                fontVariantNumeric: 'tabular-nums',
                letterSpacing: 1,
              }}
            >
              {timeLeft}
            </Typography>
            <Typography
              sx={{
                color: C.textMuted,
                fontSize: '0.6rem',
                letterSpacing: 0.8,
                mt: 0.3,
              }}
            >
              EXPIRA EM
            </Typography>
          </Box>
        </Box>

        <Box>
          <Typography sx={{ ...T.cardTournamentName, mb: 0.5 }}>
            {data.tournamentName}
          </Typography>
          <Typography
            sx={{
              color: C.text,
              fontWeight: 700,
              fontSize: '1.1rem',
              lineHeight: 1.3,
            }}
          >
            Equipe: {data.teamName}
          </Typography>
        </Box>
      </Box>

      <Button
        variant="contained"
        startIcon={<BoltIcon />}
        onClick={onPay}
        fullWidth
        sx={{
          ...LOL_TOURNAMENT_SX.goldCta,
          fontSize: '0.9rem',
          py: '14px',
          mt: 2,
        }}
      >
        PAGAR AGORA (PIX)
      </Button>
    </Box>
  );
}
