let isRefreshing = false; // flag para evitar múltiplos refreshes simultâneos

async function tryRefresh(): Promise<boolean> {
  if (isRefreshing) return false;
  isRefreshing = true;

  try {
    console.log('[INTERCEPTOR] Tentando refresh...');
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      credentials: 'include',
    });
    console.log('[INTERCEPTOR] Refresh response status:', response.status);
    return response.ok;
  } catch (error) {
    console.error('[INTERCEPTOR] Erro ao fazer refresh:', error);
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
    console.log('[INTERCEPTOR] Received 401 on:', input);
    
    const body = await response.clone().json().catch(() => ({}));
    console.log('[INTERCEPTOR] Response body:', body);

    // Tenta refresh (independente da mensagem de erro)
    const refreshed = await tryRefresh();

    if (refreshed) {
      console.log('[INTERCEPTOR] Refresh bem-sucedido, retentando requisição...');
      // Repete a requisição original com o novo cookie
      return fetch(input, { ...init, credentials: 'include' });
    }

    // Refresh falhou — redireciona para login
    console.log('[INTERCEPTOR] Refresh falhou, redirecionando para login');
    window.location.href = '/login';
  }

  return response;
}