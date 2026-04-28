interface PaymentsPageParams {
  params: Promise<{ id: string }>;
}

export default async function PaymentsPage({ params }: PaymentsPageParams) {
  const { id } = await params;
  // TODO: renderizar PaymentsReportDialog como página
  void id;
  return null;
}
