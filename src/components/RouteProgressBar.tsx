"use client";
import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { Box, Fade } from '@mui/material';

const colors = {
    accent: '#11B5E4',
    accentHover: '#0b80a0',
    bg: '#080d2e',
};

export default function RouteProgressBar() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [showSplash, setShowSplash] = useState(false);
    const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const startLoading = useCallback(() => {
        if (hideTimeoutRef.current) {
            clearTimeout(hideTimeoutRef.current);
            hideTimeoutRef.current = null;
        }

        setIsLoading(true);
        setShowSplash(true);
        setProgress((prev) => (prev > 10 ? prev : 10));
    }, []);

    const finishLoading = useCallback(() => {
        if (!isLoading) return;

        setProgress(100);
        hideTimeoutRef.current = setTimeout(() => {
            setIsLoading(false);
            setShowSplash(false);
            setProgress(0);
            hideTimeoutRef.current = null;
        }, 250);
    }, [isLoading]);

    useEffect(() => {
        const handleDocumentClick = (event: MouseEvent) => {
            if (event.defaultPrevented) return;
            if (event.button !== 0) return;
            if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

            const target = event.target as HTMLElement | null;
            const link = target?.closest('a[href]') as HTMLAnchorElement | null;
            if (!link) return;

            if (link.target && link.target !== '_self') return;
            if (link.hasAttribute('download')) return;

            const url = new URL(link.href, window.location.href);
            const isExternal = url.origin !== window.location.origin;
            const isSameRoute =
                url.pathname === window.location.pathname &&
                url.search === window.location.search &&
                url.hash === window.location.hash;

            if (isExternal || isSameRoute) return;

            startLoading();
        };

        const handlePopState = () => {
            startLoading();
        };

        document.addEventListener('click', handleDocumentClick, true);
        window.addEventListener('popstate', handlePopState);

        return () => {
            document.removeEventListener('click', handleDocumentClick, true);
            window.removeEventListener('popstate', handlePopState);
        };
    }, [startLoading]);

    useEffect(() => {
        if (!isLoading) return;

        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 90) return prev;
                return Math.min(90, prev + Math.random() * 12);
            });
        }, 160);

        return () => clearInterval(interval);
    }, [isLoading]);

    useEffect(() => {
        finishLoading();
    }, [pathname, searchParams, finishLoading]);

    useEffect(() => {
        return () => {
            if (hideTimeoutRef.current) {
                clearTimeout(hideTimeoutRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (!isLoading) return;

        const failSafeTimeout = setTimeout(() => {
            finishLoading();
        }, 5000);

        return () => {
            clearTimeout(failSafeTimeout);
        };
    }, [isLoading, finishLoading]);

    return (
        <>
            <Box
                sx={{
                    position: 'relative',
                    left: 0,
                    width: '100%',
                    height: '2px',
                    background: '#F0E',
                    overflow: 'hidden',
                }}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        height: '100%',
                        background: colors.accent,
                        width: `${progress}%`,
                        transition: 'width 0.2s ease-out',
                        boxShadow: isLoading ? `0 0 10px ${colors.accent}` : 'none',
                    }}
                />
            </Box>

            {/*}
            <Fade in={showSplash} timeout={400}>
                <Box
                    sx={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100vh',
                        background: colors.bg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1099,
                        opacity: 0.25,
                        pointerEvents: 'none',
                    }}
                >
                    <Box
                        sx={{
                            width: 40,
                            height: 40,
                            border: `2px solid rgba(17, 181, 228, 0.2)`,
                            borderTop: `2px solid ${colors.accent}`,
                            borderRadius: '50%',
                            animation: 'spin 0.8s linear infinite',
                        }}
                    />
                    <style>{`
                        @keyframes spin {
                            0% { transform: rotate(0deg); }
                            100% { transform: rotate(360deg); }
                        }
                    `}</style>
                </Box>
            </Fade>*/}
        </>
    );
}
