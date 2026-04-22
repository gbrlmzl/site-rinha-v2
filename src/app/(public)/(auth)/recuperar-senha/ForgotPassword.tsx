'use client';
import React, { useActionState, useState } from 'react';
import Form from 'next/form';
import {
  Box,
  Card,
  Typography,
  TextField,
  Button,
  InputAdornment,
  Fade,
  CircularProgress,
} from '@mui/material';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import MarkEmailReadRoundedIcon from '@mui/icons-material/MarkEmailReadRounded';
import Link from 'next/link';
import { AUTH_BUTTON_CLASSES, AUTH_SX } from '@/theme';

import passwordRecoveryAction from './forgotPasswordAction';
import { PasswordRecoveryState } from '@/types/auth/authTypes';

const initialState: PasswordRecoveryState = {
  submitted: false,
  message: '',
};

export default function ForgotPassword() {
  const [username, setUsername] = useState<string>('');

  const [state, formAction, isPending] = useActionState<
    PasswordRecoveryState,
    FormData
  >(passwordRecoveryAction, initialState);

  return (
      <Card
        sx={{
          ...AUTH_SX.card,
        }}
      >
        {!state.submitted ? (
          <Fade in timeout={300}>
            <Box>
              {/* Header */}
              <Box sx={{ mb: 4 }}>
                <Typography
                  variant='h4'
                  sx={{ ...AUTH_SX.title }}
                >
                  Recuperar senha
                </Typography>
                <Typography
                  sx={{ fontSize: '0.85rem', color: 'text.secondary', mt: 1 }}
                >
                  Informe seu nome de usuário e enviaremos um link para
                  redefinir sua senha.
                </Typography>
              </Box>

              <Form action={formAction}>
                <TextField
                  fullWidth
                  name="username"
                  label="Usuário"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  sx={{ mb: 3 }}
                  /*slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonRoundedIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                        </InputAdornment>
                      ),
                    },
                  }}*/
                />

                <Button
                  fullWidth
                  variant="contained"
                  className={AUTH_BUTTON_CLASSES.primary}
                  type="submit"
                  disabled={isPending || username.trim().length === 0}
                  sx={{
                    mb: 2,
                  }}
                >
                  {isPending ? (
                    <CircularProgress size={22} sx={{ color: '#fff' }} />
                  ) : (
                    'Enviar link'
                  )}
                </Button>
              </Form>

              <Box sx={{ textAlign: 'center' }}>
                <Link href="/login" style={{ textDecoration: 'none' }}>
                  <Button
                    variant="outlined"
                    className={AUTH_BUTTON_CLASSES.secondary}
                  >
                    Voltar para o login
                  </Button>
                </Link>
              </Box>
            </Box>
          </Fade>
        ) : (
          // ── Tela de confirmação ──────────────────────────────────────────
          <Fade in timeout={400}>
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <MarkEmailReadRoundedIcon
                sx={{ fontSize: 64, color: 'primary.main', mb: 2 }}
              />
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: '1.4rem',
                  color: 'text.primary',
                  mb: 1,
                }}
              >
                Email enviado!
              </Typography>
              <Typography
                sx={{
                  color: 'text.secondary',
                  fontSize: '0.9rem',
                  mb: 3,
                  lineHeight: 1.6,
                }}
              >
                Se o username{' '}
                <strong style={{ color: 'inherit' }}>{username}</strong> existir,
                você receberá um email com o link para redefinir sua senha. O
                link expira em{' '}
                <strong style={{ color: 'inherit' }}>10 minutos</strong>.
              </Typography>
              <Typography
                sx={{ color: 'text.secondary', fontSize: '0.8rem', mb: 3 }}
              >
                Não recebeu? Verifique a pasta de spam.
              </Typography>
              <Link href="/login" style={{ textDecoration: 'none' }}>
                <Button
                  variant="outlined"
                  className={AUTH_BUTTON_CLASSES.secondary}
                >
                  Voltar para o login
                </Button>
              </Link>
            </Box>
          </Fade>
        )}
      </Card>
  );
}
