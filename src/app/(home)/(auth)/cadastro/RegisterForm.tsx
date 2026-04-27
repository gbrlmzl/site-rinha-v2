'use client';

import registerAction from './registerAction';
import { useActionState, useEffect, useState } from 'react';
import Form from 'next/form';
import Link from 'next/link';

import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  Card,
} from '@mui/material';

import { RegisterState } from '@/types/auth/authTypes';

import Condition from '@/components/shared/Condition';

import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import DoneIcon from '@mui/icons-material/Done';
import CircularProgress from '@mui/material/CircularProgress';
import { useSnackbarContext } from '@/contexts/SnackbarContext';
import { AUTH_BUTTON_CLASSES, AUTH_TOKENS } from '@/theme';

type RegisterFormEntries = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type passwordConditions = {
  atLeast8Chars: boolean;
  hasNumberOrSymbol: boolean;
  passwordsMatch: boolean;
};

const initialState: RegisterState = {
  success: null,
  message: '',
};

export default function RegisterForm() {
  const { showSnackbar } = useSnackbarContext();

  const [state, formAction, isPending] = useActionState<RegisterState, FormData>(registerAction, initialState);

  const [formEntries, setFormEntries] = useState<RegisterFormEntries>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [passwordConditions, setPasswordConditions] =
    useState<passwordConditions>({
      atLeast8Chars: false,
      hasNumberOrSymbol: false,
      passwordsMatch: false,
    });

  const [showPassword, setShowPassword] = useState<boolean>(false);

  //const [googleLoading, setGoogleLoading] = useState<boolean>(false);

  const dadosPreenchidos: boolean =
    formEntries.email.trim().length > 0 &&
    passwordConditions.atLeast8Chars &&
    passwordConditions.hasNumberOrSymbol &&
    passwordConditions.passwordsMatch &&
    formEntries.username.trim().length > 0;

  useEffect(() => {
    setPasswordConditions((prev) => ({
      ...prev,
      atLeast8Chars: formEntries.password.length >= 8,
    }));
    setPasswordConditions((prev) => ({
      ...prev,
      hasNumberOrSymbol: /[\d\W]/.test(formEntries.password),
    }));
    setPasswordConditions((prev) => ({
      ...prev,
      passwordsMatch:
        formEntries.password.length !== 0 &&
        formEntries.password === formEntries.confirmPassword,
    }));
  }, [formEntries.password, formEntries.confirmPassword]);

  useEffect(() => {
    if (state.success) {
      setFormEntries({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
      return;
    }

    if (state.success === false) {
      showSnackbar({
        message: state.message || 'Não foi possível criar sua conta.',
        severity: 'error',
      });

      setFormEntries({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
    }
  }, [state, showSnackbar]);

  if (state.success) {
    return (
      <Card
        sx={{
          ...AUTH_TOKENS.sx.card,
        }}
      >
        <Typography
          component="h2"
          mb={0.75}
          sx={{
            whiteSpace: 'pre-line',
            textAlign: 'center',
            fontWeight: 500,
            fontSize: { xs: '1.3rem', sm: '1.5rem' },
          }}
        >
          {state.message}
        </Typography>
        {state.secondaryMessage && (
          <Typography
            component="p"
            mb={0.25}
            sx={{
              whiteSpace: 'pre-line',
              textAlign: 'center',
              fontSize: { xs: '0.8rem', sm: '1rem' },
              color: 'text.secondary',
            }}
          >
            {state.secondaryMessage}
          </Typography>
        )}
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            paddingBlock: '2rem',
          }}
        >
          <DoneIcon color="success" sx={{ fontSize: 150 }}></DoneIcon>
        </div>

        <Box display="flex" justifyContent="center">
          <Link href="/login" passHref>
            <Button variant="contained" className={AUTH_BUTTON_CLASSES.primary}>
              Fazer login
            </Button>
          </Link>
        </Box>
      </Card>
    );
  }

  return (
    <Card
      sx={{
        ...AUTH_TOKENS.sx.card,
      }}
    >
      <Typography variant="h4" component="h1" mb={2} sx={AUTH_TOKENS.sx.title}>
        Crie sua conta
      </Typography>

      <Form
        action={formAction}
        style={{ display: 'block', flexDirection: 'column' }}
      >
        <Stack spacing={1}>
          <TextField
            fullWidth
            name="username"
            label="Nome de usuário"
            value={formEntries.username}
            onChange={(e) =>
              setFormEntries({
                ...formEntries,
                username: e.target.value.toLowerCase(),
              })
            }
          />

          <TextField
            fullWidth
            name="email"
            type="email"
            label="Email"
            value={formEntries.email}
            onChange={(e) =>
              setFormEntries({ ...formEntries, email: e.target.value })
            }
          />

          <TextField
            fullWidth
            name="password"
            type={showPassword ? 'text' : 'password'}
            label="Senha"
            value={formEntries.password}
            onChange={(e) =>
              setFormEntries({ ...formEntries, password: e.target.value })
            }
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      tabIndex={-1}
                      onClick={() => setShowPassword((prev) => !prev)}
                      edge="end"
                      aria-label="Mostrar/Ocultar senha"
                      size="small"
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

          <TextField
            fullWidth
            name="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            label="Confirmar senha"
            value={formEntries.confirmPassword}
            onChange={(e) =>
              setFormEntries({
                ...formEntries,
                confirmPassword: e.target.value,
              })
            }
          />
        </Stack>

        <Stack spacing={1} sx={{ mt: 2 }}>
          <Condition
            ok={passwordConditions.atLeast8Chars}
            text="Ao menos 8 caracteres"
          />
          <Condition
            ok={passwordConditions.hasNumberOrSymbol}
            text="Deve conter um número ou símbolo"
          />
          <Condition
            ok={passwordConditions.passwordsMatch}
            text="As senhas devem coincidir"
          />
        </Stack>
        <Button
          type="submit"
          variant="contained"
          className={AUTH_BUTTON_CLASSES.primary}
          disabled={isPending || !dadosPreenchidos}
          fullWidth
          sx={{ mt: 2 }}
        >
          {isPending ? (
            <CircularProgress color="inherit" size={16} />
          ) : (
            'Cadastrar'
          )}
        </Button>
      </Form>

      <Box sx={AUTH_TOKENS.sx.centeredLinks}>
        <Link href="/login">Já possuo uma conta</Link>
      </Box>
    </Card>
  );
}
