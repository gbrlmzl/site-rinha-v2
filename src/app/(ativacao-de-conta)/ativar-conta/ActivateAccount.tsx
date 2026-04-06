'use client';
import React, { useState, useEffect } from 'react';
import {
    Box, Paper, Typography, Button,
    Fade, CircularProgress
} from '@mui/material';
import useActiveAccount from '@/hooks/authentication/useActivateAccount';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded';
import MarkEmailReadRoundedIcon from '@mui/icons-material/MarkEmailReadRounded';
import Link from 'next/link';


export default function AccountActivationPage() {
    const {
        token,
        pageState,
        C,
        validateAndActivate

    } = useActiveAccount();


    useEffect(() => {
        validateAndActivate();
    }, [token]);

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

                {/* Validando / Ativando */}
                {(pageState === 'validating' || pageState === 'activating') && (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                        <CircularProgress sx={{ color: C.accent }} />
                        <Typography sx={{ color: C.textMuted, mt: 2 }}>
                            {pageState === 'validating' ? 'Validando link...' : 'Ativando sua conta...'}
                        </Typography>
                    </Box>
                )}

                {/* Sucesso */}
                {pageState === 'success' && (
                    <Fade in timeout={400}>
                        <Box sx={{ textAlign: 'center', py: 2 }}>
                            <CheckCircleRoundedIcon sx={{ fontSize: 64, color: '#4caf50', mb: 2 }} />
                            <Typography sx={{ fontWeight: 700, fontSize: '1.4rem', color: C.text, mb: 1 }}>
                                Conta ativada!
                            </Typography>
                            <Typography sx={{ color: C.textMuted, fontSize: '0.9rem', mb: 3 }}>
                                Sua conta foi ativada com sucesso. Você já pode fazer login.
                            </Typography>
                            <Link href="/login" style={{ textDecoration: 'none' }}>
                                <Button variant="contained" sx={{
                                    backgroundColor: C.accent, borderRadius: 3,
                                    '&:hover': { backgroundColor: C.accentHover },
                                    fontWeight: 700,
                                }}>
                                    Ir para o login
                                </Button>
                            </Link>
                        </Box>
                    </Fade>
                )}

                {/* Token expirado */}
                {pageState === 'expired' && (
                    <Fade in timeout={300}>
                        <Box sx={{ textAlign: 'center', py: 2 }}>
                            <MarkEmailReadRoundedIcon sx={{ fontSize: 64, color: '#f0a500', mb: 2 }} />
                            <Typography sx={{ fontWeight: 700, fontSize: '1.4rem', color: C.text, mb: 1 }}>
                                Link expirado
                            </Typography>
                            <Typography sx={{ color: C.textMuted, fontSize: '0.9rem', mb: 3 }}>
                                Este link de ativação expirou. Solicite um novo link abaixo.
                            </Typography>
                            <Link href="/reenviar-ativacao" style={{ textDecoration: 'none' }}>
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

                {/* Token inválido */}
                {pageState === 'invalid' && (
                    <Fade in timeout={300}>
                        <Box sx={{ textAlign: 'center', py: 2 }}>
                            <ErrorRoundedIcon sx={{ fontSize: 64, color: C.danger, mb: 2 }} />
                            <Typography sx={{ fontWeight: 700, fontSize: '1.4rem', color: C.text, mb: 1 }}>
                                Link inválido
                            </Typography>
                            <Typography sx={{ color: C.textMuted, fontSize: '0.9rem', mb: 3 }}>
                                Este link é inválido ou já foi utilizado.
                            </Typography>
                            <Link href="/login" style={{ textDecoration: 'none' }}>
                                <Button variant="outlined" sx={{
                                    borderColor: C.border, color: C.text, borderRadius: 3,
                                    '&:hover': { borderColor: C.accent, color: C.accent },
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