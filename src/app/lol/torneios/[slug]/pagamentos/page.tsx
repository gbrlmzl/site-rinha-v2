import PagamentosRedirect from './PagamentosRedirect';

interface Props {
  params: Promise<{ slug: string }>;
}

/**
 * Fallback route for /lol/torneios/[slug]/pagamentos.
 *
 * Required by Next.js so that:
 *   1. Soft navigation's RSC payload fetch resolves successfully, allowing
 *      the intercepting route at `@modal/(.)[slug]/pagamentos` to render
 *      the PaymentModal over the previous page.
 *   2. Hard refresh / direct URL access has somewhere to land.
 *
 * On hard refresh the children slot mounts <PagamentosRedirect/>, which
 * client-side replaces the URL with /inscricoes — the semantically correct
 * URL for the registration / payment flow. The wizard there already detects
 * PENDING_PAYMENT and jumps to the payment step.
 *
 * We intentionally avoid server-side `redirect()` here: it would race the
 * parallel `@modal` slot during soft navigation and abort the interception.
 */
export default async function PagamentosFallbackPage({ params }: Props) {
  const { slug } = await params;
  return <PagamentosRedirect slug={slug} />;
}
