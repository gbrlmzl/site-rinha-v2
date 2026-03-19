'use client';

import Form from 'next/form';
import Link from 'next/link';
import loginAction from './loginAction';
import { useActionState, useEffect, useState } from 'react';
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
} from '@mui/material';

import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import GoogleIcon from '@mui/icons-material/Google';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

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
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  
  useEffect(() => {
    if (state.success) {
      router.push('/');
    }
  }, [state.success, router]);
  

  const dadosPreenchidos = username.trim().length > 0 && password.trim().length > 0;

  /*
  async function handleGoogleSignIn() {
    if (googleLoading) return;
    setGoogleLoading(true);
    await signIn('google');
    setGoogleLoading(false);
  }
    */

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
        <Stack spacing={2}>
          <TextField
            fullWidth
            type="text"
            name="username"
            label="Usuário"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <TextField
            fullWidth
            type={showPassword ? 'text' : 'password'}
            name="password"
            label="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((prev) => !prev)}
                      edge="end"
                      aria-label="Mostrar/Ocultar senha"
                    >
                      {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          {/*
          <Stack spacing={1} alignItems="center" pt={1}>
            <Typography variant="body2">Ou entrar com</Typography>
            <Button
              type="button"
              variant="outlined"
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
              startIcon={googleLoading ? <CircularProgress size={16} /> : <GoogleIcon />}
            >
              Google
            </Button>
          </Stack>
          */}

          <Button
            type="submit"
            variant="contained"
            disabled={isPending || !dadosPreenchidos}
            endIcon={isPending ? <CircularProgress color="inherit" size={16} /> : <ArrowForwardIcon />}
          >
            {isPending ? 'Entrando...' : 'Entrar'}
          </Button>
        </Stack>
      </Form>

      <Box mt={2} textAlign="center">
        <Link href="/cadastro" style={{ textDecoration: 'none' }}>
          Criar conta
        </Link>
      </Box>
    </Card>
  );
}