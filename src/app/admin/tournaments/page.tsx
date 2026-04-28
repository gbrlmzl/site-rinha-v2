import { Box } from '@mui/material';
import AdminPageHeader from '@/components/admin/shell/AdminPageHeader';
import TournamentsListClient from '@/components/admin/tournaments/TournamentsListClient';
import { ADMIN_TOKENS } from '@/theme';

export default function TournamentsListPage() {
  return (
    <Box>
      <AdminPageHeader
        title="Gerenciar Torneios"
        subtitle="Controle total das competições, pagamentos e equipes."
      />
      <Box sx={ADMIN_TOKENS.sx.panelSection}>
        <TournamentsListClient />
      </Box>
    </Box>
  );
}
