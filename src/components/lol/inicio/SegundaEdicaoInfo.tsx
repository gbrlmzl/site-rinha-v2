'use client';

import { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import Image, { type StaticImageData } from 'next/image';
import Link from 'next/link';
import gravesBackground from '@/assets/imgs/gravesSplashFHD.jpg';
import gravesBackgroundMobile from '@/assets/imgs/gravesSplashMobile.jpg';
import { LOL_HOME_TOKENS } from '@/theme';

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
  'DIA 1: FASE DE GRUPOS',
  'DIA 2: FASE FINAL',
  'EQUIPES PODEM TER ATÉ 4 JOGADORES DE FORA DA UFPB',
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
      <Link href="/lol/torneios/" passHref>
        <Button variant="contained" size="large" sx={S.ctaButton}>
          Mais informações
        </Button>
      </Link>

      {
      /*
      <Typography sx={{ ...T.caption, fontSize: { xs: '0.75rem', md: '0.8rem' } }}>
        Ainda não tem uma equipe?
      </Typography>

      <Typography sx={{ ...T.caption, fontSize: { xs: '0.75rem', md: '0.8rem' } }}>
        Inscrições até{' '}
        <Highlight>23 de abril</Highlight>
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
          A SEGUNDA EDIÇÃO VEM AÍ!
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
            Isso mesmo, meus amigos.
          </Typography>

          <Typography sx={{ ...T.body, fontSize: { xs: '0.9rem', md: '1.1rem' }, textAlign: { xs: 'center', md: 'left' } }}>
            Formem suas equipes e se preparem, porque no dia{' '}
            <Highlight>25 de abril</Highlight>{' '}
            começa a segunda edição da Rinha da UFPB!
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