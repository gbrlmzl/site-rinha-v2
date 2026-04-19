import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function useActiveAccount() {
  const searchParams = useSearchParams();
  const token: string = searchParams.get('token') ?? '';
  const apiUrl: string | undefined = process.env.NEXT_PUBLIC_API_URL;

  const [pageState, setPageState] = useState<PageState>('validating');

  const C = {
    bg: '#080d2e',
    surface: '#0E1241',
    surfaceHigh: '#151a54',
    border: 'rgba(255,255,255,0.08)',
    accent: '#11B5E4',
    accentHover: '#0b80a0',
    danger: '#ff6b6b',
    text: '#ffffff',
    textMuted: 'rgba(255,255,255,0.45)',
  };

  type PageState =
    | 'validating'
    | 'activating'
    | 'success'
    | 'invalid'
    | 'expired';

  const validateAndActivate = async (): Promise<void> => {
    if (!token || !apiUrl) {
      setPageState('invalid');
      return;
    }

    try {
      // 1. Valida o token
      const validateResponse = await fetch(
        `${apiUrl}/auth/activate/validate?token=${encodeURIComponent(token)}`,
        {
          method: 'GET',
          cache: 'no-store',
        }
      );

      if (!validateResponse.ok) {
        const body = await validateResponse.json().catch(() => ({}));
        setPageState(body.error?.includes('expirado') ? 'expired' : 'invalid');
        return;
      }

      // 2. Token válido — ativa a conta automaticamente
      setPageState('activating');

      const activateResponse = await fetch(
        `${apiUrl}/auth/activate?token=${encodeURIComponent(token)}`,
        {
          method: 'POST',
          cache: 'no-store',
        }
      );

      setPageState(activateResponse.ok ? 'success' : 'invalid');
    } catch {
      setPageState('invalid');
    }
  };

  return {
    token,
    pageState,
    C,
    validateAndActivate,
  };
}
