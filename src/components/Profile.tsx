'use client';
import { useRef, type KeyboardEvent } from 'react';
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  TextField,
  Button,
  InputAdornment,
  Divider,
  Chip,
  Fade,
  Tooltip,
  Paper,
  Snackbar,
  Alert,
  Stack,
} from '@mui/material';
import CameraAltRoundedIcon from '@mui/icons-material/CameraAltRounded';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import SaveIcon from '@mui/icons-material/Save';
import { useProfile } from '@/hooks/useProfile';
import Slide, { SlideProps } from '@mui/material/Slide';
import ChangePassword from './ChangePassword';

import {THEME_COLORS, inputSx} from '@/constants/styles/theme';
// ─── Paleta coesa com o resto do projeto ───────────────────────────────────




// ═══════════════════════════════════════════════════════════════════════════
// ProfilePage — responsável exclusivamente pela renderização
// ═══════════════════════════════════════════════════════════════════════════

export default function ProfilePage() {
  const nicknameInputRef = useRef<HTMLInputElement | null>(null);

  const {
    nickname,
    email,
    username,
    avatarLetter,
    profilePic,
    nicknameInput,
    nicknameError,
    canSendChangeRequest,
    handleNicknameInputChange,
    confirmChanges,
    view,
    goToPassword,
    goToProfile,
    fileInputRef,
    openFilePicker,
    handleFileChange,
    passwordForm,
    updatePasswordField,
    passwordSuccess,
    visibility,
    toggleVisibility,
    handlePasswordSubmit,
    handleCloseSnackbar,
    passwordFieldsValidated,
    passwordRequirements,
  } = useProfile();

  const handleNicknameInputKeyDown = (
    event: KeyboardEvent<HTMLDivElement>
  ) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      nicknameInputRef.current?.blur();
      confirmChanges();
    }
  };

  const handleNicknameBoxClick = () => {
    nicknameInputRef.current?.focus();
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: THEME_COLORS.bg,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        pt: view === 'password' ? { xs: '13vh', md: 8 } : { xs: 4, md: 6 },

        px: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: 480,
          backgroundColor: THEME_COLORS.surface,
          borderRadius: 4,
          border: `1px solid ${THEME_COLORS.border}`,
          p: { xs: 3, md: 4 },
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: `linear-gradient(90deg, transparent, ${THEME_COLORS.accent}, transparent)`,
          },
        }}
      >
        {view === 'password' ? (
          // ── Tela: alterar senha ──────────────────────────────────────────
          <Fade in timeout={300}>
                <ChangePassword
                goToProfile={goToProfile}
                passwordForm={passwordForm}
                updatePasswordField={updatePasswordField}
                visibility={visibility}
                toggleVisibility={toggleVisibility}
                passwordRequirements={passwordRequirements}
                passwordFieldsValidated={passwordFieldsValidated}
                handlePasswordSubmit={handlePasswordSubmit}
                passwordSuccess={passwordSuccess}
                />

          </Fade>
        ) : (
          // ── Tela: perfil ─────────────────────────────────────────────────
          <Fade in timeout={300}>
            <Box>
              {/* Título */}
              <Box sx={{ mb: 2 }}>
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: '1.5rem',
                    color: THEME_COLORS.text,
                    textAlign: 'center',
                  }}
                >
                  Minha conta
                </Typography>
              </Box>

              {/* Avatar */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  mb: 4,
                }}
              >
                <Box sx={{ position: 'relative', display: 'inline-block' }}>
                  <Avatar
                    src={profilePic ?? undefined}
                    alt={nickname}
                    sx={{
                      width: 110,
                      height: 110,
                      bgcolor: THEME_COLORS.accent,
                      fontSize: '2.5rem',
                      fontWeight: 700,
                      border: `3px solid ${THEME_COLORS.surfaceHigh}`,
                      boxShadow: `0 0 0 2px ${THEME_COLORS.accent}40`,
                    }}
                  >
                    {!profilePic && avatarLetter}
                  </Avatar>

                  <Tooltip title="Alterar foto">
                    <IconButton
                      onClick={openFilePicker}
                      size="small"
                      sx={{
                        position: 'absolute',
                        bottom: 2,
                        right: 2,
                        bgcolor: THEME_COLORS.accent,
                        color: '#fff',
                        width: 32,
                        height: 32,
                        border: `2px solid ${THEME_COLORS.surface}`,
                        '&:hover': {
                          bgcolor: THEME_COLORS.accentHover,
                          transform: 'scale(1.1)',
                        },
                        transition: 'all 0.2s',
                      }}
                    >
                      <CameraAltRoundedIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Tooltip>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleFileChange}
                  />
                </Box>

                <Typography
                  sx={{
                    mt: 1.5,
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    color: THEME_COLORS.text,
                  }}
                >
                  {nickname}
                </Typography>
                <Typography sx={{ fontSize: '0.8rem', color: THEME_COLORS.textMuted }}>
                  @{username}
                </Typography>
              </Box>

              {/* Campos de informação */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1.5,
                  mb: 3,
                }}
              >
                <Box
                  onClick={handleNicknameBoxClick}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    bgcolor: THEME_COLORS.surfaceHigh,
                    borderRadius: 2,
                    px: 2,
                    py: 1.8,
                    border: `1px solid ${THEME_COLORS.border}`,
                    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                    '&:focus-within': {
                      borderColor: THEME_COLORS.accent,
                      boxShadow: `0 0 0 2px ${THEME_COLORS.accent}33`,
                    },
                  }}
                >
                  <Box sx={{ flex: 1, cursor: 'text' }}>
                    <Typography
                      sx={{
                        fontSize: '0.68rem',
                        color: THEME_COLORS.textMuted,
                        mb: 0.2,
                        letterSpacing: 1,
                      }}
                    >
                      NICKNAME
                    </Typography>
                    <TextField
                      inputRef={nicknameInputRef}
                      size="small"
                      value={nicknameInput}
                      onChange={handleNicknameInputChange}
                      onKeyDown={handleNicknameInputKeyDown}
                      error={!!nicknameError}
                      helperText={nicknameError || ''}
                      sx={{
                        width: '100%',
                        ...inputSx,
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: 'transparent',
                          '& fieldset': {
                            borderColor: 'transparent',
                          },
                          '&:hover fieldset': {
                            borderColor: 'transparent',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: 'transparent',
                          },
                        },
                        '& .MuiFormHelperText-root': {
                          color: THEME_COLORS.danger,
                          marginLeft: 0,
                        },
                        '& .MuiOutlinedInput-input': {
                          padding: '4px 4px',
                          fontSize: '0.99rem',
                          color: THEME_COLORS.text,
                        },
                      }}
                    />
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    gap: 1.5,
                    bgcolor: THEME_COLORS.surfaceHigh,
                    borderRadius: 2,
                    px: 2,
                    py: 1.8,
                    border: `1px solid ${THEME_COLORS.border}`,
                  }}
                >

                  <Box sx={{ flex: 1, width: '100%', minWidth: 0 }}>
                    <Stack direction="row" alignItems="center" justifyContent={'space-between'}>
                      <Typography
                      sx={{
                        fontSize: '0.68rem',
                        color: THEME_COLORS.textMuted,
                        mb: 0.2,
                        letterSpacing: 1,
                      }}
                    >
                      EMAIL
                    </Typography>
                      <Chip
                    label="Privado"
                    size="small"
                    sx={{
                      alignSelf: { xs: 'flex-start', sm: 'center' },
                      bgcolor: 'rgba(255,255,255,0.05)',
                      color: THEME_COLORS.textMuted,
                      fontSize: '0.65rem',
                      height: 20,
                      border: `1px solid ${THEME_COLORS.border}`,
                    }}
                  />
                    </Stack>
                    
                    <Typography
                      sx={{
                        color: THEME_COLORS.text,
                        fontWeight: 600,
                        wordBreak: 'break-word',
                      }}
                    >
                      {email}
                    </Typography>
                  </Box>
                  
                </Box>
              </Box>

              <Divider sx={{ borderColor: THEME_COLORS.border, mb: 3 }} />

              {/* Botão alterar senha */}
              <Stack direction="column" spacing={1} justifyContent="center">
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<SaveIcon />}
                  onClick={confirmChanges}
                  disabled={
                    !canSendChangeRequest
                  }
                  sx={{
                    py: 1.4,
                    backgroundColor: `${THEME_COLORS.accent}`,
                    borderRadius: 3,
                    borderColor: THEME_COLORS.border,
                    color: THEME_COLORS.text,
                    fontWeight: 600,
                    letterSpacing: 0.5,
                    '&:hover': {
                      borderColor: THEME_COLORS.accent,
                      backgroundColor: `${THEME_COLORS.accentHover}`,
                      color: THEME_COLORS.accent,
                    },
                    ':disabled': {
                      borderColor: THEME_COLORS.border,
                      color: THEME_COLORS.textMuted,
                      backgroundColor: 'transparent',
                    },
                    transition: 'all 0.2s',
                  }}
                >
                  Salvar alterações
                </Button>

                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<LockRoundedIcon  />}
                  onClick={goToPassword}
                  sx={{
                    backgroundColor: `${THEME_COLORS.danger}`,
                    py: 1.4,
                    borderRadius: 3,
                    borderColor: THEME_COLORS.border,
                    color: THEME_COLORS.text,
                    fontWeight: 600,
                    letterSpacing: 0.5,
                    '&:hover': {
                      borderColor: THEME_COLORS.danger,
                      backgroundColor: `${THEME_COLORS.dangerHover}`,
                      //color: THEME_COLORS.accent,
                    },
                    transition: 'all 0.2s',
                  }}
                >
                  Segurança
                </Button>
              </Stack>
            </Box>
          </Fade>
        )}
      </Paper>
    </Box>
  );
}
