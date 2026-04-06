'use server';

import { z } from 'zod';
import { registerSchema } from "@/schemas/users";


export type RegisterState = {
  success: boolean | null;
  message: string;
  secondaryMessage?: string;
};


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
    const response = await fetch(`${process.env.API_URL}/auth/register`, { //URL da API de cadastro, posteriomente colocar isso em uma variável de ambiente
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      cache: 'no-store',
    });
    console.log('Resposta da API de cadastro:', response);

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
      secondaryMessage: 'Verifique seu email para ativar a conta.'
    };
  } catch (error) {
    return {
      success: false,
      message: 'Não foi possível conectar à API de cadastro.',
    };
  }
}