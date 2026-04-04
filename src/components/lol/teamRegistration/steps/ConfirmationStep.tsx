'use client';

/**
 * Passo 3: Confirmação de Dados
 * Revisa todas as informações antes do pagamento
 */

import React from 'react';
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
import { THEME_COLORS } from '@/hooks/lol/teamRegistration/constants';

interface ConfirmationStepProps {
  team: Team;
  players: Player[];
  shieldPreview: string | null;
  termsAccepted: boolean;
  onTermsChange: (accepted: boolean) => void;
  error?: string | null;
}

export const ConfirmationStep: React.FC<ConfirmationStepProps> = ({
  team,
  players,
  shieldPreview,
  termsAccepted,
  onTermsChange,
  error = null,
}) => {
  const activePlayers = players.filter((p) => !p.disabledPlayer);
  const shieldSrc = shieldPreview || team.teamShield;

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
          <Stack spacing={2} sx={{ p: 2 }}>
            {/* Shield preview + Team title */}
            {shieldSrc && (
              <Box
                sx={{
                  width: '100%',
                  minHeight: 190,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: THEME_COLORS.surfaceHigh,
                  borderRadius: 1.5,
                  gap: 1,
                  py: 1.5,
                }}
              >
                <Image
                  src={shieldSrc}
                  alt="Escudo da equipe"
                  width={120}
                  height={120}
                  style={{ objectFit: 'contain' }}
                />
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
              </Box>
            )}

            <Divider sx={{ borderColor: THEME_COLORS.border }} />
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
                  expandIcon={<ExpandMoreIcon sx={{ color: THEME_COLORS.accent }} />}
                >
                  <Stack
                    direction="row"
                    spacing={1.5}
                    sx={{
                      width: '100%',
                      alignItems: 'center',
                    }}
                  >
                    {idx === 0 && (
                      <MilitaryTechOutlinedIcon
                        sx={{
                          color: '#FFD700',
                          fontSize: 24,
                        }}
                      />
                    )}
                    <Typography
                      sx={{
                        color: THEME_COLORS.text,
                        fontWeight: 600,
                        flex: 1,
                      }}
                    >
                      {player.nickname}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: THEME_COLORS.textMuted,
                        backgroundColor: THEME_COLORS.surfaceHigh,
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                      }}
                    >
                      {player.role}
                    </Typography>
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
                          {player.matricula || 'N/A'}
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
          Revise todos os dados acima. Uma vez confirmado, você será redirecionado para o pagamento.
        </Alert>
      </Stack>
    </Box>
  );
};
