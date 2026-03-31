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
  INITIAL_TEAM,
  INITIAL_PLAYERS,
  INITIAL_PAYMENT_FORM,
  STEP_LIST,
  API_ENDPOINTS,
  PAYMENT_STATUS,
} from './constants';

// Hook auxiliar para WebSocket (extraído para reutilização)
function usePaymentWebSocket() {
  const unsubscribeRef = useRef<(() => void) | null>(null);

  const subscribe = useCallback(
    (uuidPagamento: string, onPaymentApproved: () => void) => {
      // Simular WebSocket listener com SockJS/STOMP
      // Import real ocorre no service, aqui apenas estrutura
      return () => {
        // cleanup
      };
    },
    []
  );

  const unsubscribe = useCallback(() => {
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }
  }, []);

  return { subscribe, unsubscribe };
}

// ─────────────────────────────────────────────────────────────────────────

export const useTeamRegistration = () => {
  // ─── State ───────────────────────────────────────────────────────────────

  const [state, setState] = useState<TeamRegistrationState>({
    team: INITIAL_TEAM,
    players: INITIAL_PLAYERS,
    paymentForm: INITIAL_PAYMENT_FORM,
    currentStep: 'teamInfo',
    shieldFile: null,
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

  const { subscribe: subscribePayment, unsubscribe: unsubscribePayment } =
    usePaymentWebSocket();
  const paymentSubscriptionRef = useRef<(() => void) | null>(null);

  // ─── Handlers: Team ────────────────────────────────────────────────────

  const updateTeam = useCallback((updates: Partial<Team>) => {
    setState((prev) => ({
      ...prev,
      team: { ...prev.team, ...updates },
    }));
    setError(null);
  }, []);

  const setTeamShield = useCallback((url: string) => {
    setState((prev) => ({
      ...prev,
      team: { ...prev.team, escudo: url },
    }));
  }, []);

  // ─── Handlers: Shield File ─────────────────────────────────────────────

  const handleShieldFileSelected = useCallback((file: File | null) => {
    setState((prev) => ({
      ...prev,
      shieldFile: file,
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

  // ─── Async: Upload Shield ──────────────────────────────────────────────

  const uploadShield = useCallback(async (): Promise<string | null> => {
    if (!state.shieldFile) {
      setError('Nenhum arquivo de escudo selecionado');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', state.shieldFile);
      formData.append('title', state.team.nomeEquipe || 'Escudo');

      const response = await fetch(API_ENDPOINTS.UPLOAD_SHIELD, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Erro ao fazer upload do escudo');
      }

      const data = await response.json();

      if (data.link) {
        setTeamShield(data.link);
        return data.link;
      } else {
        throw new Error(data.error || 'Erro desconhecido no upload');
      }
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : 'Erro ao fazer upload do escudo';
      setError(errorMsg);
      return null;
    } finally {
      setLoading(false);
    }
  }, [state.shieldFile, state.team.nomeEquipe]);

  // ─── Async: Submit Registration & Process Payment ──────────────────────
  
  /*const submitRegistration = useCallback(async (): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const activePlayers = state.players.filter((p) => !p.disabledPlayer);

      const payload = {
        teamData: {
          ...state.team,
          players: activePlayers,
        },
        paymentData: state.paymentForm,
      };

      const response = await fetch(API_ENDPOINTS.SUBMIT_REGISTRATION, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Erro ao enviar inscrição');
      }

      const data = await response.json();

      if (data.uuid && data.qrCodeBase64 && data.qrCode) {
        setQrCodeData({
          uuid: data.uuid,
          qrCode: data.qrCode,
          qrCodeBase64: `data:image/png;base64,${data.qrCodeBase64}`,
          valor: data.valor,
        });

        // Inscrever no WebSocket para pagamento
        handlePaymentWebSocketSubscribe(data.uuid);

        return true;
      } else {
        throw new Error('Resposta inválida do servidor');
      }
    } catch (err) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : 'Erro ao processar inscrição';
      setError(errorMsg);
      return false;
    } finally {
      setLoading(false);
    }
  }, [state.team, state.players, state.paymentForm]);*/
  const submitRegistration = () => {
    console.log(state.team, state.players, state.paymentForm);

  }

  // ─── WebSocket: Pagamento ──────────────────────────────────────────────

  const handlePaymentWebSocketSubscribe = useCallback((uuid: string) => {
    // Implementação real no service (aqui é estrutura)
    // O listener vai chamar handlePaymentApproved quando receber PAGAMENTO REALIZADO
  }, []);

  const handlePaymentApproved = useCallback(() => {
    setPaymentApproved(true);
  }, []);

  // ─── Cleanup ────────────────────────────────────────────────────────────

  useEffect(() => {
    return () => {
      if (paymentSubscriptionRef.current) {
        paymentSubscriptionRef.current();
      }
      unsubscribePayment();
    };
  }, []);

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
      shieldFile: null,
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
    uploadShield,

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