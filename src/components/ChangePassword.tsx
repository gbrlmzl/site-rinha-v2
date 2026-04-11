import { Box, Button, colors, Divider, IconButton, InputAdornment, Stack, TextField, Typography } from "@mui/material"
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import Condition from "@/components/shared/Condition";


export default function ChangePassword({
    C, inputSx,
    goToProfile,
    nickname,
    email,
    passwordForm,
    updatePasswordField,
    visibility,
    toggleVisibility,
    passwordRequirements,
    passwordFieldsValidated,
    handlePasswordSubmit,
    passwordSuccess }: any) {


    return (
        <Box>

            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 1.5 }}>
                <IconButton onClick={goToProfile} sx={{ color: C.textMuted, '&:hover': { color: C.text, bgcolor: C.surfaceHigh } }}>
                    <ArrowBackRoundedIcon />
                </IconButton>
                <Box>
                    <Typography sx={{ fontSize: '0.75rem', color: C.textMuted, letterSpacing: 2, textTransform: 'uppercase' }}>
                        Segurança
                    </Typography>
                    <Typography sx={{ fontWeight: 700, fontSize: '1.4rem', color: C.text }}>
                        Alterar senha
                    </Typography>
                </Box>
            </Box>

            {/* Info do usuário (somente leitura) */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <Box sx={{ flex: 1, bgcolor: C.surfaceHigh, borderRadius: 2, px: 2, py: 1.5, border: `1px solid ${C.border}` }}>
                    <Typography sx={{ fontSize: '0.7rem', color: C.textMuted, mb: 0.3 }}>Nickname</Typography>
                    <Typography sx={{ color: C.text, fontWeight: 600 }}>{nickname}</Typography>
                </Box>
                <Box sx={{ flex: 2, bgcolor: C.surfaceHigh, borderRadius: 2, px: 2, py: 1.5, border: `1px solid ${C.border}` }}>
                    <Typography sx={{ fontSize: '0.7rem', color: C.textMuted, mb: 0.3 }}>Email</Typography>
                    <Typography sx={{ color: C.text, fontWeight: 600 }}>{email}</Typography>
                </Box>
            </Box>

            <Divider sx={{ borderColor: C.border, mb: 3 }} />

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
                                    <IconButton tabIndex={-1} onClick={toggleVisibility('showCurrent')} sx={{ color: C.textMuted }}>
                                        {visibility.showCurrent
                                            ? <VisibilityOffRoundedIcon fontSize="small" />
                                            : <VisibilityRoundedIcon fontSize="small" />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }
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
                                        <IconButton tabIndex={-1} onClick={toggleVisibility('showNew')} sx={{ color: C.textMuted }}>
                                            {visibility.showNew
                                                ? <VisibilityOffRoundedIcon fontSize="small" />
                                                : <VisibilityRoundedIcon fontSize="small" />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }
                        }}
                    />

                    {passwordForm.newPassword.length > 0 && (

                        <Box>
                            <Stack spacing={1} sx={{ mt: 1 }} >
                                <Condition ok={passwordRequirements.atLeast8Chars} text="Ao menos 8 caracteres" textColor="white" />
                                <Condition ok={passwordRequirements.hasNumberOrSymbol} text="Deve conter um número ou símbolo" textColor="white" />
                                <Condition ok={passwordRequirements.passwordsMatch} text="As senhas devem coincidir" textColor="white" />
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
                                    <IconButton tabIndex={-1} onClick={toggleVisibility('showConfirm')} sx={{ color: C.textMuted }}>
                                        {visibility.showConfirm
                                            ? <VisibilityOffRoundedIcon fontSize="small" />
                                            : <VisibilityRoundedIcon fontSize="small" />}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }
                    }
                    }
                />
            </Box>

            {/* Botão confirmar */}
            <Button
                fullWidth
                variant="contained"
                onClick={handlePasswordSubmit}
                disabled={!passwordFieldsValidated}
                sx={{
                    mt: 4, py: 1.5, borderRadius: 3,
                    fontWeight: 700, fontSize: '0.95rem', letterSpacing: 1,
                    backgroundColor: passwordSuccess ? '#4caf50' : C.accent,
                    '&:hover': { backgroundColor: passwordSuccess ? '#4caf50' : C.accentHover },
                    '&.Mui-disabled': {
                        backgroundColor: 'rgba(9, 65, 80, 0.35)',
                        color: 'rgba(255, 255, 255, 0.46)',
                        border: '1px solid rgba(9, 98, 122, 0.45)',
                    },
                    transition: 'background-color 0.3s',
                }}
                startIcon={passwordSuccess ? <CheckCircleRoundedIcon /> : <LockRoundedIcon />}
            >
                {passwordSuccess ? 'Senha alterada!' : 'Confirmar'}
            </Button>

        </Box>
    )
}