'use client';

/**
 * Orquestrador Principal: TeamRegistrationWizard
 * Gerencia navegação entre passos e renderização condicional
 * Integra todas os passos, validações e lógica de negócio
 */

import {
  useEffect,
  useRef,
  type KeyboardEvent,
  type MouseEvent,
} from 'react';

import {
  Box,
  Button,
  Stack,
  Alert,
  CircularProgress,
  Container,
  Paper,
} from '@mui/material';

import { useTeamRegistration } from '@/hooks/lol/teamRegistration/useTeamRegistration';

import { STEPS } from '@/hooks/lol/teamRegistration/teamRegistrationConstants';

// Componentes de Passos
import { StepIndicator } from './shared/StepIndicator';
import { TeamInfoStep } from './steps/TeamInfoStep';
import { PlayersStep } from './steps/PlayersStep';
import { ConfirmationStep } from './steps/ConfirmationStep';
import { PaymentStep } from './steps/PaymentStep';
import ExpiredPayment from './ExpiredPayment';
import TeamRegistrationLoadingScreen from './TeamRegistrationLoadingScreen';
import InfoScreen from '@/components/lol/teamRegistration/UI/InfoScreen';
import { TEAM_REGISTRATION_TOKENS } from '@/theme';
import { useSnackbarContext } from '@/contexts/SnackbarContext';
// ─────────────────────────────────────────────────────────────────────────
type TeamRegistrationWizardProps = {
  slug: string;
};

export function TeamRegistrationWizard({ slug }: TeamRegistrationWizardProps) {
  const {
    registrationData,
    step,
    loading,
    uiState,
    checkingRegisteredTeam,
    paymentData,
    paymentApproved,
    cancelingRegistration,
    termsAccepted,
    setTermsAccepted,
    wsError,
    currentPlayerIndex,
    setCurrentPlayerIndex,
    isCheckingTeamName,
    stepIndex,
    validationErrors,

    handleNextStep,
    handlePrevStep,

    updateTeam,
    handleShieldFileSelected,
    updatePlayer,
    updatePaymentForm,
    getPaymentValue,
    checkRegisteredTeam,
    handleCancelPayment,
    handleRetryPayment,
    handleReturnToTournamentPage,
  } = useTeamRegistration();

  const wizardCardRef = useRef<HTMLDivElement | null>(null);
  const THEME_COLORS = TEAM_REGISTRATION_TOKENS.colors;

  useEffect(() => {
    // Verificar se o usuário já tem uma inscrição ativa
    checkRegisteredTeam(slug);
  }, []);

  // ─── Step Handlers ────────────────────────────────────────────────────

  // ─── Renderização Condicional ─────────────────────────────────────────

  const renderStepContent = () => {
    const stepContentMap = {
      teamInfo: (
        <TeamInfoStep
          data={registrationData.team}
          shieldPreview={registrationData.shieldPreview}
          onTeamChange={updateTeam}
          onShieldFileSelected={handleShieldFileSelected}
          loading={loading}
          error={validationErrors[0] || null}
        />
      ),
      playersInfo: (
        <PlayersStep
          data={registrationData.players}
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
          team={registrationData.team}
          players={registrationData.players}
          shieldPreview={registrationData.shieldPreview}
          termsAccepted={termsAccepted}
          onTermsChange={setTermsAccepted}
          error={validationErrors[0] || null}
        />
      ),
      payment: (
        <PaymentStep
          data={registrationData.paymentForm}
          onDataChange={updatePaymentForm}
          paymentValue={getPaymentValue()}
          paymentData={paymentData}
          paymentApproved={paymentApproved}
          loading={loading}
          error={validationErrors[0] || wsError || null}
        />
      ),
    } as const;

    return stepContentMap[step] ?? null;
  };

  const isLastStep = stepIndex === STEPS.length - 1;
  const isPaymentScreen = paymentData !== null;
  const isPaymentStep = step === 'payment';
  const isConfirmationBlocked = step === 'confirmation' && !termsAccepted;


  /**
   *  Gerenciador de Tecla Enter para Navegação no Wizard
   * @param event 
   * @returns @void
   * 
   * Só reage ao Enter: retorna imediatamente se a tecla não for Enter.
   * Ignora Enter com modificadores (Shift/Ctrl/Alt/Meta).
   * Descarta o evento quando o foco está em um textarea ou elemento editável (contentEditable).
   * Descarta se o alvo está dentro de um botão ou link (evita interferir em controles clicáveis).
   * Cancela a ação se qualquer condição de bloqueio estiver ativa: loading, isCheckingTeamName, isConfirmationBlocked ou paymentApproved.
   * Se todas as checagens passarem, chama event.preventDefault() e dispara handleNextStep() (avança o wizard).
   */
  const handleWizardKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Enter') return;
    if (event.shiftKey || event.ctrlKey || event.altKey || event.metaKey)
      return;

    const target = event.target as HTMLElement;
    //verificação para evitar interferência em campos de texto multilinha ou elementos editáveis
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


  /**
   * 
   * @param event 
   * @returns @void
   * Ao clicar numa área “vazia” do cartão, a função foca o cartão para habilitar navegação por teclado;
   * Ao clicar em elementos interativos, ela evita roubar o foco desses elementos.
   */
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
    step === 'playersInfo' &&
    currentPlayerIndex < registrationData.players.length - 1
      ? 'Próximo'
      : isLastStep && !isPaymentScreen
        ? 'Gerar QR code PIX'
        : 'Próximo';

  //======================================================================

  //Se estiver verificando se o usuário já tem inscrição ativa, mostra tela de loading
  if (checkingRegisteredTeam) {
    return <TeamRegistrationLoadingScreen />;
  }

  if (uiState.status === 'payment_expired') {
    return (
      <ExpiredPayment
        loading={cancelingRegistration}
        onCancel={handleCancelPayment}
        onRetryPayment={handleRetryPayment}
      />
    );
  }

  if (
    uiState.status !== 'can_register' &&
    uiState.status !== 'pending_payment'
  ) {
    return <InfoScreen event={uiState} slug={slug} />;
  }

  return (
    <Box
      onKeyDown={handleWizardKeyDown}
      sx={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: THEME_COLORS.bg,
        py: { xs: '10vh', md: '13vh' },
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

            {/* Step Content */}
            <Box sx={{ mb: 3, minHeight: 400 }}>
              {loading && stepIndex < 3 ? (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: 400,
                  }}
                >
                  <CircularProgress size={100} />
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
                      width: { xs: '33%', md: '20%' },
                      '&:hover': {
                        backgroundColor: 'rgba(17, 181, 228, 0.1)',
                        borderColor: THEME_COLORS.accent,
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
                      ? { xs: '75%', md: '33%' }
                      : { xs: '33%', md: '25%' },
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
                    
                    loading  && 'Processando...'
                    
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
                  alignItems: 'center',
                }}
              >
                <Button
                  variant="contained"
                  onClick={() => handleReturnToTournamentPage(slug)}
                  sx={{
                    width: { xs: '100%', md: '50%' },
                    backgroundColor: THEME_COLORS.accent,
                    '&:hover': {
                      backgroundColor: THEME_COLORS.accentHover,
                    },
                  }}
                >
                  Voltar à página do torneio
                </Button>
              </Stack>
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
