interface PaymentsModalParams {
  params: Promise<{ id: string }>;
}

export default async function PaymentsModalIntercept({
  params,
}: PaymentsModalParams) {
  const { id } = await params;
  // TODO: renderizar PaymentsReportDialog
  void id;
  return null;
}
