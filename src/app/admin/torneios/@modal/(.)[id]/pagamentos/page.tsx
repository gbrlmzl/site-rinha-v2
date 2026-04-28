import PaymentsReportDialog from '@/components/admin/tournaments/payments/PaymentsReportDialog';

interface PaymentsModalParams {
  params: Promise<{ id: string }>;
}

export default async function PaymentsModalIntercept({
  params,
}: PaymentsModalParams) {
  const { id } = await params;
  const tournamentId = Number(id);
  if (Number.isNaN(tournamentId)) return null;
  return <PaymentsReportDialog tournamentId={tournamentId} />;
}
