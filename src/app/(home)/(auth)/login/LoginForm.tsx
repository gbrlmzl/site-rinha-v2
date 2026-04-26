'use client';

import Link from 'next/link';
import Form from 'next/form';
import { useEffect, useState } from 'react';
import loginAction from '@/hooks/authentication/useLogin';
import { useActionState } from 'react';
import { useRouter } from 'next/navigation';
import { AUTH_BUTTON_CLASSES, AUTH_SX } from '@/theme';

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
import { useAuthContext } from '@/contexts/AuthContext';

type LoginState = {
  success: boolean | null;
  message: string;
};

type LoginFormEntries = {
  username: string;
  password: string;
};

const initialState: LoginState = {
  success: null,
  message: '',
};

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState<LoginState, FormData>(
    loginAction,
    initialState
  );
  const [formEntries, setFormEntries] = useState<LoginFormEntries>({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState<boolean>(false);

  const { isLoading, refreshUser } = useAuthContext();

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
      console.log('Falha no login:', state.message);
      setFormEntries((prev) => ({ ...prev, password: '' }));
    }
  }, [state]);

  const dadosPreenchidos: boolean =
    formEntries.username.trim().length > 0 &&
    formEntries.password.trim().length > 0;

  return (
    <Card
      sx={{
        ...AUTH_SX.card,
      }}
    >
      <Typography
        variant="h4"
        component="h1"
        mb={2}
        sx={AUTH_SX.title}
      >
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
            name="username"
            type="text"
            label="Usuário"
            value={formEntries.username}
            onChange={(e) =>
              setFormEntries((prev) => ({
                ...prev,
                username: e.target.value.toLowerCase(),
              }))
            }
            disabled={isPending}
          />

          <TextField
            fullWidth
            type={showPassword ? 'text' : 'password'}
            label="Senha"
            name="password"
            value={formEntries.password}
            onChange={(e) =>
              setFormEntries((prev) => ({ ...prev, password: e.target.value }))
            }
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
                      {showPassword ? (
                        <VisibilityIcon />
                      ) : (
                        <VisibilityOffIcon />
                      )}
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
            name="keepLoggedIn"
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
              className={AUTH_BUTTON_CLASSES.primary}
              disabled={isPending || !dadosPreenchidos}
            >
              {isPending ? <CircularProgress color="inherit" size={16} /> : 'Entrar'}
            </Button>
          )}
        </Stack>
      </Form>

      {!isLoading && (
        <Box
          sx={AUTH_SX.centeredLinks}
        >
          <Link
            href="/recuperar-senha"
            style={{ textDecoration: 'none', fontSize: '0.875rem' }}
          >
            Esqueceu a senha?
          </Link>
          <Link href="/cadastro" style={{ textDecoration: 'none' }}>
            Criar conta
          </Link>
        </Box>
      )}
    </Card>
  );
}
