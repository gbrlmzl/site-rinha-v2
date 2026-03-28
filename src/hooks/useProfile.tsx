import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/hooks/authentication/useAuth';
import { RefreshOutlined } from '@mui/icons-material';
import { apiFetch } from '@/services/interceptor';
import { set } from 'zod';



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

export interface PasswordRequirements {
  atLeast8Chars: boolean;
  hasNumberOrSymbol: boolean;
  passwordsMatch: boolean;
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
  const { user, refreshUser } = useAuth();

  // ── Dados derivados do usuário ──────────────────────────────────────────
  const nickname = user?.nickname ?? 'Usuário';
  const email = user?.email ?? '';
  const username = user?.username ?? '';

  
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [nicknameInput, setNicknameInput] = useState('');
  const [nicknamePreview, setNicknamePreview] = useState(nickname);
  const [nicknameError, setNicknameError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{open : boolean,  message: string; severity: 'success' | 'error' | 'info' } | null>(null);
  
  

  useEffect(() => {
    if (!isEditingNickname) {
      setNicknamePreview(nickname);
    }
  }, [nickname, isEditingNickname]);

  const startNicknameEdit = () => {
    setNicknameInput(nicknamePreview);
    setNicknameError(null);
    setIsEditingNickname(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ open: false, message: snackbar?.message || '', severity: snackbar?.severity || 'info' });
  };

  const cancelNicknameEdit = () => {
    setIsEditingNickname(false);
    setNicknameInput('');
    setNicknameError(null);
  };

  const handleNicknameInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNicknameInput(e.target.value);
  };

  const confirmNicknameEdit = async () => {
    const nextNickname = nicknameInput.trim();

    if (nextNickname.length < 3) {
      setNicknameError('O nickname deve ter pelo menos 3 caracteres.');
      return;
    }

    // TODO: Persistir nickname na API (ex.: PATCH /users/me/nickname)
    try {
      const response = await apiFetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nickname: nextNickname }),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorBody = await response.json();
        //setNicknameError(errorBody.error || 'Erro ao atualizar nickname.');
        setSnackbar({ open: true, message: errorBody.error || 'Erro ao atualizar nickname.', severity: 'error' });
        return;
      }

      if (response.status === 200) {
        //chamar um refresh para atualizar o usuário com o novo nickname
        setSnackbar({ open: true, message: 'Nickname atualizado com sucesso!', severity: 'success' });
        await refreshUser();
      }

    } catch (error) {
      setSnackbar({ open: true, message: 'Erro interno no servidor.', severity: 'error' });

    }


    setNicknamePreview(nextNickname);
    setIsEditingNickname(false);
    setNicknameInput('');
    setNicknameError(null);
  };

  const displayNickname = nicknamePreview;
  const avatarLetter = displayNickname.charAt(0).toUpperCase();

  // ── Navegação entre telas ───────────────────────────────────────────────
  const [view, setView] = useState<ProfileView>('profile');
  const goToPassword = () => setView('password');
  const goToProfile = () => setView('profile');

  // ── Foto de perfil ──────────────────────────────────────────────────────
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const IMGUR_ALLOWED_FORMATS = ["image/jpeg", "image/png"];
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB (limite do Imgur)

  const fileInputRef = useRef<HTMLInputElement>(null);

  const profilePic = previewUrl ?? (user?.profilePic || null);

  const openFilePicker = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    //validar tipo de arquivo
    if (!IMGUR_ALLOWED_FORMATS.includes(file.type)) {
      return;
    }
    //validar tamanho do arquivo
    if (file.size > MAX_FILE_SIZE) {
      //retornar False e mensagem de erro
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

  };


  /*const handleConfirmChangePicture = async (username: string, email: string) => {
    if (loadingChangeProfilePicture) return; // Impede execução se já estiver carregando

    setLoadingChangeProfilePicture(true);

    const formData = new FormData();
    formData.append('profilePictureFile', profilePictureFile as Blob);
    formData.append('username', username);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/profile-picture`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

    } catch (error) {
      console.error('Erro ao alterar foto de perfil:', error);
    } finally {
      setLoadingChangeProfilePicture(false);
    }
  }*/

  // ── Formulário de senha ─────────────────────────────────────────────────
  const [passwordForm, setPasswordForm] = useState<PasswordFormState>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [passwordRequirements, setPasswordRequirements] = useState<PasswordRequirements>({ atLeast8Chars: false, hasNumberOrSymbol: false, passwordsMatch: false });
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const passwordFieldsValidated = 
    passwordRequirements.atLeast8Chars &&
    passwordRequirements.hasNumberOrSymbol &&
    passwordRequirements.passwordsMatch &&
    passwordForm.currentPassword.length > 0;

  useEffect(() => {
    setPasswordRequirements({
      atLeast8Chars: passwordForm.newPassword.length >= 8,
      hasNumberOrSymbol: /[\d\W]/.test(passwordForm.newPassword),
      passwordsMatch: passwordForm.newPassword === passwordForm.confirmPassword && passwordForm.newPassword.length > 0,
    });
  }, [passwordForm]);

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
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
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
 /* const validatePasswordForm = (): boolean => {
    const errors: PasswordErrors = {};

    if (!passwordForm.currentPassword)
      errors.current = 'Informe a senha atual';

    if (passwordForm.newPassword.length < 8)
      errors.new = 'Mínimo de 8 caracteres';

    if (passwordForm.newPassword !== passwordForm.confirmPassword)
      errors.confirm = 'As senhas não coincidem';

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };*/



  // ── Submit ──────────────────────────────────────────────────────────────
  const handlePasswordSubmit = async () => {
    if (!passwordFieldsValidated) return;

    // TODO: chamar API de alteração de senha
    await changePassword({ newPassword: passwordForm.newPassword, currentPassword: passwordForm.currentPassword });


  };

  const changePassword = async (data: { newPassword: string; currentPassword: string }) => {
    try {
      const response = await apiFetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorBody = await response.json();

        setPasswordSuccess(false);
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setSnackbar({ open: true, message: errorBody.error || 'Erro ao alterar senha.', severity: 'error' });
        return;
      }

      if (response.status === 200) {
        setSnackbar({ open: true, message: 'Senha alterada com sucesso!', severity: 'success' });
        setPasswordSuccess(true);
        setTimeout(() => {
          //setPasswordSuccess(false);
          setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
          setPasswordRequirements({ atLeast8Chars: false, hasNumberOrSymbol: false, passwordsMatch: false });
          goToProfile();
        }, 1800);
        await refreshUser();
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'Erro ao conectar à API.', severity: 'error' });
      setPasswordSuccess(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    }
  };

  // ── Retorno público do hook ─────────────────────────────────────────────
  return {
    // dados do usuário
    nickname: displayNickname,
    email,
    username,
    avatarLetter,
    profilePic,

    // edição de nickname
    isEditingNickname,
    nicknameInput,
    nicknameError,
    startNicknameEdit,
    cancelNicknameEdit,
    handleNicknameInputChange,
    confirmNicknameEdit,

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
    passwordFieldsValidated,
    passwordSuccess,
    passwordStrength,
    passwordRequirements,

    // visibilidade dos campos de senha
    visibility,
    toggleVisibility,

    // submit
    handlePasswordSubmit,

    //snackbar
    snackbar,
    handleCloseSnackbar
  };
}