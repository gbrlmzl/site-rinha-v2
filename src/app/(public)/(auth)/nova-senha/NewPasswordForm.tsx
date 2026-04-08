'use client';
import React, { useState, useEffect } from 'react';
import {
    Box, Paper, Typography, TextField, Button,
    InputAdornment, IconButton, Fade, CircularProgress, Alert, Stack
} from '@mui/material';

import Condition from "@/components/shared/Condition";
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded';
import Link from 'next/link';
import useNewPassword from '../../../../hooks/authentication/useNewPassword';




type PageState = 'validating' | 'invalid' | 'form' | 'success';

export default function NewPasswordPage() {


    const [newPassword, setNewPassword] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);


    const [atLeast8Chars, setAtLeast8Chars] = useState(false);
    const [hasNumberOrSymbol, setHasNumberOrSymbol] = useState(false);
    const [passwordsMatch, setPasswordsMatch] = useState(false);

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

        checkToken()
    }, [token]);

    // Valida os critérios de senha sempre que o usuário digitar
    useEffect(() => {
        setAtLeast8Chars(newPassword.length >= 8);
        setHasNumberOrSymbol(/[\d\W]/.test(newPassword));
        setPasswordsMatch(newPassword.length !== 0 && newPassword === confirmPass);

    }, [newPassword, confirmPass]);

    /*const validate = (): boolean => {
        const e: Record<string, string> = {};
        if (newPassword.length < 8) e.new = 'Mínimo de 8 caracteres';
        if (newPassword !== confirmPass) e.confirm = 'As senhas não coincidem';
        setErrors(e);
        return Object.keys(e).length === 0;
    };*/

    const handleSubmit = async () => {
        submitNewPassword(newPassword);
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            backgroundColor: C.bg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            px: 2,
        }}>
            <Paper elevation={0} sx={{
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
                    top: 0, left: 0, right: 0,
                    height: 3,
                    background: `linear-gradient(90deg, transparent, ${C.accent}, transparent)`,
                },
            }}>

                {/* Validando token */}
                {pageState === 'validating' && (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                        <CircularProgress sx={{ color: C.accent }} />
                        <Typography sx={{ color: C.textMuted, mt: 2 }}>Validando link...</Typography>
                    </Box>
                )}

                {/* Token inválido */}
                {pageState === 'invalid' && (
                    <Fade in timeout={300}>
                        <Box sx={{ textAlign: 'center', py: 2 }}>
                            <ErrorRoundedIcon sx={{ fontSize: 64, color: C.danger, mb: 2 }} />
                            <Typography sx={{ fontWeight: 700, fontSize: '1.4rem', color: C.text, mb: 1 }}>
                                Link inválido
                            </Typography>
                            <Typography sx={{ color: C.textMuted, fontSize: '0.9rem', mb: 3 }}>
                                Este link é inválido ou já expirou. Solicite um novo link de recuperação.
                            </Typography>
                            <Link href="/recuperar-senha" style={{ textDecoration: 'none' }}>
                                <Button variant="contained" sx={{
                                    backgroundColor: C.accent, borderRadius: 3,
                                    '&:hover': { backgroundColor: C.accentHover },
                                }}>
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
                                <Typography sx={{ fontSize: '0.72rem', color: C.textMuted, letterSpacing: 2, textTransform: 'uppercase', mb: 0.5 }}>
                                    Segurança
                                </Typography>
                                <Typography sx={{ fontWeight: 700, fontSize: '1.5rem', color: C.text }}>
                                    Nova senha
                                </Typography>
                            </Box>

                            {errors.submit && (
                                <Alert severity="error" sx={{ mb: 2, bgcolor: 'rgba(255,107,107,0.1)', color: C.danger }}>
                                    {errors.submit}
                                </Alert>
                            )}

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Box>
                                    <TextField
                                        fullWidth
                                        label="Nova senha"
                                        type={showNew ? 'text' : 'password'}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        error={!!errors.new}
                                        helperText={errors.new}
                                        sx={inputSx}
                                        slotProps={{
                                            input: {
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton tabIndex={-1} onClick={() => setShowNew(p => !p)} sx={{ color: C.textMuted }}>
                                                            {showNew ? <VisibilityOffRoundedIcon fontSize="small" /> : <VisibilityRoundedIcon fontSize="small" />}
                                                        </IconButton>
                                                    </InputAdornment>

                                                )
                                            }
                                        }}
                                    />
                                </Box>

                                <TextField
                                    fullWidth
                                    label="Confirmar senha"
                                    type={showConfirm ? 'text' : 'password'}
                                    value={confirmPass}
                                    onChange={(e) => setConfirmPass(e.target.value)}
                                    error={!!errors.confirm}
                                    helperText={errors.confirm}
                                    sx={inputSx}
                                    slotProps={{
                                        input: {
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton tabIndex={-1} onClick={() => setShowConfirm(p => !p)} sx={{ color: C.textMuted }}>
                                                        {showConfirm ? <VisibilityOffRoundedIcon fontSize="small" /> : <VisibilityRoundedIcon fontSize="small" />}
                                                    </IconButton>
                                                </InputAdornment>

                                            )
                                        }
                                    }}
                                />
                            </Box>
                            <Stack spacing={1} sx={{ mt: 2 }} >
                                <Condition ok={atLeast8Chars} text="Ao menos 8 caracteres" textColor='white' />
                                <Condition ok={hasNumberOrSymbol} text="Deve conter um número ou símbolo" textColor='white' />
                                <Condition ok={passwordsMatch} text="As senhas devem coincidir" textColor='white' />
                            </Stack>

                            <Button
                                fullWidth
                                variant="contained"
                                onClick={handleSubmit}
                                disabled={loading}
                                startIcon={loading ? undefined : <LockRoundedIcon />}
                                sx={{
                                    mt: 3, py: 1.5, borderRadius: 3,
                                    backgroundColor: C.accent,
                                    '&:hover': { backgroundColor: C.accentHover },
                                    fontWeight: 700,
                                }}
                            >
                                {loading ? <CircularProgress size={22} sx={{ color: '#fff' }} /> : 'Redefinir senha'}
                            </Button>
                        </Box>
                    </Fade>
                )}

                {/* Sucesso */}
                {pageState === 'success' && (
                    <Fade in timeout={400}>
                        <Box sx={{ textAlign: 'center', py: 2 }}>
                            <CheckCircleRoundedIcon sx={{ fontSize: 64, color: '#4caf50', mb: 2 }} />
                            <Typography sx={{ fontWeight: 700, fontSize: '1.4rem', color: C.text, mb: 1 }}>
                                Senha redefinida!
                            </Typography>
                            <Typography sx={{ color: C.textMuted, fontSize: '0.9rem', mb: 3 }}>
                                Sua senha foi atualizada com sucesso. Faça login com sua nova senha.
                            </Typography>
                            <Link href="/login" style={{ textDecoration: 'none' }}>
                                <Button variant="contained" sx={{
                                    backgroundColor: C.accent, borderRadius: 3,
                                    '&:hover': { backgroundColor: C.accentHover },
                                }}>
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