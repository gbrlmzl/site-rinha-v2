let isRefreshing = false; // flag para evitar múltiplos refreshes simultâneos

async function tryRefresh(): Promise<boolean> {
  if (isRefreshing) return false;
  isRefreshing = true;

  try {
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      credentials: 'include',
    });
    return response.ok;
  } catch (error) {
    
    return false;
  } finally {
    isRefreshing = false;
  }
}

// Substitui o fetch nativo em todo o projeto
export async function apiFetch(input: RequestInfo, init?: RequestInit): Promise<Response> {
  const response = await fetch(input, { ...init, credentials: 'include' });

  // Intercepta 401 — tenta renovar silenciosamente
  if (response.status === 401) {
    const body = await response.clone().json().catch(() => ({}));
    

    // Tenta refresh (independente da mensagem de erro)
    const refreshed = await tryRefresh();

    if (refreshed) {
      // Repete a requisição original com o novo cookie
      return fetch(input, { ...init, credentials: 'include' });
    }

    // Refresh falhou — redireciona para login
    window.location.href = '/login';
  }

  return response;
}