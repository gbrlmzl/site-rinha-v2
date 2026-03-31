'use client';

/**
 * Indicador de progresso customizado (Stepper) com tema dark
 * Substitui o Stepper padrão do MUI com visual mais moderno
 */

import React from 'react';
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
import { THEME_COLORS } from '@/hooks/lol/teamRegistration/constants';

interface StepIndicatorProps {
  steps: StepConfig[];
  activeStep: number;
  onStepClick?: (stepIndex: number) => void;
  clickableSteps?: boolean;
}

// ─── Customized StepConnector ─────────────────────────────────────────────

const CustomStepConnector = styled(StepConnector)(() => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
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
  height: 22,
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
  icon: React.ReactNode;
}

function CustomStepIcon(props: CustomStepIconProps) {
  const { active, completed, icon } = props;

  return (
    <CustomStepIconRoot ownerState={{ active, completed }}>
      {completed ? (
        <CheckCircleIcon sx={{ color: THEME_COLORS.accent, fontSize: 28 }} />
      ) : (
        <Box
          sx={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            backgroundColor: active ? THEME_COLORS.accent : THEME_COLORS.surfaceHigh,
            border: `2px solid ${active ? THEME_COLORS.accent : THEME_COLORS.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 12,
            fontWeight: 600,
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
    marginTop: 8,
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

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  steps,
  activeStep,
  onStepClick,
  clickableSteps = false,
}) => {
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
            cursor: clickableSteps && activeStep >= activeStep ? 'pointer' : 'default',
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
              StepIconComponent={CustomStepIcon}
            >
              {step.label}
            </CustomStepLabel>
          </Step>
        ))}
      </MuiStepper>

      {/* Step Description */}
      {/*<Box
        sx={{
          mt: 3,
          p: 2,
          backgroundColor: THEME_COLORS.surfaceHigh,
          borderRadius: 2,
          border: `1px solid ${THEME_COLORS.border}`,
        }}
      >
        
        
        <Stack spacing={0.5}>
          <Typography
            variant="h6"
            sx={{
              color: THEME_COLORS.text,
              fontWeight: 600,
              fontSize: '1rem',
            }}
          >
            {steps[activeStep].title}
          </Typography>
          {steps[activeStep].description && (
            <Typography
              variant="body2"
              sx={{
                color: THEME_COLORS.textMuted,
                fontSize: '0.9rem',
              }}
            >
              {steps[activeStep].description}
            </Typography>
          )}
        </Stack>
      </Box>*/}
    </Box>
  );
};
