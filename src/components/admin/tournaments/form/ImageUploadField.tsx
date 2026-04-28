'use client';

import { useEffect, useRef, useState } from 'react';
import { Box, Typography } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { formStyles } from '@/components/admin/tournaments/form/formStyles';

interface ImageUploadFieldProps {
  value: File | null | undefined;
  onChange: (file: File | null) => void;
  /** URL da imagem atual (modo edit). Mostrada como preview se nenhum arquivo novo foi selecionado. */
  currentImageUrl?: string | null;
  errorMessage?: string;
}

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_BYTES = 10 * 1024 * 1024;

export default function ImageUploadField({
  value,
  onChange,
  currentImageUrl,
  errorMessage,
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (!value) {
      setLocalPreview(null);
      return;
    }
    const url = URL.createObjectURL(value);
    setLocalPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [value]);

  const handleFile = (file: File | null) => {
    setLocalError(null);
    if (!file) {
      onChange(null);
      return;
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      setLocalError('Formato inválido. Use JPG, PNG ou WebP.');
      return;
    }
    if (file.size > MAX_BYTES) {
      setLocalError('Arquivo muito grande. Máximo 10MB.');
      return;
    }
    onChange(file);
  };

  const previewUrl = localPreview ?? currentImageUrl ?? null;
  const finalError = localError ?? errorMessage;
  const state: 'idle' | 'preview' | 'error' = finalError
    ? 'error'
    : previewUrl
      ? 'preview'
      : 'idle';

  return (
    <Box>
      <Box
        sx={formStyles.dropzone(state)}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const file = e.dataTransfer.files?.[0];
          if (file) handleFile(file);
        }}
      >
        {previewUrl ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewUrl} alt="Preview" style={formStyles.dropzonePreview as React.CSSProperties} />
            <Box sx={formStyles.dropzoneOverlay}>
              <CheckCircleIcon sx={{ fontSize: 32, mb: 0.5 }} />
              <Typography sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                Trocar imagem
              </Typography>
            </Box>
          </>
        ) : (
          <>
            <CloudUploadIcon sx={formStyles.dropzoneIcon} />
            <Typography sx={formStyles.dropzoneText}>
              Clique ou arraste o arquivo
            </Typography>
          </>
        )}

        <input
          ref={inputRef}
          type="file"
          accept={ALLOWED_TYPES.join(',')}
          hidden
          onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
        />
      </Box>

      {finalError && (
        <Typography sx={{ mt: 0.75, fontSize: '0.8rem', color: '#fc2c2c' }}>
          {finalError}
        </Typography>
      )}
    </Box>
  );
}
