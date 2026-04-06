'use client';
import useResendActivation from '@/hooks/authentication/useResendActivation';
import {
    Box, Paper, Typography, TextField, Button,
    InputAdornment, Fade, CircularProgress, Alert
} from '@mui/material';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import MarkEmailReadRoundedIcon from '@mui/icons-material/MarkEmailReadRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import Link from 'next/link';
import { useState } from 'react';



export default function ResendActivationPage() {

    const [username, setUsername] = useState('');

    const {
        C,
        inputSx,
        error,
        loading,
        submitted,
        submitResendForm


    } = useResendActivation();

    const handleSubmit = () => {
        submitResendForm(username);
    }

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

                {!submitted ? (
                    <Fade in timeout={300}>
                        <Box>
                            <Box sx={{ mb: 4 }}>
                                <Typography sx={{ fontSize: '0.72rem', color: C.textMuted, letterSpacing: 2, textTransform: 'uppercase', mb: 0.5 }}>
                                    Cadastro
                                </Typography>
                                <Typography sx={{ fontWeight: 700, fontSize: '1.5rem', color: C.text }}>
                                    Reenviar ativação
                                </Typography>
                                <Typography sx={{ fontSize: '0.85rem', color: C.textMuted, mt: 1 }}>
                                    Informe seu username para receber um novo link de ativação.
                                </Typography>
                            </Box>

                            {error && (
                                <Alert severity="error" sx={{ mb: 2, bgcolor: 'rgba(255,107,107,0.1)', color: C.danger }}>
                                    {error}
                                </Alert>
                            )}

                            <TextField
                                fullWidth
                                label="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
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
                                onClick={handleSubmit}
                                disabled={loading}
                                sx={{
                                    py: 1.5, borderRadius: 3,
                                    backgroundColor: C.accent,
                                    '&:hover': { backgroundColor: C.accentHover },
                                    fontWeight: 700, mb: 2,
                                }}
                            >
                                {loading ? <CircularProgress size={22} sx={{ color: '#fff' }} /> : 'Reenviar email'}
                            </Button>

                            <Box sx={{ textAlign: 'center' }}>
                                <Link href="/login" style={{ textDecoration: 'none' }}>
                                    <Button startIcon={<ArrowBackRoundedIcon />} sx={{ color: C.textMuted, '&:hover': { color: C.text } }}>
                                        Voltar para o login
                                    </Button>
                                </Link>
                            </Box>
                        </Box>
                    </Fade>

                ) : (
                    <Fade in timeout={400}>
                        <Box sx={{ textAlign: 'center', py: 2 }}>
                            <MarkEmailReadRoundedIcon sx={{ fontSize: 64, color: C.accent, mb: 2 }} />
                            <Typography sx={{ fontWeight: 700, fontSize: '1.4rem', color: C.text, mb: 1 }}>
                                Email enviado!
                            </Typography>
                            <Typography sx={{ color: C.textMuted, fontSize: '0.9rem', mb: 1.5, lineHeight: 1.6 }}>
                                Se o username <strong style={{ color: C.text }}>{username}</strong> existir e a conta ainda não
                                estiver ativa, você receberá um novo link de ativação.
                            </Typography>
                            <Typography sx={{ color: C.textMuted, fontSize: '0.9rem', mb: 3, lineHeight: 1.6 }}>
                                O link expira em <strong style={{ color: C.accent }}>24 horas</strong>.
                            </Typography>
                            <Link href="/login" style={{ textDecoration: 'none' }}>
                                <Button variant="outlined" sx={{
                                    borderColor: C.border, color: C.text, borderRadius: 3,
                                    '&:hover': { borderColor: C.accent, color: C.accent },
                                }}>
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