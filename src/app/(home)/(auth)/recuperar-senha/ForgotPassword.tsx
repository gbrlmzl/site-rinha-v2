'use client';
import React, { useActionState, useState } from 'react';
import Form from 'next/form';
import {
  Box,
  Card,
  Typography,
  TextField,
  Button,
  Fade,
  CircularProgress,
} from '@mui/material';

import MarkEmailReadRoundedIcon from '@mui/icons-material/MarkEmailReadRounded';
import Link from 'next/link';
import { AUTH_BUTTON_CLASSES, AUTH_TOKENS } from '@/theme';

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
        ...AUTH_TOKENS.sx.card,
      }}
    >
      {
        !state.submitted ? (
          <Fade in timeout={300}>
            <Box>
              {/* Header */}
              <Box sx={{ mb: 4 }}>
                <Typography className="auth-primary-title">
                  Recuperar senha
                </Typography>

                <Typography className="auth-secondary-text">
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
                />

                <Button
                  fullWidth
                  className="auth-btn-primary"
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
                    fullWidth
                    variant="outlined"
                    className={'auth-btn-secondary'}
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
              <Typography className="auth-primary-title" mb={2}>
                Email enviado!
              </Typography>
              <Typography className="auth-secondary-text" mb={2}>
                Se o username{' '}
                <strong style={{ color: 'inherit' }}>{username}</strong>{' '}
                existir, você receberá um email com o link para redefinir sua
                senha. O link expira em{' '}
                <strong style={{ color: 'inherit' }}>10 minutos</strong>.
              </Typography>
              <Typography className="auth-secondary-text" mb={1}>
                Não recebeu? Verifique a pasta de spam.
              </Typography>

              <Button
                href="/login"
                LinkComponent={Link}
                variant="outlined"
                className={'auth-btn-secondary'}
              >
                Voltar para o login
              </Button>
            </Box>
          </Fade>
        )
      }
    </Card>
  );
}
