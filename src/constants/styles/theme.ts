// ─── Theme Colors ────────────────────────────────────────────────────────

export const THEME_COLORS = {
  bg: '#080d2e',
  surface: '#0E1241',
  surfaceHigh: '#151a54',
  border: 'rgba(255,255,255,0.08)',
  accent: '#11B5E4',
  accentHover: '#0b80a0',
  danger: '#fc2c2c',
  dangerHover: '#fc2c2cbb',
  text: '#ffffff',
  textMuted: 'rgba(255,255,255,0.45)',
};

export const inputSx = {
  '& .MuiOutlinedInput-root': {
    backgroundColor: THEME_COLORS.surfaceHigh,
    borderRadius: 2,
    color: THEME_COLORS.text,
    '& fieldset': { borderColor: THEME_COLORS.border },
    '&:hover fieldset': { borderColor: THEME_COLORS.accent },
    '&.Mui-focused fieldset': { borderColor: THEME_COLORS.accent },
  },
  '& .MuiInputLabel-root': { color: THEME_COLORS.textMuted },
  '& .MuiInputLabel-root.Mui-focused': { color: THEME_COLORS.accent },
  '& .MuiFormHelperText-root': { color: THEME_COLORS.danger },
};