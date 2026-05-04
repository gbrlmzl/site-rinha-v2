import TeamsManagementDialog from '@/components/admin/tournaments/teams/TeamsManagementDialog';

interface TeamsPageParams {
  params: Promise<{ id: string }>;
}

export default async function TeamsPage({ params }: TeamsPageParams) {
  const { id } = await params;
  const tournamentId = Number(id);
  if (Number.isNaN(tournamentId)) return null;
  return <TeamsManagementDialog tournamentId={tournamentId} />;
}
