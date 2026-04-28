interface TeamsModalParams {
  params: Promise<{ id: string }>;
}

export default async function TeamsModalIntercept({ params }: TeamsModalParams) {
  const { id } = await params;
  // TODO: renderizar TeamsManagementDialog
  void id;
  return null;
}
