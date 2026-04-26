'use client';

import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import { Box, IconButton } from '@mui/material';
import React, { useState } from 'react';

const CARD_WIDTH = 320;
const GAP = 16;
const DESKTOP_VISIBLE = 3;

const NAV_BTN_SX = {
  backgroundColor: 'rgba(255,255,255,0.08)',
  color: '#ffffff',
  border: '1px solid rgba(255,255,255,0.15)',
  borderRadius: '50%',
  width: 36,
  height: 36,
  flexShrink: 0,
  '&:hover': { backgroundColor: 'rgba(255,255,255,0.18)' },
  '&.Mui-disabled': { opacity: 0.25, pointerEvents: 'none' },
};

interface Props {
  items: React.ReactNode[];
}

export default function MyTournamentsCarousel({ items }: Props) {
  const [index, setIndex] = useState(0);

  const count = items.length;
  const maxIndex = Math.max(0, count - DESKTOP_VISIBLE);
  const safeIndex = Math.min(index, maxIndex);
  const showArrows = count > DESKTOP_VISIBLE;

  function prev() {
    setIndex((i) => Math.max(0, i - 1));
  }

  function next() {
    setIndex((i) => Math.min(maxIndex, i + 1));
  }

  return (
    <>
      {/* Desktop: fixed-width cards, arrow navigation */}
      <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
        {showArrows && (
          <IconButton onClick={prev} disabled={safeIndex === 0} sx={NAV_BTN_SX}>
            <ChevronLeftRoundedIcon />
          </IconButton>
        )}

        <Box sx={{ flex: 1, overflow: 'hidden' }}>
          <Box
            sx={{
              display: 'flex',
              gap: `${GAP}px`,
              transform: `translateX(-${safeIndex * (CARD_WIDTH + GAP)}px)`,
              transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            {items.map((item, i) => (
              <Box key={i} sx={{ flexShrink: 0, width: CARD_WIDTH }}>
                {item}
              </Box>
            ))}
          </Box>
        </Box>

        {showArrows && (
          <IconButton onClick={next} disabled={safeIndex >= maxIndex} sx={NAV_BTN_SX}>
            <ChevronRightRoundedIcon />
          </IconButton>
        )}
      </Box>

      {/* Mobile: 1 card per view with peek of next, swipeable, no scrollbar */}
      <Box
        sx={{
          display: { xs: 'flex', md: 'none' },
          gap: `${GAP}px`,
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
        }}
      >
        {items.map((item, i) => (
          <Box
            key={i}
            sx={{
              minWidth: 'calc(100% - 48px)',
              scrollSnapAlign: 'start',
              flexShrink: 0,
            }}
          >
            {item}
          </Box>
        ))}
      </Box>
    </>
  );
}
