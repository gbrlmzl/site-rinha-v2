'use client';

import registerAction from "./registerAction";
import { use, useActionState, useEffect, useState } from 'react';
import Form from 'next/form';
import Link from 'next/link';

import {
    Alert,
    Box,
    Button,
    CircularProgress,
    IconButton,
    InputAdornment,
    Stack,
    TextField,
    Typography,
    Card,
    Paper,
    Icon
} from '@mui/material';

import Condition from "@/components/shared/Condition";

import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import DoneIcon from '@mui/icons-material/Done';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import GoogleIcon from '@mui/icons-material/Google';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';


type RegisterState = {
    success: boolean | null;
    message: string;
};

const initialState: RegisterState = {
    success: null,
    message: '',
};

export default function RegisterForm() {
    const [state, formAction, isPending] = useActionState<RegisterState, FormData>(registerAction, initialState);

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [atLeast8Chars, setAtLeast8Chars] = useState(false);
    const [hasNumberOrSymbol, setHasNumberOrSymbol] = useState(false);
    const [passwordsMatch, setPasswordsMatch] = useState(false);

    

    const dadosPreenchidos =
        email.trim().length > 0 &&
        atLeast8Chars &&
        hasNumberOrSymbol &&
        passwordsMatch &&
        username.trim().length > 0;
        

    useEffect(() => {
        setAtLeast8Chars(password.length >= 8);
        setHasNumberOrSymbol(/[\d\W]/.test(password));
        setPasswordsMatch(password.length !== 0 && password === confirmPassword);
        
    }, [password, confirmPassword]);

    useEffect(() => {
        if (state.success) {
            setUsername('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
        }else if (state.success === false) {
            setPassword('');
            setConfirmPassword('');
        }

    }, [state]);

    function handleGoogleSignIn() {
        if (googleLoading) return;
        setGoogleLoading(true);

        // ...existing code...
        console.log('Login com Google');
        // ...existing code...

        setGoogleLoading(false);
    }


    if (state.success) {
        return (
            <Card sx={{ width: 'fit-content', height: 'fit-content', mx: 'auto', paddingBlock: 4, paddingInline: { xs: "1rem", md: "2rem" }, mt: 2 }}>
                <Typography component="h2" mb={1} sx={{ textAlign: 'center', fontWeight: 500, fontSize: { xs: '1.3rem', sm: '1.5rem' } }}>
                    {state.message}
                </Typography>
                <div style={{width: "100%", display: "flex", justifyContent: "center", paddingBlock: "2rem"}}>
                    <DoneIcon color="success" sx={{fontSize: 150}}></DoneIcon>
                </div>
                
                <Box display="flex" justifyContent="center">
                    <Link href="/login" passHref>
                        <Button variant="contained" endIcon={<ArrowForwardIcon />}>
                            Fazer login
                        </Button>
                    </Link>
                </Box>
            </Card>
        );
    }

    return (
        <Card sx={{width: { xs: "90vw", sm: "30vw" }, height: "fit-content", mx: 'auto', p: 3, mt: 2,  }}>
                <Typography variant="h4" component="h1" mb={2} sx={{ textAlign: "center", fontWeight: 500 }}>
                    Crie sua conta
                </Typography>

                {state.success === false && (
                    <Alert severity="error" sx={{ mb: 2, marginInline: { xs: "1rem", md: "2rem" } }}>
                        {state.message}
                    </Alert>
                )}
            <Box sx={{paddingInline: { xs: "2rem", md: "4rem" }}}>
                <Form action={formAction} style={{ display: 'block', flexDirection: 'column' }}>
                    <Stack spacing={1}>
                        <TextField
                            fullWidth
                            name="username"
                            label="Nome de usuário"
                            value={username}
                            onChange={(e) => setUsername(e.target.value.toLowerCase())}
                        />

                        <TextField
                            fullWidth
                            name="email"
                            type="email"
                            label="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <TextField
                            fullWidth
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            label="Senha"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            slotProps={{
                                input: {
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton tabIndex={-1} onClick={() => setShowPassword((prev) => !prev)} edge="end" aria-label="Mostrar/Ocultar senha" size="small">
                                                {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }
                            }}
                        />

                        <TextField
                            fullWidth
                            name="confirmPassword"
                            type={showPassword ? 'text' : 'password'}
                            label="Confirmar senha"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </Stack>

                    <Stack spacing={1} sx={{mt: 2}} >
                        <Condition ok={atLeast8Chars} text="Ao menos 8 caracteres" />
                        <Condition ok={hasNumberOrSymbol} text="Deve conter um número ou símbolo" />
                        <Condition ok={passwordsMatch} text="As senhas devem coincidir" />
                    </Stack>

                        {/*
                    <Stack spacing={1} alignItems="center" pt={1}>
                        <Typography variant="body2">Ou crie uma conta com</Typography>
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
                        endIcon={<ArrowForwardIcon />}
                        sx={{ mt: 1 }}
                        fullWidth
                    >
                        {isPending ? 'Enviando...' : 'Cadastrar'}
                    </Button>
                    
                </Form>

                <Box mt={1} textAlign="center">
                    <Link href="/login">Já possuo uma conta</Link>
                </Box>
            </Box>

            

        </Card>

    );
}