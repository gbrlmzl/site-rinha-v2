'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Box, Grid, useMediaQuery, useTheme } from '@mui/material';
import { useState } from 'react';

// Mobile arts (logo já embutida na imagem)
import LolArtMobile    from '@/assets/imgs/lol/LolHomeArtMobile.svg';
import CsArtMobile     from '@/assets/imgs/cs/CS2HomeArtMobile.svg';
import ValorantArtMobile from '@/assets/imgs/valorant/ValorantHomeArtMobile.svg';

// Desktop arts (arte de fundo sem logo)
import LolArtDesktop      from '@/assets/imgs/lol/DravenHomeArt.svg';
import CsArtDesktop       from '@/assets/imgs/cs/CsHomeArt.svg';
import ValorantArtDesktop from '@/assets/imgs/valorant/ValorantHomeArtDesktop.svg';

// Logos (somente desktop)
import LolLogo      from '@/assets/imgs/lol/LolHomeLogo.svg';
import CsLogo       from '@/assets/imgs/cs/CsHomeLogo.svg';
import ValorantLogo from '@/assets/imgs/valorant/ValorantHomeLogo.svg';

//Desktop Arts FullHD(1920x1080) para resoluções maiores
import LolArtDesktopFullHD      from '@/assets/imgs/lol/DravenHomeArtFullHD.svg';
import CsArtDesktopFullHD       from '@/assets/imgs/cs/CsHomeArtFullHD.svg';
import ValorantArtDesktopFullHD from '@/assets/imgs/valorant/ValorantHomeArtDesktopFullHD.svg';

// ─── Dados dos jogos ──────────────────────────────────────────────────────────
const games = [
  {
    id:         'lol',
    route:      '/lol',
    artMobile:  LolArtMobile,
    artDesktop: LolArtDesktop,
    artDesktopFullHD: LolArtDesktopFullHD,
    logo:       LolLogo,
    alt:        'League of Legends',
  },
  {
    id:         'cs',
    route:      '/cs',
    artMobile:  CsArtMobile,
    artDesktop: CsArtDesktop,
    artDesktopFullHD: CsArtDesktopFullHD,
    logo:       CsLogo,
    alt:        'Counter Strike 2',
  },
  {
    id:         'valorant',
    route:      '/valorant',
    artMobile:  ValorantArtMobile,
    artDesktop: ValorantArtDesktop,
    artDesktopFullHD: ValorantArtDesktopFullHD,
    logo:       ValorantLogo,
    alt:        'Valorant',
  },
];

// ─── Componente principal ─────────────────────────────────────────────────────
export default function Inicio() {
  const router  = useRouter();
  const theme   = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isFullHD = useMediaQuery('(min-width:1920px)');

  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // ── MOBILE ──────────────────────────────────────────────────────────────────
  if (isMobile) {
    return (
      <Grid
        container
        spacing={0}
        sx={{ width: '100vw', minHeight: '100dvh', m: 0 }}
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
              sizes="100vw"
              style={{ objectFit: 'cover', cursor: 'pointer' }}
              onClick={() => router.push(game.route)}
            />
          </Grid>
        ))}
      </Grid>
    );
  }

  // ── DESKTOP ──────────────────────────────────────────────────────────────────
  return (
    <Box
      sx={{
        display:       'flex',
        flexDirection: 'row',
        width:         '100vw',
        minHeight:     '100dvh',
        overflow:      'hidden',
        // Divisórias entre os painéis
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
              flex:     1,
              position: 'relative',
              overflow: 'hidden',
              cursor:   'pointer',
              // Escurece levemente os painéis vizinhos quando um está em hover
              filter: hoveredId && !isHovered ? 'brightness(0.65)' : 'brightness(1)',
              transition: 'filter 0.4s ease',
            }}
          >
            {/* Arte de fundo — faz o zoom */}
            <Box
              sx={{
                position:   'absolute',
                inset:      0,
                transform:  isHovered ? 'scale(1.06)' : 'scale(1)',
                transition: 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                willChange: 'transform',
              }}
            >
              <Image
                src={game.artDesktopFullHD}
                alt={game.alt}
                fill
                sizes="33vw"
                style={{ objectFit: 'cover' }}
                priority
              />
            </Box>

            {/* Logo — fica estática, não sofre zoom */}
            <Box
              sx={{
                position:       'absolute',
                bottom:         '12%',
                left:           '50%',
                transform:      'translateX(-50%)',
                width:          '70%',
                maxWidth:       260,
                pointerEvents:  'none',
                // Sobe levemente no hover para dar sensação de destaque
                marginBottom:   isHovered ? '8px' : '0px',
                transition:     'margin-bottom 0.4s ease',
                zIndex:         2,
              }}
            >
              <Image
                src={game.logo}
                alt={`${game.alt} logo`}
                width={260}
                height={120}
                style={{
                  width:     '100%',
                  height:    'auto',
                  objectFit: 'contain',
                  filter:    isHovered
                    ? 'drop-shadow(0 4px 24px rgba(0,0,0,0.7))'
                    : 'drop-shadow(0 2px 8px rgba(0,0,0,0.4))',
                  transition: 'filter 0.4s ease',
                }}
              />
            </Box>

            {/* Gradiente de fundo para destacar a logo */}
            <Box
              sx={{
                position:   'absolute',
                bottom:     0,
                left:       0,
                right:      0,
                height:     '45%',
                background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)',
                zIndex:     1,
                transition: 'opacity 0.4s ease',
                opacity:    isHovered ? 1 : 0.7,
              }}
            />
          </Box>
        );
      })}
    </Box>
  );
}