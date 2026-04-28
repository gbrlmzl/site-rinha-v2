'use client';

import { Box, IconButton, Tooltip } from '@mui/material';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Link from 'next/link';
import { tournamentStyles } from '@/components/admin/tournaments/tournamentStyles';

interface TournamentRowActionsProps {
  tournamentId: number;
  onCancelClick: (tournamentId: number) => void;
}

export default function TournamentRowActions({
  tournamentId,
  onCancelClick,
}: TournamentRowActionsProps) {
  const stop = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <Box sx={tournamentStyles.rowActionsContainer} onClick={stop}>
      <Tooltip title="Gerenciar equipes">
        <IconButton
          component={Link}
          href={`/admin/tournaments/${tournamentId}/equipes`}
          size="small"
          sx={tournamentStyles.iconAction}
        >
          <PeopleAltOutlinedIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Tooltip title="Ver pagamentos">
        <IconButton
          component={Link}
          href={`/admin/tournaments/${tournamentId}/pagamentos`}
          size="small"
          sx={tournamentStyles.iconAction}
        >
          <ReceiptLongOutlinedIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Tooltip title="Editar">
        <IconButton
          component={Link}
          href={`/admin/tournaments/${tournamentId}/editar`}
          size="small"
          sx={tournamentStyles.iconAction}
        >
          <EditOutlinedIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Tooltip title="Cancelar torneio">
        <IconButton
          size="small"
          onClick={() => onCancelClick(tournamentId)}
          sx={tournamentStyles.iconActionDanger}
        >
          <DeleteOutlineIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );
}
