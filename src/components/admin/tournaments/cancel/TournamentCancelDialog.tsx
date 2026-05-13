'use client';

import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import { ADMIN_TOKENS } from '@/components/admin/adminTheme';
import { GLOBAL_TOKENS } from '@/theme';
import { useCancelTournament } from '@/hooks/admin/useTournamentMutations';

interface TournamentCancelDialogProps {
  open: boolean;
  tournamentId: number | null;
  /** activeTeamsCount = PENDING_PAYMENT + READY. Se 0, mostra fluxo de exclusão; senão, fluxo de cancelamento. */
  activeTeamsCount: number;
  onClose: () => void;
  onSuccess?: (mode: 'deleted' | 'canceled') => void;
}

export default function TournamentCancelDialog({
  open,
  tournamentId,
  activeTeamsCount,
  onClose,
  onSuccess,
}: TournamentCancelDialogProps) {
  const isDeleteFlow = activeTeamsCount === 0;
  const cancelMutation = useCancelTournament();
  const { reset: resetMutation } = cancelMutation;
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setErrorMessage(null);
      resetMutation();
    }
    // `resetMutation` é estável entre renders (referência da mutation),
    // mas o objeto `cancelMutation` inteiro NÃO é — por isso só listamos `open`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleConfirm = async () => {
    if (tournamentId == null) return;
    try {
      // No fluxo delete (sem equipes), o back deleta; no fluxo cancel, força cascade.
      await cancelMutation.mutateAsync({
        id: tournamentId,
        force: !isDeleteFlow,
      });
      onSuccess?.(isDeleteFlow ? 'deleted' : 'canceled');
      onClose();
    } catch (err) {
      setErrorMessage((err as Error).message ?? 'Falha ao processar a ação.');
    }
  };

  const headerTitle = isDeleteFlow ? 'Excluir torneio?' : 'Atenção!';
  const accentColor = GLOBAL_TOKENS.danger;
  const Icon = isDeleteFlow ? DeleteForeverRoundedIcon : WarningAmberRoundedIcon;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: { ...ADMIN_TOKENS.sx.modalPaper, maxWidth: 440, width: '100%' },
        },
      }}
    >
      <Box sx={ADMIN_TOKENS.sx.modalHeader}>
        <Typography sx={{ fontWeight: 700, color: '#fff' }}>
          {headerTitle}
        </Typography>
        <IconButton onClick={onClose} sx={{ color: 'rgba(255,255,255,0.7)' }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            backgroundColor: `${accentColor}1F`,
            border: `2px solid ${accentColor}55`,
            mx: 'auto',
            mb: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon sx={{ fontSize: 32, color: accentColor }} />
        </Box>

        {isDeleteFlow ? (
          <Typography sx={{ color: 'rgba(255,255,255,0.85)', mb: 1 }}>
            Esse torneio <strong>não tem equipes inscritas</strong> e será
            removido permanentemente.
          </Typography>
        ) : (
          <>
            <Typography sx={{ color: 'rgba(255,255,255,0.85)', mb: 1 }}>
              Este torneio possui{' '}
              <strong>
                {activeTeamsCount} equipe{activeTeamsCount > 1 ? 's' : ''}
              </strong>{' '}
              inscrita{activeTeamsCount > 1 ? 's' : ''}. Todos os pagamentos
              pendentes serão cancelados no Mercado Pago.
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.85rem' }}>
              Deseja realmente cancelar este torneio definitivamente?
            </Typography>
          </>
        )}

        {errorMessage && (
          <Alert severity="error" sx={{ mt: 2, textAlign: 'left' }}>
            {errorMessage}
          </Alert>
        )}
      </Box>

      <Stack
        direction="row"
        spacing={1.5}
        sx={{
          paddingInline: 3,
          paddingBlock: 2,
          borderTop: `1px solid ${GLOBAL_TOKENS.border}`,
        }}
      >
        <Button
          onClick={onClose}
          fullWidth
          sx={{
            backgroundColor: 'rgba(255,255,255,0.06)',
            color: '#fff',
            '&:hover': { backgroundColor: 'rgba(255,255,255,0.12)' },
          }}
        >
          Não, voltar
        </Button>
        <Button
          onClick={handleConfirm}
          fullWidth
          disabled={cancelMutation.isPending}
          sx={{
            backgroundColor: accentColor,
            color: '#fff',
            fontWeight: 700,
            '&:hover': { backgroundColor: GLOBAL_TOKENS.dangerHover },
            '&.Mui-disabled': {
              backgroundColor: 'rgba(252, 44, 44, 0.4)',
              color: '#fff',
            },
          }}
        >
          {cancelMutation.isPending ? (
            <CircularProgress size={20} sx={{ color: '#fff' }} />
          ) : isDeleteFlow ? (
            'Sim, excluir'
          ) : (
            'Sim, cancelar'
          )}
        </Button>
      </Stack>
    </Dialog>
  );
}
