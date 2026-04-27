import { useEffect, useRef, useState } from 'react';
import { useAuthContext } from '@/contexts/AuthContext';
import { apiFetch } from '@/services/interceptor';
import { useSnackbarContext } from '@/contexts/SnackbarContext';
import { ChangeEvent } from 'react';
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
  atLeast8Characters: boolean;
  hasNumberOrSymbol: boolean;
  passwordsMatch: boolean;
}

// ───────────────────────────────────────────────────────────────────────────

export function useProfile() {
  const { user, refreshUser } = useAuthContext();
  const [loading, setLoading] = useState(false);

  // ── Dados derivados do usuário ──────────────────────────────────────────
  const nickname: string = user?.nickname ?? 'Usuário';
  const email: string = user?.email ?? '';
  const username: string = user?.username ?? '';

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [profilePicFile, setProfilePicFile] = useState<File | null>(null);
  const [nicknameInput, setNicknameInput] = useState<string>(nickname);
  const [nicknameError, setNicknameError] = useState<string | null>(null);

  const [visibility, setVisibility] = useState<PasswordVisibility>({
    showCurrent: false,
    showNew: false,
    showConfirm: false,
  });
  const [view, setView] = useState<ProfileView>('profile');

  // ── Formulário de senha ─────────────────────────────────────────────────
  const [passwordForm, setPasswordForm] = useState<PasswordFormState>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [passwordRequirements, setPasswordRequirements] =
    useState<PasswordRequirements>({
      atLeast8Characters: false,
      hasNumberOrSymbol: false,
      passwordsMatch: false,
    });
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const { showSnackbar, closeSnackbar } = useSnackbarContext();

  function isNewNickNameValid(): boolean {
    const trimmed = nicknameInput.trim();
    return trimmed.length >= 3 && trimmed !== nickname;
  }

  const canSendChangeRequest = isNewNickNameValid() || profilePicFile !== null;

  const handleCloseSnackbar = () => {
    closeSnackbar();
  };

  const resetProfilePictureSelection = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setPreviewUrl(null);
    setProfilePicFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleNicknameInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNicknameInput(e.target.value);
    if (nicknameError) {
      setNicknameError(null);
    }
  };

  

  const confirmChanges = async () => {
    const nextNickname = nicknameInput.trim();
    const hasNicknameChange = nextNickname !== nickname;
    const hasProfilePicChange = profilePicFile !== null;

    if (hasNicknameChange && nextNickname.length < 3) {
      setNicknameError('O nickname deve ter pelo menos 3 caracteres.');
      return;
    }

    if (!hasNicknameChange && !hasProfilePicChange) {
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      const data = {
        nickname: hasNicknameChange ? nextNickname : null,
        // outros campos de perfil que possam ser editados no futuro
      };
      formData.append(
        'data',
        new Blob([JSON.stringify(data)], { type: 'application/json' })
      );

      if (profilePicFile) {
        formData.append('profilePic', profilePicFile);
      }

     
      const response = await apiFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/me`,
        {
          method: 'PATCH',
          body: formData,
          credentials: 'include',
        }
      );

      if (!response.ok) {
        let errorMessage = 'Erro ao atualizar perfil.';
        try {
          const errorBody = await response.json();
          errorMessage = errorBody.error || errorMessage;
        } catch {
          // se a resposta não for JSON, mantém a mensagem genérica
        }
        showSnackbar({
          message: errorMessage,
          severity: 'error',
        });
        return;
      }

      showSnackbar({
        message: 'Perfil atualizado com sucesso!',
        severity: 'success',
      });

      if (hasNicknameChange) {
        setNicknameInput(nextNickname);
      }

      await refreshUser();
      resetProfilePictureSelection();
    } catch (error) {
      showSnackbar({
        message: 'Erro ao conectar à API.',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  
  const avatarLetter = nickname.charAt(0).toUpperCase();

  // ── Navegação entre telas ───────────────────────────────────────────────

  const goToPassword = () => setView('password');
  const goToProfile = () => setView('profile');

  // ── Foto de perfil ──────────────────────────────────────────────────────

  const IMGUR_ALLOWED_FORMATS = ['image/jpeg', 'image/png'];
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB 

  const fileInputRef = useRef<HTMLInputElement>(null);

  const profilePic = previewUrl ?? (user?.profilePic || null);

  const openFilePicker = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    //validar tipo de arquivo
    if (!IMGUR_ALLOWED_FORMATS.includes(file.type)) {
      showSnackbar({
        message: 'Formato inválido. Use JPG ou PNG.',
        severity: 'error',
      });
      return;
    }
    //validar tamanho do arquivo
    if (file.size > MAX_FILE_SIZE) {
      showSnackbar({
        message: 'Arquivo muito grande. Máximo de 5MB.',
        severity: 'error',
      });
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setProfilePicFile(file);
  };


  const passwordFieldsValidated =
    passwordRequirements.atLeast8Characters &&
    passwordRequirements.hasNumberOrSymbol &&
    passwordRequirements.passwordsMatch &&
    passwordForm.currentPassword.length > 0;

  useEffect(() => {
    setPasswordRequirements({
      atLeast8Characters: passwordForm.newPassword.length >= 8,
      hasNumberOrSymbol: /[\d\W]/.test(passwordForm.newPassword),
      passwordsMatch:
        passwordForm.newPassword === passwordForm.confirmPassword &&
        passwordForm.newPassword.length > 0,
    });
  }, [passwordForm]);

  const updatePasswordField =
    (field: keyof PasswordFormState) =>
    (e: ChangeEvent<HTMLInputElement>) =>
      setPasswordForm((prev) => ({ ...prev, [field]: e.target.value }));

  const toggleVisibility = (field: keyof PasswordVisibility) => () => setVisibility((prev) => ({ ...prev, [field]: !prev[field] }));

  // ── Submit ──────────────────────────────────────────────────────────────
  const handlePasswordSubmit = async () => {
    if (!passwordFieldsValidated) return;

    // TODO: chamar API de alteração de senha
    await changePassword({
      newPassword: passwordForm.newPassword,
      currentPassword: passwordForm.currentPassword,
    });
  };

  const changePassword = async (data: {
    newPassword: string;
    currentPassword: string;
  }) => {
    try {
      const formData = new FormData();
      formData.append(
        'data',
        new Blob([JSON.stringify(data)], { type: 'application/json' })
      );


      const response = await apiFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/me`,
        {
          method: 'PATCH',
          body: formData,
          credentials: 'include',
        }
      );

      if (!response.ok) {
        const errorBody = await response.json();

        setPasswordSuccess(false);
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        showSnackbar({
          message: errorBody.error || 'Erro ao alterar senha.',
          severity: 'error',
        });
        return;
      }

      if (response.status === 200) {
        showSnackbar({
          message: 'Senha alterada com sucesso!',
          severity: 'success',
        });

        setPasswordSuccess(true);
        setTimeout(() => {
          //setPasswordSuccess(false);
          setPasswordForm({
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
          });
          setPasswordRequirements({
            atLeast8Characters: false,
            hasNumberOrSymbol: false,
            passwordsMatch: false,
          });
          goToProfile();
        }, 1800);
        await refreshUser();
      }
    } catch (error) {
      showSnackbar({
        message: 'Erro ao conectar à API.',
        severity: 'error',
      });
      setPasswordSuccess(false);
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    }
  };

  // ── Retorno público do hook ─────────────────────────────────────────────
  return {
    // dados do usuário
    nickname,
    email,
    username,
    avatarLetter,
    profilePic,

    // edição de nickname
    nicknameInput,
    handleNicknameInputChange,
    nicknameError,
    canSendChangeRequest,
    confirmChanges,
    loading,

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
    passwordRequirements,

    // visibilidade dos campos de senha
    visibility,
    toggleVisibility,

    // submit
    handlePasswordSubmit,

    //snackbar
    handleCloseSnackbar,
  };
}
