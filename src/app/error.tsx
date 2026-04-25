'use client';

import { Box, Button, Stack, Typography } from '@mui/material';
import Image from 'next/image';
import ErrorHeirmerdinger from '@/assets/imgs/ErrorHeirmerdinger.jpg';

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
}) {
  

  const handleReturnHome = () => {
    window.location.href = '/'
  };

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
        src={ErrorHeirmerdinger}
        alt="Tela de erro"
        fill
        priority
        sizes="100vw"
        style={{ objectFit: 'cover', objectPosition: 'center' }}
      />

      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          display: 'grid',
          placeItems: 'center',
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.35) 45%, rgba(0,0,0,0.65) 100%)',
          px: 2,
        }}
      >
        <Stack
          spacing={2}
          alignItems="center"
          sx={{
            textAlign: 'center',
            maxWidth: 560,
          }}
        >
          <Typography
            sx={{
              color: 'white',
              fontWeight: 800,
              lineHeight: 1.1,
              fontSize: { xs: '1.6rem', sm: '2rem', md: '2.3rem' },
              fontFamily: 'var(--font-russo-one)',
              textShadow: '0 8px 30px rgba(0,0,0,0.75)',
            }}
          >
            Algo deu errado por aqui!
          </Typography>

          <Button
            variant="contained"
            onClick={handleReturnHome}
            sx={{
              borderRadius: 8,
              px: { xs: 4, md: 6 },
              py: 1,
              fontWeight: 700,
              letterSpacing: 0.3,
            }}
          >
            INÍCIO
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}