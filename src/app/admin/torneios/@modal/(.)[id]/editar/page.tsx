import TournamentFormModal from '@/components/admin/tournaments/form/TournamentFormModal';

interface EditModalParams {
  params: Promise<{ id: string }>;
}

export default async function EditTournamentModalIntercept({
  params,
}: EditModalParams) {
  const { id } = await params;
  const tournamentId = Number(id);
  if (Number.isNaN(tournamentId)) return null;
  return <TournamentFormModal mode="edit" tournamentId={tournamentId} />;
}
