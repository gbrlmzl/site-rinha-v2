'use client';

/**
 * Passo 1: Informações da Equipe
 * Coleta: Nome e Escudo
 */

import { type ChangeEvent } from 'react';
import { Box, TextField, Stack, Typography } from '@mui/material';
import { Team } from '@/types/teamRegistration';
import { ShieldUploader } from '../shared/ShieldUploader';
import { TEAM_REGISTRATION_TOKENS } from '@/theme';


interface TeamInfoStepProps {
  data: Team;
  shieldPreview: string | null;
  onTeamChange: (updates: Partial<Team>) => void;
  onShieldFileSelected: (file: File | null) => void;
  loading?: boolean;
  error?: string | null;
}

export function TeamInfoStep({
  data,
  shieldPreview,
  onTeamChange,
  onShieldFileSelected,
  loading = false,
  error = null,
}: TeamInfoStepProps) {
  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    onTeamChange({ teamName: e.target.value });
  };

  const THEME_COLORS = TEAM_REGISTRATION_TOKENS.colors;
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
        spacing={1}
        sx={{
          width: '100%',
          maxWidth: 500,
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
          Equipe
        </Typography>

        {/* Shield Upload */}
        <Box>
          <ShieldUploader
            preview={shieldPreview}
            onFileSelected={onShieldFileSelected}
            loading={loading}
            error={error}
            success={data.teamShield !== null && !shieldPreview}
          />
        </Box>

        {/* Team Name */}
        <Box>
          <TextField
            fullWidth
            value={data.teamName}
            onChange={handleNameChange}
            disabled={loading}
            placeholder="Nome da equipe"
            slotProps={{
              htmlInput: {
                maxLength: 30,
              },
              formHelperText: {
                sx: { color: THEME_COLORS.textMuted, textAlign: 'right' },
              },
            }}
            helperText={`${data.teamName.length}/30 caracteres`}
            sx={{
              mt: 2,
              '& .MuiFormLabel-root': {
                color: THEME_COLORS.textMuted,
                fontFamily: 'var(--font-russo-one), sans-serif',
                fontSize: '1rem',
                alignContent: 'center',
                justifyContent: 'center',
              },
              '& .MuiOutlinedInput-root': {
                backgroundColor: THEME_COLORS.surfaceHigh,
                borderRadius: 2,
                color: THEME_COLORS.text,
                fontFamily: 'var(--font-russo-one), sans-serif',
                fontSize: '1.5rem',
                '& fieldset': { borderColor: THEME_COLORS.border },
                '&:hover fieldset': { borderColor: THEME_COLORS.accent },
                '&.Mui-focused fieldset': { borderColor: THEME_COLORS.accent },
              },
              '& .MuiOutlinedInput-input': {
                textAlign: 'center',
                paddingBlock: 1,
              },
              '& .MuiOutlinedInput-input::placeholder': {
                textAlign: 'center',
              },
              '& .MuiInputLabel-root': { color: THEME_COLORS.textMuted },
            }}
          />
        </Box>
      </Stack>
    </Box>
  );
}
