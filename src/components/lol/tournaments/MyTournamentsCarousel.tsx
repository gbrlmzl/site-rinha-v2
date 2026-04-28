'use client';

import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import { Box, IconButton } from '@mui/material';
import { useState, type ReactNode } from 'react';
import { LOL_TOURNAMENT_SX } from './tournamentsTheme';

const CARD_WIDTH = 320;
const GAP = 16;
const DESKTOP_VISIBLE = 3;
const FADE_DISTANCE = 60;

const NAV_BTN_SX = {
  ...LOL_TOURNAMENT_SX.navButton,
  width: 36,
  height: 36,
  flexShrink: 0,
};

interface Props {
  items: ReactNode[];
}

export default function MyTournamentsCarousel({ items }: Props) {
  const [index, setIndex] = useState(0);

  const count = items.length;
  const maxIndex = Math.max(0, count - DESKTOP_VISIBLE);
  const safeIndex = Math.min(index, maxIndex);
  const showArrows = count > DESKTOP_VISIBLE;

  const showLeftFade = safeIndex > 0;
  const showRightFade = safeIndex < maxIndex;

  // Máscara translúcida nas pontas que sugere conteúdo cortado
  let fadeMask = 'none';
  if (showLeftFade && showRightFade) {
    fadeMask = `linear-gradient(to right, rgba(0,0,0,0.05) 0%, rgba(0,0,0,1) ${FADE_DISTANCE}px, rgba(0,0,0,1) calc(100% - ${FADE_DISTANCE}px), rgba(0,0,0,0.05) 100%)`;
  } else if (showLeftFade) {
    fadeMask = `linear-gradient(to right, rgba(0,0,0,0.05) 0%, rgba(0,0,0,1) ${FADE_DISTANCE}px)`;
  } else if (showRightFade) {
    fadeMask = `linear-gradient(to left, rgba(0,0,0,0.05) 0%, rgba(0,0,0,1) ${FADE_DISTANCE}px)`;
  }

  return (
    <>
      {/* Desktop: setas absolutas + máscara nas pontas */}
      <Box sx={{ display: { xs: 'none', md: 'block' }, position: 'relative' }}>
        {showArrows && (
          <Box
            sx={{
              position: 'absolute',
              left: -18,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 2,
            }}
          >
            <IconButton
              onClick={() => setIndex((i) => Math.max(0, i - 1))}
              disabled={safeIndex === 0}
              sx={NAV_BTN_SX}
            >
              <ChevronLeftRoundedIcon />
            </IconButton>
          </Box>
        )}

        <Box
          sx={{
            overflow: 'hidden',
            maskImage: fadeMask,
            WebkitMaskImage: fadeMask,
            px: 1,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              gap: `${GAP}px`,
              transform: `translateX(-${safeIndex * (CARD_WIDTH + GAP)}px)`,
              transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
              alignItems: 'stretch',
            }}
          >
            {items.map((item, i) => (
              <Box
                key={i}
                sx={{
                  flexShrink: 0,
                  width: CARD_WIDTH,
                  display: 'flex',
                  '& > *': { width: '100%' },
                }}
              >
                {item}
              </Box>
            ))}
          </Box>
        </Box>

        {showArrows && (
          <Box
            sx={{
              position: 'absolute',
              right: -18,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 2,
            }}
          >
            <IconButton
              onClick={() => setIndex((i) => Math.min(maxIndex, i + 1))}
              disabled={safeIndex >= maxIndex}
              sx={NAV_BTN_SX}
            >
              <ChevronRightRoundedIcon />
            </IconButton>
          </Box>
        )}
      </Box>

      {/* Mobile/tablet: swipe nativo com scroll-snap */}
      <Box
        sx={{
          ...LOL_TOURNAMENT_SX.hScrollNoScrollbar,
          display: { xs: 'flex', md: 'none' },
          gap: `${GAP}px`,
          alignItems: 'stretch',
        }}
      >
        {items.map((item, i) => (
          <Box
            key={i}
            sx={{
              minWidth: { xs: 'calc(100% - 48px)', sm: CARD_WIDTH },
              scrollSnapAlign: 'start',
              flexShrink: 0,
              display: 'flex',
              '& > *': { width: '100%' },
            }}
          >
            {item}
          </Box>
        ))}
      </Box>
    </>
  );
}
