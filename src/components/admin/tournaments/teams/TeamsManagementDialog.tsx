'use client';

import { useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Dialog,
  IconButton,
  Skeleton,
  Snackbar,
  Stack,
  Tab,
  TablePagination,
  Tabs,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useRouter } from 'next/navigation';
import { ADMIN_TOKENS } from '@/components/admin/adminTheme';
import TeamAccordionItem from '@/components/admin/tournaments/teams/TeamAccordionItem';
import BanTeamDialog from '@/components/admin/tournaments/teams/BanTeamDialog';
import { teamStyles } from '@/components/admin/tournaments/teams/teamStyles';
import { tournamentStyles } from '@/components/admin/tournaments/tournamentStyles';
import { useAdminTournament } from '@/hooks/admin/useAdminTournaments';
import { useAdminTournamentTeams } from '@/hooks/admin/useAdminTournamentTeams';
import type { AdminTeamSummary, TeamStatus } from '@/types/admin/team';

interface TeamsManagementDialogProps {
  tournamentId: number;
}

type StatusFilter = 'ALL' | 'PENDING_PAYMENT' | 'READY' | 'FINISHED';

const FILTER_OPTIONS: {
  value: StatusFilter;
  label: string;
  statuses: TeamStatus[];
}[] = [
  {
    value: 'ALL',
    label: 'Todas',
    statuses: ['PENDING_PAYMENT', 'READY', 'FINISHED'],
  },
  { value: 'PENDING_PAYMENT', label: 'Pendentes', statuses: ['PENDING_PAYMENT'] },
  { value: 'READY', label: 'Prontas', statuses: ['READY'] },
  { value: 'FINISHED', label: 'Finalizadas', statuses: ['FINISHED'] },
];

export default function TeamsManagementDialog({
  tournamentId,
}: TeamsManagementDialogProps) {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const [banTarget, setBanTarget] = useState<AdminTeamSummary | null>(null);
  const [feedback, setFeedback] = useState<{
    open: boolean;
    message: string;
  }>({ open: false, message: '' });

  const statusList = useMemo(
    () =>
      FILTER_OPTIONS.find((opt) => opt.value === statusFilter)?.statuses ?? [],
    [statusFilter]
  );

  const { data: tournament } = useAdminTournament(tournamentId);
  const { data, isLoading, isError, error } = useAdminTournamentTeams({
    tournamentId,
    statusList,
    page,
    size: pageSize,
  });

  const handleClose = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/admin/torneios');
    }
  };

  const teams = data?.content ?? [];

  return (
    <>
      <Dialog
        open
        onClose={handleClose}
        slotProps={{ paper: { sx: teamStyles.modalPaper } }}
        fullWidth
        fullScreen={isMobile}
      >
        <Box sx={ADMIN_TOKENS.sx.modalHeader}>
          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{ fontWeight: 700, fontSize: '1.1rem', color: '#fff' }}
              noWrap
            >
              Gerenciar Equipes
            </Typography>
            {tournament && (
              <Typography
                sx={{
                  ...ADMIN_TOKENS.typography.sectionLabel,
                  color: 'rgba(255,255,255,0.55)',
                  mt: 0.25,
                }}
                noWrap
              >
                {tournament.name}
              </Typography>
            )}
          </Box>
          <IconButton
            onClick={handleClose}
            sx={{ color: 'rgba(255,255,255,0.7)' }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <Box sx={{ paddingInline: { xs: 2, md: 3 }, paddingTop: 2 }}>
          <Tabs
            value={statusFilter}
            onChange={(_, value) => {
              setStatusFilter(value as StatusFilter);
              setPage(0);
            }}
            sx={teamStyles.filterTabs}
            variant="scrollable"
            allowScrollButtonsMobile
          >
            {FILTER_OPTIONS.map((opt) => (
              <Tab key={opt.value} value={opt.value} label={opt.label} />
            ))}
          </Tabs>
        </Box>

        <Box
          sx={{
            paddingInline: { xs: 2, md: 3 },
            py: 2,
            ...teamStyles.scrollArea,
            flex: 1,
          }}
        >
          {isError ? (
            <Alert severity="error">
              {(error as Error)?.message ?? 'Falha ao carregar equipes.'}
            </Alert>
          ) : (
            <Stack spacing={1.25}>
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton
                    key={`team-skel-${i}`}
                    variant="rounded"
                    height={84}
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.05)',
                      borderRadius: 1.5,
                    }}
                  />
                ))
              ) : teams.length === 0 ? (
                <Box sx={teamStyles.emptyState}>
                  Nenhuma equipe encontrada
                  {statusFilter === 'ALL' ? '' : ' para esse filtro'}.
                </Box>
              ) : (
                teams.map((team) => (
                  <TeamAccordionItem
                    key={team.id}
                    team={team}
                    tournamentId={tournamentId}
                    onBanClick={setBanTarget}
                  />
                ))
              )}
            </Stack>
          )}
        </Box>

        {!isError && (data?.totalElements ?? 0) > 0 && (
          <TablePagination
            component="div"
            count={data?.totalElements ?? 0}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            rowsPerPage={pageSize}
            onRowsPerPageChange={(e) => {
              setPageSize(parseInt(e.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={[10, 20, 50]}
            labelRowsPerPage="Por página:"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}–${to} de ${count}`
            }
            sx={tournamentStyles.paginationContainer}
          />
        )}
      </Dialog>

      <BanTeamDialog
        open={banTarget != null}
        tournamentId={tournamentId}
        teamId={banTarget?.id ?? null}
        teamName={banTarget?.name ?? null}
        onClose={() => setBanTarget(null)}
        onSuccess={(name) =>
          setFeedback({
            open: true,
            message: `Equipe "${name}" banida com sucesso.`,
          })
        }
      />

      <Snackbar
        open={feedback.open}
        autoHideDuration={4000}
        onClose={() => setFeedback((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity="success"
          onClose={() => setFeedback((s) => ({ ...s, open: false }))}
        >
          {feedback.message}
        </Alert>
      </Snackbar>
    </>
  );
}
