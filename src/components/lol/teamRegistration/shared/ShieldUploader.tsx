'use client';

/**
 * Componente para upload de escudo da equipe
 * Inclui preview, upload e feedback visual
 */

import React, { useRef } from 'react';
import {
  Box,
  Button,
  Card,
  Typography,
  CircularProgress,
  Alert,
  Stack,
  IconButton,
} from '@mui/material';
import Image from 'next/image';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { THEME_COLORS } from '@/hooks/lol/teamRegistration/constants';

interface ShieldUploaderProps {
  preview: string | null;
  onFileSelected: (file: File | null) => void;
  loading?: boolean;
  error?: string | null;
  success?: boolean;
}

export const ShieldUploader: React.FC<ShieldUploaderProps> = ({
  preview,
  onFileSelected,
  loading = false,
  error = null,
  success = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validar tipo de arquivo
      if (!file.type.match(/^image\/(png|jpeg|webp|jpg)$/)) {
        //alert('Por favor, selecione um arquivo de imagem válido (PNG, JPG, JPEG, WebP)');
        //Snackbar de erro 
        return;
      }

      // Validar tamanho (máx 5MB)
      if (file.size > 5 * 1024 * 1024) {
        //Snackbar de erro
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
    <Stack spacing={2}>
      {/* Card Preview */}
      <Card
        sx={{
          width: '100%',
          height: 220,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: THEME_COLORS.surfaceHigh,
          border: `2px dashed ${THEME_COLORS.border}`,
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
              style={{ objectFit: 'contain', padding: 12 }}
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
            <Typography
              variant="body2"
              sx={{ color: THEME_COLORS.textMuted }}
            >
              PNG, JPG, JPEG ou WebP
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
        accept=".png,.jpg,.jpeg,.webp"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {/* Upload Button & Actions */}
      <Stack
        direction="row"
        spacing={1}
        sx={{
          justifyContent: 'center',
        }}
      >
        <Button
          variant="contained"
          endIcon={loading ? <CircularProgress size={20} /> : <CloudUploadIcon />}
          onClick={handleClick}
          disabled={loading}
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
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
              fontSize: 22,
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
      </Stack>

      {/* Error Message */}
      {error && (
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          {error}
        </Alert>
      )}

    </Stack>
  );
};
