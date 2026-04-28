'use client';

import { useAuthContext } from '@/contexts/AuthContext';
import { useTournament } from '@/hooks/lol/tournaments/useTournament';
import { useTournamentPaymentApproved } from '@/hooks/lol/tournaments/useTournamentPaymentApproved';
import { PAYMENT_FEE_PER_PLAYER } from '@/hooks/lol/teamRegistration/teamRegistrationConstants';
import {
  TEAM_STATUS_LABELS,
  TournamentDetailData,
} from '@/types/lol/tournaments/tournament';
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useEffect, useState, type ReactNode } from 'react';
import TournamentStatusBadge from '@/components/shared/badges/TournamentStatusBadge';
import TeamAccordionItem from './TeamAccordionItem';
import StatChip from '../shared/StatChip';
import {
  LOL_TOURNAMENT_COLORS as C,
  LOL_TOURNAMENT_SX,
  LOL_TOURNAMENT_TYPOGRAPHY as T,
} from '../tournamentsTheme';
import {
  formatDateLong,
  formatDateMonth,
  formatPrize,
} from '@/utils/tournaments/formatters';

const RULE_BULLETS = [
  'Início pontual no horário marcado.',
  'Respeito mútuo entre participantes.',
  'Uso de hack/cheat causa banimento.',
];

interface Props {
  slug: string;
}

export default function TournamentDetailPage({ slug }: Props) {
  const router = useRouter();
  useAuthContext();
  const { getTournamentDetailBySlug } = useTournament();

  const [tournament, setTournament] = useState<TournamentDetailData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const loadTournament = () =>
    getTournamentDetailBySlug(slug).then((data) => {
      if (data) setTournament(data);
      else setNotFound(true);
      setLoading(false);
    });

  useEffect(() => {
    loadTournament();
  }, [slug]);

  // Atualiza dados (status do usuário, equipes confirmadas) sempre que
  // um pagamento é aprovado — cobre o caso do usuário abrir o PaymentModal
  // a partir desta página e completar o PIX.
  useTournamentPaymentApproved(loadTournament);

  if (loading) {
    return (
      <Box sx={CENTER_60VH}>
        <CircularProgress sx={{ color: C.primary }} />
      </Box>
    );
  }

  if (notFound || !tournament) {
    return (
      <Box sx={{ ...CENTER_60VH, flexDirection: 'column', gap: 2 }}>
        <Typography sx={{ color: C.text, fontWeight: 700, fontSize: '1.4rem' }}>
          Torneio não encontrado
        </Typography>
        <Button
          variant="outlined"
          onClick={() => router.push('/lol/torneios')}
          sx={{ borderColor: C.primary, color: C.primary }}
        >
          Voltar aos torneios
        </Button>
      </Box>
    );
  }

  const remainingSpots = tournament.maxTeams - tournament.confirmedTeamsCount;
  const userTeam = tournament.userTeam;

  const userHasVisibleTeam =
    userTeam?.teamStatus === 'PENDING_PAYMENT' ||
    userTeam?.teamStatus === 'READY' ||
    userTeam?.teamStatus === 'FINISHED' ||
    userTeam?.teamStatus === 'BANNED';

  // Filtra a equipe do usuário da lista de confirmadas pra evitar duplicação
  const confirmedTeamsFiltered = userTeam
    ? tournament.confirmedTeams.filter((t) => t.name !== userTeam.teamName)
    : tournament.confirmedTeams;

  // CTA: PENDING_PAYMENT mantém o botão habilitado e roteia pra /pagamentos
  // (interceptor @modal mostra o PaymentModal sobre esta página)
  let btnDisabled = false;
  let btnLabel = 'Inscreva-se';
  let btnTarget: 'inscricoes' | 'pagamentos' = 'inscricoes';

  if (userTeam) {
    const ts = userTeam.teamStatus;
    if (ts === 'BANNED') {
      btnDisabled = true;
      btnLabel = 'Você foi banido';
    } else if (ts === 'PENDING_PAYMENT') {
      btnLabel = 'Pagar agora';
      btnTarget = 'pagamentos';
    } else if (ts === 'READY' || ts === 'FINISHED') {
      btnDisabled = true;
      btnLabel = 'Já Inscrito';
    }
    // EXPIRED_PAYMENT, EXPIRED_PAYMENT_PROBLEM, CANCELED → permite reinscrição
  }

  if (!btnDisabled) {
    if (tournament.status === 'FULL') {
      btnDisabled = true;
      btnLabel = 'Vagas Esgotadas';
    } else if (
      tournament.status === 'ONGOING' ||
      tournament.status === 'FINISHED'
    ) {
      btnDisabled = true;
      btnLabel = 'Inscrições Encerradas';
    }
  }

  const targetPath =
    btnTarget === 'pagamentos'
      ? `/lol/torneios/${tournament.slug}/pagamentos`
      : `/lol/torneios/${tournament.slug}/inscricoes`;

  return (
    <Box sx={{ backgroundColor: C.bg, minHeight: '100vh' }}>
      <Box sx={{ position: 'relative', overflow: 'hidden' }}>
        <Box
          sx={{ height: { xs: 220, md: 420, lg: 500 }, position: 'relative' }}
        >
          <Image
            src={tournament.imageUrl}
            alt={tournament.name}
            fill
            referrerPolicy="no-referrer"
            style={{
              objectFit: 'cover',
              objectPosition: 'top center',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(to top, #080d2e 0%, rgba(8,13,46,0.4) 50%, transparent 100%)',
            }}
          />
        </Box>

        <Box
          sx={{
            display: { xs: 'none', md: 'block' },
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            px: { md: 6, lg: 10 },
            pb: 5,
          }}
        >
          <HeroContent tournament={tournament} />
        </Box>
      </Box>

      <Box sx={{ display: { xs: 'block', md: 'none' }, px: 2, pt: 2, pb: 1 }}>
        <HeroContent tournament={tournament} />
      </Box>

      <Box
        sx={{
          maxWidth: 1200,
          mx: 'auto',
          px: { xs: 2, md: 4, lg: 6 },
          pt: { xs: 3, md: 5 },
          pb: 8,
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
            gap: { xs: 4, lg: 6 },
            alignItems: 'start',
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {tournament.description && (
              <Box>
                <SectionTitle>Sobre o Torneio</SectionTitle>
                <Typography
                  sx={{
                    color: 'rgba(255,255,255,0.65)',
                    fontSize: '0.95rem',
                    lineHeight: 1.8,
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {tournament.description}
                </Typography>
              </Box>
            )}

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <SectionTitle>Detalhes do Torneio</SectionTitle>
              <Box
                sx={{ ...LOL_TOURNAMENT_SX.panelCard, p: { xs: 2.5, md: 2 } }}
              >
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                    gap: 3,
                  }}
                >
                  <Box>
                    <Typography sx={{ ...T.microLabel, mb: 1.5 }}>
                      Cronograma
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1.5,
                      }}
                    >
                      <InfoRow
                        label="Início em"
                        value={formatDateLong(tournament.startsAt)}
                      />
                      {tournament.endsAt && (
                        <InfoRow
                          label="Término em"
                          value={formatDateLong(tournament.endsAt)}
                        />
                      )}
                    </Box>
                  </Box>

                  <Box>
                    <Typography sx={{ ...T.microLabel, mb: 1.5 }}>
                      Regras Gerais
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 0.8,
                      }}
                    >
                      {RULE_BULLETS.map((rule) => (
                        <Typography
                          key={rule}
                          sx={{
                            color: C.text,
                            lineHeight: 1.5,
                            fontWeight: 700,
                            fontSize: '1rem',
                            mt: 0.2,
                          }}
                        >
                          • {rule}
                        </Typography>
                      ))}
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>

            <Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mb: 2.5,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <GroupsRoundedIcon sx={{ color: C.primary, fontSize: 22 }} />
                  <SectionTitle>Equipes Confirmadas</SectionTitle>
                </Box>
                <Typography
                  sx={{
                    color: 'rgba(255,255,255,0.4)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                  }}
                >
                  {tournament.confirmedTeamsCount} / {tournament.maxTeams} Vagas
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {userTeam && userHasVisibleTeam && (
                  <TeamAccordionItem
                    team={{
                      id: 0,
                      name: userTeam.teamName,
                      shieldUrl: userTeam.teamShieldUrl,
                      captainNickname: userTeam.captainNickname ?? '—',
                      players: userTeam.players,
                    }}
                    highlighted
                    highlightLabel="Sua Equipe"
                    statusNote={
                      userTeam.teamStatus === 'PENDING_PAYMENT'
                        ? TEAM_STATUS_LABELS.PENDING_PAYMENT
                        : undefined
                    }
                  />
                )}

                {confirmedTeamsFiltered.length > 0 ? (
                  confirmedTeamsFiltered.map((team) => (
                    <TeamAccordionItem key={team.id} team={team} />
                  ))
                ) : !userHasVisibleTeam ? (
                  <Box
                    sx={{
                      textAlign: 'center',
                      py: 6,
                      border: '2px dashed rgba(255,255,255,0.1)',
                      borderRadius: 3,
                    }}
                  >
                    <GroupsRoundedIcon
                      sx={{
                        fontSize: 40,
                        color: 'rgba(255,255,255,0.12)',
                        mb: 1,
                      }}
                    />
                    <Typography
                      sx={{
                        color: 'rgba(255,255,255,0.35)',
                        fontSize: '0.9rem',
                      }}
                    >
                      Nenhuma equipe confirmada ainda. Seja o primeiro!
                    </Typography>
                  </Box>
                ) : null}
              </Box>
            </Box>
          </Box>

          <Box>
            <Box
              sx={{
                ...LOL_TOURNAMENT_SX.panelCard,
                position: { xs: 'static', lg: 'sticky' },
                top: 88,
                p: { xs: 2.5, md: 3 },
              }}
            >
              <Typography
                sx={{
                  color: C.text,
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  mb: 3,
                  textAlign: 'center',
                }}
              >
                Inscreva-se Agora!
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <FeeRow label="Taxa por Inscrição">
                  R${' '}
                  {PAYMENT_FEE_PER_PLAYER.toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                  })}{' '}
                  por jogador
                </FeeRow>
                <Divider sx={{ borderColor: 'rgba(255,255,255,0.07)' }} />
                <FeeRow label="Vagas Restantes">
                  <Typography
                    component="span"
                    sx={{
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      color: remainingSpots <= 4 ? '#ff6b6b' : C.success,
                    }}
                  >
                    {remainingSpots}
                  </Typography>
                </FeeRow>
                <Divider sx={{ borderColor: 'rgba(255,255,255,0.07)' }} />
              </Box>

              <Box
                sx={{
                  mt: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1.5,
                }}
              >
                <Button
                  variant="contained"
                  fullWidth
                  disabled={btnDisabled}
                  onClick={() => {
                    if (btnDisabled) return;
                    router.push(targetPath);
                  }}
                  sx={{
                    ...LOL_TOURNAMENT_SX.primaryCta,
                    fontSize: '0.9rem',
                    py: 1.6,
                  }}
                >
                  {btnLabel}
                </Button>

                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<DescriptionRoundedIcon />}
                  href={tournament.rulesUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    ...LOL_TOURNAMENT_SX.outlinedSecondary,
                    fontSize: '0.8rem',
                    py: 1.2,
                  }}
                >
                  Ler Regras Completas
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

const CENTER_60VH = {
  minHeight: '60vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
} as const;

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <Typography
      sx={{
        color: C.text,
        fontWeight: 800,
        fontSize: { xs: '1.1rem', md: '1.25rem' },
      }}
    >
      {children}
    </Typography>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <Box>
      <Typography sx={T.infoLabel}>{label}</Typography>
      <Typography
        sx={{ color: C.text, fontWeight: 700, fontSize: '1rem', mt: 0.2 }}
      >
        {value}
      </Typography>
    </Box>
  );
}

function FeeRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        py: 1.5,
      }}
    >
      <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>
        {label}
      </Typography>
      <Typography sx={{ color: C.text, fontWeight: 700, fontSize: '0.9rem' }}>
        {children}
      </Typography>
    </Box>
  );
}

function HeroContent({ tournament }: { tournament: TournamentDetailData }) {
  return (
    <Stack spacing={1.5}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <TournamentStatusBadge status={tournament.status} />
      </Box>

      <Typography
        sx={{
          ...T.heroTitle,
          fontSize: { xs: '2rem', md: '3.5rem', lg: '4.5rem' },
          lineHeight: 1,
          textShadow: '0 2px 20px rgba(0,0,0,0.6)',
          letterSpacing: -0.5,
        }}
      >
        {tournament.name}
      </Typography>

      <Stack direction="row" spacing={1.5} sx={{ flexWrap: 'wrap', gap: 1 }}>
        <StatChip
          icon={
            <CalendarTodayRoundedIcon
              sx={{ fontSize: 16, color: 'rgba(255,255,255,0.7)' }}
            />
          }
        >
          {formatDateMonth(tournament.startsAt)}
        </StatChip>
        <StatChip
          icon={<GroupsRoundedIcon sx={{ fontSize: 16, color: C.primary }} />}
        >
          {tournament.confirmedTeamsCount}/{tournament.maxTeams} Equipes
        </StatChip>
        <StatChip
          icon={
            <EmojiEventsRoundedIcon
              sx={{ fontSize: 16, color: C.statusFull }}
            />
          }
          valueColor={C.statusFull}
        >
          {formatPrize(tournament.prizePool)}
        </StatChip>
      </Stack>
    </Stack>
  );
}
