import { useState } from 'react';
import { useActionState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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

async function loginAction(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const data = Object.fromEntries(formData.entries());
  const payload = {
    username: data.username,
    password: data.password,
    keepLoggedIn: data.keepLoggedIn ? true : false,
  };

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        credentials: 'include', // importante para enviar cookies
      }
    );

    if (!response.ok) {
      const errorBody = await response.json();
      return {
        success: false,
        message: errorBody.error || 'Erro ao fazer login',
      };
    }

    return {
      success: true,
      message: 'Login realizado com sucesso',
    };
  } catch (error) {
    return {
      success: false,
      message: 'Erro ao conectar à API.',
    };
  }
}

export default function useLogin() {
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
  const searchParams = useSearchParams();
  const next = searchParams.get('next');

  const nextSafe =
    next && next.startsWith('/') && !next.startsWith('//') ? next : '/inicio';

  const dadosPreenchidos: boolean =
    formEntries.username.trim().length > 0 &&
    formEntries.password.trim().length > 0;


    return {
        state,
        formAction,
        isPending,
        formEntries,
        setFormEntries,
        showPassword,
        setShowPassword,
        keepLoggedIn,
        setKeepLoggedIn,
        isLoading,
        refreshUser,        router,
        nextSafe,
        dadosPreenchidos
    }
}
