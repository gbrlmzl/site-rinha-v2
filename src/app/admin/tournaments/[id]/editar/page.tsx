interface EditPageParams {
  params: Promise<{ id: string }>;
}

export default async function EditTournamentPage({ params }: EditPageParams) {
  const { id } = await params;
  // TODO: renderizar TournamentFormModal mode="edit" com id como página
  void id;
  return null;
}
