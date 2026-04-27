'use client';
import useResendActivation from '@/hooks/authentication/useResendActivation';
import { AUTH_TOKENS, INPUT_SX } from '@/theme';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  InputAdornment,
  Fade,
  CircularProgress,
} from '@mui/material';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import MarkEmailReadRoundedIcon from '@mui/icons-material/MarkEmailReadRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSnackbarContext } from '@/contexts/SnackbarContext';

export default function ResendActivationPage() {
  const { colors, sx: authSx } = AUTH_TOKENS;

  const {
    username, 
    setUsername, 
    error, 
    loading, 
    submitted, 
    submitResendForm 
  } = useResendActivation();
  
  const { showSnackbar } = useSnackbarContext();

  useEffect(() => {
    if (error) {
      showSnackbar({ message: error, severity: 'error' });
    }
  }, [error, showSnackbar]);

  const handleSubmit = () => {
    void submitResendForm(username);
  };

  return (
    <Box
      sx={{
        ...authSx.pageContainerWithTopSpacing
      }}
    >
      <Paper
        sx={{
          ...authSx.wideCard,
        }}
      >
        {!submitted ? (
          <Fade in timeout={300}>
            <Box>
              <Box sx={{ mb: 4 }}>
                <Typography 
                 className='auth-primary-title'
                >
                  Reenviar ativação
                </Typography>
                <Typography
                  className='auth-secondary-text'
                >
                  Informe seu username para receber um novo link de ativação.
                </Typography>
              </Box>

              <TextField
                fullWidth
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                sx={{ mb: 2 }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonRoundedIcon
                          sx={{ color: colors.textMuted, fontSize: 20 }}
                        />
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <Button
                fullWidth
                variant="contained"
                onClick={handleSubmit}
                disabled={loading}
                className='auth-btn-primary'
              >
                {loading ? (
                  <CircularProgress size={22} sx={{ color: '#fff' }} />
                ) : (
                  'Reenviar email'
                )}
              </Button>

              <Box sx={{ textAlign: 'center' }}>
                <Button
                  component={Link}
                  href="/login"
                  variant="text"
                  startIcon={<ArrowBackRoundedIcon />}
                  sx={{
                    color: colors.textMuted,
                    '&:hover': { color: colors.text },
                  }}
                >
                  Voltar para o login
                </Button>
              </Box>
            </Box>
          </Fade>
        ) : (
          <Fade in timeout={400}>
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <MarkEmailReadRoundedIcon
                sx={{ fontSize: 64, color: colors.primary, mb: 2 }}
              />
              <Typography
                className='auth-primary-title' mb={2}>
                Email enviado!
              </Typography>
              <Typography
                className='auth-secondary-text'mb={2}>
                Se o username{' '}
                <strong style={{ color: colors.text }}>
                  {username}
                </strong>{' '}
                existir e a conta ainda não estiver ativa, você receberá um novo
                link de ativação.
              </Typography>
              <Typography
                className='auth-secondary-text'
                mb={2}
              >
                O link expira em{' '}
                <strong style={{ color: colors.primary }}>24 horas</strong>.
              </Typography>
              <Button
                variant="contained"
                component={Link}
                href="/login"
                className='auth-btn-primary'
              >
                Voltar para o login
              </Button>
            </Box>
          </Fade>
        )}
      </Paper>
    </Box>
  );
}
