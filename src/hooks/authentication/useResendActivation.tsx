import { useState } from 'react';

export default function useResendActivation() {
    
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);

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
    };

    const submitResendForm = async (username : string) => {
        if (!username.trim()) {
            setError('Informe seu username');
            return;
        }

        setLoading(true);
        setError(null);

        try {

                //Não precisa de await, pois não vamos usar a resposta para nada específico — só queremos garantir que a requisição foi feita
                fetch('http://localhost:8080/auth/activate/resend', {
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



    }

    return {
        C,
        inputSx,
        loading,
        submitted,
        error,
        submitResendForm,

    }
}