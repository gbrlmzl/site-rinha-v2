let isRefreshing = false;

async function tryRefresh(): Promise<boolean> {
  if (isRefreshing) return false;
  isRefreshing = true;

  try {
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      credentials: 'include',
      cache: 'no-store',
    });
    return response.ok;
  } catch {
    return false;
  } finally {
    isRefreshing = false;
  }
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