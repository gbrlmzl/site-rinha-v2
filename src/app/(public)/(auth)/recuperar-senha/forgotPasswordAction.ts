'use server';
import { PasswordRecoveryState } from '@/types/auth/authTypes';

export default async function passwordRecoveryAction(
  _prevState: PasswordRecoveryState,
  formData: FormData
): Promise<PasswordRecoveryState> {
  const data = Object.fromEntries(formData.entries());

  const payload = {
    username: String(data.username ?? ''),
  };

  try {
    console.log(
      'Enviando solicitação de recuperação de senha para:',
      payload.username
    );
    // não precisa de await
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/password-reset/request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    return {
      submitted: true,
      message: 'Instruções de recuperação enviadas para seu email.',
    };
  } catch {
    // Mesmo em caso de erro, não revela nada — evita enumeração de usuários
    return {
      submitted: true,
      message: 'Instruções de recuperação enviadas para seu email.',
    };
  }
}
