interface TeamsPageParams {
  params: Promise<{ id: string }>;
}

export default async function TeamsPage({ params }: TeamsPageParams) {
  const { id } = await params;
  // TODO: renderizar TeamsManagementDialog como página
  void id;
  return null;
}
