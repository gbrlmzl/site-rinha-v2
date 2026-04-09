'use client';

/**
 * Formulário individual de jogador (reutilizável)
 * Usado dentro de PlayersStep para cada jogador
 */

import React from 'react';
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
import { THEME_COLORS, PLAYER_LABELS } from '@/hooks/lol/teamRegistration/constants';

interface PlayerInfoFormProps {
  data: Player;
  playerIndex: number;
  onChange: (updates: Partial<Player>) => void;
  error?: string | null;
  disabled?: boolean;
}

export const PlayerInfoForm: React.FC<PlayerInfoFormProps> = ({
  data,
  playerIndex,
  onChange,
  error = null,
  disabled = false,
}) => {
  const isReserva = playerIndex === 5;
  const isFormDisabled = disabled || (isReserva && data.disabledPlayer);

  const handleChange = (field: keyof Player) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    if(field === 'matricula') {
      // Permitir apenas números na matrícula
      //se o valor não for um número, não atualizar
      if (isNaN(Number(value))) {
        return;
      }
    }


    onChange({ [field]: value } as Partial<Player>);
  };

  const handleExternalToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      isExternalPlayer: e.target.checked,
      matricula: '', // Limpar matrícula ao marcar como externo
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
        {/* Header com badge */}
        {/*<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography
            variant="subtitle1"
            sx={{
              color: THEME_COLORS.text,
              fontWeight: 600,
            }}
          >
            {PLAYER_LABELS[playerIndex]}
          </Typography>
          
        </Box>
        
        <Divider sx={{ borderColor: THEME_COLORS.border, my: 0 }} />
        */}

        {/* Nome do Jogador */}
        <TextField
          fullWidth
          label="Nome do Jogador"
          placeholder="Nome completo"
          value={data.playerName}
          onChange={handleChange('playerName')}
          disabled={isFormDisabled}
          slotProps={{
            htmlInput:{maxLength: 50}
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
            htmlInput:{maxLength: 30}
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
            }
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
              value={data.matricula}
              onChange={handleChange('matricula')}
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
                  '&.Mui-focused fieldset': { borderColor: THEME_COLORS.accent },
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
                <Typography sx={{ color: playerIndex === 0 || isFormDisabled ? THEME_COLORS.textMuted : THEME_COLORS.text, fontSize: '0.85rem' }}>
                  Não possui matrícula
                </Typography>
              }
              sx={{ mr: 0 }}
            />
          </Box>
        </Box>

        {/* Posição */}
        <Box sx={{width: "100%", display:"flex", justifyContent:"center"}}>
          <PositionSelector
            value={data.role}
            onChange={(position) => onChange({ role: position })}
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
};
