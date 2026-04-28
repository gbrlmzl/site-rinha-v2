interface EditModalParams {
  params: Promise<{ id: string }>;
}

export default async function EditTournamentModalIntercept({
  params,
}: EditModalParams) {
  const { id } = await params;
  // TODO: renderizar TournamentFormModal em modo "edit" com id
  void id;
  return null;
}
