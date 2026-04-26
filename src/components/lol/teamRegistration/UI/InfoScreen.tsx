'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Box, Button, Card, CardActions, CardContent, Typography } from '@mui/material';
import { TEAM_REGISTRATION_TOKENS } from '@/theme';
import type { StaticImageData } from 'next/image';
import FullTournamentArt from '@/assets/imgs/lol/Full_Tournament.jpg';
import ClosedTournamentArt from '@/assets/imgs/lol/Closed_Tournament.jpg';
import ErrorRammus from '@/assets/imgs/lol/Error_Rammus.jpg';
import PaymentApprovedArt from '@/assets/imgs/lol/Gentleman_chogath.jpg';



type InfoScreenAction = {
  label: string;
  onClick: () => void;
};

import { RegistrationUIState } from '@/types/teamRegistration';
import { useRouter } from 'next/navigation';


interface InfoScreenProps {
  event: RegistrationUIState;
  slug: string | undefined;
}

type EventConfig = {
  title: string;
  message: string;
  action : InfoScreenAction | null;
  image: StaticImageData;
}; 

export default function InfoScreen({
  event,
  slug,
}: InfoScreenProps) {
  const router = useRouter();
  const THEME_COLORS = TEAM_REGISTRATION_TOKENS.colors;

  const actionConfigMap: Map<RegistrationUIState['status'], InfoScreenAction> = new Map([
    ['tournament_closed', { label: 'Voltar', onClick: () => router.back() }],
    ['tournament_full', { label: 'Voltar', onClick: () => router.back() }],
    ['payment_approved', { label: 'Voltar', onClick: () => router.push(`/lol/torneios/${slug}`) }],
    ['error', { label: 'Início', onClick: () => router.push(`/lol/torneios`) }],
    ['canceled', { label: 'Início', onClick: () => router.push(`/lol/torneios`) }],
  ]);

  const eventConfigMap: Map<RegistrationUIState['status'], EventConfig> = new Map([
    ['tournament_closed', { title: 'Torneio encerrado', message: 'As inscrições para este torneio foram encerradas.', action: actionConfigMap.get('tournament_closed') ?? null, image: ClosedTournamentArt }],
    ['tournament_full', { title: 'Vagas esgotadas', message: 'Todas as vagas deste torneio já foram preenchidas.', action: actionConfigMap.get('tournament_full') ?? null, image: FullTournamentArt }],
    ['payment_approved', { title: 'Inscrição aprovada', message: `Seu pagamento foi aprovado e sua inscrição está confirmada.\nBoa sorte!`, action: actionConfigMap.get('payment_approved') ?? null, image: PaymentApprovedArt }],
    ['canceled', { title: 'Inscrição cancelada', message: 'Sua inscrição foi cancelada.', action: actionConfigMap.get('canceled') ?? null, image: ClosedTournamentArt }],
    ['error', { title: 'Algo deu errado', message: 'Tente novamente mais tarde.', action: actionConfigMap.get('error') ?? null, image: ErrorRammus }]
  ]);

  const eventConfig = eventConfigMap.get(event.status) ?? eventConfigMap.get('error')!;
  console.log('Evento:', event.status, 'Configuração:', eventConfig);

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: THEME_COLORS.bg,
        px: 2,
        py: { xs: 3, md: 4 },
        display: 'flex',
        alignItems: { xs: 'center', md: 'flex-start' },
        justifyContent: 'center',
      }}
    >
      <Card
        sx={{
          mt: { xs: 0, md: '10vh' },
          width: '100%',
          maxWidth: { xs: '100%', md: '30vw', lg: '33vw' },
          boxShadow: 3,
          borderRadius: 3,
          overflow: 'hidden',
        }}
      >
        <Box sx={{ position: 'relative', width: '100%', height: { xs: '33vh', md: '40vh' } }}>
          <Image
            src={eventConfig.image}
            alt={event.status}
            fill
            sizes="(max-width: 900px) 100vw, 33vw"
            style={{ objectFit: 'cover' }}
            placeholder="blur"
            priority
          />
        </Box>

        <CardContent
          sx={{
            px: 3,
            pt: 4,
            pb: 2,
            mt: { xs: -3, md: -4 },
            position: 'relative',
            zIndex: 1,
            backgroundColor: THEME_COLORS.surface,
            //borderTopLeftRadius: 24,
            //borderTopRightRadius: 24,
            '&::before': {
              content: '""',
              position: 'absolute',
              top: -32,
              left: 0,
              right: 0,
              height: 32,
              pointerEvents: 'none',
              background: `linear-gradient(to bottom, rgba(0, 0, 0, 0), ${THEME_COLORS.surface})`,
            },
          }}
        >
          <Typography gutterBottom variant="h5" component="div" sx={{ color: THEME_COLORS.text, fontWeight: 700 }}>
            {eventConfig.title}
          </Typography>

          <Typography variant="body1" sx={{ color: THEME_COLORS.textMuted, whiteSpace: 'pre-line' }}>
            {eventConfig.message}
          </Typography>
        </CardContent>

        <CardActions
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            width: '100%',
            px: 3,
            py: 2,
            justifyContent: 'center',
            backgroundColor: THEME_COLORS.surface,
          }}
        >
          <Button
            variant="contained"
            onClick={eventConfig.action?.onClick}
            sx={{
              justifySelf: 'center',
              minWidth: { xs: '100%', sm: 220 },
              backgroundColor: THEME_COLORS.accent,
              '&:hover': {
                backgroundColor: THEME_COLORS.accentHover,
              },
            }}
          >
            {eventConfig.action?.label}
          </Button>
        </CardActions>
      </Card>

      <Box sx={{ display: 'none' }}>
        <Typography variant="body2">{eventConfig.title}</Typography>
      </Box>
    </Box>
  );
}