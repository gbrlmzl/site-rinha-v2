
import { TeamRegistrationWizard } from '@/components/lol/teamRegistration/TeamRegistrationWizard';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function Inscricoes({ params }: Props) {
  const { slug } = await params;
  return <TeamRegistrationWizard slug={slug} />;
}
