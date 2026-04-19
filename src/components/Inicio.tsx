'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Box, Grid } from '@mui/material';
import { useState } from 'react';

// Mobile arts (logo já embutida na imagem)
import LolArtMobile from '@/assets/imgs/lol/LolHomeArtMobile.jpg';
import CsArtMobile from '@/assets/imgs/cs/CS2HomeArtMobile.jpg';
import ValorantArtMobile from '@/assets/imgs/valorant/ValorantHomeArtMobile.jpg';

// Desktop arts (arte de fundo sem logo)
import LolArtDesktop from '@/assets/imgs/lol/DravenHomeArt.svg';
import CsArtDesktop from '@/assets/imgs/cs/CsHomeArt.svg';
import ValorantArtDesktop from '@/assets/imgs/valorant/ValorantHomeArtDesktop.png';

// Logos (somente desktop)
import LolLogo from '@/assets/imgs/lol/LolHomeLogo.png';
import CsLogo from '@/assets/imgs/cs/CsHomeLogo.png';
import ValorantLogo from '@/assets/imgs/valorant/ValorantHomeLogo.png';

//Desktop Arts FullHD(1920x1080) para resoluçõe-s maiores
import LolArtDesktopFullHD from '@/assets/imgs/lol/DravenHomeArt.jpg';
import CsArtDesktopFullHD from '@/assets/imgs/cs/CsHomeArtFullHD.jpg';
import ValorantArtDesktopFullHD from '@/assets/imgs/valorant/ValorantHomeArtDesktop.png';

// ─── Dados dos jogos ──────────────────────────────────────────────────────────
const games = [
  {
    id: 'lol',
    route: '/lol',
    artMobile: LolArtMobile,
    artDesktop: LolArtDesktop,
    artDesktopFullHD: LolArtDesktopFullHD,
    logo: LolLogo,
    alt: 'League of Legends',
  },
  {
    id: 'cs',
    route: '/cs',
    artMobile: CsArtMobile,
    artDesktop: CsArtDesktop,
    artDesktopFullHD: CsArtDesktopFullHD,
    logo: CsLogo,
    alt: 'Counter Strike 2',
  },
  {
    id: 'valorant',
    route: '/valorant',
    artMobile: ValorantArtMobile,
    artDesktop: ValorantArtDesktop,
    artDesktopFullHD: ValorantArtDesktopFullHD,
    logo: ValorantLogo,
    alt: 'Valorant',
  },
];

// ─── Componente principal ─────────────────────────────────────────────────────
export default function Inicio() {
  const router = useRouter();

  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <>
      <Grid
        container
        spacing={0}
        sx={{
          width: '100vw',
          minHeight: '100dvh',
          m: 0,
          display: { xs: 'flex', md: 'none' },
        }}
      >
        {games.map((game) => (
          <Grid
            key={game.id}
            size={12}
            sx={{ position: 'relative', width: '100%', minHeight: '33.333dvh' }}
          >
            <Image
              src={game.artMobile}
              alt={game.alt}
              fill
              preload
              sizes="100vw"
              style={{ objectFit: 'cover', cursor: 'pointer' }}
              onClick={() => router.push(game.route)}
            />
          </Grid>
        ))}
      </Grid>

      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'row',
          width: '100vw',
          minHeight: '100dvh',
          overflow: 'hidden',
          '& > *:not(:last-child)': {
            borderRight: '3px solid #0E1241',
          },
        }}
      >
        {games.map((game) => {
          const isHovered = hoveredId === game.id;

          return (
            <Box
              key={game.id}
              onClick={() => router.push(game.route)}
              onMouseEnter={() => setHoveredId(game.id)}
              onMouseLeave={() => setHoveredId(null)}
              sx={{
                flex: 1,
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer',
                filter:
                  hoveredId && !isHovered
                    ? 'brightness(0.65)'
                    : 'brightness(1)',
                transition: 'filter 0.4s ease',
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  transform: isHovered ? 'scale(1.06)' : 'scale(1)',
                  transition:
                    'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  willChange: 'transform',
                }}
              >
                <Image
                  src={game.artDesktopFullHD}
                  alt={game.alt}
                  fill
                  sizes="33vw"
                  style={{ objectFit: 'cover' }}
                  preload={true}
                />
              </Box>

              <Box
                sx={{
                  position: 'absolute',
                  bottom: '12%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '70%',
                  maxWidth: 260,
                  pointerEvents: 'none',
                  marginBottom: isHovered ? '8px' : '0px',
                  transition: 'margin-bottom 0.4s ease',
                  zIndex: 2,
                }}
              >
                <Image
                  src={game.logo}
                  alt={`${game.alt} logo`}
                  width={260}
                  height={120}
                  style={{
                    width: '100%',
                    height: 'auto',
                    objectFit: 'contain',
                    filter: isHovered
                      ? 'drop-shadow(0 4px 24px rgba(0,0,0,0.7))'
                      : 'drop-shadow(0 2px 8px rgba(0,0,0,0.4))',
                    transition: 'filter 0.4s ease',
                  }}
                />
              </Box>

              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '45%',
                  background:
                    'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)',
                  zIndex: 1,
                  transition: 'opacity 0.4s ease',
                  opacity: isHovered ? 1 : 0.7,
                }}
              />
            </Box>
          );
        })}
      </Box>
    </>
  );
}
