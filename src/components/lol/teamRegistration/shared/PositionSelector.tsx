'use client';

/**
 * Seletor de posição com Menu customizado
 * Componente reutilizável para seleção de posição de jogador
 */

import React, { useState } from 'react';
import {
  IconButton,
  Menu,
  MenuItem,
  Box,
  Tooltip,
  Stack,
} from '@mui/material';
import Image from 'next/image';
import { PlayerPosition } from '@/types/teamRegistration';
import { PLAYER_POSITIONS, DEFAULT_POSITION_ICON, THEME_COLORS } from '@/hooks/lol/teamRegistration/constants';

interface PositionSelectorProps {
  value: PlayerPosition;
  onChange: (position: PlayerPosition) => void;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export const PositionSelector: React.FC<PositionSelectorProps> = ({
  value,
  onChange,
  disabled = false,
  size = 'medium',
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleSelectPosition = (position: PlayerPosition) => {
    onChange(position);
    handleCloseMenu();
  };

  // Obter ícone da posição selecionada
  const currentPosition = PLAYER_POSITIONS.find((p) => p.key === value);
  const iconSrc = currentPosition?.icon || DEFAULT_POSITION_ICON;

  const iconSize = size === 'small' ? 32 : size === 'large' ? 56 : 40;

  return (
    <>
      <Tooltip title={disabled ? 'Jogador desabilitado' : 'Selecionar posição'}>
        <IconButton
          onClick={handleOpenMenu}
          disabled={disabled}
          sx={{
            backgroundColor: THEME_COLORS.surfaceHigh,
            borderRadius: '50%',
            padding: '10px',
            border: `2px solid ${THEME_COLORS.border}`,
            transition: 'all 0.2s',
            '&:hover:not(:disabled)': {
              backgroundColor: THEME_COLORS.accent,
              borderColor: THEME_COLORS.accent,
            },
            '&:disabled': {
              opacity: 0.5,
            },
          }}
        >
          <Box
            sx={{
              width: iconSize,
              height: iconSize,
              position: 'relative',
            }}
          >
            <Image
              src={iconSrc}
              alt={`Posição: ${value}`}
              fill
              style={{ objectFit: 'contain' }}
            />
          </Box>
        </IconButton>
      </Tooltip>

      {/* Menu de seleção */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        slotProps={{
          paper: {
            sx: {
              backgroundColor: THEME_COLORS.surface,
              border: `1px solid ${THEME_COLORS.border}`,
              borderRadius: 2,
            },
          },
        }}
      >
        <Stack
          direction="row"
          spacing={1}
          sx={{ p: 1 }}
        >
          {PLAYER_POSITIONS.map((position) => (
            <MenuItem
              key={position.key}
              onClick={() => handleSelectPosition(position.key)}
              selected={value === position.key}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: 60,
                height: 60,
                padding: '8px !important',
                borderRadius: 2,
                backgroundColor: value === position.key ? THEME_COLORS.accent : 'transparent',
                border: `2px solid ${value === position.key ? THEME_COLORS.accent : THEME_COLORS.border}`,
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  backgroundColor: THEME_COLORS.accent,
                  borderColor: THEME_COLORS.accent,
                },
              }}
              title={position.label}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  position: 'relative',
                }}
              >
                <Image
                  src={position.icon}
                  alt={position.label}
                  fill
                  style={{ objectFit: 'contain' }}
                />
              </Box>
            </MenuItem>
          ))}
        </Stack>
      </Menu>
    </>
  );
};
