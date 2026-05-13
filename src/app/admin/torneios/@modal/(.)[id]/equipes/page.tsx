import TeamsManagementDialog from '@/components/admin/tournaments/teams/TeamsManagementDialog';

interface TeamsModalParams {
  params: Promise<{ id: string }>;
}

export default async function TeamsModalIntercept({ params }: TeamsModalParams) {
  const { id } = await params;
  const tournamentId = Number(id);
  if (Number.isNaN(tournamentId)) return null;
  return <TeamsManagementDialog tournamentId={tournamentId} />;
}
