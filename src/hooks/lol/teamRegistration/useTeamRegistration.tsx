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

import {
  validatePlayer,
  validateAllPLayers,
  validatePaymentForm,
  validateTeam,
} from '@/schemas/teamRegistrationSchemas';

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
  STEPS,
} from './teamRegistrationConstants';
import { useRouter } from 'next/navigation';
import { useSnackbarContext } from '@/contexts/SnackbarContext';

type CacheEntry = { available: boolean; cachedAt: number };

// ────────────────────────────────────────────────────────────────────────

export const useTeamRegistration = () => {
  // ─── States ───────────────────────────────────────────────────────────────
  const [step, setStep] = useState<StepType>('teamInfo');
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<{
    [key: number]: string;
  }>({});
  const [wsError, setWsError] = useState<string | null>(null);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState<number>(0);
  const [isCheckingTeamName, setIsCheckingTeamName] = useState<boolean>(false);
  const stepIndex: number = STEPS.findIndex((s) => s.key === step);

  const [tournamentId, setTournamentId] = useState<number>(0);
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
  const teamNameAvailabilityCacheRef = useRef<Record<string, CacheEntry>>({});

  const { showSnackbar } = useSnackbarContext();
  const router = useRouter();

  const CACHE_TTL_MS = 15_000;

  useEffect(() => {
    return () => {
      unsubscribePayment();
      disconnectWebSocket();
    };
  }, []);

  //Step handlers
  const handleNextStep = async () => {
    if (loading || isCheckingTeamName) return;

    switch (step) {
      case 'teamInfo': {
        // Validar equipe
        const validation = validateTeam(registrationData.team);
        if (!validation.success) {
          const firstIssue = Array.isArray(validation.errors)
            ? validation.errors[0]
            : null;
          const errorMsg = firstIssue?.message || 'Erro na validação';
          setValidationErrors({
            0: errorMsg,
          });
          return;
        }

        //Verificar se já existe uma equipe com o mesmo nome
        setIsCheckingTeamName(true);
        try {
          const nameCheckResult = await checkTeamNameAvailability(
            registrationData.team.teamName,
            tournamentId
          );
          if (!nameCheckResult) {
            showSnackbar({
              message: `Já existe uma equipe com esse nome.\nPor favor, escolha outro.`,
              severity: 'error',
            });
            return;
          }

          setValidationErrors({});
          nextStep();
        } finally {
          setIsCheckingTeamName(false);
        }
        break;
      }

      case 'playersInfo': {
        setValidationErrors({});
        const isLastPlayer =
          currentPlayerIndex === registrationData.players.length - 1;

        if (!isLastPlayer) {
          const currentValidation = validatePlayer(
            registrationData.players[currentPlayerIndex],
            currentPlayerIndex
          );

          if (!currentValidation.success) {
            const firstIssue = Array.isArray(currentValidation.errors)
              ? currentValidation.errors[0]
              : null;
            showSnackbar({
              message: `${firstIssue?.message || 'Dados inválidos'}`,
              severity: 'error',
            });
            return;
          }

          setCurrentPlayerIndex((prev) => prev + 1);
          return;
        }

        // isLastPlayer === true, validar o conjunto completo antes de avançar
        // No último jogador, valida o conjunto completo antes de avançar
        const validation = validateAllPLayers(registrationData.players);
        if (!validation.success) {
          if (validation.playerIndex !== undefined) {
            const firstIssue = Array.isArray(validation.errors)
              ? validation.errors[0]
              : null;
            showSnackbar({
              message: `${firstIssue?.message || 'Dados inválidos'}`,
              severity: 'error',
            });
          } else {
            showSnackbar({
              message: `${validation.message || 'Erro na validação'}`,
              severity: 'error',
            });
          }
          return;
        }

        setCurrentPlayerIndex(0);
        nextStep();
        break;
      }

      case 'confirmation': {
        setValidationErrors({});
        if (!termsAccepted) {
          showSnackbar({
            message: 'Você deve concordar com os termos',
            severity: 'error',
          });
          return;
        }

        nextStep();
        break;
      }

      case 'payment': {
        setValidationErrors({});
        // Validar pagamento
        const validation = validatePaymentForm(registrationData.paymentForm);
        if (!validation.success) {
          const firstIssue = Array.isArray(validation.errors)
            ? validation.errors[0]
            : null;
          showSnackbar({
            message: `${firstIssue?.message || 'Dados de pagamento inválidos'}`,
            severity: 'error',
          });
          return;
        }

        // Enviar inscrição e gerar QR Code
        const success = await submitRegistration();
        if (!success) {
          return;
        }

        break;
      }

      default:
        break;
    }
  };

  const handlePrevStep = () => {
    setValidationErrors({});

    if (step === 'playersInfo' && currentPlayerIndex > 0) {
      setCurrentPlayerIndex((prev) => prev - 1);
      return;
    }

    prevStep();
  };

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

  const handleReturnToTournamentPage = (slug: string) => {
    router.push(`/lol/torneios/${slug}`);
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
    async (name: string, tournamentId: number): Promise<boolean> => {
      if (!tournamentId) return false;
      const normalizedName = name.trim();
      if (!normalizedName) return false;

      const cachedResult = teamNameAvailabilityCacheRef.current[normalizedName];
      if (cachedResult && Date.now() - cachedResult.cachedAt < CACHE_TTL_MS) {
        //libera para tentar novamente com nomes já verificados após expiração do cache
        return cachedResult.available; // retorna cache sem fazer requisição
      }

      const response = await apiFetch(
        `http://localhost:8080/tournaments/${tournamentId}/teams/name-availability?name=${encodeURIComponent(normalizedName)}`,
        { method: 'GET' }
      );

      const isAvailable = response.status === 200;
      teamNameAvailabilityCacheRef.current[normalizedName] = {
        available: isAvailable,
        cachedAt: Date.now(),
      };
      return isAvailable;
    },
    []
  );

  const checkRegisterStatus = async (tournamentSlug: string) => {
    const response = await apiFetch(
      `http://localhost:8080/tournaments/${tournamentSlug}/registrations`,
      { method: 'GET' }
    );
    if (!response.ok) {
      const data: ExceptionResponse = await response.json();
      throw new Error(data.error || 'Erro ao verificar status de inscrição');
    }
    const data: RegisterStatusResponse = await response.json();
    return data;
  };

  const checkRegisteredTeam = async (slug: string) => {
    try {
      setCheckingRegisteredTeam(true);

      let registrationStatus: RegisterStatusResponse;

      try {
        registrationStatus = await checkRegisterStatus(slug);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      setTournamentId(registrationData.tournamentId);

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
          }
          break;

        case 'READY':
          setUiState({ status: 'payment_approved' });
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
    termsAccepted,
    setTermsAccepted,
    wsError,
    setWsError,
    currentPlayerIndex,
    setCurrentPlayerIndex,
    isCheckingTeamName,
    setIsCheckingTeamName,
    stepIndex,
    validationErrors,
    setValidationErrors,

    //Step Handlers
    handlePrevStep,
    handleNextStep,

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
    handleReturnToTournamentPage,

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
