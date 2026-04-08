"use client";
import RouteProgressBar from "@/components/RouteProgressBar";
import { Box, Container, Skeleton, Stack } from "@mui/material";

export default function Loading() {
    const colors = {
        bg: '#080d2e',
        surface: '#0E1241',
        surfaceHigh: '#151a54',
        border: 'rgba(255,255,255,0.08)',
        accent: '#11B5E4',
        accentHover: '#0b80a0',
    };

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                background: colors.bg,
                py: 4,
            }}
        >

            <Container maxWidth="md" sx={{ width: '100%' }}>
                <Stack spacing={3}>
                    {/* Header Skeleton */}
                    {/*
                    <Box sx={{ mb: 4 }}>
                        <Skeleton
                            variant="rounded"
                            width="40%"
                            height={40}
                            sx={{
                                background: `linear-gradient(90deg, ${colors.surface} 25%, ${colors.surfaceHigh} 50%, ${colors.surface} 75%)`,
                                backgroundSize: '200% 100%',
                                animation: 'loading 1.5s infinite',
                                mb: 2,
                            }}
                        />
                    </Box>
                    */}

                    {/* Content Cards Skeleton */}
                    {[1, 2, 3].map((item) => (
                        <Box
                            key={item}
                            sx={{
                                p: 3,
                                background: colors.surface,
                                border: `1px solid ${colors.border}`,
                                borderRadius: 2,
                            }}
                        >
                            <Stack spacing={2}>
                                <Skeleton
                                    variant="rounded"
                                    height={20}
                                    sx={{
                                        background: `linear-gradient(90deg, ${colors.surfaceHigh} 25%, ${colors.accent}33 50%, ${colors.surfaceHigh} 75%)`,
                                        backgroundSize: '200% 100%',
                                        animation: 'loading 1.5s infinite',
                                    }}
                                />
                                <Skeleton
                                    variant="rounded"
                                    height={16}
                                    width="85%"
                                    sx={{
                                        background: `linear-gradient(90deg, ${colors.surfaceHigh} 25%, ${colors.accent}33 50%, ${colors.surfaceHigh} 75%)`,
                                        backgroundSize: '200% 100%',
                                        animation: 'loading 1.5s infinite',
                                    }}
                                />
                                <Skeleton
                                    variant="rounded"
                                    height={16}
                                    width="70%"
                                    sx={{
                                        background: `linear-gradient(90deg, ${colors.surfaceHigh} 25%, ${colors.accent}33 50%, ${colors.surfaceHigh} 75%)`,
                                        backgroundSize: '200% 100%',
                                        animation: 'loading 1.5s infinite',
                                    }}
                                />
                            </Stack>
                        </Box>
                    ))}

                    <style>{`
                        @keyframes loading {
                            0% {
                                background-position: 200% 0;
                            }
                            100% {
                                background-position: -200% 0;
                            }
                        }
                    `}</style>
                </Stack>
            </Container>
        </Box>
    );
}