/**
 * Hook principal para gerenciar estado e lógica do cadastro de equipes
 * Responsabilidades:
 * - Gerenciar estado (equipe, jogadores, formulário pagamento, passo atual)
 * - Handlers para atualizar cada entidade
 * - Integração com upload de imagem (Imgur)
 * - Integração com pagamento (API + WebSocket)
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import {
    Team,
    Player,
    PaymentForm,
    TeamRegistrationState,
    StepType,
    PaymentStatusMessage,
} from '@/types/teamRegistration';
import {
    subscribeToPayment,
    disconnectWebSocket,
} from '@/services/paymentWebSocketService';

import { apiFetch } from '@/services/interceptor';

import {
    INITIAL_TEAM,
    INITIAL_PLAYERS,
    INITIAL_PAYMENT_FORM,
    STEP_LIST,
    API_ENDPOINTS,
    PAYMENT_STATUS,
} from './constants';

// ────────────────────────────────────────────────────────────────────────

export const useTeamRegistration = () => {
    // ─── State ───────────────────────────────────────────────────────────────

    const [state, setState] = useState<TeamRegistrationState>({
        team: INITIAL_TEAM,
        players: INITIAL_PLAYERS,
        paymentForm: INITIAL_PAYMENT_FORM,
        currentStep: 'teamInfo',
        shieldPreview: null,
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [qrCodeData, setQrCodeData] = useState<{
        uuid: string;
        qrCode: string;
        qrCodeBase64: string;
        valor: number;
    } | null>(null);
    const [paymentApproved, setPaymentApproved] = useState(false);

    const paymentSubscriptionRef = useRef<(() => void) | null>(null); // Ref para guardar função de cleanup do WebSocket

    // ─── Handlers: Team ────────────────────────────────────────────────────

    const updateTeam = useCallback((updates: Partial<Team>) => {
        setState((prev) => ({
            ...prev,
            team: { ...prev.team, ...updates },
        }));
        setError(null);
    }, []);

    const setTeamShield = useCallback((file: File | null) => {
        setState((prev) => ({
            ...prev,
            team: { ...prev.team, teamShield: file },
        }));
    }, []);

    // ─── Handlers: Shield File ─────────────────────────────────────────────

    const handleShieldFileSelected = useCallback((file: File | null) => {
        setState((prev) => ({
            ...prev,
            team: { ...prev.team, teamShield: file },
        }));

        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setState((prev) => ({
                    ...prev,
                    shieldPreview: e.target?.result as string,
                }));
            };
            reader.readAsDataURL(file);

        } else {
            setState((prev) => ({
                ...prev,
                shieldPreview: null,
            }));
        }
        setError(null);
    }, []);

    // ─── Handlers: Players ─────────────────────────────────────────────────

    const updatePlayer = useCallback((playerIndex: number, updates: Partial<Player>) => {
        setState((prev) => {
            const newPlayers = [...prev.players];
            newPlayers[playerIndex] = { ...newPlayers[playerIndex], ...updates };
            return {
                ...prev,
                players: newPlayers,
            };
        });
        setError(null);
    }, []);

    const updateAllPlayers = useCallback((players: Player[]) => {
        setState((prev) => ({
            ...prev,
            players,
        }));
    }, []);

    // ─── Handlers: Payment Form ────────────────────────────────────────────

    const updatePaymentForm = useCallback((updates: Partial<PaymentForm>) => {
        setState((prev) => ({
            ...prev,
            paymentForm: { ...prev.paymentForm, ...updates },
        }));
        setError(null);
    }, []);

    // ─── Handlers: Step Navigation ──────────────────────────────────────────

    const goToStep = useCallback((step: StepType) => {
        setState((prev) => ({
            ...prev,
            currentStep: step,
        }));
        setError(null);
    }, []);

    const nextStep = useCallback(() => {
        setState((prev) => {
            const currentIdx = STEP_LIST.indexOf(prev.currentStep);
            if (currentIdx < STEP_LIST.length - 1) {
                return {
                    ...prev,
                    currentStep: STEP_LIST[currentIdx + 1],
                };
            }
            return prev;
        });
        setError(null);
    }, []);

    const prevStep = useCallback(() => {
        setState((prev) => {
            const currentIdx = STEP_LIST.indexOf(prev.currentStep);
            if (currentIdx > 0) {
                return {
                    ...prev,
                    currentStep: STEP_LIST[currentIdx - 1],
                };
            }
            return prev;
        });
        setError(null);
    }, []);



    // ─── WebSocket: Pagamento ──────────────────────────────────────────────

    // ─── WebSocket: Pagamento ──────────────────────────────────────────────────
    const handlePaymentWebSocketSubscribe = useCallback(async (uuid: string) => {
        try {
            // Guarda a função de cleanup na ref para usar no useEffect
            paymentSubscriptionRef.current = await subscribeToPayment(
                uuid,
                handlePaymentApproved  // callback chamado quando APPROVED chegar
            );
        } catch (error) {
            console.error('[WebSocket] Erro ao inscrever no pagamento:', error);
            setError('Erro ao conectar para monitorar pagamento. Verifique manualmente.');
        }
    }, []);

    const handlePaymentApproved = useCallback(() => {
        setPaymentApproved(true);
        unsubscribePayment(); // cancela a inscrição — não precisa mais ouvir
    }, []);

    // Função auxiliar para cancelar inscrição e limpar a ref
    const unsubscribePayment = useCallback(() => {
        if (paymentSubscriptionRef.current) {
            paymentSubscriptionRef.current();
            paymentSubscriptionRef.current = null;
        }
    }, []);

    // ─── Cleanup — cancela WebSocket ao desmontar o componente ────────────────
    useEffect(() => {
        return () => {
            unsubscribePayment();
            disconnectWebSocket();
        };
    }, []);

        // ─── Async: Upload Shield ──────────────────────────────────────────────

   const submitRegistration = useCallback(async (): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
        const activePlayers = state.players.filter((p) => !p.disabledPlayer);

        const payload = new FormData();

        // ✅ Blob com Content-Type application/json — Spring consegue deserializar
        payload.append(
            'teamData',
            new Blob(
                [JSON.stringify({
                    teamName: state.team.teamName,
                    players: activePlayers,
                })],
                { type: 'application/json' }
            )
        );

        payload.append(
            'paymentData',
            new Blob(
                [JSON.stringify(state.paymentForm)],
                { type: 'application/json' }
            )
        );

        // Arquivo direto — sem Blob, sem JSON
        if (state.team.teamShield) {
            payload.append('teamShield', state.team.teamShield);
        }

        const response = await apiFetch(
            `http://localhost:8080/tournaments/1/registrations`,
            {
                method: 'POST',
                body: payload,
                // SEM Content-Type — browser define multipart/form-data + boundary automaticamente
            }
        );

        if (!response.ok) {
            const errorBody = await response.json().catch(() => ({}));
            throw new Error(errorBody.error ?? 'Erro ao enviar inscrição');
        }

        const data = await response.json();

        if (!data.uuid || !data.qrCode) {
            throw new Error('Resposta inválida do servidor');
        }

        setQrCodeData({
            uuid:         data.uuid,
            qrCode:       data.qrCode,
            qrCodeBase64: data.qrCodeBase64 ?? null,
            valor:        data.value,
        });

        await handlePaymentWebSocketSubscribe(data.uuid);
        return true;

    } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao processar inscrição');
        return false;
    } finally {
        setLoading(false);
    }
}, [state.team, state.players, state.paymentForm, handlePaymentWebSocketSubscribe]);

    // ─── Getters ────────────────────────────────────────────────────────────

    const getActivePlayers = useCallback((): Player[] => {
        return state.players.filter((p) => !p.disabledPlayer);
    }, [state.players]);

    const getPaymentValue = useCallback((): number => {
        const active = getActivePlayers();
        return active.length * 10; // R$10 por jogador
    }, [getActivePlayers]);

    // ─── Reset ──────────────────────────────────────────────────────────────

    const resetForm = useCallback(() => {
        setState({
            team: INITIAL_TEAM,
            players: INITIAL_PLAYERS,
            paymentForm: INITIAL_PAYMENT_FORM,
            currentStep: 'teamInfo',
            shieldPreview: null,
        });
        setLoading(false);
        setError(null);
        setQrCodeData(null);
        setPaymentApproved(false);
    }, []);

    // ─────────────────────────────────────────────────────────────────────

    return {
        // State
        state,
        loading,
        error,
        qrCodeData,
        paymentApproved,

        // Team
        updateTeam,
        setTeamShield,

        // Shield
        handleShieldFileSelected,
        //uploadShield,

        // Players
        updatePlayer,
        updateAllPlayers,
        getActivePlayers,

        // Payment
        updatePaymentForm,
        getPaymentValue,
        submitRegistration,
        handlePaymentApproved,

        // Navigation
        goToStep,
        nextStep,
        prevStep,

        // Utils
        resetForm,
    };
};