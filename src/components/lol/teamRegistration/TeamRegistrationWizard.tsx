'use client';

/**
 * Orquestrador Principal: TeamRegistrationWizard
 * Gerencia navegação entre passos e renderização condicional
 * Integra todas os passos, validações e lógica de negócio
 */

import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
} from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Stack,
  Alert,
  CircularProgress,
  useMediaQuery,
  useTheme,
  Container,
  Paper,
} from '@mui/material';
import { useTeamRegistration } from '@/hooks/lol/teamRegistration/useTeamRegistration';
import {
  validatePlayer,
  validateAllPLayers,
  validatePaymentForm,
  validateTeam,
} from '@/schemas/validationSchemas';
import { STEPS, THEME_COLORS } from '@/hooks/lol/teamRegistration/constants';

// Componentes de Passos
import { StepIndicator } from './shared/StepIndicator';
import { TeamInfoStep } from './steps/TeamInfoStep';
import { PlayersStep } from './steps/PlayersStep';
import { ConfirmationStep } from './steps/ConfirmationStep';
import { PaymentStep } from './steps/PaymentStep';
import ExpiredPayment from './ExpiredPayment';
import TeamRegistrationLoadingScreen from './TeamRegistrationLoadingScreen';
import InfoScreen from '@/components/lol/teamRegistration/UI/InfoScreen';

// ─────────────────────────────────────────────────────────────────────────

export function TeamRegistrationWizard() {
  const {
    state,
    loading,
    uiState,
    checkingRegisteredTeam,
    error,
    paymentData,
    paymentApproved,
    paymentExpired,
    cancelingRegistration,
    updateTeam,
    handleShieldFileSelected,
    updatePlayer,
    updatePaymentForm,
    getPaymentValue,
    submitRegistration,
    nextStep,
    prevStep,
    resetForm,
    checkTeamNameAvailability,
    checkRegisteredTeam,
    handleCancelPayment,
    handleRetryPayment,
  } = useTeamRegistration();

  const [validationErrors, setValidationErrors] = useState<{
    [key: number]: string;
  }>({});

  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
  const [wsError, setWsError] = useState<string | null>(null);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState<number>(0);
  const [isCheckingTeamName, setIsCheckingTeamName] = useState<boolean>(false);
  const wizardCardRef = useRef<HTMLDivElement | null>(null);

  const theme = useTheme();
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const stepIndex: number = STEPS.findIndex((s) => s.key === state.currentStep);

  useEffect(() => {
    // Verificar se o usuário já tem uma inscrição ativa
    checkRegisteredTeam();
  }, []);
  // ─── Step Handlers ────────────────────────────────────────────────────

  const handleNextStep = async () => {
    if (loading || isCheckingTeamName) return;

    switch (state.currentStep) {
      case 'teamInfo': {
        // Validar equipe
        const validation = validateTeam(state.team);
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
            state.team.teamName
          );
          if (!nameCheckResult) {
            setValidationErrors({
              0: 'Já existe uma equipe com esse nome. Por favor, escolha outro.',
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
        const isLastPlayer = currentPlayerIndex === state.players.length - 1;
        const lastPlayerIndex = state.players.length - 1;

        if (!isLastPlayer) {
          const currentValidation = validatePlayer(
            state.players[currentPlayerIndex],
            currentPlayerIndex
          );

          if (!currentValidation.success) {
            const firstIssue = Array.isArray(currentValidation.errors)
              ? currentValidation.errors[0]
              : null;
            setValidationErrors({
              [currentPlayerIndex]: firstIssue?.message || 'Dados inválidos',
            });
            return;
          }

          setCurrentPlayerIndex((prev) => prev + 1);
          return;
        }

        // isLastPlayer === true, validar o conjunto completo antes de avançar
        // No último jogador, valida o conjunto completo antes de avançar
        const validation = validateAllPLayers(state.players);
        if (!validation.success) {
          console.log('Erro de validação dos jogadores:', validation.message);
          if (validation.playerIndex !== undefined) {
            const firstIssue = Array.isArray(validation.errors)
              ? validation.errors[0]
              : null;
            setValidationErrors({
              [validation.playerIndex]:
                firstIssue?.message || 'Dados inválidos',
            });
          } else {
            setValidationErrors({
              [lastPlayerIndex]: validation.message || 'Erro na validação',
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
          setValidationErrors({
            0: 'Você deve concordar com os termos',
          });
          return;
        }

        nextStep();
        break;
      }

      case 'payment': {
        setValidationErrors({});
        // Validar pagamento
        const validation = validatePaymentForm(state.paymentForm);
        if (!validation.success) {
          const firstIssue = Array.isArray(validation.errors)
            ? validation.errors[0]
            : null;
          setValidationErrors({
            0: firstIssue?.message || 'Dados de pagamento inválidos',
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

    if (state.currentStep === 'playersInfo' && currentPlayerIndex > 0) {
      setCurrentPlayerIndex((prev) => prev - 1);
      return;
    }

    prevStep();
  };

  // ─── Renderização Condicional ─────────────────────────────────────────

  const renderStepContent = () => {
    const stepContentMap = {
      teamInfo: (
        <TeamInfoStep
          data={state.team}
          shieldPreview={state.shieldPreview}
          onTeamChange={updateTeam}
          onShieldFileSelected={handleShieldFileSelected}
          loading={loading}
          error={validationErrors[0] || null}
        />
      ),
      playersInfo: (
        <PlayersStep
          data={state.players}
          onPlayerChange={updatePlayer}
          error={validationErrors}
          disabled={loading}
          currentPlayerIndex={currentPlayerIndex}
          onCurrentPlayerIndexChange={setCurrentPlayerIndex}
          onPositionKeyboardConfirm={() => {
            wizardCardRef.current?.focus();
          }}
        />
      ),
      confirmation: (
        <ConfirmationStep
          team={state.team}
          players={state.players}
          shieldPreview={state.shieldPreview}
          termsAccepted={termsAccepted}
          onTermsChange={setTermsAccepted}
          error={validationErrors[0] || null}
        />
      ),
      payment: (
        <PaymentStep
          data={state.paymentForm}
          onDataChange={updatePaymentForm}
          paymentValue={getPaymentValue()}
          paymentData={paymentData}
          paymentApproved={paymentApproved}
          loading={loading}
          error={validationErrors[0] || wsError || null}
        />
      ),
    } as const;

    return stepContentMap[state.currentStep] ?? null;
  };

  const isLastStep = stepIndex === STEPS.length - 1;
  const isPaymentScreen = paymentData !== null;
  const isPaymentStep = state.currentStep === 'payment';
  const isConfirmationBlocked =
    state.currentStep === 'confirmation' && !termsAccepted;

  const handleWizardKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Enter') return;
    if (event.shiftKey || event.ctrlKey || event.altKey || event.metaKey)
      return;

    const target = event.target as HTMLElement;
    if (target.tagName === 'TEXTAREA' || target.isContentEditable) return;
    if (target.closest('button, [role="button"], a[href]')) return;
    if (
      loading ||
      isCheckingTeamName ||
      isConfirmationBlocked ||
      paymentApproved
    )
      return;

    event.preventDefault();
    void handleNextStep();
  };

  const handleWizardCardClick = (event: MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (
      target.closest(
        'input, textarea, button, [role="button"], a[href], [contenteditable="true"]'
      )
    ) {
      return;
    }

    event.currentTarget.focus();
  };

  const nextButtonLabel =
    state.currentStep === 'playersInfo' &&
    currentPlayerIndex < state.players.length - 1
      ? 'Próximo'
      : isLastStep && !isPaymentScreen
        ? 'Gerar QR code PIX'
        : 'Próximo';

  //======================================================================

  if (checkingRegisteredTeam) {
    return <TeamRegistrationLoadingScreen />;
  }

  if (uiState.status === 'tournament_closed') {
    return (
      <InfoScreen
        event={'tournament_closed'}
        title="Inscrições encerradas"
        message={
          uiState.message || 'As inscrições para este torneio foram encerradas.'
        }
        action={{ label: 'Voltar', onClick: () => router.back() }}
      />
    );
  }

  if (uiState.status === 'tournament_full') {
    return (
      <InfoScreen
        event={'tournament_full'}
        title="Vagas esgotadas"
        message={
          uiState.message ||
          'Todas as vagas deste torneio já foram preenchidas.'
        }
        action={{ label: 'Voltar', onClick: () => router.back() }}
      />
    );
  }

  if (uiState.status === 'error') {
    return (
      <InfoScreen
        event={'error'}
        title="Algo deu errado"
        message={uiState.message || 'Tente novamente mais tarde.'}
        action={{ label: 'Início', onClick: () => router.push('/lol') }}
      />
    );
  }

  if (paymentExpired) {
    return (
      <ExpiredPayment
        loading={cancelingRegistration}
        onCancel={handleCancelPayment}
        onRetryPayment={handleRetryPayment}
      />
    );
  }

  return (
    <Box
      onKeyDown={handleWizardKeyDown}
      sx={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: THEME_COLORS.bg,
        py: { xs: 3, md: 4 },
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={0}
          tabIndex={0}
          ref={wizardCardRef}
          onClick={handleWizardCardClick}
          sx={{
            backgroundColor: THEME_COLORS.surface,
            borderRadius: 3,
            border: `1px solid ${THEME_COLORS.border}`,
            p: { xs: 0, md: 1 },
            overflow: 'hidden',
            '&:focus-visible': {
              outline: `1px solid transparent`,
            },
          }}
        >
          <Box sx={{ p: { xs: 2, md: 4 } }}>
            {/* Step Indicator */}
            <StepIndicator steps={STEPS} activeStep={stepIndex} />

            {/* Global Error Alert */}
            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            {/* Step Content */}
            <Box sx={{ mb: 4, minHeight: 400 }}>
              {loading && stepIndex < 3 ? (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: 400,
                  }}
                >
                  <CircularProgress />
                  {/*Criar skeleton para o formulario de inscricao */}
                </Box>
              ) : (
                renderStepContent()
              )}
            </Box>

            {/* Navigation Buttons */}
            {!paymentApproved && !isPaymentScreen && (
              <Stack
                direction={'row'}
                spacing={2}
                sx={{
                  justifyContent: isPaymentStep ? 'center' : 'space-between',
                  alignItems: 'center',
                }}
              >
                {!isPaymentStep && (
                  <Button
                    variant="contained"
                    onClick={handlePrevStep}
                    disabled={
                      stepIndex === 0 ||
                      loading ||
                      isCheckingTeamName ||
                      isPaymentScreen
                    }
                    sx={{
                      backgroundColor: THEME_COLORS.accent,
                      color: THEME_COLORS.text,
                      width: isMobile ? '33%' : '20%',
                      '&:hover': {
                        backgroundColor: 'rgba(17, 181, 228, 0.1)',
                        borderColor: THEME_COLORS.accent,
                      },
                      '&:disabled': {
                        opacity: 0.5,
                      },
                    }}
                  >
                    Voltar
                  </Button>
                )}

                <Button
                  variant="contained"
                  onClick={handleNextStep}
                  disabled={
                    loading || isCheckingTeamName || isConfirmationBlocked
                  }
                  sx={{
                    backgroundColor: isPaymentStep
                      ? '#16a34a'
                      : THEME_COLORS.accent,
                    color: '#ffffff',
                    width: isPaymentStep
                      ? isMobile
                        ? '75%'
                        : '33%'
                      : isMobile
                        ? '33%'
                        : '25%',
                    '&:hover': {
                      backgroundColor: isPaymentStep
                        ? '#15803d'
                        : THEME_COLORS.accentHover,
                    },
                    '&:disabled': {
                      opacity: 0.5,
                    },
                  }}
                >
                  {loading || isCheckingTeamName ? (
                    <>
                      <CircularProgress size={18} sx={{ mr: 1 }} />
                      {loading && 'Processando...'}
                    </>
                  ) : (
                    `${nextButtonLabel}`
                  )}
                </Button>
              </Stack>
            )}

            {/* Success Screen */}
            {paymentApproved && (
              <Stack
                spacing={2}
                sx={{
                  textAlign: 'center',
                }}
              >
                <Button
                  variant="contained"
                  href="/"
                  sx={{
                    width: isMobile ? '100%' : '50%',
                    alignSelf: 'center',
                    backgroundColor: THEME_COLORS.accent,
                    '&:hover': {
                      backgroundColor: THEME_COLORS.accentHover,
                    },
                  }}
                >
                  Voltar para Início
                </Button>
              </Stack>
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
