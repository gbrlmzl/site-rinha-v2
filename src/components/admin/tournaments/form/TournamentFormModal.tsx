'use client';

import { useEffect } from 'react';
import type { FieldNamesMarkedBoolean } from 'react-hook-form';
import {
  Alert,
  Box,
  CircularProgress,
  Dialog,
  Grid,
  IconButton,
  MenuItem,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import LoadingButton from '@/components/admin/tournaments/form/LoadingButton';
import ImageUploadField from '@/components/admin/tournaments/form/ImageUploadField';
import { formStyles } from '@/components/admin/tournaments/form/formStyles';
import {
  TOURNAMENT_EDITABLE_STATUSES,
  TOURNAMENT_GAMES,
  tournamentFormSchema,
  type TournamentFormValues,
} from '@/schemas/admin/tournament';
import {
  useCreateTournament,
  useUpdateTournament,
} from '@/hooks/admin/useTournamentMutations';
import { useAdminTournament } from '@/hooks/admin/useAdminTournaments';
import { GAME_PALETTE } from '@/components/shared/badges/GameBadge';
import { TOURNAMENT_STATUS_PALETTE } from '@/components/admin/tournaments/tournamentStyles';

type FormMode = 'create' | 'edit';

interface TournamentFormModalProps {
  mode: FormMode;
  /** Em modo edit, id do torneio para pré-carregar. */
  tournamentId?: number;
}

const DEFAULT_VALUES: TournamentFormValues = {
  name: '',
  game: 'LEAGUE_OF_LEGENDS',
  maxTeams: 16,
  prizePool: 0,
  startsAt: dayjs().add(1, 'day'),
  endsAt: dayjs().add(2, 'day'),
  description: '',
  rulesUrl: '',
  image: null,
  status: undefined,
};

const FIELD_LABELS = {
  name: 'NOME DO TORNEIO',
  game: 'JOGO',
  maxTeams: 'MÁX. EQUIPES',
  status: 'STATUS DO TORNEIO',
  prizePool: 'PREMIAÇÃO (R$)',
  startsAt: 'INÍCIO DO TORNEIO',
  endsAt: 'TÉRMINO DO TORNEIO',
  image: 'IMAGEM BANNER (UPLOAD)',
  rulesUrl: 'REGRAS (URL)',
  description: 'DESCRIÇÃO CURTA',
} as const;

export default function TournamentFormModal({
  mode,
  tournamentId,
}: TournamentFormModalProps) {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { data: tournament, isLoading: isLoadingDetail } = useAdminTournament(
    mode === 'edit' && tournamentId ? tournamentId : null
  );

  const createMutation = useCreateTournament();
  const updateMutation = useUpdateTournament();

  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting, dirtyFields },
  } = useForm<TournamentFormValues>({
    resolver: zodResolver(tournamentFormSchema),
    defaultValues: DEFAULT_VALUES,
  });

  useEffect(() => {
    if (mode === 'edit' && tournament) {
      reset({
        name: tournament.name,
        game: tournament.game,
        maxTeams: tournament.maxTeams,
        prizePool: Number(tournament.prizePool),
        startsAt: dayjs(tournament.startsAt),
        endsAt: dayjs(tournament.endsAt),
        description: tournament.description ?? '',
        rulesUrl: tournament.rulesUrl ?? '',
        image: null,
        status:
          tournament.status === 'CANCELED'
            ? undefined
            : (tournament.status as TournamentFormValues['status']),
      });
    }
  }, [mode, tournament, reset]);

  const handleClose = () => {
    // Em rotas interceptadas, router.back() é o caminho canônico para fechar o modal
    // (router.push pra mesma rota base não desmonta o slot @modal de forma confiável).
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/admin/torneios');
    }
  };

  const onSubmit = async (values: TournamentFormValues) => {
    if (mode === 'create' && !values.image) {
      setError('image', { type: 'required', message: 'Imagem obrigatória' });
      return;
    }

    const payload =
      mode === 'create'
        ? buildCreatePayload(values)
        : buildUpdatePayload(values, dirtyFields);

    const formData = new FormData();
    formData.append(
      'data',
      new Blob([JSON.stringify(payload)], { type: 'application/json' })
    );
    if (values.image) formData.append('image', values.image);

    try {
      if (mode === 'create') {
        await createMutation.mutateAsync(formData);
      } else if (tournamentId != null) {
        await updateMutation.mutateAsync({ id: tournamentId, formData });
      }
      handleClose();
    } catch {
      // erro fica visível no Alert abaixo via mutation.error
    }
  };

  const submissionError =
    (createMutation.error as Error | null)?.message ??
    (updateMutation.error as Error | null)?.message ??
    null;

  return (
    <Dialog
      open
      fullScreen={isMobile}
      onClose={handleClose}
      slotProps={{ paper: { sx: formStyles.dialogPaper } }}
    >
      <Box sx={formStyles.header}>
        <Typography sx={formStyles.title}>
          {mode === 'create' ? 'Criar Novo Torneio' : 'Editar Torneio'}
        </Typography>
        <IconButton onClick={handleClose} sx={{ color: 'rgba(255,255,255,0.7)' }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <Box sx={formStyles.contentScrollable}>
          {mode === 'edit' && isLoadingDetail ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress sx={{ color: '#8B5CF6' }} />
            </Box>
          ) : (
            <Grid container spacing={2.5}>
              <Grid size={12}>
                <Typography sx={formStyles.fieldLabel}>{FIELD_LABELS.name}</Typography>
                <Controller
                  name="name"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      placeholder="Ex: Liga dos Campeões 2026"
                      fullWidth
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      sx={formStyles.field}
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={formStyles.fieldLabel}>{FIELD_LABELS.game}</Typography>
                <Controller
                  name="game"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      select
                      fullWidth
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      sx={formStyles.field}
                      slotProps={{
                        select: {
                          MenuProps: {
                            slotProps: { paper: { sx: formStyles.selectMenuPaper } },
                          },
                        },
                      }}
                    >
                      {TOURNAMENT_GAMES.map((g) => (
                        <MenuItem key={g} value={g}>
                          {GAME_PALETTE[g].label}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={formStyles.fieldLabel}>{FIELD_LABELS.maxTeams}</Typography>
                <Controller
                  name="maxTeams"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      value={
                        Number.isFinite(field.value as number)
                          ? (field.value as number)
                          : ''
                      }
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === '' ? NaN : Number(e.target.value)
                        )
                      }
                      onBlur={field.onBlur}
                      name={field.name}
                      inputRef={field.ref}
                      type="number"
                      inputProps={{ min: 2 }}
                      fullWidth
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      sx={formStyles.field}
                    />
                  )}
                />
              </Grid>

              {mode === 'edit' && (
                <Grid size={12}>
                  <Typography sx={formStyles.fieldLabel}>{FIELD_LABELS.status}</Typography>
                  <Controller
                    name="status"
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        value={field.value ?? ''}
                        select
                        fullWidth
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                        sx={formStyles.field}
                        slotProps={{
                          select: {
                            MenuProps: {
                              slotProps: { paper: { sx: formStyles.selectMenuPaper } },
                            },
                          },
                        }}
                      >
                        {TOURNAMENT_EDITABLE_STATUSES.map((s) => (
                          <MenuItem key={s} value={s}>
                            {TOURNAMENT_STATUS_PALETTE[s].label}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  />
                </Grid>
              )}

              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={formStyles.fieldLabel}>{FIELD_LABELS.prizePool}</Typography>
                <Controller
                  name="prizePool"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      value={
                        Number.isFinite(field.value as number)
                          ? (field.value as number)
                          : ''
                      }
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === '' ? NaN : Number(e.target.value)
                        )
                      }
                      onBlur={field.onBlur}
                      name={field.name}
                      inputRef={field.ref}
                      type="number"
                      inputProps={{ min: 0, step: '0.01' }}
                      fullWidth
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      sx={formStyles.field}
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={formStyles.fieldLabel}>{FIELD_LABELS.startsAt}</Typography>
                <Controller
                  name="startsAt"
                  control={control}
                  render={({ field, fieldState }) => (
                    <DateTimePicker
                      value={field.value}
                      onChange={(v) => field.onChange(v)}
                      ampm={false}
                      format="DD/MM/YYYY HH:mm"
                      sx={{ width: '100%' }}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!fieldState.error,
                          helperText: fieldState.error?.message,
                          sx: formStyles.field,
                        },
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid size={12}>
                <Typography sx={formStyles.fieldLabel}>{FIELD_LABELS.endsAt}</Typography>
                <Controller
                  name="endsAt"
                  control={control}
                  render={({ field, fieldState }) => (
                    <DateTimePicker
                      value={field.value}
                      onChange={(v) => field.onChange(v)}
                      ampm={false}
                      format="DD/MM/YYYY HH:mm"
                      sx={{ width: '100%' }}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!fieldState.error,
                          helperText: fieldState.error?.message,
                          sx: formStyles.field,
                        },
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid size={12}>
                <Typography sx={formStyles.fieldLabel}>{FIELD_LABELS.image}</Typography>
                <Controller
                  name="image"
                  control={control}
                  render={({ field }) => (
                    <ImageUploadField
                      value={field.value ?? null}
                      onChange={field.onChange}
                      currentImageUrl={mode === 'edit' ? tournament?.imageUrl : null}
                      errorMessage={errors.image?.message}
                    />
                  )}
                />
              </Grid>

              <Grid size={12}>
                <Typography sx={formStyles.fieldLabel}>{FIELD_LABELS.rulesUrl}</Typography>
                <Controller
                  name="rulesUrl"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      placeholder="https://exemplo.com/regras.pdf"
                      fullWidth
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      sx={formStyles.field}
                    />
                  )}
                />
              </Grid>

              <Grid size={12}>
                <Typography sx={formStyles.fieldLabel}>{FIELD_LABELS.description}</Typography>
                <Controller
                  name="description"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      placeholder="Resumo sobre o torneio..."
                      fullWidth
                      multiline
                      minRows={3}
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      sx={formStyles.field}
                    />
                  )}
                />
              </Grid>

              {submissionError && (
                <Grid size={12}>
                  <Alert severity="error">{submissionError}</Alert>
                </Grid>
              )}
            </Grid>
          )}
        </Box>

        <Box sx={formStyles.footer}>
          <LoadingButton
            type="submit"
            loading={isSubmitting}
            sx={formStyles.submitButton}
          >
            {mode === 'create' ? 'Criar Torneio' : 'Salvar Alterações'}
          </LoadingButton>
        </Box>
      </Box>
    </Dialog>
  );
}

function buildCreatePayload(values: TournamentFormValues): Record<string, unknown> {
  return {
    name: values.name.trim(),
    game: values.game,
    maxTeams: values.maxTeams,
    prizePool: values.prizePool,
    startsAt: values.startsAt.toISOString(),
    endsAt: values.endsAt.toISOString(),
    description: values.description.trim(),
    rulesUrl: values.rulesUrl.trim(),
  };
}

/**
 * No update, só envia campos que o admin alterou.
 * Os outros vão como `null`, que o back trata como "não alterar".
 */
function buildUpdatePayload(
  values: TournamentFormValues,
  dirtyFields: Partial<Readonly<FieldNamesMarkedBoolean<TournamentFormValues>>>
): Record<string, unknown> {
  return {
    name: dirtyFields.name ? values.name.trim() : null,
    game: dirtyFields.game ? values.game : null,
    maxTeams: dirtyFields.maxTeams ? values.maxTeams : null,
    prizePool: dirtyFields.prizePool ? values.prizePool : null,
    startsAt: dirtyFields.startsAt ? values.startsAt.toISOString() : null,
    endsAt: dirtyFields.endsAt ? values.endsAt.toISOString() : null,
    description: dirtyFields.description ? values.description.trim() : null,
    rulesUrl: dirtyFields.rulesUrl ? values.rulesUrl.trim() : null,
    status: dirtyFields.status && values.status ? values.status : null,
  };
}
