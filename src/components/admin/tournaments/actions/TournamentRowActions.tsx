'use client';

import { Box, IconButton, Tooltip } from '@mui/material';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import BlockIcon from '@mui/icons-material/Block';
import Link from 'next/link';
import { tournamentStyles } from '@/components/admin/tournaments/tournamentStyles';

interface TournamentRowActionsProps {
  tournamentId: number;
  /** Total histórico. 0 → ícone lixeira (delete); >0 → ícone bloquear (cancel). */
  totalTeamsCount: number;
  /** Se já está cancelado, desabilita o botão. */
  isCanceled?: boolean;
  onCancelClick: (tournamentId: number) => void;
}

export default function TournamentRowActions({
  tournamentId,
  totalTeamsCount,
  isCanceled = false,
  onCancelClick,
}: TournamentRowActionsProps) {
  const stop = (e: React.MouseEvent) => e.stopPropagation();
  const isDeleteFlow = totalTeamsCount === 0;

  return (
    <Box sx={tournamentStyles.rowActionsContainer} onClick={stop}>
      <Tooltip title="Gerenciar equipes">
        <IconButton
          component={Link}
          href={`/admin/torneios/${tournamentId}/equipes`}
          size="small"
          sx={tournamentStyles.iconAction}
        >
          <PeopleAltOutlinedIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Tooltip title="Ver pagamentos">
        <IconButton
          component={Link}
          href={`/admin/torneios/${tournamentId}/pagamentos`}
          size="small"
          sx={tournamentStyles.iconAction}
        >
          <ReceiptLongOutlinedIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Tooltip title="Editar">
        <IconButton
          component={Link}
          href={`/admin/torneios/${tournamentId}/editar`}
          size="small"
          sx={tournamentStyles.iconAction}
        >
          <EditOutlinedIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Tooltip
        title={
          isCanceled
            ? 'Torneio já cancelado'
            : isDeleteFlow
            ? 'Excluir torneio'
            : 'Cancelar torneio'
        }
      >
        <span>
          <IconButton
            size="small"
            disabled={isCanceled}
            onClick={() => onCancelClick(tournamentId)}
            sx={
              isCanceled
                ? tournamentStyles.iconActionDisabled
                : tournamentStyles.iconActionDanger
            }
          >
            {isDeleteFlow ? (
              <DeleteOutlineIcon fontSize="small" />
            ) : (
              <BlockIcon fontSize="small" />
            )}
          </IconButton>
        </span>
      </Tooltip>
    </Box>
  );
}
