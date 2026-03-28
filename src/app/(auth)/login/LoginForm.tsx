'use client';

import Link from 'next/link';
import Form from 'next/form';
import { useEffect, useState } from 'react';
import { redirect } from 'next/navigation';
import loginAction from '@/hooks/authentication/useLogin'
import { useActionState } from 'react';
import { useRouter } from 'next/navigation';

import {
  Alert,
  Box,
  Button,
  Card,
  CircularProgress,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  Checkbox,
  FormControlLabel,
} from '@mui/material';

import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import GoogleIcon from '@mui/icons-material/Google';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useAuth } from '@/hooks/authentication/useAuth';

type LoginState = {
  success: boolean | null;
  message: string;
};

const initialState: LoginState = {
  success: null,
  message: '',
};

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState<LoginState, FormData>(loginAction, initialState);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  
  

  const { isLoading, refreshUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      refreshUser().then(() => {
        router.push('/');
      });
    }
  }, [state?.success, refreshUser]);

  useEffect(() => {
    if (state?.success === false) {
      setPassword('');
    }
  }, [state?.success]);

  const dadosPreenchidos = username.trim().length > 0 && password.trim().length > 0;

  return (
    <Card sx={{ maxWidth: 500, mx: 'auto', p: 3, mt: 2, paddingInline: { xs: '2rem', md: '8rem' } }}>
      <Typography variant="h4" component="h1" mb={2} sx={{ textAlign: 'center', fontWeight: 500 }}>
        Fazer login
      </Typography>

      {state.success === false && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {state.message}
        </Alert>
      )}

      <Form action={formAction}>
        <Stack spacing={1}>
          <TextField
            fullWidth
            name='username'
            type="text"
            label="Usuário"
            value={username}
            onChange={(e) => setUsername(e.target.value.toLowerCase())}
            disabled={isPending}
          />

          <TextField
            fullWidth
            type={showPassword ? 'text' : 'password'}
            label="Senha"
            name='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isPending}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((prev) => !prev)}
                      edge="end"
                      aria-label="Mostrar/Ocultar senha"
                      tabIndex={-1}
                      disabled={isPending}
                    >
                      {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
        </Stack>

        <Box sx={{ width: '100%', paddingBlock: 0.5, paddingInline: 1 }}>
          <FormControlLabel
            control={<Checkbox />}
            name='keepLoggedIn'
            checked={keepLoggedIn}
            onChange={() => setKeepLoggedIn(!keepLoggedIn)}
            label="Manter login"
            disabled={isPending}
            sx={{
              '& .MuiSvgIcon-root': { fontSize: '1rem' },
              '& .MuiFormControlLabel-label': { fontSize: '0.875rem' },
              '& .MuiButtonBase-root': { paddingInline: 0.5, paddingBlock: 0 },
            }}
          />
        </Box>

        <Stack spacing={2} mt={2}>
          {isLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <CircularProgress size={40} />
            </div>
          ) : (
            <Button
              type="submit"
              variant="contained"
              disabled={isPending || !dadosPreenchidos}
              endIcon={isPending ? <CircularProgress color="inherit" size={16} /> : <ArrowForwardIcon />}
            >
              {isPending ? 'Entrando...' : 'Entrar'}
            </Button>
          )}
        </Stack>
      </Form>

      {!isLoading && (
        <Box mt={2} textAlign="center">
          <Link href="/cadastro" style={{ textDecoration: 'none' }}>
            Criar conta
          </Link>
        </Box>
      )}
    </Card>
  );
}