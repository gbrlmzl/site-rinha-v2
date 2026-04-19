type LoginState = {
  success: boolean | null;
  message: string;
};

export default async function loginAction(
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
