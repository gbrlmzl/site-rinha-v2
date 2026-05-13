import { useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';

type PageState = 'validating' | 'activating' | 'success' | 'invalid' | 'expired';

export default function useActiveAccount() {
  const searchParams = useSearchParams();
  const token: string = searchParams.get('token') ?? '';
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const [pageState, setPageState] = useState<PageState>('validating');

  const validateAndActivate = useCallback(async (): Promise<void> => {
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
  }, [apiUrl, token]);

  return {
    token,
    pageState,
    validateAndActivate,
  };
}
