'use client';
import React, { useActionState, useState } from 'react';
import Form from 'next/form';
import {
    Box, Paper, Typography, TextField, Button,
    InputAdornment, Fade, CircularProgress, Alert
} from '@mui/material';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import MarkEmailReadRoundedIcon from '@mui/icons-material/MarkEmailReadRounded';
import Link from 'next/link';

import passwordRecoveryAction from "./forgotPasswordAction";
import { PasswordRecoveryState } from "./forgotPasswordAction";

const C = {
    bg: '#080d2e',
    surface: '#0E1241',
    surfaceHigh: '#151a54',
    border: 'rgba(255,255,255,0.08)',
    accent: '#11B5E4',
    accentHover: '#0b80a0',
    danger: '#ff6b6b',
    text: '#ffffff',
    textMuted: 'rgba(255,255,255,0.45)',
};

const inputSx = {
    '& .MuiOutlinedInput-root': {
        backgroundColor: C.surfaceHigh,
        borderRadius: 2,
        color: C.text,
        '& fieldset': { borderColor: C.border },
        '&:hover fieldset': { borderColor: C.accent },
        '&.Mui-focused fieldset': { borderColor: C.accent },
    },
    '& .MuiInputLabel-root': { color: C.textMuted },
    '& .MuiInputLabel-root.Mui-focused': { color: C.accent },
};



const initialState: PasswordRecoveryState = {
    submitted: false,
    message: '',
};

export default function ForgotPassword() {
    const [username, setUsername] = useState('');
    const [error, setError] = useState<string | null>(null);

    const [state, formAction, isPending] = useActionState<PasswordRecoveryState, FormData>(passwordRecoveryAction, initialState);


    return (
        <Box sx={{
            minHeight: '100vh',
            backgroundColor: C.bg,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            px: 2,
            py: 6,
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

                {!state.submitted ? (
                    <Fade in timeout={300}>
                        <Box>
                            {/* Header */}
                            <Box sx={{ mb: 4 }}>
                                <Typography sx={{ fontWeight: 700, fontSize: '1.5rem', color: C.text }}>
                                    Recuperar senha
                                </Typography>
                                <Typography sx={{ fontSize: '0.85rem', color: C.textMuted, mt: 1 }}>
                                    Informe seu nome de usuário e enviaremos um link para redefinir sua senha.
                                </Typography>
                            </Box>

                            {error && (
                                <Alert severity="error" sx={{ mb: 2, bgcolor: 'rgba(255,107,107,0.1)', color: C.danger, border: `1px solid ${C.danger}40` }}>
                                    {error}
                                </Alert>
                            )}
                            <Form action={formAction}>

                                <TextField
                                    fullWidth
                                    name='username'
                                    label="Usuário"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    sx={{ ...inputSx, mb: 3 }}
                                    slotProps={{
                                        input: {
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <PersonRoundedIcon sx={{ color: C.textMuted, fontSize: 20 }} />
                                                </InputAdornment>
                                            )
                                        }
                                    }}

                                />

                                <Button
                                    fullWidth
                                    variant="contained"
                                    type='submit'
                                    disabled={isPending || username.trim().length === 0}
                                    sx={{
                                        py: 1.5, borderRadius: 3,
                                        backgroundColor: C.accent,
                                        '&:hover': { backgroundColor: C.accentHover },
                                        '&.Mui-disabled': {
                                            backgroundColor: '#0E1241',
                                            color: 'rgba(255,255,255,0.72)',
                                            border: `1px solid ${C.accent}80`,
                                            boxShadow: 'none',
                                        },
                                        fontWeight: 700, fontSize: '0.95rem',
                                        mb: 2,
                                        
                                    }}
                                >
                                    {isPending ? <CircularProgress size={22} sx={{ color: '#fff' }} /> : 'Enviar link'}
                                </Button>
                            </Form>

                            <Box sx={{ textAlign: 'center' }}>
                                <Link href="/login" style={{ textDecoration: 'none' }}>
                                    <Button
                                        startIcon={<ArrowBackRoundedIcon />}
                                        sx={{ color: C.textMuted, '&:hover': { color: C.text } }}
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
                            <MarkEmailReadRoundedIcon sx={{ fontSize: 64, color: C.accent, mb: 2 }} />
                            <Typography sx={{ fontWeight: 700, fontSize: '1.4rem', color: C.text, mb: 1 }}>
                                Email enviado!
                            </Typography>
                            <Typography sx={{ color: C.textMuted, fontSize: '0.9rem', mb: 3, lineHeight: 1.6 }}>
                                Se o username <strong style={{ color: C.text }}>{username}</strong> existir,
                                você receberá um email com o link para redefinir sua senha.
                                O link expira em <strong style={{ color: C.accent }}>10 minutos</strong>.
                            </Typography>
                            <Typography sx={{ color: C.textMuted, fontSize: '0.8rem', mb: 3 }}>
                                Não recebeu? Verifique a pasta de spam.
                            </Typography>
                            <Link href="/login" style={{ textDecoration: 'none' }}>
                                <Button
                                    variant="outlined"
                                    startIcon={<ArrowBackRoundedIcon />}
                                    sx={{
                                        borderColor: C.border, color: C.text,
                                        '&:hover': { borderColor: C.accent, color: C.accent },
                                        borderRadius: 3,
                                    }}
                                >
                                    Voltar para o login
                                </Button>
                            </Link>
                        </Box>
                    </Fade>
                )}

            </Paper>
        </Box>
    );
}