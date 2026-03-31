'use client';

/**
 * Passo 2: Informações dos Jogadores
 * Orquestra 6 sub-passos individuais de jogadores
 */

import React from 'react';
import {
  Box,
  Stack,
  Typography,
  Button,
  Checkbox,
  FormControlLabel,
  Stepper,
  Step,
  StepLabel,
  MobileStepper,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Player } from '@/types/teamRegistration';
import { PlayerInfoForm } from './PlayerInfoForm';
import { PLAYER_LABELS, THEME_COLORS } from '@/hooks/lol/teamRegistration/constants';

interface PlayersStepProps {
  data: Player[];
  onPlayerChange: (playerIndex: number, updates: Partial<Player>) => void;
  error?: { [key: number]: string };
  disabled?: boolean;
  currentPlayerIndex: number;
  onCurrentPlayerIndexChange: (index: number) => void;
}

export const PlayersStep: React.FC<PlayersStepProps> = ({
  data,
  onPlayerChange,
  error = {},
  disabled = false,
  currentPlayerIndex,
  onCurrentPlayerIndexChange,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isReservaStep = currentPlayerIndex === 5;

  const handleReserveToggle = (checked: boolean) => {
    if (!isReservaStep) return;

    if (checked) {
      onPlayerChange(5, {
        disabledPlayer: true,
        nomeJogador: '',
        matricula: '',
        nickname: '',
        discordUser: '',
        posicao: 'FILL',
        isExternalPlayer: false,
      });
      return;
    }

    onPlayerChange(5, {
      disabledPlayer: false,
    });
  };

  const handleNextPlayer = () => {
    if (currentPlayerIndex < 5) {
      onCurrentPlayerIndexChange(currentPlayerIndex + 1);
    }
  };

  const handlePrevPlayer = () => {
    if (currentPlayerIndex > 0) {
      onCurrentPlayerIndexChange(currentPlayerIndex - 1);
    }
  };

  const handlePlayerClick = (index: number) => {
    onCurrentPlayerIndexChange(index);
  };

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
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
            flexDirection: { xs: 'column', md: 'row' },
          }}
        >
          <Typography
            variant="h5"
            sx={{
              color: THEME_COLORS.accent,
              fontWeight: 700,
              textAlign: 'center',
              fontSize: '1.4rem',
            }}
          >
            {PLAYER_LABELS[currentPlayerIndex]}
          </Typography>

          {isReservaStep && (
            <FormControlLabel
              control={
                <Checkbox
                  checked={Boolean(data[5]?.disabledPlayer)}
                  onChange={(e) => handleReserveToggle(e.target.checked)}
                  disabled={disabled}
                />
              }
              label={
                <Typography sx={{ color: THEME_COLORS.text, fontSize: '0.9rem' }}>
                  Sem jogador reserva
                </Typography>
              }
              sx={{ m: 0 }}
            />
          )}
        </Box>

        <Typography
          variant="body2"
          sx={{
            color: THEME_COLORS.textMuted,
            textAlign: 'center',
          }}
        >
          5 titulares + 1 reserva (opcional)
        </Typography>

        {/* Player Stepper - Desktop 
        {!isMobile && (
          <Box sx={{ mb: 2, overflowX: 'auto' }}>
            <Stepper
              activeStep={currentPlayerIndex}
              sx={{
                backgroundColor: 'transparent',
                padding: 0,
                '& .MuiStep-root': {
                  cursor: 'pointer',
                  minWidth: 80,
                },
                '& .MuiStepLabel-label': {
                  fontSize: '0.8rem',
                  color: THEME_COLORS.textMuted,
                },
                '& .MuiStepLabel-label.Mui-active': {
                  color: THEME_COLORS.accent,
                  fontWeight: 600,
                },
              }}
            >
              {data.map((_, index) => (
                <Step
                  key={index}
                  onClick={() => handlePlayerClick(index)}
                >
                  <StepLabel>J{index + 1}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>
        )}
        */}

        {/* Current Player Form */}
        <PlayerInfoForm
          data={data[currentPlayerIndex]}
          playerIndex={currentPlayerIndex}
          onChange={(updates) => onPlayerChange(currentPlayerIndex, updates)}
          error={error[currentPlayerIndex] || null}
          disabled={disabled}
        />

        {/* Player Navigation - Mobile 
        {isMobile && (
          <MobileStepper
            variant="text"
            steps={6}
            position="static"
            activeStep={currentPlayerIndex}
            nextButton={
              <Button
                size="small"
                onClick={handleNextPlayer}
                disabled={currentPlayerIndex >= 5 || disabled}
                sx={{ color: THEME_COLORS.accent }}
              >
                Próximo
                <ChevronRightIcon />
              </Button>
            }
            backButton={
              <Button
                size="small"
                onClick={handlePrevPlayer}
                disabled={currentPlayerIndex === 0 || disabled}
                sx={{ color: THEME_COLORS.accent }}
              >
                <ChevronLeftIcon />
                Anterior
              </Button>
            }
            sx={{
              backgroundColor: THEME_COLORS.surfaceHigh,
              borderRadius: 2,
              mt: 2,
            }}
          />
        )}

        {/* Player Navigation - Desktop 
        {!isMobile && (
          <Stack
            direction="row"
            spacing={1}
            sx={{ justifyContent: 'center', mt: 2 }}
          >
            <Button
              variant="outlined"
              onClick={handlePrevPlayer}
              disabled={currentPlayerIndex === 0 || disabled}
              startIcon={<ChevronLeftIcon />}
              sx={{
                borderColor: THEME_COLORS.accent,
                color: THEME_COLORS.accent,
                '&:hover': {
                  backgroundColor: 'rgba(17, 181, 228, 0.1)',
                  borderColor: THEME_COLORS.accent,
                },
              }}
            >
              Anterior
            </Button>

            {/* Player Counter 
            <Box
              sx={{
                px: 2,
                py: 1,
                display: 'flex',
                alignItems: 'center',
                backgroundColor: THEME_COLORS.surfaceHigh,
                borderRadius: 1,
                border: `1px solid ${THEME_COLORS.border}`,
              }}
            >
              <Typography sx={{ color: THEME_COLORS.text, fontSize: '0.9rem' }}>
                {currentPlayerIndex + 1} / 6
              </Typography>
            </Box>

            <Button
              variant="contained"
              onClick={handleNextPlayer}
              disabled={currentPlayerIndex >= 5 || disabled}
              endIcon={<ChevronRightIcon />}
              sx={{
                backgroundColor: THEME_COLORS.accent,
                '&:hover': { backgroundColor: THEME_COLORS.accentHover },
              }}
            >
              Próximo
            </Button>
          </Stack>
        )}
          */}

        {/* Summary 
        <Box
          sx={{
            p: 2,
            backgroundColor: THEME_COLORS.surfaceHigh,
            borderRadius: 2,
            border: `1px solid ${THEME_COLORS.border}`,
          }}
        >
          <Typography variant="caption" sx={{ color: THEME_COLORS.textMuted }}>
            <strong>{data.filter((p) => !p.disabledPlayer).length}</strong> de{' '}
            <strong>6</strong> jogadores preenchidos
          </Typography>
        </Box>
        */}
      </Stack>
    </Box>
  );
};
