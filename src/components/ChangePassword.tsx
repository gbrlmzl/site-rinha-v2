import {
  Box,
  Button,
  Divider,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import Condition from '@/components/shared/Condition';
import { THEME_COLORS, inputSx } from '@/constants/styles/theme';
import { PasswordVisibility } from '@/hooks/useProfile';

type ChangePasswordProps = {
  goToProfile: () => void;
  passwordForm: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  };
  updatePasswordField: (
    field: keyof ChangePasswordProps['passwordForm']
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  visibility: {
    showCurrent: boolean;
    showNew: boolean;
    showConfirm: boolean;
  };
  toggleVisibility: (field: keyof PasswordVisibility) => () => void;
  passwordRequirements: {
    atLeast8Characters: boolean;
    hasNumberOrSymbol: boolean;
    passwordsMatch: boolean;
  };
  passwordFieldsValidated: boolean;
  handlePasswordSubmit: () => void;
  passwordSuccess: boolean;
};

export default function ChangePassword({
  goToProfile,
  passwordForm,
  updatePasswordField,
  visibility,
  toggleVisibility,
  passwordRequirements,
  passwordFieldsValidated,
  handlePasswordSubmit,
  passwordSuccess,
}: ChangePasswordProps) {
  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 1.5 }}>
        <IconButton
          onClick={goToProfile}
          sx={{
            color: THEME_COLORS.textMuted,
            '&:hover': {
              color: THEME_COLORS.text,
              bgcolor: THEME_COLORS.surfaceHigh,
            },
          }}
        >
          <ArrowBackRoundedIcon />
        </IconButton>
        <Box>
          <Typography
            sx={{
              fontSize: '0.75rem',
              color: THEME_COLORS.textMuted,
              letterSpacing: 2,
              textTransform: 'uppercase',
            }}
          >
            Segurança
          </Typography>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: '1.4rem',
              color: THEME_COLORS.text,
            }}
          >
            Alterar senha
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ borderColor: THEME_COLORS.border, mb: 3 }} />

      {/* Campos de senha */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Senha atual */}
        <TextField
          fullWidth
          label="Senha atual"
          type={visibility.showCurrent ? 'text' : 'password'}
          value={passwordForm.currentPassword}
          onChange={updatePasswordField('currentPassword')}
          sx={inputSx}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    tabIndex={-1}
                    onClick={toggleVisibility('showCurrent')}
                    sx={{ color: THEME_COLORS.textMuted }}
                  >
                    {visibility.showCurrent ? (
                      <VisibilityOffRoundedIcon fontSize="small" />
                    ) : (
                      <VisibilityRoundedIcon fontSize="small" />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />

        {/* Nova senha + barra de força */}
        <Box>
          <TextField
            fullWidth
            label="Nova senha"
            type={visibility.showNew ? 'text' : 'password'}
            value={passwordForm.newPassword}
            onChange={updatePasswordField('newPassword')}
            sx={inputSx}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      tabIndex={-1}
                      onClick={toggleVisibility('showNew')}
                      sx={{ color: THEME_COLORS.textMuted }}
                    >
                      {visibility.showNew ? (
                        <VisibilityOffRoundedIcon fontSize="small" />
                      ) : (
                        <VisibilityRoundedIcon fontSize="small" />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          {passwordForm.newPassword.length > 0 && (
            <Box>
              <Stack spacing={1} sx={{ mt: 1 }}>
                <Condition
                  ok={passwordRequirements.atLeast8Characters}
                  text="Ao menos 8 caracteres"
                  textColor="white"
                  uncheckedColor="white"
                />
                <Condition
                  ok={passwordRequirements.hasNumberOrSymbol}
                  text="Deve conter um número ou símbolo"
                  textColor="white"
                  uncheckedColor="white"
                />
                <Condition
                  ok={passwordRequirements.passwordsMatch}
                  text="As senhas devem coincidir"
                  textColor="white"
                  uncheckedColor="white"
                />
              </Stack>
            </Box>
          )}
        </Box>

        {/* Confirmar nova senha */}
        <TextField
          fullWidth
          label="Confirmar nova senha"
          type={visibility.showConfirm ? 'text' : 'password'}
          value={passwordForm.confirmPassword}
          onChange={updatePasswordField('confirmPassword')}
          sx={inputSx}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    tabIndex={-1}
                    onClick={toggleVisibility('showConfirm')}
                    sx={{ color: THEME_COLORS.textMuted }}
                  >
                    {visibility.showConfirm ? (
                      <VisibilityOffRoundedIcon fontSize="small" />
                    ) : (
                      <VisibilityRoundedIcon fontSize="small" />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>

      {/* Botão confirmar */}
      <Button
        fullWidth
        variant="contained"
        onClick={handlePasswordSubmit}
        disabled={!passwordFieldsValidated}
        sx={{
          mt: 4,
          py: 1.5,
          borderRadius: 3,
          fontWeight: 700,
          fontSize: '0.95rem',
          letterSpacing: 1,
          backgroundColor: passwordSuccess
            ? '#4caf50'
            : THEME_COLORS.accent,
          '&:hover': {
            backgroundColor: passwordSuccess
              ? '#4caf50'
              : THEME_COLORS.accentHover,
          },
          '&.Mui-disabled': {
            backgroundColor: 'rgba(9, 65, 80, 0.35)',
            color: 'rgba(255, 255, 255, 0.46)',
            border: '1px solid rgba(9, 98, 122, 0.45)',
          },
          transition: 'background-color 0.3s',
        }}
        startIcon={
          passwordSuccess ? <CheckCircleRoundedIcon /> : <LockRoundedIcon />
        }
      >
        {passwordSuccess ? 'Senha alterada!' : 'Confirmar'}
      </Button>
    </Box>
  );
}
