'use client';

import { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import Image, { type StaticImageData } from 'next/image';
import Link from 'next/link';
import gravesBackground from '@/assets/imgs/gravesSplashFHD.jpg';
import gravesBackgroundMobile from '@/assets/imgs/gravesSplashMobile.jpg';
import { LOL_HOME_TOKENS } from '@/theme';
import {WhatsApp} from '@mui/icons-material';
// ─────────────────────────────────────────────────────────────────────────────
// Sub-componentes
// ─────────────────────────────────────────────────────────────────────────────

const { sx: S, typography: T, colors: C } = LOL_HOME_TOKENS;

/** Texto com destaque inline (ex: datas). */
function Highlight({ children }: { children: React.ReactNode }) {
  return (
    <Typography component="span" sx={T.highlight}>
      {children}
    </Typography>
  );
}

/** Imagem de fundo com fade-in ao carregar. Oculta/exibe conforme breakpoint. */
function BackgroundImage({
  src,
  alt,
  objectPosition,
  hideAbove,
  hideBelow,
  priority = false,
}: {
  src: StaticImageData;
  alt: string;
  objectPosition: string;
  hideAbove?: 'lg';
  hideBelow?: 'lg';
  priority?: boolean;
}) {
  const [loaded, setLoaded] = useState(false);

  const display = hideAbove
    ? { xs: 'block', [hideAbove]: 'none' }
    : hideBelow
      ? { xs: 'none', [hideBelow]: 'block' }
      : 'block';

  return (
    <Box sx={{ display }}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        onLoad={() => setLoaded(true)}
        style={{
          objectFit: 'cover',
          objectPosition,
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.6s ease-in-out',
        }}
      />
    </Box>
  );
}

/** Lista de regras do torneio. */
const RULES = [
  'FORMATO SUIÇO',
  '2 DIAS DE TORNEIO',
  'JOGOS NO FINAL DE SEMANA',
] as const;

function RulesList() {
  return (
    <Box sx={S.rulesList}>
      {RULES.map((rule) => (
        <Typography key={rule} sx={{ ...T.body, fontSize: { xs: '0.85rem', md: '1rem' } }}>
          ● {rule}
        </Typography>
      ))}
    </Box>
  );
}

/** Bloco de CTA (botão + texto de apoio). */
function CtaBlock() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: { xs: 'center', md: 'center' },
        gap: 0.5,
        width: { xs: '100%', md: 'auto' },
      }}
    >
      <Link href="https://chat.whatsapp.com/LRSVVOsbRae3i1uRHC2xpl" passHref>
        <Button
          variant="contained"
          size="large"
          sx={{
            ...S.ctaButton,
            backgroundColor: '#25D366',
            '&:hover': { backgroundColor: '#1DA851' },
          }}
          endIcon={<WhatsApp sx={{ fontSize: { xs: 28, md: 32 } }} />}
        >
          Entrar no grupo
        </Button>
      </Link>

      {
        /*
        <Typography sx={{ ...T.caption, fontSize: { xs: '0.75rem', md: '0.8rem' } }}>
          Ainda não tem uma equipe?
        </Typography>
  
        <Typography sx={{ ...T.caption, fontSize: { xs: '0.75rem', md: '0.8rem' } }}>
          Inscrições até{' '}
          <Highlight>25 de maio</Highlight>
        </Typography>
        */
      }
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Componente principal
// ─────────────────────────────────────────────────────────────────────────────

export default function InfoBox() {
  return (
    <Box sx={S.heroSection}>
      {/* Imagens de fundo */}
      <BackgroundImage
        src={gravesBackground}
        alt="Graves — background desktop"
        objectPosition="top right"
        hideBelow="lg"
        priority
      />
      <BackgroundImage
        src={gravesBackgroundMobile}
        alt="Graves — background mobile"
        objectPosition="bottom right"
        hideAbove="lg"
        priority
      />

      {/* Conteúdo — único overlay responsivo (substitui a duplicação mobile/desktop) */}
      <Box sx={S.heroContent}>
        {/* Título principal */}
        <Typography
          sx={{
            ...T.heroTitle,
            fontSize: { xs: '1.4rem', sm: '1.7rem', md: '2.75rem' },
            mb: { xs: 2, md: 4 },
          }}
        >
          ESTAMOS TRABALHANDO NISSO...
        </Typography>

        {/* Corpo de texto */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: { xs: 1.5, md: 2 },
            maxWidth: { xs: '100%', md: '30vw' },
            mb: { xs: 3, md: 4 },
          }}
        >
          <Typography sx={{ ...T.subtitle, fontSize: { xs: '1rem', md: '1.1rem' } }}>
            {/* Texto ligeiramente diferente entre mobile e desktop no original —
                unificado aqui na versão desktop (mais completa). */}
            Meus amigos,
          </Typography>

          <Typography sx={{ ...T.body, fontSize: { xs: '0.9rem', md: '1.1rem' }, textAlign: { xs: 'center', md: 'left' } }}>
            Estamos analisando os cenários e planejando a <Highlight>Segunda Edição</Highlight> da Rinha do Campus IV.  Em breve teremos novidades sobre o formato, datas e inscrições.
          </Typography>

          <Typography sx={{ ...T.subtitle, fontSize: { xs: '0.9rem', md: '1rem' } }}>
            Dessa vez, com um novo formato:
          </Typography>

          <RulesList />
        </Box>

        <CtaBlock />
      </Box>
    </Box>
  );
}