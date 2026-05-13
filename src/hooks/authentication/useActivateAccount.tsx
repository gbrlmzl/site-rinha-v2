import { useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';

type PageState = 'validating' | 'activating' | 'success' | 'invalid' | 'expired';

export default function useActiveAccount() {
  const searchParams = useSearchParams();
  const token: string = searchParams.get('token') ?? '';

  const [pageState, setPageState] = useState<PageState>('validating');

  const validateAndActivate = useCallback(async (): Promise<void> => {
    if (!token) {
      setPageState('invalid');
      return;
    }

    try {
      const validateResponse = await fetch(
        `/api/auth/activate/validate?token=${encodeURIComponent(token)}`,
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

      setPageState('activating');

      const activateResponse = await fetch(
        `/api/auth/activate?token=${encodeURIComponent(token)}`,
        {
          method: 'POST',
          cache: 'no-store',
        }
      );

      setPageState(activateResponse.ok ? 'success' : 'invalid');
    } catch {
      setPageState('invalid');
    }
  }, [token]);

  return {
    token,
    pageState,
    validateAndActivate,
  };
}
