'use client';

import {
  Box,
  Stack,
  Typography,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import { Player } from '@/types/teamRegistration';
import { PlayerInfoForm } from './PlayerInfoForm';
import {
  PLAYER_LABELS,
} from '@/hooks/lol/teamRegistration/constants';
import { TEAM_REGISTRATION_TOKENS } from '@/theme';

interface PlayersStepProps {
  data: Player[];
  onPlayerChange: (playerIndex: number, updates: Partial<Player>) => void;
  error?: { [key: number]: string };
  disabled?: boolean;
  currentPlayerIndex: number;
  onCurrentPlayerIndexChange: (index: number) => void;
  onPositionKeyboardConfirm?: () => void;
}

export function PlayersStep({
  data,
  onPlayerChange,
  error = {},
  disabled = false,
  currentPlayerIndex,
  onCurrentPlayerIndexChange,
  onPositionKeyboardConfirm,
}: PlayersStepProps) {
   const THEME_COLORS = TEAM_REGISTRATION_TOKENS.colors;
  const isReservaStep = currentPlayerIndex === 5;

  const handleReserveToggle = (checked: boolean) => {
    if (!isReservaStep) return;

    if (checked) {
      onPlayerChange(5, {
        disabledPlayer: true,
        playerName: '',
        schoolId: '',
        nickname: '',
        discordUser: '',
        role: 'FILL',
        isExternalPlayer: false,
      });
      return;
    }

    onPlayerChange(5, {
      disabledPlayer: false,
    });
  };

  {
    /* const handleNextPlayer = () => {
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
  */
  }

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
            justifyContent: 'center',
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
                  sx={{
                    color: '#d0d3d3',
                    '&.Mui-checked': {
                      color: 'primary.main',
                    },
                  }}
                />
              }
              label={
                <Typography
                  sx={{ color: THEME_COLORS.text, fontSize: '0.9rem' }}
                >
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

        {/* Current Player Form */}
        <PlayerInfoForm
          data={data[currentPlayerIndex]}
          playerIndex={currentPlayerIndex}
          onChange={(updates) => onPlayerChange(currentPlayerIndex, updates)}
          onPositionKeyboardConfirm={onPositionKeyboardConfirm}
          error={error[currentPlayerIndex] || null}
          disabled={disabled}
        />
      </Stack>
    </Box>
  );
}
