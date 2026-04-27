'use client';
import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Fade,
  CircularProgress,
  Alert,
  Stack,
} from '@mui/material';

import Condition from '@/components/shared/Condition';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded';
import Link from 'next/link';
import useNewPassword from '../../../../hooks/authentication/useNewPassword';
import { AUTH_BUTTON_CLASSES, AUTH_TOKENS } from '@/theme';

export default function NewPasswordPage() {
  const {
    formEntries,
    setFormEntries,
    showPassword,
    setShowPassword,
    passwordCriteria,
    setPasswordCriteria,
    token,
    loading,
    pageState,
    submitNewPassword,
    checkToken,
  } = useNewPassword();

  useEffect(() => {
    setPasswordCriteria((prev) => ({
      ...prev,
      atLeast8Chars: formEntries.newPassword.length >= 8,
      hasNumberOrSymbol: /[\d\W]/.test(formEntries.newPassword),
      passwordsMatch:
        formEntries.newPassword.length !== 0 &&
        formEntries.newPassword === formEntries.confirmPass,
    }));
  }, [formEntries.newPassword, formEntries.confirmPass]);

  // Valida o token ao montar a página
  useEffect(() => {
    checkToken();
  }, [token]);

  // Valida os critérios de senha sempre que o usuário digitar

  const validPassword = Object.values(passwordCriteria).every(
    (criterion) => criterion
  );

  const handleSubmit = async () => {
    submitNewPassword(formEntries.newPassword);
  };

  return (
    <Card
      sx={{
        ...AUTH_TOKENS.sx.card,
      }}
    >
      {/* Validando token */}
      {pageState === 'validating' && (
        <Box sx={{ textAlign: 'center', py: 10 }}>
          <CircularProgress />
          <Typography sx={{ color: 'text.secondary', mt: 2 }}>
            Validando link...
          </Typography>
        </Box>
      )}

      {/* Token inválido */}
      {pageState === 'invalid' && (
        <Fade in timeout={300}>
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <ErrorRoundedIcon
              sx={{ fontSize: 64, color: 'error.main', mb: 2 }}
            />
            <Typography className="auth-primary-title" mb={2}>
              Link inválido
            </Typography>
            <Typography className="auth-secondary-text" mb={3}>
              Este link é inválido ou já expirou.
            </Typography>
            <Link href="/recuperar-senha" style={{ textDecoration: 'none' }}>
              <Button
                variant="contained"
                className={AUTH_BUTTON_CLASSES.primary}
              >
                Solicitar novo link
              </Button>
            </Link>
          </Box>
        </Fade>
      )}

      {/*Erro na resposta da APi */}
      {pageState === 'error' && (
        <Fade in timeout={300}>
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <ErrorRoundedIcon
              sx={{ fontSize: 64, color: 'error.main', mb: 2 }}
            />
            <Typography className="auth-primary-title" mb={2}>
              Ocorreu um erro
            </Typography>
            <Typography className="auth-secondary-text" mb={3}>
              Ocorreu um erro ao processar sua solicitação. Tente novamente mais
              tarde.
            </Typography>

            <Button
              href="/recuperar-senha"
              LinkComponent={Link}
              variant="contained"
              className={AUTH_BUTTON_CLASSES.primary}
            >
              Tentar novamente
            </Button>
          </Box>
        </Fade>
      )}

      {/* Formulário de nova senha */}
      {pageState === 'form' && (
        <Fade in timeout={300}>
          <Box>
            <Typography
              /*sx={{
                ...AUTH_TOKENS.sx.title,
              }}*/
              className="auth-primary-title"
              textAlign={'center'}
              mb={3}
            >
              Nova senha
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <TextField
                  fullWidth
                  label="Nova senha"
                  type={showPassword ? 'text' : 'password'}
                  value={formEntries.newPassword}
                  onChange={(e) =>
                    setFormEntries((prev) => ({
                      ...prev,
                      newPassword: e.target.value,
                    }))
                  }
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            tabIndex={-1}
                            onClick={() => setShowPassword((p) => !p)}
                          >
                            {showPassword ? (
                              <VisibilityOffRoundedIcon fontSize="small" />
                            ) : (
                              <VisibilityRoundedIcon fontSize="small" />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Box>

              <TextField
                fullWidth
                label="Confirmar senha"
                type={showPassword ? 'text' : 'password'}
                value={formEntries.confirmPass}
                onChange={(e) =>
                  setFormEntries((prev) => ({
                    ...prev,
                    confirmPass: e.target.value,
                  }))
                }
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          tabIndex={-1}
                          onClick={() => setShowPassword((p) => !p)}
                        >
                          {showPassword ? (
                            <VisibilityOffRoundedIcon fontSize="small" />
                          ) : (
                            <VisibilityRoundedIcon fontSize="small" />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Box>
            <Stack
              spacing={1}
              sx={{
                mt: 2,
              }}
            >
              <Condition
                ok={passwordCriteria.atLeast8Chars}
                text="Ao menos 8 caracteres"
              />
              <Condition
                ok={passwordCriteria.hasNumberOrSymbol}
                text="Deve conter um número ou símbolo"
              />
              <Condition
                ok={passwordCriteria.passwordsMatch}
                text="As senhas devem coincidir"
              />
            </Stack>

            <Button
              fullWidth
              className={AUTH_BUTTON_CLASSES.primary}
              onClick={handleSubmit}
              disabled={!validPassword || loading}
              sx={{
                mt: 3,
              }}
            >
              {loading ? (
                <CircularProgress size={22} sx={{ color: '#fff' }} />
              ) : (
                'Redefinir senha'
              )}
            </Button>
          </Box>
        </Fade>
      )}

      {/* Sucesso */}
      {pageState === 'success' && (
        <Fade in timeout={400}>
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <CheckCircleRoundedIcon
              sx={{ fontSize: 64, color: 'success.main', mb: 2 }}
            />
            <Typography className="auth-primary-title">
              Senha redefinida!
            </Typography>

            <Typography className="auth-secondary-text" mb={3}>
              Sua senha foi atualizada com sucesso. Faça login com sua nova
              senha.
            </Typography>

            <Button
              href="/login"
              LinkComponent={Link}
              variant="contained"
              className={AUTH_BUTTON_CLASSES.primary}
            >
              Ir para o login
            </Button>
          </Box>
        </Fade>
      )}
    </Card>
  );
}
