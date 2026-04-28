'use client';

import { useAuthContext } from '@/contexts/AuthContext';
import { useTournament } from '@/hooks/lol/tournaments/useTournament';
import { useTournamentPaymentApproved } from '@/hooks/lol/tournaments/useTournamentPaymentApproved';
import { PAYMENT_FEE_PER_PLAYER } from '@/hooks/lol/teamRegistration/teamRegistrationConstants';
import {
  TEAM_STATUS_LABELS,
  TournamentDetailData,
} from '@/types/lol/tournaments/tournament';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import TournamentStatusBadge from '../explorer/TournamentStatusBadge';
import TeamAccordionItem from './TeamAccordionItem';
import Image from 'next/image';

function formatDateLong(iso: string) {
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatPrize(value: number) {
  return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}`;
}

interface Props {
  slug: string;
}

export default function TournamentDetailPage({ slug }: Props) {
  const router = useRouter();
  const { isAuthenticated } = useAuthContext();
  const { getTournamentDetailBySlug } = useTournament();

  const [tournament, setTournament] = useState<TournamentDetailData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  function loadTournament() {
    return getTournamentDetailBySlug(slug).then((data) => {
      if (data) setTournament(data);
      else setNotFound(true);
      setLoading(false);
    });
  }

  useEffect(() => {
    loadTournament();
  }, [slug]);

  // Refresh tournament data (user team status, confirmed teams, etc.)
  // whenever a payment is approved — covers the case where the user opens
  // the PaymentModal from this page and completes the PIX.
  useTournamentPaymentApproved(loadTournament);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress sx={{ color: '#11B5E4' }} />
      </Box>
    );
  }

  if (notFound || !tournament) {
    return (
      <Box
        sx={{
          minHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
        }}
      >
        <Typography
          sx={{ color: '#ffffff', fontWeight: 700, fontSize: '1.4rem' }}
        >
          Torneio não encontrado
        </Typography>
        <Button
          variant="outlined"
          onClick={() => router.push('/lol/torneios')}
          sx={{ borderColor: '#11B5E4', color: '#11B5E4' }}
        >
          Voltar aos torneios
        </Button>
      </Box>
    );
  }

  const remainingSpots = tournament.maxTeams - tournament.confirmedTeamsCount;
  const userTeam = tournament.userTeam;

  // Teams the user owns that are "active" (show the highlight card)
  const userHasVisibleTeam =
    userTeam?.teamStatus === 'PENDING_PAYMENT' ||
    userTeam?.teamStatus === 'READY' ||
    userTeam?.teamStatus === 'FINISHED' ||
    userTeam?.teamStatus === 'BANNED';

  // Filter user's own team out of the confirmed list to avoid duplication
  const confirmedTeamsFiltered = userTeam
    ? tournament.confirmedTeams.filter((t) => t.name !== userTeam.teamName)
    : tournament.confirmedTeams;

  // Determine call-to-action button state.
  // For PENDING_PAYMENT, the button stays enabled and routes to /pagamentos
  // so the @modal interceptor can show the PaymentModal over this page.
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
    // EXPIRED_PAYMENT, EXPIRED_PAYMENT_PROBLEM, CANCELED → can re-register, fall through
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

  const canClickRegister = !btnDisabled;
  const inscricoesPath = `/lol/torneios/${tournament.slug}/inscricoes`;
  const pagamentosPath = `/lol/torneios/${tournament.slug}/pagamentos`;
  const targetPath =
    btnTarget === 'pagamentos' ? pagamentosPath : inscricoesPath;

  return (
    <Box sx={{ backgroundColor: '#080d2e', minHeight: '100vh' }}>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <Box sx={{ position: 'relative', overflow: 'hidden' }}>
        {/* Image */}
        <Box
          sx={{ height: { xs: 220, md: 420, lg: 500 }, position: 'relative' }}
        >
          <Image
            src={tournament.imageUrl}
            alt={tournament.name}
            fill
            referrerPolicy="no-referrer"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'top center',
              display: 'block',
            }}
          />
          {/* Bottom-to-top fade only */}
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(to top, #080d2e 0%, rgba(8,13,46,0.4) 50%, transparent 100%)',
            }}
          />
        </Box>

        {/* Desktop content overlay */}
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

      {/* Mobile content (below image) */}
      <Box sx={{ display: { xs: 'block', md: 'none' }, px: 2, pt: 2, pb: 1 }}>
        <HeroContent tournament={tournament} />
      </Box>

      {/* ── Main grid ────────────────────────────────────────────────── */}
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
          {/* ── LEFT COLUMN ─────────────────────────────────────── */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {/* Description */}
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

            {/* Technical Info */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <SectionTitle>Informações Técnicas</SectionTitle>
              <Box
                sx={{
                  backgroundColor: '#0E1241',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 3,
                  p: { xs: 2.5, md: 2 },
                }}
              >
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                    gap: 3,
                  }}
                >
                  <Box>
                    <Typography
                      sx={{
                        color: 'rgba(255,255,255,0.4)',
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        letterSpacing: 1.2,
                        textTransform: 'uppercase',
                        mb: 1.5,
                      }}
                    >
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
                    <Typography
                      sx={{
                        color: 'rgba(255,255,255,0.4)',
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        letterSpacing: 1.2,
                        textTransform: 'uppercase',
                        mb: 1.5,
                      }}
                    >
                      Regras Gerais
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 0.8,
                      }}
                    >
                      {[
                        'Início pontual no horário marcado.',
                        'Respeito mútuo entre participantes.',
                        'Uso de hack/cheat causa banimento.',
                      ].map((rule) => (
                        <Typography
                          key={rule}
                          sx={{
                            color: '#ffffff',
                            fontFamily:
                              'family: "Roboto Mono", Roboto Fallback',
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

            {/* Teams */}
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
                  <GroupsRoundedIcon sx={{ color: '#11B5E4', fontSize: 22 }} />
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
                {/* User's team highlight card */}
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
                        ? `${TEAM_STATUS_LABELS.PENDING_PAYMENT}`
                        : undefined
                    }
                  />
                )}

                {/* Confirmed teams (READY), filtered to exclude user's own */}
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

          {/* ── RIGHT COLUMN: action card ────────────────────────── */}
          <Box>
            <Box
              sx={{
                position: { xs: 'static', lg: 'sticky' },
                top: 88,
                backgroundColor: '#0E1241',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 3,
                p: { xs: 2.5, md: 3 },
              }}
            >
              <Typography
                sx={{
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  mb: 3,
                }}
              >
                Inicie sua Jornada
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
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
                      color: remainingSpots <= 4 ? '#ff6b6b' : '#37963c',
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
                    if (!canClickRegister) return;
                    // Auth is handled by the proxy / middleware.
                    router.push(targetPath);
                  }}
                  sx={{
                    backgroundColor: canClickRegister ? '#11B5E4' : undefined,
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    letterSpacing: 1,
                    textTransform: 'uppercase',
                    fontStyle: 'italic',
                    py: 1.6,
                    '&:hover': { backgroundColor: '#0b80a0' },
                    '&.Mui-disabled': {
                      backgroundColor: 'rgba(255,255,255,0.08)',
                      color: 'rgba(255,255,255,0.3)',
                    },
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
                    borderColor: 'rgba(255,255,255,0.15)',
                    color: 'rgba(255,255,255,0.7)',
                    fontWeight: 600,
                    fontSize: '0.8rem',
                    letterSpacing: 0.8,
                    textTransform: 'uppercase',
                    py: 1.2,
                    '&:hover': {
                      borderColor: 'rgba(255,255,255,0.35)',
                      backgroundColor: 'rgba(255,255,255,0.04)',
                    },
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

// ── Sub-components ─────────────────────────────────────────────────────────

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <Typography
      sx={{
        color: '#ffffff',
        fontWeight: 800,
        fontSize: { xs: '1.1rem', md: '1.25rem' },
        mb: 0,
      }}
    >
      {children}
    </Typography>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <Box>
      <Typography
        sx={{
          color: '#11B5E4',
          fontSize: '0.6rem',
          fontWeight: 700,
          letterSpacing: 1,
          textTransform: 'uppercase',
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{ color: '#ffffff', fontWeight: 700, fontSize: '1rem', mt: 0.2 }}
      >
        {value}
      </Typography>
    </Box>
  );
}

function FeeRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
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
      <Typography
        sx={{ color: '#ffffff', fontWeight: 700, fontSize: '0.9rem' }}
      >
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
          color: '#ffffff',
          fontWeight: 900,
          fontSize: { xs: '2rem', md: '3.5rem', lg: '4.5rem' },
          lineHeight: 1,
          textTransform: 'uppercase',
          fontStyle: 'italic',
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
          {new Date(tournament.startsAt).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
          })}
        </StatChip>
        <StatChip
          icon={<GroupsRoundedIcon sx={{ fontSize: 16, color: '#11B5E4' }} />}
        >
          {tournament.confirmedTeamsCount}/{tournament.maxTeams} Equipes
        </StatChip>
        <StatChip
          icon={
            <EmojiEventsRoundedIcon sx={{ fontSize: 16, color: '#E07F0A' }} />
          }
        >
          <Typography
            component="span"
            sx={{ color: '#E07F0A', fontWeight: 700 }}
          >
            {formatPrize(tournament.prizePool)}
          </Typography>
        </StatChip>
      </Stack>
    </Stack>
  );
}

function StatChip({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 0.7,
        backgroundColor: 'rgba(0,0,0,0.45)',
        borderRadius: 2,
        px: 1.5,
        py: 0.8,
        backdropFilter: 'blur(8px)',
      }}
    >
      {icon}
      <Typography
        sx={{ color: '#ffffff', fontWeight: 600, fontSize: '0.85rem' }}
      >
        {children}
      </Typography>
    </Box>
  );
}
