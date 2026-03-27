import { useRef, useState } from 'react';
import { useAuth } from '@/hooks/authentication/useAuth';

// ─── Tipos exportados para uso nos componentes ─────────────────────────────

export type ProfileView = 'profile' | 'password';

export interface PasswordFormState {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface PasswordVisibility {
  showCurrent: boolean;
  showNew: boolean;
  showConfirm: boolean;
}

export interface PasswordErrors {
  current?: string;
  new?: string;
  confirm?: string;
}

export interface PasswordStrengthInfo {
  score: number;                // 0–4
  label: string;                // '', 'Fraca', 'Razoável', 'Boa', 'Forte'
  color: string;                // cor correspondente ao score
}

// ─── Constantes de força de senha ──────────────────────────────────────────
const STRENGTH_LABELS = ['', 'Fraca', 'Razoável', 'Boa', 'Forte'];
const STRENGTH_COLORS = ['', '#ff6b6b', '#f0a500', '#11B5E4', '#4caf50'];

// ───────────────────────────────────────────────────────────────────────────

export function useProfile() {
  const { user } = useAuth();

  // ── Dados derivados do usuário ──────────────────────────────────────────
  const nickname    = user?.nickname   ?? 'Usuário';
  const email       = user?.email      ?? '';
  const username    = user?.username   ?? '';
  const avatarLetter = nickname.charAt(0).toUpperCase();

  // ── Navegação entre telas ───────────────────────────────────────────────
  const [view, setView] = useState<ProfileView>('profile');
  const goToPassword = () => setView('password');
  const goToProfile  = () => setView('profile');

  // ── Foto de perfil ──────────────────────────────────────────────────────
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const profilePic = previewUrl ?? (user?.profilePic || null);

  const openFilePicker = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    // TODO: fazer upload do arquivo para a API
  };

  // ── Formulário de senha ─────────────────────────────────────────────────
  const [passwordForm, setPasswordForm] = useState<PasswordFormState>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [passwordErrors, setPasswordErrors] = useState<PasswordErrors>({});
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const [visibility, setVisibility] = useState<PasswordVisibility>({
    showCurrent: false,
    showNew: false,
    showConfirm: false,
  });

  const updatePasswordField = (field: keyof PasswordFormState) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setPasswordForm(prev => ({ ...prev, [field]: e.target.value }));

  const toggleVisibility = (field: keyof PasswordVisibility) => () =>
    setVisibility(prev => ({ ...prev, [field]: !prev[field] }));

  // ── Força da senha ──────────────────────────────────────────────────────
  const calcPasswordStrength = (p: string): number => {
    if (!p) return 0;
    let score = 0;
    if (p.length >= 8)           score++;
    if (/[A-Z]/.test(p))         score++;
    if (/[0-9]/.test(p))         score++;
    if (/[^a-zA-Z0-9]/.test(p)) score++;
    return score;
  };

  const passwordStrength: PasswordStrengthInfo = (() => {
    const score = calcPasswordStrength(passwordForm.newPassword);
    return {
      score,
      label: STRENGTH_LABELS[score],
      color: STRENGTH_COLORS[score],
    };
  })();

  // ── Validação ───────────────────────────────────────────────────────────
  const validatePasswordForm = (): boolean => {
    const errors: PasswordErrors = {};

    if (!passwordForm.currentPassword)
      errors.current = 'Informe a senha atual';

    if (passwordForm.newPassword.length < 8)
      errors.new = 'Mínimo de 8 caracteres';

    if (passwordForm.newPassword !== passwordForm.confirmPassword)
      errors.confirm = 'As senhas não coincidem';

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ── Submit ──────────────────────────────────────────────────────────────
  const handlePasswordSubmit = () => {
    if (!validatePasswordForm()) return;

    // TODO: chamar API de alteração de senha
    // ex: await changePassword({ current: passwordForm.currentPassword, new: passwordForm.newPassword })

    setPasswordSuccess(true);
    setTimeout(() => {
      setPasswordSuccess(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPasswordErrors({});
      goToProfile();
    }, 1800);
  };

  // ── Retorno público do hook ─────────────────────────────────────────────
  return {
    // dados do usuário
    nickname,
    email,
    username,
    avatarLetter,
    profilePic,

    // navegação
    view,
    goToPassword,
    goToProfile,

    // foto de perfil
    fileInputRef,
    openFilePicker,
    handleFileChange,

    // formulário de senha
    passwordForm,
    updatePasswordField,
    passwordErrors,
    passwordSuccess,
    passwordStrength,

    // visibilidade dos campos de senha
    visibility,
    toggleVisibility,

    // submit
    handlePasswordSubmit,
  };
}