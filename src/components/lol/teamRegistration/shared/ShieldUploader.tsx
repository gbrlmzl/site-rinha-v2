'use client';

/**
 * Componente para upload de escudo da equipe
 * Inclui preview, upload e feedback visual
 */

import { useRef, useState, type ChangeEvent } from 'react';
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
import { TEAM_REGISTRATION_TOKENS } from '@/theme';

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
  const [shieldFileError, setShieldFileError] = useState<string | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validar tipo de arquivo
      if (!file.type.match(/^image\/(png|jpeg|jpg)$/)) {
        //alert('Por favor, selecione um arquivo de imagem válido (PNG, JPG, JPEG)');
        //Snackbar de erro
        setShieldFileError(
          'Por favor, selecione um arquivo de imagem válido (PNG, JPG, JPEG)'
        );
        return;
      }

      // Validar tamanho (máx 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setShieldFileError('O tamanho do arquivo deve ser menor que 5MB');
        return;
      }
      // Se passou nas validações, limpar erros anteriores
      setShieldFileError(null);

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
          width: 250,
          height: 250,
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

      {/* Error Message */}
      {error ? (
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          {error}
        </Alert>
      ) : shieldFileError ? (
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          {shieldFileError}
        </Alert>
      ) : null}
    </Stack>
  );
}
