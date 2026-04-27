import { useState } from 'react';

export default function useResendActivation() {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const submitResendForm = async (username: string) => {
    if (!username.trim()) {
      setError('Informe seu username');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await fetch('http://localhost:8080/auth/activate/resend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });

      // Sempre vai para "enviado" — não revela se o username existe
      setSubmitted(true);
    } catch {
      setError('Erro ao processar solicitação. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return {
    username,
    setUsername,
    loading,
    submitted,
    error,
    submitResendForm,
  };
}
