import TournamentFormModal from '@/components/admin/tournaments/form/TournamentFormModal';

interface EditPageParams {
  params: Promise<{ id: string }>;
}

export default async function EditTournamentPage({ params }: EditPageParams) {
  const { id } = await params;
  const tournamentId = Number(id);
  if (Number.isNaN(tournamentId)) return null;
  return <TournamentFormModal mode="edit" tournamentId={tournamentId} />;
}
