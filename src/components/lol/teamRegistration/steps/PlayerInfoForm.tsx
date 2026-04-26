'use client';

/**
 * Formulário individual de jogador (reutilizável)
 * Usado dentro de PlayersStep para cada jogador
 */

import { useLayoutEffect, useRef, type ChangeEvent } from 'react';
import {
  Box,
  TextField,
  Stack,
  Typography,
  FormControlLabel,
  Checkbox,
  Alert,
} from '@mui/material';
import { Player } from '@/types/teamRegistration';
import { PositionSelector } from '../shared/PositionSelector';
import { TEAM_REGISTRATION_TOKENS } from '@/theme';

interface PlayerInfoFormProps {
  data: Player;
  playerIndex: number;
  onChange: (updates: Partial<Player>) => void;
  onPositionKeyboardConfirm?: () => void;
  error?: string | null;
  disabled?: boolean;
}

export function PlayerInfoForm({
  data,
  playerIndex,
  onChange,
  onPositionKeyboardConfirm,
  error = null,
  disabled = false,
}: PlayerInfoFormProps) {
  const THEME_COLORS = TEAM_REGISTRATION_TOKENS.colors;
  const isReserva = playerIndex === 5;
  const isFormDisabled = disabled || (isReserva && data.disabledPlayer);
  const playerNameInputRef = useRef<HTMLInputElement | null>(null);

  useLayoutEffect(() => {
    if (isFormDisabled) return;

    playerNameInputRef.current?.focus();
  }, [isFormDisabled, playerIndex]);

  const handleChange =
    (field: keyof Player) => (e: ChangeEvent<HTMLInputElement>) => {
      const value =
        e.target.type === 'checkbox' ? e.target.checked : e.target.value;
      if (field === 'schoolId') {
        // Permitir apenas números na matrícula
        //se o valor não for um número, não atualizar
        if (isNaN(Number(value))) {
          return;
        }
      }

      onChange({ [field]: value } as Partial<Player>);
    };

  const handleExternalToggle = (e: ChangeEvent<HTMLInputElement>) => {
    onChange({
      isExternalPlayer: e.target.checked,
      schoolId: '', // Limpar matrícula ao marcar como externo
    });
  };

  return (
    <Box
      sx={{
        p: 2,
        backgroundColor: THEME_COLORS.surface,
        borderRadius: 2,
        border: `1px solid ${THEME_COLORS.border}`,
      }}
    >
      <Stack spacing={2}>
        {/* Nome do Jogador */}
        <TextField
          fullWidth
          label="Nome do Jogador"
          placeholder="Nome completo"
          value={data.playerName}
          onChange={handleChange('playerName')}
          disabled={isFormDisabled}
          inputRef={playerNameInputRef}
          slotProps={{
            htmlInput: { maxLength: 50 },
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: THEME_COLORS.surfaceHigh,
              borderRadius: 1.5,
              color: THEME_COLORS.text,
              '& fieldset': { borderColor: THEME_COLORS.border },
              '&:hover fieldset': { borderColor: THEME_COLORS.accent },
              '&.Mui-focused fieldset': { borderColor: THEME_COLORS.accent },
            },
            '& .MuiInputLabel-root': { color: THEME_COLORS.textMuted },
          }}
        />

        {/* Nickname */}
        <TextField
          fullWidth
          label="Nickname (In-Game)"
          placeholder="Nickname no LoL"
          value={data.nickname}
          onChange={handleChange('nickname')}
          disabled={isFormDisabled}
          slotProps={{
            htmlInput: { maxLength: 30 },
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: THEME_COLORS.surfaceHigh,
              borderRadius: 1.5,
              color: THEME_COLORS.text,
              '& fieldset': { borderColor: THEME_COLORS.border },
              '&:hover fieldset': { borderColor: THEME_COLORS.accent },
              '&.Mui-focused fieldset': { borderColor: THEME_COLORS.accent },
            },
            '& .MuiInputLabel-root': { color: THEME_COLORS.textMuted },
          }}
        />

        {/* Discord User */}
        <TextField
          fullWidth
          label="Discord"
          placeholder="Seu usuário no Discord"
          value={data.discordUser}
          onChange={handleChange('discordUser')}
          disabled={isFormDisabled}
          slotProps={{
            htmlInput: {
              maxLength: 50,
            },
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: THEME_COLORS.surfaceHigh,
              borderRadius: 1.5,
              color: THEME_COLORS.text,
              '& fieldset': { borderColor: THEME_COLORS.border },
              '&:hover fieldset': { borderColor: THEME_COLORS.accent },
              '&.Mui-focused fieldset': { borderColor: THEME_COLORS.accent },
            },
            '& .MuiInputLabel-root': { color: THEME_COLORS.textMuted },
          }}
        />

        {/* Matrícula + Checkbox "não possui" */}
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 1.5,
            flexDirection: { xs: 'column', md: 'row' },
          }}
        >
          <Box sx={{ width: { xs: '100%', md: '66%' } }}>
            <TextField
              fullWidth
              label="Matrícula"
              placeholder="Números apenas (6-11 dígitos)"
              value={data.schoolId}
              onChange={handleChange('schoolId')}
              disabled={isFormDisabled || data.isExternalPlayer}
              slotProps={{
                htmlInput: {
                  pattern: '[0-9]*',
                  maxLength: 11,
                },
                formHelperText: {
                  sx: { color: THEME_COLORS.textMuted, textAlign: 'right' },
                },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: THEME_COLORS.surfaceHigh,
                  borderRadius: 1.5,
                  color: THEME_COLORS.text,
                  '& fieldset': { borderColor: THEME_COLORS.border },
                  '&:hover fieldset': { borderColor: THEME_COLORS.accent },
                  '&.Mui-focused fieldset': {
                    borderColor: THEME_COLORS.accent,
                  },
                },
                '& .MuiInputLabel-root': { color: THEME_COLORS.textMuted },
              }}
            />
          </Box>

          <Box
            sx={{
              width: { xs: '100%', md: '34%' },
              minHeight: 56,
              display: 'flex',
              alignItems: 'center',
              justifyContent: { xs: 'flex-start', md: 'flex-end' },
            }}
          >
            <FormControlLabel
              disabled={playerIndex == 0 || isFormDisabled} // O capitão sempre deve ter matrícula
              control={
                <Checkbox
                  checked={data.isExternalPlayer}
                  onChange={handleExternalToggle}
                  disabled={isFormDisabled}
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
                  sx={{
                    color:
                      playerIndex === 0 || isFormDisabled
                        ? THEME_COLORS.textMuted
                        : THEME_COLORS.text,
                    fontSize: '0.85rem',
                  }}
                >
                  Não possui matrícula
                </Typography>
              }
              sx={{ mr: 0 }}
            />
          </Box>
        </Box>

        {/* Posição */}
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <PositionSelector
            value={data.role}
            onChange={(position) => onChange({ role: position })}
            onKeyboardConfirm={onPositionKeyboardConfirm}
            disabled={isFormDisabled}
          />
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ borderRadius: 1.5 }}>
            {error}
          </Alert>
        )}
      </Stack>
    </Box>
  );
}
