import PaymentModal from '@/components/lol/tournaments/PaymentModal';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function InterceptedPaymentPage({ params }: Props) {
  const { slug } = await params;
  return <PaymentModal torneioId={slug} />;
}
