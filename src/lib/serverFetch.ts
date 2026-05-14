import { cookies } from 'next/headers';
import { internalApiUrl } from '@/lib/internalApi';

/**
 * Fetch helper para Server Components que precisam consumir a API autenticada.
 * Encaminha o cookie do request atual e desliga cache (dado dinâmico).
 *
 * Uso típico: páginas que pré-carregam dados antes de hidratar React Query.
 */
export async function serverFetch(
  path: string,
  init: RequestInit = {}
): Promise<Response> {
  const cookieHeader = (await cookies()).toString();

  const headers = new Headers(init.headers);
  if (cookieHeader) headers.set('cookie', cookieHeader);

  return fetch(internalApiUrl(path), {
    ...init,
    headers,
    cache: 'no-store',
  });
}
