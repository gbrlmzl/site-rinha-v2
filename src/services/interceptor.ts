let refreshPromise: Promise<boolean> | null = null;
let refreshFailed = false;
const refreshUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`;

async function tryRefresh(): Promise<boolean> {
  if (refreshFailed) return false;
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      const response = await fetch(refreshUrl, {
        method: 'POST',
        credentials: 'include',
        cache: 'no-store',
      });

      if (!response.ok) {
        refreshFailed = true;
        return false;
      }

      return true;
    } catch {
      refreshFailed = true;
      return false;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

export async function apiFetch(input: RequestInfo, init?: RequestInit): Promise<Response> {

  // Monta os headers corretamente
  const headers = new Headers(init?.headers);

  // Só define JSON se NÃO for FormData — FormData precisa do boundary automático do browser
  if (!(init?.body instanceof FormData)) {
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
  }

  const response = await fetch(input, {
    ...init,
    headers,
    credentials: 'include',
  });

  // Intercepta 401 — tenta renovar silenciosamente
  if (response.status === 401) {
    const requestUrl = typeof input === 'string' ? input : input.url;
    if (requestUrl.includes('/auth/refresh')) {
      return response;
    }

    const body = await response.clone().json().catch(() => ({}));

    // Só tenta refresh se o erro for token expirado ou genérico
    // token_invalid não adianta tentar refresh
    if (body.error === 'token_invalid') {
      window.location.href = '/login';
      return response;
    }

    const refreshed = await tryRefresh();

    if (refreshed) {
      // Repete com os mesmos headers corrigidos
      return fetch(input, { ...init, headers, credentials: 'include' });
    }

    window.location.href = '/login';
  }

  return response;
}