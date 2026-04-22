import { ShowChart } from '@mui/icons-material';
import { useSearchParams } from 'next/navigation';
import { use, useState } from 'react';
import { useSnackbarContext } from '@/contexts/SnackbarContext';

type PageState = 'validating' | 'invalid' | 'form' | 'success' | 'error';

export default function useNewPassword() {
  const [pageState, setPageState] = useState<PageState>('validating');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const { showSnackbar } = useSnackbarContext();
  // Lógica para nova senha
  const searchParams = useSearchParams();
  const token: string = searchParams.get('token') ?? '';

  

  const checkToken = async (): Promise<void> => {
    try {
      const response = await fetch(
        `http://localhost:8080/auth/password-reset/${token}`,
        {
          method: 'GET',
          cache: 'no-store',
        }
      );
      if (response.ok) {
        setPageState('form');
      } else {
        setPageState('invalid');
      }
      return;
    } catch (error) {
      setPageState('invalid');
    }
  };

  const submitNewPassword = async (newPassword: string): Promise<void> => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8080/auth/password-reset/${token}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ newPassword }),
        }
      );

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        showSnackbar({message: body.message || 'Erro ao conectar com o servidor', severity: 'error'});
        setPageState('invalid');
        return;
      }

      setPageState('success');
    } catch {
      showSnackbar({message: 'Erro ao conectar com o servidor', severity: 'error'});
      setPageState('invalid');
      return;
    } finally {
      setLoading(false);
    }
  };

  return {
    // Retorne o que for necessário para o componente de nova senha
    token,
    checkToken,
    loading,
    pageState,
    submitNewPassword,
  };
}
