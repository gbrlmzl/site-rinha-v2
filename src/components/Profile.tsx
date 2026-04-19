'use client';
import React from 'react';
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
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { useProfile } from '@/hooks/useProfile';
import Slide, { SlideProps } from '@mui/material/Slide';
import ChangePassword from './ChangePassword';

// ─── Paleta coesa com o resto do projeto ───────────────────────────────────
const C = {
  bg: '#080d2e',
  surface: '#0E1241',
  surfaceHigh: '#151a54',
  border: 'rgba(255,255,255,0.08)',
  accent: '#11B5E4',
  accentHover: '#0b80a0',
  danger: '#ff6b6b',
  text: '#ffffff',
  textMuted: 'rgba(255,255,255,0.45)',
};

// Estilo reutilizável para os campos de senha
const inputSx = {
  '& .MuiOutlinedInput-root': {
    backgroundColor: C.surfaceHigh,
    borderRadius: 2,
    color: C.text,
    '& fieldset': { borderColor: C.border },
    '&:hover fieldset': { borderColor: C.accent },
    '&.Mui-focused fieldset': { borderColor: C.accent },
  },
  '& .MuiInputLabel-root': { color: C.textMuted },
  '& .MuiInputLabel-root.Mui-focused': { color: C.accent },
  '& .MuiFormHelperText-root': { color: C.danger },
};

// ═══════════════════════════════════════════════════════════════════════════
// ProfilePage — responsável exclusivamente pela renderização
// ═══════════════════════════════════════════════════════════════════════════

export default function ProfilePage() {
  const {
    nickname,
    email,
    username,
    avatarLetter,
    profilePic,
    isEditingNickname,
    nicknameInput,
    nicknameError,
    startNicknameEdit,
    cancelNicknameEdit,
    handleNicknameInputChange,
    confirmNicknameEdit,
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
    snackbar,
    handleCloseSnackbar,
    passwordFieldsValidated,
    passwordRequirements,
  } = useProfile();

  const handleNicknameInputKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>
  ) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      confirmNicknameEdit();
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: C.bg,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        pt: { xs: 2, md: 4 },
        px: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: 480,
          backgroundColor: C.surface,
          borderRadius: 4,
          border: `1px solid ${C.border}`,
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
            background: `linear-gradient(90deg, transparent, ${C.accent}, transparent)`,
          },
        }}
      >
        {view === 'password' ? (
          // ── Tela: alterar senha ──────────────────────────────────────────
          <Fade in timeout={300}>
            <ChangePassword
              C={C}
              inputSx={inputSx}
              goToProfile={goToProfile}
              nickname={nickname}
              email={email}
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
                    color: C.text,
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
                      bgcolor: C.accent,
                      fontSize: '2.5rem',
                      fontWeight: 700,
                      border: `3px solid ${C.surfaceHigh}`,
                      boxShadow: `0 0 0 2px ${C.accent}40`,
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
                        bgcolor: C.accent,
                        color: '#fff',
                        width: 32,
                        height: 32,
                        border: `2px solid ${C.surface}`,
                        '&:hover': {
                          bgcolor: C.accentHover,
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
                    color: C.text,
                  }}
                >
                  {nickname}
                </Typography>
                <Typography sx={{ fontSize: '0.8rem', color: C.textMuted }}>
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
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    bgcolor: C.surfaceHigh,
                    borderRadius: 2,
                    px: 2,
                    py: 1.8,
                    border: `1px solid ${C.border}`,
                  }}
                >
                  <PersonRoundedIcon
                    sx={{ color: C.textMuted, fontSize: 20 }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      sx={{
                        fontSize: '0.68rem',
                        color: C.textMuted,
                        mb: 0.2,
                        letterSpacing: 1,
                      }}
                    >
                      NICKNAME
                    </Typography>
                    {isEditingNickname ? (
                      <TextField
                        size="small"
                        value={nicknameInput}
                        onChange={handleNicknameInputChange}
                        onKeyDown={handleNicknameInputKeyDown}
                        error={!!nicknameError}
                        helperText={nicknameError || ''}
                        sx={{
                          width: '100%',
                          ...inputSx,
                          '& .MuiFormHelperText-root': {
                            color: C.danger,
                            marginLeft: 0,
                          },
                          '& .MuiOutlinedInput-input': {
                            padding: '4px 4px',
                            fontSize: '0.99rem',
                            color: C.text,
                          },
                        }}
                      />
                    ) : (
                      <Typography sx={{ color: C.text, fontWeight: 600 }}>
                        {nickname}
                      </Typography>
                    )}
                  </Box>
                  {isEditingNickname ? (
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <Tooltip title="Confirmar">
                        <IconButton
                          size="small"
                          onClick={confirmNicknameEdit}
                          sx={{ color: C.accent }}
                        >
                          <CheckRoundedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Cancelar">
                        <IconButton
                          size="small"
                          onClick={cancelNicknameEdit}
                          sx={{ color: C.textMuted }}
                        >
                          <CloseRoundedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  ) : (
                    <Tooltip title="Editar nickname">
                      <IconButton
                        size="small"
                        onClick={startNicknameEdit}
                        sx={{ color: C.accent }}
                      >
                        <EditRoundedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    bgcolor: C.surfaceHigh,
                    borderRadius: 2,
                    px: 2,
                    py: 1.8,
                    border: `1px solid ${C.border}`,
                  }}
                >
                  <EmailRoundedIcon sx={{ color: C.textMuted, fontSize: 20 }} />
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      sx={{
                        fontSize: '0.68rem',
                        color: C.textMuted,
                        mb: 0.2,
                        letterSpacing: 1,
                      }}
                    >
                      EMAIL
                    </Typography>
                    <Typography sx={{ color: C.text, fontWeight: 600 }}>
                      {email}
                    </Typography>
                  </Box>
                  <Chip
                    label="Privado"
                    size="small"
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.05)',
                      color: C.textMuted,
                      fontSize: '0.65rem',
                      height: 20,
                      border: `1px solid ${C.border}`,
                    }}
                  />
                </Box>
              </Box>

              <Divider sx={{ borderColor: C.border, mb: 3 }} />

              {/* Botão alterar senha */}
              <Button
                fullWidth
                variant="outlined"
                startIcon={<LockRoundedIcon />}
                onClick={goToPassword}
                sx={{
                  py: 1.4,
                  borderRadius: 3,
                  borderColor: C.border,
                  color: C.text,
                  fontWeight: 600,
                  letterSpacing: 0.5,
                  '&:hover': {
                    borderColor: C.accent,
                    backgroundColor: `${C.accent}10`,
                    color: C.accent,
                  },
                  transition: 'all 0.2s',
                }}
              >
                Alterar senha
              </Button>
            </Box>
          </Fade>
        )}
      </Paper>
      <Snackbar
        open={snackbar?.open || false}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        /*message={snackbar?.message}*/
        /*severity={snackbar?.severity}*/
        slots={{ transition: Slide }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar?.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {' '}
          {snackbar?.message}{' '}
        </Alert>
      </Snackbar>
    </Box>
  );
}
