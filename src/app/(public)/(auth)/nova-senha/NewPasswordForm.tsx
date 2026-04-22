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
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded';
import Link from 'next/link';
import useNewPassword from '../../../../hooks/authentication/useNewPassword';
import { AUTH_BUTTON_CLASSES, AUTH_SX } from '@/theme';

type NewPasswordFormEntries = {
  newPassword: string;
  confirmPass: string;
};

type PasswordCriteria = {
  atLeast8Chars: boolean;
  hasNumberOrSymbol: boolean;
  passwordsMatch: boolean;
};

export default function NewPasswordPage() {
  const [formEntries, setFormEntries] = useState<NewPasswordFormEntries>({
    newPassword: '',
    confirmPass: '',
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);

  const [passwordCriteria, setPasswordCriteria] = useState<PasswordCriteria>({
    atLeast8Chars: false,
    hasNumberOrSymbol: false,
    passwordsMatch: false,
  });

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

  

  const {
    token,
    loading,
    pageState,
    submitNewPassword,
    checkToken,
  } = useNewPassword();

  // Valida o token ao montar a página
  useEffect(() => {
    checkToken();
  }, [token]);

  // Valida os critérios de senha sempre que o usuário digitar
  


  const validPassword = Object.values(passwordCriteria).every((criterion) => criterion);
  /*const validate = (): boolean => {
        const e: Record<string, string> = {};
        if (formEntries.newPassword.length < 8) e.new = 'Mínimo de 8 caracteres';
        if (formEntries.newPassword !== formEntries.confirmPass) e.confirm = 'As senhas não coincidem';
        setErrors(e);
        return Object.keys(e).length === 0;
    };*/
  

  const handleSubmit = async () => {
    submitNewPassword(formEntries.newPassword);
  };

  return (
      <Card
        sx={{
          ...AUTH_SX.card,
        }}
      >
        {/* Validando token */}
        {pageState === 'validating' && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
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
              <ErrorRoundedIcon sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: '1.4rem',
                  color: 'text.primary',
                  mb: 1,
                }}
              >
                Link inválido
              </Typography>
              <Typography
                sx={{ color: 'text.secondary', fontSize: '0.9rem', mb: 3 }}
              >
                Este link é inválido ou já expirou. Solicite um novo link de
                recuperação.
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
              <ErrorRoundedIcon sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: '1.4rem',
                  color: 'text.primary',
                  mb: 1,
                }}
              >
                Ocorreu um erro
              </Typography>
              <Typography
                sx={{ color: 'text.secondary', fontSize: '0.9rem', mb: 3 }}
              >
                Ocorreu um erro ao processar sua solicitação. Tente novamente
                mais tarde.
              </Typography>
              <Link href="/recuperar-senha" style={{ textDecoration: 'none' }}>
                <Button
                  variant="contained"
                  className={AUTH_BUTTON_CLASSES.primary}
                >
                  Tentar novamente
                </Button>
              </Link>
            </Box>
          </Fade>
        )}

        {/* Formulário de nova senha */}
        {pageState === 'form' && (
          <Fade in timeout={300}>
            <Box>
              <Box sx={{ mb: 4 }}>
                <Typography

                  sx={{
                    ...AUTH_SX.title,
                  }}
                >
                  Nova senha
                </Typography>
              </Box>

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
                variant="contained"
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
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: '1.4rem',
                  color: 'text.primary',
                  mb: 1,
                }}
              >
                Senha redefinida!
              </Typography>
              <Typography
                sx={{ color: 'text.secondary', fontSize: '0.9rem', mb: 3 }}
              >
                Sua senha foi atualizada com sucesso. Faça login com sua nova
                senha.
              </Typography>
              <Link href="/login" style={{ textDecoration: 'none' }}>
                <Button
                  variant="contained"
                  className={AUTH_BUTTON_CLASSES.primary}
                >
                  Ir para o login
                </Button>
              </Link>
            </Box>
          </Fade>
        )}
      </Card>
  );
}
