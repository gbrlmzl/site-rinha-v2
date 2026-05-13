'use client';

/**
 * Indicador de progresso customizado (Stepper) com tema dark
 * Substitui o Stepper padrão do MUI com visual mais moderno
 */

import type { ReactNode } from 'react';
import {
  Box,
  Step,
  StepLabel,
  Stepper as MuiStepper,
  StepConnector,
  stepConnectorClasses,
  Typography,
  Stack,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { StepConfig } from '@/types/teamRegistration';
import { TEAM_REGISTRATION_TOKENS } from '@/theme';

interface StepIndicatorProps {
  steps: StepConfig[];
  activeStep: number;
  onStepClick?: (stepIndex: number) => void;
  clickableSteps?: boolean;
}

 const THEME_COLORS = TEAM_REGISTRATION_TOKENS.colors;

// ─── Customized StepConnector ─────────────────────────────────────────────

const CustomStepConnector = styled(StepConnector)(() => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 16,
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: THEME_COLORS.border,
    borderRadius: 1,
  },
  [`&.${stepConnectorClasses.active} .${stepConnectorClasses.line}`]: {
    backgroundColor: THEME_COLORS.accent,
  },
  [`&.${stepConnectorClasses.completed} .${stepConnectorClasses.line}`]: {
    backgroundColor: THEME_COLORS.accent,
  },
}));

// ─── Custom Step Icon ─────────────────────────────────────────────────────

const CustomStepIconRoot = styled('div')<{
  ownerState: { completed?: boolean; active?: boolean };
}>(({ ownerState }) => ({
  display: 'flex',
  height: 32,
  alignItems: 'center',
  ...(ownerState.active && {
    color: THEME_COLORS.accent,
  }),
  ...(ownerState.completed && {
    color: THEME_COLORS.accent,
  }),
}));

interface CustomStepIconProps {
  active?: boolean;
  completed?: boolean;
  icon: ReactNode;
}

function CustomStepIcon(props: CustomStepIconProps) {

  const { active, completed, icon } = props;
  
  return (
    <CustomStepIconRoot ownerState={{ active, completed }}>
      {completed ? (
        <CheckCircleIcon sx={{ color: THEME_COLORS.accent, fontSize: 32 }} />
      ) : (
        <Box
          sx={{
            width: {xs: 24, md: 26, lg: 32},
            height: {xs: 24, md: 26, lg: 32},
            borderRadius: '50%',
            backgroundColor: active
              ? THEME_COLORS.accent
              : THEME_COLORS.surfaceHigh,
            border: `2px solid ${active ? THEME_COLORS.accent : THEME_COLORS.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: {xs: 14, md: 14, lg: 16},
            fontWeight: 600,
            padding: {xs: 2, md: 1, lg: 2},
            color: active ? '#000' : THEME_COLORS.textMuted,
            transition: 'all 0.3s',
          }}
        >
          {icon}
        </Box>
      )}
    </CustomStepIconRoot>
  );
}

// ─── StepLabel Customizado ───────────────────────────────────────────────

const CustomStepLabel = styled(StepLabel)({
  '& .MuiStepLabel-label': {
    color: THEME_COLORS.textMuted,
    marginTop: 6,
    fontSize: '0.85rem',
    fontWeight: 500,
    transition: 'color 0.3s',
  },
  '& .MuiStepLabel-label.Mui-active': {
    color: THEME_COLORS.accent,
    fontWeight: 600,
  },
  '& .MuiStepLabel-label.Mui-completed': {
    color: THEME_COLORS.accent,
  },
});

// ─────────────────────────────────────────────────────────────────────────

export function StepIndicator({
  steps,
  activeStep,
  onStepClick,
  clickableSteps = false,
}: StepIndicatorProps) {
  const handleStepClick = (stepIndex: number) => {
    if (clickableSteps && onStepClick && stepIndex <= activeStep) {
      onStepClick(stepIndex);
    }
  };

  return (
    <Box sx={{ width: '100%', mb: 2 }}>
      <MuiStepper
        activeStep={activeStep}
        connector={<CustomStepConnector />}
        alternativeLabel
        sx={{
          backgroundColor: 'transparent',
          padding: 0,
          '& .MuiStep-root': {
            cursor:
              clickableSteps && activeStep >= activeStep
                ? 'pointer'
                : 'default',
          },
        }}
      >
        {steps.map((step, index) => (
          <Step
            key={step.key}
            completed={index < activeStep}
            onClick={() => handleStepClick(index)}
            sx={{
              '&:hover': {
                opacity: clickableSteps && index <= activeStep ? 0.8 : 1,
              },
            }}
          >
            <CustomStepLabel
              icon={index + 1}
              slots={{
                stepIcon: CustomStepIcon,
              }}
            >
              {step.label}
            </CustomStepLabel>
          </Step>
        ))}
      </MuiStepper>
    </Box>
  );
}
