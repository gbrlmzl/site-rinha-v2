import TournamentDetailPage from '@/components/lol/tournaments/detail/TournamentDetailPage';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function TournamentDetailRoute({ params }: Props) {
  const { slug } = await params;
  return <TournamentDetailPage slug={slug} />;
}
