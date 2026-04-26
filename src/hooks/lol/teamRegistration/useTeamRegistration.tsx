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
  RegistrationUIState,
  RegistrationData,
} from '@/types/teamRegistration';

import { ApiResponseSuccess, ApiResponseError } from '@/types/api';

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
  // ─── States ───────────────────────────────────────────────────────────────

  const [registrationData, setRegistrationData] =
    useState<TeamRegistrationState>({
      team: INITIAL_TEAM,
      players: INITIAL_PLAYERS,
      paymentForm: INITIAL_PAYMENT_FORM,
      shieldPreview: null,
    });
  const [uiState, setUiState] = useState<RegistrationUIState>({
    status: 'loading',
  });

  const [step, setStep] = useState<StepType>('teamInfo');
  const [loading, setLoading] = useState(false);
  const [checkingRegisteredTeam, setCheckingRegisteredTeam] = useState(true);
  const [cancelingRegistration, setCancelingRegistration] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentData, setPaymentData] = useState<GeneratedPaymentData | null>(
    null
  );
  const [paymentApproved, setPaymentApproved] = useState(false);
  const [retryRegisterData, setRetryRegisterData] =
    useState<RegistrationData | null>(null); // Estado para armazenar os dados da inscrição existente ao tentar re-registrar após expiração ou falha de pagamento

  const paymentSubscriptionRef = useRef<(() => void) | null>(null); // Ref para guardar função de cleanup do WebSocket
  const teamNameAvailabilityCacheRef = useRef<Record<string, boolean>>({});

  const { showSnackbar } = useSnackbarContext();
  const router = useRouter();

  useEffect(() => {
    return () => {
      unsubscribePayment();
      disconnectWebSocket();
    };
  }, []);

  // ─── Handlers: Team ────────────────────────────────────────────────────

  const updateTeam = useCallback((updates: Partial<Team>) => {
    setRegistrationData((prev) => ({
      ...prev,
      team: { ...prev.team, ...updates },
    }));
    setError(null);
  }, []);

  const setTeamShield = useCallback((file: File | null) => {
    setRegistrationData((prev) => ({
      ...prev,
      team: { ...prev.team, teamShield: file },
    }));
  }, []);

  // ─── Handlers: Shield File ─────────────────────────────────────────────

  const handleShieldFileSelected = useCallback((file: File | null) => {
    setRegistrationData((prev) => ({
      ...prev,
      team: { ...prev.team, teamShield: file },
    }));

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setRegistrationData((prev) => ({
          ...prev,
          shieldPreview: e.target?.result as string,
        }));
      };
      reader.readAsDataURL(file);
    } else {
      setRegistrationData((prev) => ({
        ...prev,
        shieldPreview: null,
      }));
    }
    setError(null);
  }, []);

  // ─── Handlers: Players ─────────────────────────────────────────────────

  const updatePlayer = useCallback(
    (playerIndex: number, updates: Partial<Player>) => {
      setRegistrationData((prev) => {
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
    setRegistrationData((prev) => ({
      ...prev,
      players,
    }));
  }, []);

  // ─── Handlers: Payment Form ────────────────────────────────────────────

  const updatePaymentForm = useCallback((updates: Partial<PaymentForm>) => {
    setRegistrationData((prev) => ({
      ...prev,
      paymentForm: { ...prev.paymentForm, ...updates },
    }));
    setError(null);
  }, []);

  const handleRetryPayment = () => {
    setUiState({ status: 'can_register' });
    setStep('payment');
  };

  // ─── Handlers: Step Navigation ──────────────────────────────────────────

  const goToStep = useCallback((step: StepType) => {
    setStep(step);
    setError(null);
  }, []);

  const nextStep = useCallback(() => {
    setStep((prev) => {
      const currentIdx = STEP_LIST.indexOf(prev);
      if (currentIdx < STEP_LIST.length - 1) {
        return STEP_LIST[currentIdx + 1];
      }
      return prev;
    });
    setError(null);
  }, []);

  const prevStep = useCallback(() => {
    setStep((prev) => {
      const currentIdx = STEP_LIST.indexOf(prev);
      if (currentIdx > 0) {
        return STEP_LIST[currentIdx - 1];
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

      const tournamentId = 3; //TODO: pegar tournamentId do path /lol/torneios/:tournamentId/inscricao
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
      const data: ExceptionResponse = await response.json();
      throw new Error(data.error || 'Erro ao verificar status de inscrição');
    }
    const data: RegisterStatusResponse = await response.json();
    return data;
  };

  const checkRegisteredTeam = async () => {
    try {
      setCheckingRegisteredTeam(true);
      const tournamentId = 3; // TODO: pegar do path

      let registrationStatus: RegisterStatusResponse;

      try {
        registrationStatus = await checkRegisterStatus(tournamentId);
      } catch (err: any) {
        // Trata exceções HTTP separadamente das lógicas de negócio
        if (err) {
          if (err.status === 404) {
            setUiState({ status: 'error', message: 'Torneio não encontrado' });
            return;
          }
          if (err.status === 409) {
            // TournamentFullException — torneio encerrado ou não aberto
            setUiState({
              status: 'tournament_closed',
              message: 'As inscrições para este torneio estão encerradas.',
            });

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
        setUiState({
          status: 'error',
          message: 'Erro ao verificar status da inscrição. Tente novamente.',
        });
        return;
      }

      const { registrationData, paymentData } = registrationStatus;

      // ── Torneio lotado (sem inscrição prévia) ──────────────────────────────
      if (
        !registrationData.registered &&
        (registrationData.maxTeamsReached ||
          registrationData.tournamentStatus === 'FULL')
      ) {
        setUiState({
          status: 'tournament_full',
          message: 'Não há mais vagas disponíveis para este torneio.',
        });
        return;
      }

      // ── Sem inscrição — pode registrar ─────────────────────────────────────
      if (!registrationData.registered) {
        setUiState({ status: 'can_register' });
        return;
      }

      // ── Tem inscrição — analisa o status ───────────────────────────────────
      switch (registrationData.teamStatus) {
        case 'PENDING_PAYMENT':
          if (paymentData) {
            setPaymentData(paymentData);
            console.log(
              'Inscrição pendente de pagamento. Dados de pagamento recebidos:',
              paymentData
            );
            setUiState({ status: 'pending_payment' });
            goToStep('payment');
            await handlePaymentWebSocketSubscribe(paymentData.uuid);
            return;
          } else {
            // Inconsistência: PENDING sem paymentData → trata como erro
            setUiState({
              status: 'error',
              message:
                'Houve um erro ao processar a sua inscrição, tente novamente mais tarde.',
            });
            console.error(
              'Inscrição pendente de pagamento sem dados de pagamento disponíveis.'
            );
          }
          break;

        case 'READY':
          setUiState({ status: 'payment_approved' });
          //setPaymentApproved(true);
          //goToStep('payment');
          break;

        case 'EXPIRED_PAYMENT':
          setUiState({ status: 'payment_expired' });
          setRetryRegisterData(registrationData); // Guarda os dados da inscrição existente para usar no retry
          break;
        case 'EXPIRED_PAYMENT_PROBLEM':
          if (registrationData.maxTeamsReached) {
            // Expirou mas torneio lotou → não pode fazer retry
            setUiState({ status: 'tournament_full' });
          } else {
            setUiState({ status: 'payment_expired' });
            goToStep('payment'); // volta para a etapa de pagamento com opção de retry
          }
          break;

        case 'CANCELED':
          // Cancelou antes → pode inscrever de novo
          setUiState({ status: 'can_register' });
          break;

        default:
          setUiState({
            status: 'error',
            message: 'Status de inscrição inválido.',
          });
          showSnackbar({
            message: 'Status de inscrição inválido.',
            severity: 'error',
          });
      }
    } catch {
      setUiState({
        status: 'error',
        message: 'Erro inesperado ao verificar inscrição.',
      });
    } finally {
      setCheckingRegisteredTeam(false);
    }
  };

  // ─── Cancel Registration ────────────────────────────────────────────────
  const cancelTournamentRegistration =
    async (): Promise<CancelTournamentRegistrationResponse> => {
      try {
        setCancelingRegistration(true);
        const tournamentId = 3; //TODO: pegar tournamentId do path /lol/torneios/:tournamentId/inscricao
        const response = await apiFetch(
          `http://localhost:8080/tournaments/${tournamentId}/registrations`,
          { method: 'PUT', body: JSON.stringify({ cancelRegistration: true }) }
        );
        if (!response.ok) {
          throw new Error('Erro ao cancelar inscrição');
        }
        const data: CanceledTeamData = await response.json();

        return {
          success: true,
          message: 'Equipe cancelada com sucesso',
          data: data,
        };
      } catch (err) {
        setUiState({ status: 'error', message: 'Erro ao cancelar inscrição.' });
        return {
          success: false,
          message: 'Erro ao cancelar inscrição',
        };
      } finally {
        setCancelingRegistration(false);
      }
    };

  const handleCancelPayment = async () => {
    const response = await cancelTournamentRegistration();

    if (response.success) {
      setUiState({
        status: 'canceled',
        message: 'Inscrição cancelada com sucesso.',
      });
      resetForm();
    }
  };
  // ─── Submit Registration ────────────────────────────────────────────────

  const submitRegistration = useCallback(async (): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const payload = new FormData();

      /**
       *Se não houver retryRegisterData, é um registro novo → envia dados completos (team + players + payment).
       *Se houver retryRegisterData, é uma tentativa de re-registrar após expiração ou falha de pagamento → envia apenas payment, pois team + players já existem e não podem ser alterados nessa situação.
       **/
      if (!retryRegisterData) {
        const activePlayers = registrationData.players.filter(
          (p) => !p.disabledPlayer
        );

        payload.append(
          'teamData',
          new Blob(
            [
              JSON.stringify({
                teamName: registrationData.team.teamName,
                players: activePlayers,
              }),
            ],
            { type: 'application/json' }
          )
        );

        // Arquivo direto — sem Blob, sem JSON
        if (registrationData.team.teamShield) {
          payload.append('teamShield', registrationData.team.teamShield);
        }
      }

      payload.append(
        'paymentData',
        new Blob([JSON.stringify(registrationData.paymentForm)], {
          type: 'application/json',
        })
      );

      const tournamentId = 3; //TODO: pegar tournamentId do path /lol/torneios/:tournamentId/inscricao
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

      const data: GeneratedPaymentData = await response.json();

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

      return true;
    } catch (err) {
      showSnackbar({
        message:
          err instanceof Error ? err.message : 'Erro ao processar inscrição',
        severity: 'error',
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [
    registrationData.team,
    registrationData.players,
    registrationData.paymentForm,
    handlePaymentWebSocketSubscribe,
  ]);

  // ─── Getters ────────────────────────────────────────────────────────────

  const getActivePlayers = useCallback((): Player[] => {
    return registrationData.players.filter((p) => !p.disabledPlayer);
  }, [registrationData.players]);

  const getPaymentValue = () => {
    if (retryRegisterData && retryRegisterData.teamPlayersAmount) {
      return retryRegisterData.teamPlayersAmount * 10; // R$10 por jogador, valor fixo para re-registrar após expiração ou falha de pagamento
    }
    const active = getActivePlayers();
    return active.length * 10; // R$10 por jogador
  };

  // ─── Reset ──────────────────────────────────────────────────────────────

  const resetForm = useCallback(() => {
    setRegistrationData({
      team: INITIAL_TEAM,
      players: INITIAL_PLAYERS,
      paymentForm: INITIAL_PAYMENT_FORM,
      shieldPreview: null,
    });
    setStep('teamInfo');
    setLoading(false);
    setError(null);
    setPaymentData(null);
    setPaymentApproved(false);
    setRetryRegisterData(null);
  }, []);

  // ─────────────────────────────────────────────────────────────────────

  return {
    // State
    registrationData,
    step,
    loading,
    checkingRegisteredTeam,
    error,
    paymentData,
    paymentApproved,
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
