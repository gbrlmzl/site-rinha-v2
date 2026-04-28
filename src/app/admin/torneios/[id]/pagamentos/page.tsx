import PaymentsReportDialog from '@/components/admin/tournaments/payments/PaymentsReportDialog';

interface PaymentsPageParams {
  params: Promise<{ id: string }>;
}

export default async function PaymentsPage({ params }: PaymentsPageParams) {
  const { id } = await params;
  const tournamentId = Number(id);
  if (Number.isNaN(tournamentId)) return null;
  return <PaymentsReportDialog tournamentId={tournamentId} />;
}
