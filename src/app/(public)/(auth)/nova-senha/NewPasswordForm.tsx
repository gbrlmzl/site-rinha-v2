'use client';
import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
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

type PageState = 'validating' | 'invalid' | 'form' | 'success';

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

  const {
    C,
    inputSx,
    token,
    loading,
    pageState,
    errors,
    submitNewPassword,
    checkToken,
  } = useNewPassword();

  // Valida o token ao montar a página
  useEffect(() => {
    checkToken();
  }, [token]);

  // Valida os critérios de senha sempre que o usuário digitar
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
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: C.bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: 440,
          backgroundColor: C.surface,
          borderRadius: 4,
          border: `1px solid ${C.border}`,
          p: { xs: 3, md: 4 },
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: `linear-gradient(90deg, transparent, ${C.accent}, transparent)`,
          },
        }}
      >
        {/* Validando token */}
        {pageState === 'validating' && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CircularProgress sx={{ color: C.accent }} />
            <Typography sx={{ color: C.textMuted, mt: 2 }}>
              Validando link...
            </Typography>
          </Box>
        )}

        {/* Token inválido */}
        {pageState === 'invalid' && (
          <Fade in timeout={300}>
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <ErrorRoundedIcon sx={{ fontSize: 64, color: C.danger, mb: 2 }} />
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: '1.4rem',
                  color: C.text,
                  mb: 1,
                }}
              >
                Link inválido
              </Typography>
              <Typography
                sx={{ color: C.textMuted, fontSize: '0.9rem', mb: 3 }}
              >
                Este link é inválido ou já expirou. Solicite um novo link de
                recuperação.
              </Typography>
              <Link href="/recuperar-senha" style={{ textDecoration: 'none' }}>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: C.accent,
                    borderRadius: 3,
                    '&:hover': { backgroundColor: C.accentHover },
                  }}
                >
                  Solicitar novo link
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
                    fontWeight: 700,
                    fontSize: '1.5rem',
                    color: C.text,
                    textAlign: 'center',
                  }}
                >
                  Nova senha
                </Typography>
              </Box>

              {errors.submit && (
                <Alert
                  severity="error"
                  sx={{
                    mb: 2,
                    bgcolor: 'rgba(255,107,107,0.1)',
                    color: C.danger,
                  }}
                >
                  {errors.submit}
                </Alert>
              )}

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
                    error={!!errors.new}
                    helperText={errors.new}
                    sx={inputSx}
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              tabIndex={-1}
                              onClick={() => setShowPassword((p) => !p)}
                              sx={{ color: C.textMuted }}
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
                  error={!!errors.confirm}
                  helperText={errors.confirm}
                  sx={inputSx}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            tabIndex={-1}
                            onClick={() => setShowPassword((p) => !p)}
                            sx={{ color: C.textMuted }}
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
                  '& .MuiSvgIcon-colorDisabled': { color: C.textMuted },
                }}
              >
                <Condition
                  ok={passwordCriteria.atLeast8Chars}
                  text="Ao menos 8 caracteres"
                  textColor="white"
                />
                <Condition
                  ok={passwordCriteria.hasNumberOrSymbol}
                  text="Deve conter um número ou símbolo"
                  textColor="white"
                />
                <Condition
                  ok={passwordCriteria.passwordsMatch}
                  text="As senhas devem coincidir"
                  textColor="white"
                />
              </Stack>

              <Button
                fullWidth
                variant="contained"
                onClick={handleSubmit}
                disabled={loading}
                startIcon={loading ? undefined : <LockRoundedIcon />}
                sx={{
                  mt: 3,
                  py: 1.5,
                  borderRadius: 3,
                  backgroundColor: C.accent,
                  '&:hover': { backgroundColor: C.accentHover },
                  fontWeight: 700,
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
                sx={{ fontSize: 64, color: '#4caf50', mb: 2 }}
              />
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: '1.4rem',
                  color: C.text,
                  mb: 1,
                }}
              >
                Senha redefinida!
              </Typography>
              <Typography
                sx={{ color: C.textMuted, fontSize: '0.9rem', mb: 3 }}
              >
                Sua senha foi atualizada com sucesso. Faça login com sua nova
                senha.
              </Typography>
              <Link href="/login" style={{ textDecoration: 'none' }}>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: C.accent,
                    borderRadius: 3,
                    '&:hover': { backgroundColor: C.accentHover },
                  }}
                >
                  Ir para o login
                </Button>
              </Link>
            </Box>
          </Fade>
        )}
      </Paper>
    </Box>
  );
}
