'use client';

import { ReactNode } from 'react';
import {
  AppBar,
  Box,
  Button,
  Stack,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import LogoutIcon from '@mui/icons-material/Logout';
import { useRouter } from 'next/navigation';
import { ADMIN_TOKENS } from '@/theme';

interface AdminShellProps {
  children: ReactNode;
}

const EXIT_PATH = '/inicio';

export default function AdminShell({ children }: AdminShellProps) {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleExit = () => router.push(EXIT_PATH);

  return (
    <>
      <AppBar position="fixed" elevation={0} sx={ADMIN_TOKENS.sx.shellAppBar}>
        <Toolbar
          disableGutters
          sx={{
            paddingInline: { xs: 2, md: 4 },
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <Box sx={ADMIN_TOKENS.sx.shellBrand}>
            <Box sx={ADMIN_TOKENS.sx.shellBrandIcon}>
              <SettingsRoundedIcon fontSize="small" />
            </Box>
            <Stack spacing={0} sx={{ lineHeight: 1 }}>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: '0.95rem', md: '1.05rem' },
                  color: ADMIN_TOKENS.colors.text,
                  lineHeight: 1.1,
                }}
              >
                Painel Administrativo
              </Typography>
              <Typography
                sx={{
                  ...ADMIN_TOKENS.typography.sectionLabel,
                  fontSize: '0.65rem',
                }}
              >
                Gestão de competições
              </Typography>
            </Stack>
          </Box>

          <Button
            onClick={handleExit}
            variant="contained"
            disableElevation
            startIcon={!isMobile ? <LogoutIcon /> : undefined}
            sx={ADMIN_TOKENS.sx.shellExitButton}
          >
            {isMobile ? <LogoutIcon fontSize="small" /> : 'Sair do Painel'}
          </Button>
        </Toolbar>
      </AppBar>

      <Box component="main" sx={ADMIN_TOKENS.sx.pageContainer}>
        {children}
      </Box>
    </>
  );
}
