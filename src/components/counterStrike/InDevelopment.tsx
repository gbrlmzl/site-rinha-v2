'use client';

import {
  Box,
  Button,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useState } from 'react';
import KnifeArt from '@/assets/imgs/cs/Cs2Knife.svg';
import InDevArtDesktop from '@/assets/imgs/cs/Cs2InDevArtDesktop.jpg';
import inDevArtMobile from '@/assets/imgs/cs/Cs2InDevArtMobile.svg';
import inDevArtBlur from '@/assets/imgs/cs/InDevArtBlur.svg';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function InDevelopmentCounterStrike() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const router = useRouter();
  const [knifeLoaded, setKnifeLoaded] = useState(false);

  const handleGoBack = () => {
    router.push('/');
  };

  const navbarOffset = isMobile ? '17.5vh' : '15vh'; // Ajuste para evitar sobreposição com a navbar

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100vw',
        height: '100dvh',
        overflow: 'hidden',
      }}
    >
      <Image
        src={isMobile ? inDevArtMobile : InDevArtDesktop}
        alt="Em desenvolvimento"
        fill
        loading="eager"
        placeholder="blur"
        blurDataURL={inDevArtBlur.src}
        preload
        sizes="100vw"
        style={{ objectFit: 'cover', objectPosition: 'center' }}
      />

      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          pt: navbarOffset,
          px: { xs: 2, sm: 3, md: 4 },
          display: 'grid',
          placeItems: { xs: 'start center', md: 'start center' },
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.35) 100%)',
        }}
      >
        <Stack
          spacing={2}
          alignItems="center"
          sx={{
            textAlign: 'center',
            maxWidth: 560,
            width: '100%',
          }}
        >
          <Typography
            sx={{
              color: 'white',
              fontWeight: 800,
              lineHeight: 1.1,
              fontSize: { xs: '1.45rem', sm: '1.8rem', md: '2.2rem' },
              fontFamily: 'var(--font-russo-one)',
              textShadow: '0 8px 30px rgba(0,0,0,0.65)',
            }}
          >
            Em breve...
          </Typography>
          <Box
            sx={{
              pt: '12vh',
              display: 'inline-flex',
              animation: 'spinCounterClockwise 9s linear infinite',
              transformOrigin: 'center center',
              '@keyframes spinCounterClockwise': {
                from: { transform: 'rotate(0deg)' },
                to: { transform: 'rotate(-360deg)' },
              },
            }}
          >
            <Image
              src={KnifeArt}
              alt="Karambit"
              preload
              loading="eager"
              onLoadingComplete={() => setKnifeLoaded(true)}
              style={{
                objectFit: 'cover',
                objectPosition: 'center',
                opacity: knifeLoaded ? 1 : 0,
                transition: 'opacity 1s ease-in-out',
              }}
            />
          </Box>
          <Button
            variant="contained"
            onClick={handleGoBack}
            sx={{
              borderRadius: 8,
              px: { xs: 4, md: 6 },
              py: 1,
              fontWeight: 700,
              letterSpacing: 0.3,
              backgroundColor: theme.appPalette.primary,
              '&:hover': { backgroundColor: theme.appPalette.primaryHover },
            }}
          >
            Início
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
