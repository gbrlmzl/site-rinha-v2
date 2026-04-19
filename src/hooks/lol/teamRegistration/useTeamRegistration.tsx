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
  RegisterStatus,
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

  const [loading, setLoading] = useState(true);
  const [checkingRegisteredTeam, setCheckingRegisteredTeam] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentData, setPaymentData] = useState<{
    uuid: string;
    qrCode: string;
    qrCodeBase64: string;
    value: number;
    expiresAt: string;
  } | null>(null);
  const [paymentApproved, setPaymentApproved] = useState(false);
  const [paymentExpired, setPaymentExpired] = useState(false);
  const [isRetryRegister, setIsRetryRegister] = useState(false); // Estado para controlar se é uma tentativa de re-registrar após falha ou expiração do pagamento

  const paymentSubscriptionRef = useRef<(() => void) | null>(null); // Ref para guardar função de cleanup do WebSocket
  const teamNameAvailabilityCacheRef = useRef<Record<string, boolean>>({});

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

  const updatePlayer = useCallback(
    (playerIndex: number, updates: Partial<Player>) => {
      setState((prev) => {
        const newPlayers = [...prev.players];
        newPlayers[playerIndex] = { ...newPlayers[playerIndex], ...updates };
        return {
          ...prev,
          players: newPlayers,
        };
      });
      setError(null);
    },
    []
  );

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

  const handleCancelPayment = () => {
    setPaymentExpired(false);
    resetForm();
  };

  const handleRetryPayment = () => {
    setPaymentExpired(false);
    setIsRetryRegister(true);
    setState((prev) => ({
      ...prev,
      currentStep: 'payment',
    }));
  };

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

  // ─── WebSocket: Pagamento ──────────────────────────────────────────────────
  const handlePaymentWebSocketSubscribe = useCallback(async (uuid: string) => {
    try {
      // Guarda a função de cleanup na ref para usar no useEffect
      paymentSubscriptionRef.current = await subscribeToPayment(
        uuid,
        handlePaymentApproved // callback chamado quando APPROVED chegar
      );
    } catch (error) {
      setError(
        'Erro ao conectar para monitorar pagamento. Verifique manualmente.'
      );
    }
  }, []);

  const handlePaymentApproved = useCallback(() => {
    setPaymentApproved(true);
    console.log('Pagamento aprovado! Atualizando status...');
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

  const checkTeamNameAvailability = useCallback(
    async (name: string): Promise<boolean> => {
      const normalizedName = name.trim();

      if (!normalizedName) {
        return false;
      }

      const cachedResult = teamNameAvailabilityCacheRef.current[normalizedName];
      if (cachedResult !== undefined) {
        return cachedResult;
      }

      const tournamentId = 1; //TODO: pegar tournamentId do path /lol/torneios/:tournamentId/inscricao
      const response = await apiFetch(
        `http://localhost:8080/tournaments/${tournamentId}/teams/check-name?name=${encodeURIComponent(normalizedName)}`,
        { method: 'GET' }
      );

      // 204 → disponível, 409 → já existe
      const isAvailable = response.status === 204;
      teamNameAvailabilityCacheRef.current[normalizedName] = isAvailable;

      return isAvailable;
    },
    []
  );

  const checkRegisterStatus = async (tournamentId: number) => {
    const response = await apiFetch(
      `http://localhost:8080/tournaments/${tournamentId}/registrations`,
      { method: 'GET' }
    );
    if (!response.ok) {
      throw new Error('Erro ao verificar status de inscrição');
    }
    const data: RegisterStatus = await response.json();
    return data;
  };

  const checkRegisteredTeam = async () => {
    try {
      setCheckingRegisteredTeam(true);
      const tournamentId = 1; //TODO: pegar tournamentId do path /lol/torneios/:tournamentId/inscricao
      const registrationStatus = await checkRegisterStatus(tournamentId);

      if (registrationStatus.registered) {
        if (registrationStatus.paymentStatus === 'pending') {
          setState((prev) => ({
            ...prev,
            currentStep: 'payment',
          }));
          setPaymentData({
            uuid: registrationStatus.uuid,
            qrCode: registrationStatus.qrCode,
            qrCodeBase64: registrationStatus.qrCodeBase64,
            value: registrationStatus.value,
            expiresAt: registrationStatus.expiresAt,
          });

          await handlePaymentWebSocketSubscribe(registrationStatus.uuid);
        } else if (registrationStatus.paymentStatus === 'approved') {
          setPaymentApproved(true);
          setState((prev) => ({
            ...prev,
            currentStep: 'payment',
          }));
        } else if (registrationStatus.paymentStatus === 'expired') {
          setPaymentExpired(true);
        } else {
          //
        }
      }
    } catch (err) {
      console.error('Erro ao verificar inscrição registrada:', err);
      //Mostrar snackbar de erro e redirecionar para a página do jogo em 3 segundos
      // TODO: Implementar snackbar
    } finally {
      setCheckingRegisteredTeam(false);
    }
  };

  // ─── Submit Registration ────────────────────────────────────────────────

  const submitRegistration = useCallback(async (): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const payload = new FormData();

      //Se o estado isRetryRegister for true, não precisa enviar os dados da equipe e dos jogadores, apenas gerar um novo pagamento para a inscrição existente. O backend deve ser capaz de identificar isso pela ausência dos dados da equipe e jogadores, e associar o novo pagamento à inscrição existente.
      if (!isRetryRegister) {
        // ✅ Blob com Content-Type application/json — Spring consegue deserializar
        const activePlayers = state.players.filter((p) => !p.disabledPlayer);

        payload.append(
          'teamData',
          new Blob(
            [
              JSON.stringify({
                teamName: state.team.teamName,
                players: activePlayers,
              }),
            ],
            { type: 'application/json' }
          )
        );
      }
      

      payload.append(
        'paymentData',
        new Blob([JSON.stringify(state.paymentForm)], {
          type: 'application/json',
        })
      );

      // Arquivo direto — sem Blob, sem JSON
      if (state.team.teamShield) {
        payload.append('teamShield', state.team.teamShield);
      }
      const tournamentId = 1; //TODO: pegar tournamentId do path /lol/torneios/:tournamentId/inscricao
      const response = await apiFetch(
        `http://localhost:8080/tournaments/${tournamentId}/registrations`,
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

      setPaymentData({
        uuid: data.uuid,
        qrCode: data.qrCode,
        qrCodeBase64: data.qrCodeBase64 ?? null,
        value: data.value,
        expiresAt: data.expiresAt,
      });

      await handlePaymentWebSocketSubscribe(data.uuid);
      console.log(
        'Inscrição enviada com sucesso. UUID do pagamento:',
        data.uuid
      );

      return true;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Erro ao processar inscrição'
      );
      return false;
    } finally {
      setLoading(false);
    }
  }, [
    state.team,
    state.players,
    state.paymentForm,
    handlePaymentWebSocketSubscribe,
  ]);

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
    setPaymentData(null);
    setPaymentApproved(false);
    setIsRetryRegister(false);
  }, []);

  // ─────────────────────────────────────────────────────────────────────

  return {
    // State
    state,
    loading,
    checkingRegisteredTeam,
    error,
    paymentData,
    paymentApproved,
    paymentExpired,

    // Team
    updateTeam,
    setTeamShield,
    checkTeamNameAvailability,

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
    handleCancelPayment,
    handleRetryPayment,

    // Navigation
    goToStep,
    nextStep,
    prevStep,

    //RegisteredTeam
    checkRegisteredTeam,

    // Utils
    resetForm,
  };
};
