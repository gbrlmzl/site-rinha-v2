import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

type PageState = 'validating' | 'invalid' | 'form' | 'success';


export default function useNewPassword() {
    const [pageState, setPageState] = useState<PageState>('validating');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    // Lógica para nova senha
    const searchParams = useSearchParams();
    const token = searchParams.get('token') ?? '';

    


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

    const inputSx = {
        '& .MuiOutlinedInput-root': {
            backgroundColor: C.surfaceHigh,
            borderRadius: 2,
            color: C.text,
            '& fieldset': { borderColor: C.border },
            '&:hover fieldset': { borderColor: C.accent },
            '&.Mui-focused fieldset': { borderColor: C.accent },
        },
        '& .MuiInputLabel-root': { color: C.textMuted },
        '& .MuiInputLabel-root.Mui-focused': { color: C.accent },
        '& .MuiFormHelperText-root': { color: C.danger },
    };

    const STRENGTH_LABELS = ['', 'Fraca', 'Razoável', 'Boa', 'Forte'];
    const STRENGTH_COLORS = ['', C.danger, '#f0a500', C.accent, '#4caf50'];

    const checkToken = async (): Promise<void> => {
        try {
            const response = await fetch(`http://localhost:8080/auth/password-reset/validate?token=${token}`, {
                method: 'GET',
                cache: 'no-store',
            });
            if (response.ok) {
                setPageState('form');
            } else {
                setPageState('invalid');
            }
            return;
        }catch (error) {
            setPageState('invalid');
        }
    };
    
    const submitNewPassword = async (newPassword: string): Promise<void> => {
        setLoading(true);

        try {
            const response = await fetch('http://localhost:8080/auth/password-reset/confirm', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, newPassword }),
            });

            if (!response.ok) {
                const body = await response.json().catch(() => ({}));
                setErrors({ submit: body.error ?? 'Erro ao redefinir senha' });
                
            }

            setPageState('success');

        } catch {
            setErrors({ submit: 'Erro ao conectar com o servidor' });
        } finally {
            setLoading(false);
        }
    }


            


    
    return {
        // Retorne o que for necessário para o componente de nova senha
        C,
        inputSx,
        STRENGTH_LABELS,
        STRENGTH_COLORS,
        token,
        checkToken,
        loading,
        pageState,
        errors,
        submitNewPassword

    };
}