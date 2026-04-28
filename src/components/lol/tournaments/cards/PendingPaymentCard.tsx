'use client';

import {
  MyTournamentsSummaryData,
  TEAM_STATUS_LABELS,
} from '@/types/lol/tournaments/tournament';
import BoltIcon from '@mui/icons-material/Bolt';
import { Box, Button, Chip, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

const C = {
  surface: '#0E1241',
  border: 'rgba(255,255,255,0.08)',
  pendingBorder: 'rgba(255, 184, 0, 0.35)',
  gold: '#FFB800',
  goldHover: '#C9A227',
  goldBg: 'rgba(255,184,0,0.12)',
  goldBorder: '#C9A227',
  text: '#ffffff',
  textMuted: 'rgba(255,255,255,0.5)',
  tournamentLabel: 'rgba(255,255,255,0.6)',
} as const;

function useCountdown(expiresAt: string | null) {
  const [timeLeft, setTimeLeft] = useState('--:--:--');

  useEffect(() => {
    if (!expiresAt) return;

    const update = () => {
      const diff = new Date(expiresAt).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft('00:00:00');
        return;
      }
      const h = Math.floor(diff / 3_600_000);
      const m = Math.floor((diff % 3_600_000) / 60_000);
      const s = Math.floor((diff % 60_000) / 1_000);
      setTimeLeft(
        `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
      );
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  return timeLeft;
}

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
        backgroundColor: C.surface,
        border: `1px solid ${C.pendingBorder}`,
        borderRadius: 3,
        p: 2.5,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        justifyContent: 'space-between',
        width: '100%',
        maxWidth: 360,
      }}
    >
      {/* --- GRUPO DE TEXTO E INFORMAÇÕES (Tudo junto no topo) --- */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Bloco Superior: Chip e Cronômetro */}
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
              backgroundColor: C.goldBg,
              color: C.gold,
              fontWeight: 700,
              fontSize: '0.62rem',
              letterSpacing: 0.6,
              border: `1px solid ${C.goldBorder}`,
              height: 22,
              textTransform: 'uppercase',
            }}
          />
          <Box sx={{ textAlign: 'right' }}>
            <Typography
              sx={{
                color: C.gold,
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

        {/* Bloco Inferior: Nome do Torneio e Equipe */}
        <Box>
          <Typography
            sx={{
              color: C.tournamentLabel,
              fontSize: '0.68rem',
              letterSpacing: 0.8,
              textTransform: 'uppercase',
              mb: 0.5,
            }}
          >
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

      {/* --- BOTÃO (Isolado, empurrado para a base) --- */}
      <Button
        variant="contained"
        startIcon={<BoltIcon />}
        onClick={onPay}
        fullWidth
        sx={{
          backgroundColor: C.gold,
          color: '#111827',
          fontWeight: 700,
          fontSize: '0.9rem',
          letterSpacing: 0.5,
          borderRadius: 2,
          py: '14px',
          mt: 2,
          transition: 'background-color 0.2s ease',
          '&:hover': { backgroundColor: C.goldHover },
          '&:disabled': { opacity: 0.5 },
        }}
      >
        PAGAR AGORA (PIX)
      </Button>
    </Box>
  );
}
