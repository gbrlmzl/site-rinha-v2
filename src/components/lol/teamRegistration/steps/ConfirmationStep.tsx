'use client';

/**
 * Passo 3: Confirmação de Dados
 * Revisa todas as informações antes do pagamento
 */

import {
  Box,
  Stack,
  Typography,
  Card,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControlLabel,
  Checkbox,
  Alert,
  Link,
  Divider,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MilitaryTechOutlinedIcon from '@mui/icons-material/MilitaryTechOutlined';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import Image from 'next/image';
import { Team, Player } from '@/types/teamRegistration';
import {
  PLAYER_POSITIONS,
  getPositionIcon,
} from '@/hooks/lol/teamRegistration/constants';
import { TEAM_REGISTRATION_TOKENS } from '@/theme';

interface ConfirmationStepProps {
  team: Team;
  players: Player[];
  shieldPreview: string | null;
  termsAccepted: boolean;
  onTermsChange: (accepted: boolean) => void;
  error?: string | null;
}

export function ConfirmationStep({
  team,
  players,
  shieldPreview,
  termsAccepted,
  onTermsChange,
  error = null,
}: ConfirmationStepProps) {

   const THEME_COLORS = TEAM_REGISTRATION_TOKENS.colors;
  const activePlayers = players.filter((p) => !p.disabledPlayer);
  const shieldSrc = shieldPreview;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Stack
        spacing={3}
        sx={{
          width: '100%',
          maxWidth: 600,
          p: { xs: 2, md: 3 },
        }}
      >
        {/* Title */}
        <Typography
          variant="h5"
          sx={{
            color: THEME_COLORS.accent,
            fontWeight: 700,
            textAlign: 'center',
            fontSize: '1.4rem',
          }}
        >
          Confirme seus Dados
        </Typography>

        {/* Team Card */}
        <Card
          sx={{
            backgroundColor: THEME_COLORS.surface,
            border: `1px solid ${THEME_COLORS.border}`,
            borderRadius: 2,
          }}
        >
          <Stack spacing={1} sx={{ p: 2 }}>
            {/* Shield preview + Team title */}
            {shieldSrc && (
              <Box
                sx={{
                  width: 'fit-content',
                  minHeight: 150,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignSelf: 'center',
                  alignItems: 'center',
                  backgroundColor: THEME_COLORS.surfaceHigh,
                  borderRadius: 1.5,
                  gap: 1,
                  py: 1,
                }}
              >
                <Image
                  src={shieldSrc}
                  alt="Escudo da equipe"
                  width={150}
                  height={150}
                  style={{ objectFit: 'contain' }}
                />
              </Box>
            )}

            <Divider sx={{ borderColor: THEME_COLORS.border }} />
            <Typography
              variant="h6"
              sx={{
                color: THEME_COLORS.text,
                fontWeight: 700,
                textAlign: 'center',
              }}
            >
              {team.teamName}
            </Typography>
          </Stack>
        </Card>

        {/* Players Summary */}
        <Box>
          <Typography
            variant="subtitle2"
            sx={{
              color: THEME_COLORS.text,
              fontWeight: 600,
              mb: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <EmojiEventsIcon sx={{ fontSize: 24 }} />
            Jogadores ({activePlayers.length})
          </Typography>

          <Stack spacing={1.5}>
            {activePlayers.map((player, idx) => (
              <Accordion
                key={idx}
                sx={{
                  backgroundColor: THEME_COLORS.surface,
                  border: `1px solid ${THEME_COLORS.border}`,
                  borderRadius: 2,
                  '&:before': { display: 'none' },
                }}
              >
                <AccordionSummary
                  expandIcon={
                    <ExpandMoreIcon sx={{ color: THEME_COLORS.accent }} />
                  }
                >
                  <Stack
                    direction="row"
                    spacing={1.5}
                    sx={{
                      width: '100%',
                      alignItems: 'center',
                    }}
                  >
                    
                    <Typography
                      sx={{
                        color: THEME_COLORS.text,
                        fontWeight: 600,
                        flex: 1,
                      }}
                    >
                      {player.nickname}
                    </Typography>
                    {idx === 0 && (
                      <MilitaryTechOutlinedIcon
                        sx={{
                          color: '#FFD700',
                          fontSize: 24,
                        }}
                      />
                    )}

                    <Box
                      title={
                        PLAYER_POSITIONS.find(
                          (position) => position.key === player.role
                        )?.label || player.role
                      }
                      sx={{
                        //backgroundColor: THEME_COLORS.surfaceHigh,
                        width: 30,
                        height: 30,
                        p: 0.5,
                        borderRadius: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: `1px solid ${THEME_COLORS.border}`,
                      }}
                    >
                      
                      <Box
                        sx={{
                          width: 22,
                          height: 22,
                          position: 'relative',
                        }}
                      >
                        <Image
                          src={getPositionIcon(player.role)}
                          alt={`Posição: ${player.role}`}
                          fill
                          style={{ objectFit: 'contain' }}
                        />
                      </Box>
                    </Box>
                  </Stack>
                </AccordionSummary>

                <AccordionDetails>
                  <Stack spacing={1.5}>
                    <Box>
                      <Typography
                        variant="caption"
                        sx={{ color: THEME_COLORS.textMuted }}
                      >
                        Nome Completo
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: THEME_COLORS.text }}
                      >
                        {player.playerName}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography
                        variant="caption"
                        sx={{ color: THEME_COLORS.textMuted }}
                      >
                        Discord
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: THEME_COLORS.text }}
                      >
                        {player.discordUser}
                      </Typography>
                    </Box>

                    {!player.isExternalPlayer && (
                      <Box>
                        <Typography
                          variant="caption"
                          sx={{ color: THEME_COLORS.textMuted }}
                        >
                          Matrícula
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: THEME_COLORS.text }}
                        >
                          {player.schoolId || 'N/A'}
                        </Typography>
                      </Box>
                    )}

                    {player.isExternalPlayer && (
                      <Typography
                        variant="caption"
                        sx={{
                          color: THEME_COLORS.accent,
                          backgroundColor: 'rgba(17, 181, 228, 0.15)',
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                          display: 'inline-block',
                          width: 'fit-content',
                        }}
                      >
                        Jogador Externo
                      </Typography>
                    )}
                  </Stack>
                </AccordionDetails>
              </Accordion>
            ))}
          </Stack>
        </Box>

        <Divider sx={{ borderColor: THEME_COLORS.border }} />

        {/* Terms & Conditions */}
        <Box
          sx={{
            p: 2,
            backgroundColor: THEME_COLORS.surfaceHigh,
            borderRadius: 2,
            border: `1px solid ${THEME_COLORS.border}`,
          }}
        >
          <FormControlLabel
            control={
              <Checkbox
                checked={termsAccepted}
                onChange={(e) => onTermsChange(e.target.checked)}
                sx={{
                  color: 'cyan',
                  opacity: '75%',
                }}
              />
            }
            label={
              <Typography variant="body2" sx={{ color: THEME_COLORS.text }}>
                Concordo com as{' '}
                <Link
                  href="/regulamento"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: THEME_COLORS.accent,
                    textDecoration: 'none',
                    fontWeight: 600,
                    '&:hover': { textDecoration: 'underline' },
                  }}
                >
                  regras e regulamento
                </Link>{' '}
                do torneio
              </Typography>
            }
          />
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {/* Final Note */}
        <Alert severity="info" sx={{ borderRadius: 2 }}>
          Revise todos os dados acima. Uma vez confirmado, você será
          redirecionado para o pagamento.
        </Alert>
      </Stack>
    </Box>
  );
}
