"use client";

import { Box, Button, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import InDevArtMobile from '@/assets/imgs/valorant/InDevArtMobile.svg';
import InDevArtDesktop from '@/assets/imgs/valorant/InDevArtDesktop.svg';
import Image from 'next/image';
import { useRouter } from 'next/navigation';


export default function InDevelopmentValorant() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const router = useRouter();

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
                src={isMobile ? InDevArtMobile : InDevArtDesktop}
                alt="Página em desenvolvimento"
                fill
                priority
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
                    placeItems: { xs: 'start center', md: 'center' },
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.35) 100%)',
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
                            textShadow: '0 8px 30px rgba(0,0,0,0.65)',
                        }}
                    >
                        Página em desenvolvimento...
                    </Typography>

                    <Button
                        variant="contained"
                        onClick={handleGoBack}
                        sx={{
                            borderRadius: 8,
                            px: { xs: 4, md: 6},
                            py: 1,
                            fontWeight: 700,
                            letterSpacing: 0.3,
                            backgroundColor: '#ff4655',
                            '&:hover': { backgroundColor: '#d93b49' },
                        }}
                    >
                        Início
                    </Button>
                </Stack>
            </Box>
        </Box>
    );
}