'use client';

/**
 * Seletor de posição com Menu customizado
 * Componente reutilizável para seleção de posição de jogador
 */

import { useEffect, useRef, useState, type KeyboardEvent, type MouseEvent } from 'react';
import { IconButton, Menu, MenuItem, Box, Tooltip, Stack } from '@mui/material';
import Image from 'next/image';
import { PlayerPosition } from '@/types/teamRegistration';
import {
  PLAYER_POSITIONS,
  DEFAULT_POSITION_ICON,
} from '@/hooks/lol/teamRegistration/constants';
import { TEAM_REGISTRATION_TOKENS } from '@/theme';

interface PositionSelectorProps {
  value: PlayerPosition;
  onChange: (position: PlayerPosition) => void;
  onKeyboardConfirm?: () => void;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export function PositionSelector({
  value,
  onChange,
  onKeyboardConfirm,
  disabled = false,
  size = 'medium',
}: PositionSelectorProps) {
   const THEME_COLORS = TEAM_REGISTRATION_TOKENS.colors;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const positionItemRefs = useRef<(HTMLLIElement | null)[]>([]);

  const handleOpenMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleSelectPosition = (position: PlayerPosition) => {
    onChange(position);
    handleCloseMenu();
  };

  const focusPositionAtIndex = (index: number) => {
    positionItemRefs.current[index]?.focus();
  };

  useEffect(() => {
    if (!anchorEl) return;

    const selectedIndex = Math.max(
      0,
      PLAYER_POSITIONS.findIndex((position) => position.key === value),
    );

    const animationFrameId = window.requestAnimationFrame(() => {
      focusPositionAtIndex(selectedIndex);
    });

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [anchorEl, value]);

  const handlePositionKeyDown = (
    event: KeyboardEvent<HTMLLIElement>,
    index: number,
  ) => {
    const totalPositions = PLAYER_POSITIONS.length;
    let nextIndex = index;

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        nextIndex = (index + 1) % totalPositions;
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        nextIndex = (index - 1 + totalPositions) % totalPositions;
        break;
      case 'Enter':
      case ' ': {
        event.preventDefault();
        event.stopPropagation();
        handleSelectPosition(PLAYER_POSITIONS[index].key);
        if (event.key === 'Enter') {
          onKeyboardConfirm?.();
        }
        return;
      }
      default:
        return;
    }

    event.preventDefault();
    event.stopPropagation();
    focusPositionAtIndex(nextIndex);
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
        disableScrollLock
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        slotProps={{
          paper: {
            sx: {
              backgroundColor: THEME_COLORS.surface,
              border: `1px solid ${THEME_COLORS.border}`,
              borderRadius: 2,
              overflow: 'hidden',
            },
          },
          list: {
            sx: {
              padding: 0,
            },
          },
        }}
      >
        <Stack direction="row" spacing={{xs: 0.5, sm: 1, md: 1}} sx={{ p: {xs: 0.5, sm: 1, md: 1} }}>
          {PLAYER_POSITIONS.map((position, index) => (
            <MenuItem
              key={position.key}
              ref={(element) => {
                positionItemRefs.current[index] = element;
              }}
              tabIndex={value === position.key ? 0 : -1}
              onClick={() => handleSelectPosition(position.key)}
              onKeyDown={(event) => handlePositionKeyDown(event, index)}
              selected={value === position.key}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: {xs: 50, sm: 50, md: 60},
                height: {xs: 50, sm: 50, md: 60},
                padding: '8px !important',
                borderRadius: 2,
                backgroundColor:
                  value === position.key ? THEME_COLORS.accent : 'transparent',
                border: `2px solid ${value === position.key ? THEME_COLORS.accent : THEME_COLORS.border}`,
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&.Mui-focusVisible': {
                  outline: `2px solid ${THEME_COLORS.text}`,
                  outlineOffset: 2,
                },
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
}
