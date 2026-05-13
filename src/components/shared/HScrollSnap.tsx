'use client';

import { Box, type BoxProps } from '@mui/material';

/**
 * Container de carrossel horizontal com scroll-snap nativo + scrollbar oculta.
 * Padrão usado tanto na home de LoL (torneios) quanto na seção Quem Somos.
 *
 * Cada filho direto é responsável por aplicar seu próprio `scrollSnapAlign`
 * (`'start'`, `'center'` ou `'end'`) — mantém o componente livre de mágica.
 */
const HScrollSnap = ({ sx, children, ...rest }: BoxProps) => (
  <Box
    sx={[
      {
        display: 'flex',
        overflowX: 'auto',
        overflowY: 'hidden',
        scrollSnapType: 'x mandatory',
        scrollBehavior: 'smooth',
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': { display: 'none' },
      },
      ...(Array.isArray(sx) ? sx : [sx]),
    ]}
    {...rest}
  >
    {children}
  </Box>
);

export default HScrollSnap;
