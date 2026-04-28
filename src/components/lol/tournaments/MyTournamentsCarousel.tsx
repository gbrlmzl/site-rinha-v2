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
  // Adicionamos um backdrop-filter sutil para o botão se destacar ainda mais sobre o fundo
  backdropFilter: 'blur(4px)',
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

  const showLeftFade = safeIndex > 0;
  const showRightFade = safeIndex < maxIndex;

  // 0.05 = Praticamente invisível na ponta.
  // 60px = Distância do degradê (cobre a largura do botão + um pequeno respiro).
  let fadeMask = 'none';
  if (showLeftFade && showRightFade) {
    fadeMask =
      'linear-gradient(to right, rgba(0,0,0,0.05) 0%, rgba(0,0,0,1) 60px, rgba(0,0,0,1) calc(100% - 60px), rgba(0,0,0,0.05) 100%)';
  } else if (showLeftFade) {
    fadeMask =
      'linear-gradient(to right, rgba(0,0,0,0.05) 0%, rgba(0,0,0,1) 60px)';
  } else if (showRightFade) {
    fadeMask =
      'linear-gradient(to left, rgba(0,0,0,0.05) 0%, rgba(0,0,0,1) 60px)';
  }

  return (
    <>
      {/* DESKTOP VIEW (900px ou mais) - Navegação por Setas Sobrepostas */}
      <Box
        sx={{
          display: { xs: 'none', md: 'block' }, // Mudou para block para usar relative
          position: 'relative', // Essencial para ancorar os botões
        }}
      >
        {/* BOTÃO VOLTAR - Absoluto na Esquerda */}
        {showArrows && (
          <Box
            sx={{
              position: 'absolute',
              left: -18, // Puxa metade do botão pra fora. Troque por 8 se quiser totalmente dentro
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 2, // Garante que a seta fique por cima do fade e dos cards
            }}
          >
            <IconButton
              onClick={prev}
              disabled={safeIndex === 0}
              sx={NAV_BTN_SX}
            >
              <ChevronLeftRoundedIcon />
            </IconButton>
          </Box>
        )}

        {/* CONTAINER DOS CARDS (A Máscara vai apenas aqui) */}
        <Box
          sx={{
            overflow: 'hidden',
            maskImage: fadeMask,
            WebkitMaskImage: fadeMask, // Necessário para Safari e Chrome
            // Adicionado um pequeno padding horizontal para o card não colar na borda do container caso precise
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

        {/* BOTÃO AVANÇAR - Absoluto na Direita */}
        {showArrows && (
          <Box
            sx={{
              position: 'absolute',
              right: -18, // Puxa metade do botão pra fora. Troque por 8 se quiser totalmente dentro
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 2,
            }}
          >
            <IconButton
              onClick={next}
              disabled={safeIndex >= maxIndex}
              sx={NAV_BTN_SX}
            >
              <ChevronRightRoundedIcon />
            </IconButton>
          </Box>
        )}
      </Box>

      {/* MOBILE & TABLET VIEW (Até 899px) - Navegação por Swipe Nativo */}
      <Box
        sx={{
          display: { xs: 'flex', md: 'none' },
          gap: `${GAP}px`,
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none',
          alignItems: 'stretch',
          '&::-webkit-scrollbar': { display: 'none' },
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
