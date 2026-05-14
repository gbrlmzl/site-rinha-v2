'use client';

import {
  Box,
  Button,
  InputAdornment,
  MenuItem,
  TextField,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import Link from 'next/link';
import { ADMIN_TOKENS } from '@/components/admin/adminTheme';
import { tournamentStyles } from '@/components/admin/tournaments/tournamentStyles';
import type { GameType } from '@/types/admin/tournament';

const GAME_OPTIONS: ReadonlyArray<{ value: GameType | ''; label: string }> = [
  { value: '', label: 'Todos os jogos' },
  { value: 'LEAGUE_OF_LEGENDS', label: 'League of Legends' },
  { value: 'VALORANT', label: 'Valorant' },
  { value: 'COUNTER_STRIKE', label: 'Counter Strike' },
];

export const SORT_OPTIONS = [
  { value: 'createdAt,desc', label: 'Mais recentes' },
  { value: 'createdAt,asc', label: 'Mais antigos' },
  { value: 'startsAt,asc', label: 'Próximos a iniciar' },
] as const;

export type TournamentsSort = (typeof SORT_OPTIONS)[number]['value'];

interface TournamentsToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  game: GameType | '';
  onGameChange: (value: GameType | '') => void;
  sort: TournamentsSort;
  onSortChange: (value: TournamentsSort) => void;
}

export default function TournamentsToolbar({
  search,
  onSearchChange,
  game,
  onGameChange,
  sort,
  onSortChange,
}: TournamentsToolbarProps) {
  return (
    <Box sx={ADMIN_TOKENS.sx.toolbar}>
      <TextField
        size="small"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Filtrar por nome..."
        sx={tournamentStyles.toolbarSearch}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'rgba(255,255,255,0.45)' }} />
              </InputAdornment>
            ),
          },
        }}
      />

      <TextField
        size="small"
        select
        value={game}
        onChange={(e) => onGameChange(e.target.value as GameType | '')}
        sx={tournamentStyles.toolbarSelect}
        slotProps={{
          select: {
            displayEmpty: true,
            renderValue: (selected) => {
              const value = selected as GameType | '';
              const opt = GAME_OPTIONS.find((o) => o.value === value);
              return opt?.label ?? 'Todos os jogos';
            },
            MenuProps: { slotProps: { paper: { sx: tournamentStyles.selectMenuPaper } } },
          },
        }}
      >
        {GAME_OPTIONS.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        size="small"
        select
        value={sort}
        onChange={(e) => onSortChange(e.target.value as TournamentsSort)}
        sx={tournamentStyles.toolbarSelect}
        slotProps={{
          select: {
            MenuProps: { slotProps: { paper: { sx: tournamentStyles.selectMenuPaper } } },
          },
        }}
      >
        {SORT_OPTIONS.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
      </TextField>

      <Button
        component={Link}
        href="/admin/torneios/criar"
        startIcon={<AddIcon />}
        sx={ADMIN_TOKENS.sx.primaryCta}
      >
        Criar Novo Torneio
      </Button>
    </Box>
  );
}
