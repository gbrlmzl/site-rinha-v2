'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Box, Button, Card, CardActions, CardContent, Typography } from '@mui/material';
import { THEME_COLORS } from '@/hooks/lol/teamRegistration/constants';
import type { StaticImageData } from 'next/image';
import FullTournamentArt from '@/assets/imgs/lol/Full_Tournament.jpg';
import ClosedTournamentArt from '@/assets/imgs/lol/Closed_Tournament.jpg';
import ErrorRammus from '@/assets/imgs/lol/Error_Rammus.jpg';


type InfoScreenAction = {
  label: string;
  onClick: () => void;
};

type InfoScreenEvent = 'tournament_closed' | 'tournament_full' | 'error' | 'canceled';

interface InfoScreenProps {
  event: InfoScreenEvent;
  title: string;
  message: string;
  action?: InfoScreenAction;
}

const eventIcons: Map<InfoScreenEvent, StaticImageData> = new Map([
  ['tournament_closed', ClosedTournamentArt],
  ['tournament_full', FullTournamentArt],
  ['error', ErrorRammus],
  ['canceled', ErrorRammus],
]);

export default function InfoScreen({
  event,
  title,
  message,
  action,
}: InfoScreenProps) {
  const eventImage = eventIcons.get(event) ?? ErrorRammus;
  const [imageLoaded, setImageLoaded] = useState(false);

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
            src={eventImage}
            alt={event}
            fill
            sizes="(max-width: 900px) 100vw, 33vw"
            onLoad={() => setImageLoaded(true)}
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
            {title}
          </Typography>

          <Typography variant="body1" sx={{ color: THEME_COLORS.textMuted }}>
            {message}
          </Typography>
        </CardContent>

        <CardActions
          sx={{
            display: 'grid',
            gridTemplateColumns: action ? '1fr' : '1fr',
            width: '100%',
            px: 3,
            py: 2,
            justifyContent: 'center',
            backgroundColor: THEME_COLORS.surface,
          }}
        >
          {action ? (
            <Button
              variant="contained"
              onClick={action.onClick}
              sx={{
                justifySelf: 'center',
                minWidth: { xs: '100%', sm: 220 },
                backgroundColor: THEME_COLORS.accent,
                '&:hover': {
                  backgroundColor: THEME_COLORS.accentHover,
                },
              }}
            >
              {action.label}
            </Button>
          ) : null}
        </CardActions>
      </Card>

      <Box sx={{ display: 'none' }}>
        <Typography variant="body2">{title}</Typography>
      </Box>
    </Box>
  );
}