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
import BlockIcon from '@mui/icons-material/Block';
import { ADMIN_TOKENS } from '@/components/admin/adminTheme';
import { GLOBAL_TOKENS } from '@/theme';
import { useBanTeam } from '@/hooks/admin/useAdminTournamentTeams';

interface BanTeamDialogProps {
  open: boolean;
  tournamentId: number;
  teamId: number | null;
  teamName: string | null;
  onClose: () => void;
  onSuccess?: (teamName: string) => void;
}

export default function BanTeamDialog({
  open,
  tournamentId,
  teamId,
  teamName,
  onClose,
  onSuccess,
}: BanTeamDialogProps) {
  const banMutation = useBanTeam();
  const { reset: resetMutation } = banMutation;
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setErrorMessage(null);
      resetMutation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleConfirm = async () => {
    if (teamId == null) return;
    try {
      await banMutation.mutateAsync({ tournamentId, teamId });
      onSuccess?.(teamName ?? '');
      onClose();
    } catch (err) {
      setErrorMessage((err as Error).message ?? 'Falha ao banir equipe.');
    }
  };

  const accent = GLOBAL_TOKENS.danger;

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
          Banir equipe?
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
            backgroundColor: `${accent}1F`,
            border: `2px solid ${accent}55`,
            mx: 'auto',
            mb: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <BlockIcon sx={{ fontSize: 32, color: accent }} />
        </Box>

        <Typography sx={{ color: 'rgba(255,255,255,0.85)', mb: 1 }}>
          A equipe <strong>{teamName ?? '—'}</strong> será banida do torneio.
        </Typography>
        <Typography
          sx={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.85rem' }}
        >
          Pagamentos pendentes serão cancelados. Esta ação não pode ser
          desfeita.
        </Typography>

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
          disabled={banMutation.isPending}
          sx={{
            backgroundColor: accent,
            color: '#fff',
            fontWeight: 700,
            '&:hover': { backgroundColor: GLOBAL_TOKENS.dangerHover },
            '&.Mui-disabled': {
              backgroundColor: 'rgba(252, 44, 44, 0.4)',
              color: '#fff',
            },
          }}
        >
          {banMutation.isPending ? (
            <CircularProgress size={20} sx={{ color: '#fff' }} />
          ) : (
            'Sim, banir'
          )}
        </Button>
      </Stack>
    </Dialog>
  );
}
