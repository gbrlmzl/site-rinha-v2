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
  RegisterStatusResponse,
  GeneratedPaymentData,
  CanceledTeamData,
  CancelTournamentRegistrationResponse,
  ExceptionResponse,
  RegistrationUIState
} from '@/types/teamRegistration';
import {ApiResponseSuccess, ApiResponseError} from '@/types/api';
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
import { useRouter } from 'next/navigation';
import { useSnackbarContext } from '@/contexts/SnackbarContext';

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

  const { showSnackbar } = useSnackbarContext();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [checkingRegisteredTeam, setCheckingRegisteredTeam] = useState(true);
  const [cancelingRegistration, setCancelingRegistration] = useState(false);
  const [uiState, setUiState] = useState<RegistrationUIState>({status: 'loading'});
  const [error, setError] = useState<string | null>(null);
  const [paymentData, setPaymentData] = useState<GeneratedPaymentData | null>(null);
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
      const data : ExceptionResponse = await response.json();
      throw new Error(data.error || 'Erro ao verificar status de inscrição');
    }
    const data: RegisterStatusResponse = await response.json();
    return data;
  };


  const checkRegisteredTeam = async () => {
  try {
    setCheckingRegisteredTeam(true);
    const tournamentId = 1; // TODO: pegar do path

    let registrationStatus: RegisterStatusResponse;

    try {
      registrationStatus = await checkRegisterStatus(tournamentId);
    } catch (err : any) {
      // Trata exceções HTTP separadamente das lógicas de negócio
      if (err) {
        if (err.status === 404) {
          setUiState({status: 'error', message: "Torneio não encontrado"});      
          return;
        }
        if (err.status === 409) {
          // TournamentFullException — torneio encerrado ou não aberto
          setUiState({status: 'tournament_closed', message: "As inscrições para este torneio estão encerradas."});
          
          return;
        }
        if (err.status === 401) {
          showSnackbar({
            message: 'Faça login para continuar com a inscrição.',
            severity: 'info',
          });
          router.push('/login');
          return;
        }
      }
      setUiState({status: 'error', message: "Erro ao verificar status da inscrição. Tente novamente."});
      return;
    }

    const { registrationData, paymentData } = registrationStatus;

    // ── Torneio lotado (sem inscrição prévia) ──────────────────────────────
    if (!registrationData.registered && registrationData.maxTeamsReached) {
      setUiState({status: 'tournament_full', message: "O torneio está lotado."});
      return;
    }

    // ── Sem inscrição — pode registrar ─────────────────────────────────────
    if (!registrationData.registered) {
      setUiState({status: 'can_register'});
      return;
    }

    // ── Tem inscrição — analisa o status ───────────────────────────────────
    switch (registrationData.teamStatus) {

      case 'PENDING_PAYMENT':
        if (paymentData) {
          setPaymentData(paymentData);
          setUiState({status: 'pending_payment'});
          goToStep('payment');
          await handlePaymentWebSocketSubscribe(paymentData.uuid);
        } else {
          // Inconsistência: PENDING sem paymentData → trata como erro
          setUiState({status: 'error', message: "Houve um erro ao processar a sua inscrição, tente novamente mais tarde."});
          
        }
        break;

      case 'READY':
        setUiState({status: 'payment_approved'});
        setPaymentApproved(true);
        goToStep('payment');
        break;

      case 'EXPIRED_PAYMENT':
      case 'EXPIRED_PAYMENT_PROBLEM':
        if (registrationData.maxTeamsReached) {
          // Expirou mas torneio lotou → não pode fazer retry
          setUiState({status: 'tournament_full'});
        } else {
          setUiState({status: 'payment_expired'});
          goToStep('payment'); // volta para a etapa de pagamento com opção de retry
        }
        break;

      case 'CANCELED':
        // Cancelou antes → pode inscrever de novo
        setUiState({status: 'can_register'});
        break;

      default:
        setUiState({status: 'error', message: "Status de inscrição inválido."});
        showSnackbar({
          message: 'Status de inscrição inválido.',
          severity: 'error',
        });
    }

  } catch {
    setUiState({status: 'error', message: "Erro inesperado ao verificar inscrição."});
  } finally {
    setCheckingRegisteredTeam(false);
  }
};

  // ─── Cancel Registration ────────────────────────────────────────────────
  const cancelTournamentRegistration = async (): Promise<CancelTournamentRegistrationResponse> =>  {

    try {
      setCancelingRegistration(true);
      const tournamentId = 1; //TODO: pegar tournamentId do path /lol/torneios/:tournamentId/inscricao
      const response = await apiFetch(
        `http://localhost:8080/tournaments/${tournamentId}/registrations`,
        { method: 'PUT',
          body: JSON.stringify({ 'cancelRegistration' :  true })
         }
        
      );
      if (!response.ok) {
        throw new Error('Erro ao cancelar inscrição');
      }
      const data : CanceledTeamData = await response.json();

      return {
        success: true,
        message: "Equipe cancelada com sucesso",
        data: data,
      };
    } catch (err) {
      console.error('Erro ao cancelar inscrição', err);
      setUiState({status: 'error', message: "Erro ao cancelar inscrição."});
      return {
        success: false,
        message: "Erro ao cancelar inscrição",
      };

    }finally{
      setCancelingRegistration(false);

    }
  }

  const handleCancelPayment = async () => {
    const response = await cancelTournamentRegistration();

    if (response.success) {
      setPaymentExpired(false);
      setUiState({status: 'canceled', message: "Inscrição cancelada com sucesso."});
      resetForm();
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

        // Arquivo direto — sem Blob, sem JSON
        if (state.team.teamShield) {
          payload.append('teamShield', state.team.teamShield);
        }
      }
      

      payload.append(
        'paymentData',
        new Blob([JSON.stringify(state.paymentForm)], {
          type: 'application/json',
        })
      );

      
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

      const data : GeneratedPaymentData = await response.json();

      if (!data.uuid || !data.qrCode) {
        throw new Error('Resposta inválida do servidor');
      }

      setPaymentData({
        uuid: data.uuid,
        qrCode: data.qrCode,
        qrCodeBase64: data.qrCodeBase64,
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
    cancelingRegistration,
    uiState,

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
