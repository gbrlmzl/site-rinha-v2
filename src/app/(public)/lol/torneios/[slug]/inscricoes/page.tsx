import PaymentModal from '@/components/lol/tournaments/PaymentModal';
import { extractIdFromSlug } from '@/utils/tournament-slug';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function InscricoesTorneioPage({ params }: Props) {
  const { slug } = await params;
  const torneioId = String(extractIdFromSlug(slug) ?? slug);

  return <PaymentModal torneioId={torneioId} />;
}
