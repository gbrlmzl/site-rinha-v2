'use server';

import { registerSchema } from '@/schemas/users';
import { RegisterState } from '@/types/auth/authTypes';

type RegisterPayload = {
  username: string;
  email: string;
  password: string;
};

export default async function registerAction(
  _prevState: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  const data = Object.fromEntries(formData.entries());

  const parsed = registerSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? 'Dados inválidos',
    };
  }

  const payload: RegisterPayload = {
    username: parsed.data.username,
    email: parsed.data.email,
    password: parsed.data.password,
  };

  try {
    const response = await fetch(`${process.env.API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorBody = await response.json();
      const message = errorBody?.error ?? 'Erro ao cadastrar usuário';

      return {
        success: false,
        message,
      };
    }

    return {
      success: true,
      message: 'Usuário cadastrado com sucesso!',
      secondaryMessage: 'Verifique seu email para ativar a conta.',
    };
  } catch (error) {
    return {
      success: false,
      message: 'Não foi possível conectar à API de cadastro.',
    };
  }
}
