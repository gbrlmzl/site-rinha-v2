'use client';

/**
 * Componente para upload de escudo da equipe
 * Inclui preview, upload e feedback visual
 */

import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import {
  Box,
  Button,
  Card,
  Typography,
  CircularProgress,
  Stack,
  IconButton,
} from '@mui/material';
import Image from 'next/image';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { TEAM_REGISTRATION_TOKENS } from '@/theme';
import { useSnackbarContext } from '@/contexts/SnackbarContext';

interface ShieldUploaderProps {
  preview: string | null;
  onFileSelected: (file: File | null) => void;
  loading?: boolean;
  error?: string | null;
  success?: boolean;
}

export function ShieldUploader({
  preview,
  onFileSelected,
  loading = false,
  error = null,
  success = false,
}: ShieldUploaderProps) {
  const THEME_COLORS = TEAM_REGISTRATION_TOKENS.colors;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showSnackbar } = useSnackbarContext();

  useEffect(() => {
    if (error) {
      showSnackbar({ message: error, severity: 'error' });
    }
  }, [error, showSnackbar]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.match(/^image\/(png|jpe?g)$/)) {
        showSnackbar({
          message:
            'Por favor, selecione um arquivo de imagem válido (PNG, JPG, JPEG)',
          severity: 'error',
        });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        showSnackbar({
          message: 'O tamanho do arquivo deve ser menor que 5MB',
          severity: 'error',
        });
        return;
      }
      onFileSelected(file);
    }
  };

  const handleRemoveFile = () => {
    onFileSelected(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Stack spacing={1} sx={{ p: 0 }}>
      {/* Card Preview */}
      <Card
        sx={{
          width: { xs: 180, md: 200, lg: 200, xl: 220 },
          height: { xs: 180, md: 200, lg: 200, xl: 220 },
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',
          backgroundColor: THEME_COLORS.surfaceHigh,
          border: `1px solid goldenrod`,
          borderRadius: 3,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {preview ? (
          <>
            <Image
              src={preview}
              alt="Preview do escudo"
              fill
              style={{ objectFit: 'contain' }}
            />
            {success && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  backgroundColor: 'rgba(0,0,0,0.7)',
                  borderRadius: '50%',
                  p: 0.5,
                }}
              >
                <CheckCircleIcon sx={{ color: '#4caf50', fontSize: 32 }} />
              </Box>
            )}
          </>
        ) : (
          <Box sx={{ textAlign: 'center' }}>
            <CloudUploadIcon
              sx={{
                fontSize: 60,
                color: THEME_COLORS.textMuted,
                mb: 1,
              }}
            />
            <Typography variant="body2" sx={{ color: THEME_COLORS.textMuted }}>
              PNG, JPG ou JPEG
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: THEME_COLORS.textMuted }}
            >
              Máximo 5MB
            </Typography>
          </Box>
        )}
      </Card>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".png,.jpg,.jpeg"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {/* Upload Button & Actions */}
      <Box></Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'center',
          columnGap: 1,
          width: '100%',
        }}
      >
        <Button
          variant="contained"
          endIcon={
            loading ? <CircularProgress size={20} /> : <CloudUploadIcon />
          }
          onClick={handleClick}
          disabled={loading}
          sx={{
            gridColumn: 2,
            justifySelf: 'center',
            display: 'inline-flex',
            alignItems: 'center',
            height: 40,
            width: 180,
            fontSize: '1rem',
            backgroundColor: THEME_COLORS.accent,
            '&:hover': { backgroundColor: THEME_COLORS.accentHover },
            '& .MuiButton-endIcon': {
              display: 'inline-flex',
              alignItems: 'center',
              marginLeft: 1,
              marginRight: 0,
              height: '100%',
            },
            '& .MuiButton-endIcon .MuiSvgIcon-root': {
              display: 'block',
              fontSize: 20,
              marginLeft: 1,
            },
            '& .MuiButton-endIcon .MuiCircularProgress-root': {
              display: 'block',
            },
            textTransform: 'none',
            fontWeight: 600,
          }}
        >
          {loading ? 'Carregando...' : preview ? 'Mudar Escudo' : 'Escudo'}
        </Button>

        {preview && (
          <IconButton
            onClick={handleRemoveFile}
            disabled={loading}
            sx={{
              gridColumn: 3,
              justifySelf: 'start',
              color: THEME_COLORS.danger,
              border: `1px solid ${THEME_COLORS.danger}`,
              '&:hover': {
                backgroundColor: 'rgba(255, 107, 107, 0.1)',
              },
            }}
          >
            <DeleteIcon />
          </IconButton>
        )}
      </Box>
    </Stack>
  );
}
