import { ADMIN_TOKENS } from '@/components/admin/adminTheme';
import { GLOBAL_TOKENS, INPUT_SX } from '@/theme';

const { border, surfaceHigh, text, textMuted } = GLOBAL_TOKENS;
const c = ADMIN_TOKENS.colors;

export const formStyles = {
  dialogPaper: {
    ...ADMIN_TOKENS.sx.modalPaper,
    width: '100%',
    maxWidth: 720,
    maxHeight: { xs: '100dvh', md: '92vh' },
  },

  header: ADMIN_TOKENS.sx.modalHeader,

  title: {
    fontWeight: 700,
    fontSize: { xs: '1.05rem', md: '1.2rem' },
    color: text,
  },

  contentScrollable: {
    paddingInline: { xs: 2.5, md: 3 },
    paddingBlock: { xs: 2, md: 3 },
    overflowY: 'auto' as const,
    scrollbarWidth: 'none' as const,
    '&::-webkit-scrollbar': { display: 'none' },
  },

  footer: {
    paddingInline: { xs: 2.5, md: 3 },
    paddingBlock: 2,
    borderTop: `1px solid ${border}`,
    display: 'flex',
    justifyContent: 'flex-end',
  },

  submitButton: {
    ...ADMIN_TOKENS.sx.primaryCta,
    minWidth: { xs: '100%', md: 200 },
  },

  fieldLabel: {
    ...ADMIN_TOKENS.typography.sectionLabel,
    color: textMuted,
    mb: 0.75,
  },

  /** TextField escuro padrão dos formulários do admin */
  field: {
    ...INPUT_SX,
    '& .MuiOutlinedInput-root': {
      ...INPUT_SX['& .MuiOutlinedInput-root'],
      '&:hover fieldset': { borderColor: c.adminAccent },
      '&.Mui-focused fieldset': { borderColor: c.adminAccent },
    },
    '& .MuiInputLabel-root.Mui-focused': { color: c.adminAccent },
  },

  selectMenuPaper: {
    backgroundColor: GLOBAL_TOKENS.surface,
    border: `1px solid ${border}`,
    color: text,
    '& .MuiMenuItem-root': {
      '&:hover': { backgroundColor: 'rgba(139, 92, 246, 0.12)' },
      '&.Mui-selected': {
        backgroundColor: 'rgba(139, 92, 246, 0.18)',
        '&:hover': { backgroundColor: 'rgba(139, 92, 246, 0.24)' },
      },
    },
  },

  /** Dropzone de upload de imagem */
  dropzone: (state: 'idle' | 'preview' | 'error') => ({
    position: 'relative' as const,
    borderRadius: 2,
    backgroundColor: surfaceHigh,
    border: `2px dashed ${
      state === 'error' ? GLOBAL_TOKENS.danger : 'rgba(139, 92, 246, 0.4)'
    }`,
    minHeight: 160,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    overflow: 'hidden',
    transition: 'border-color 0.15s, background-color 0.15s',
    '&:hover': {
      borderColor: c.adminAccent,
      backgroundColor: 'rgba(139, 92, 246, 0.06)',
    },
  }),

  dropzoneIcon: {
    fontSize: 36,
    color: c.adminAccent,
    mb: 1,
  },

  dropzoneText: {
    color: textMuted,
    fontSize: '0.8rem',
    letterSpacing: '0.08em',
    textTransform: 'uppercase' as const,
    fontWeight: 600,
  },

  dropzonePreview: {
    width: '100%',
    height: 200,
    objectFit: 'cover' as const,
    display: 'block',
  },

  dropzoneOverlay: {
    position: 'absolute' as const,
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column' as const,
    backgroundColor: 'rgba(0,0,0,0.45)',
    color: '#fff',
    opacity: 0,
    transition: 'opacity 0.15s',
    '&:hover': { opacity: 1 },
  },
} as const;
