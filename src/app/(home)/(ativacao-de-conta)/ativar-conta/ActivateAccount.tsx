'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import {
  Box,
  Button,
  CircularProgress,
  Fade,
  Paper,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { AUTH_TOKENS } from '@/theme';
import useActiveAccount from '@/hooks/authentication/useActivateAccount';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded';
import ScheduleIcon from '@mui/icons-material/Schedule';

const statusBoxSx = { textAlign: 'center', py: 2 };
const statusIconSx = { fontSize: 64, mb: 2 };

export default function AccountActivationPage() {
  const theme = useTheme();
  const { colors, sx: authSx } = AUTH_TOKENS;
  const {pageState, validateAndActivate } = useActiveAccount();

  useEffect(() => {
    void validateAndActivate();
  }, [validateAndActivate]);

  return (
    <Box
      sx={{
        ...authSx.pageContainer,
        alignItems: 'center',
        px: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          ...authSx.wideCard,
        }}
      >
        {(pageState === 'validating' || pageState === 'activating') && (
          <Box sx={{ ...statusBoxSx, py: 4 }}>
            <CircularProgress sx={{ color: colors.primary }} />
            <Typography sx={{ color: colors.textMuted, mt: 2 }}>
              {pageState === 'validating'
                ? 'Validando link...'
                : 'Ativando sua conta...'}
            </Typography>
          </Box>
        )}

        {pageState === 'success' && (
          <Fade in timeout={400}>
            <Box sx={statusBoxSx}>
              <CheckCircleRoundedIcon
                sx={{ ...statusIconSx, color: theme.palette.success.main }}
              />
              <Typography className='auth-primary-title' mb={2}>
                Conta ativada!
              </Typography>
              <Typography className='auth-secondary-text' mb={2} >
                {`Sua conta foi ativada com sucesso.\nVocê já pode fazer login.`}
              </Typography>
              <Button
                component={Link}
                href="/login"
                className='auth-btn-primary'
              >
                Ir para o login
              </Button>
            </Box>
          </Fade>
        )}

        {pageState === 'expired' && (
          <Fade in timeout={300}>
            <Box sx={statusBoxSx} >
              <Typography className='auth-primary-title' mb={5}>
                Link expirado
              </Typography>
              <ScheduleIcon
                sx={{ ...statusIconSx, color: theme.palette.warning.main }}
              />
              
              <Typography className='auth-secondary-text' mb={2} >
                {`Este link de ativação expirou.\nSolicite um novo link abaixo.`}
              </Typography>
              <Button
                component={Link}
                href="/reenviar-ativacao"
                className='auth-btn-primary'
              >
                Solicitar novo link
              </Button>
            </Box>
          </Fade>
        )}

        {pageState === 'invalid' && (
          <Fade in timeout={300}>
            <Box sx={statusBoxSx}>
              <ErrorRoundedIcon sx={{ ...statusIconSx, color: theme.palette.error.main }} />
              <Typography className='auth-primary-title' mb={2}>
                Link inválido
              </Typography>
              <Typography className='auth-secondary-text' mb={2}>
                Este link é inválido ou já foi utilizado.
              </Typography>
              <Button
                component={Link}
                href="/login"
                className='auth-btn-primary'
              >
                Ir para o login
              </Button>
            </Box>
          </Fade>
        )}
      </Paper>
    </Box>
  );
}
