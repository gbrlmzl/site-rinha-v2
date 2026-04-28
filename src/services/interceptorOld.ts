
let refreshPromise: Promise<boolean> | null = null; //Cachea uma Promise de refresh em andamento para evitar múltiplas requisições concorrentes de renovação do token.

let refreshFailed = false; //Flag que impede novas tentativas de refresh depois de uma falha persistente.

const refreshUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`; 

let redirectingToLogin = false; //evita redirecionamentos repetidos para a tela de login.


//lista de rotas públicas (login/cadastro/recuperar senha/ativação) que não devem provocar redirect para login.
const publicAuthPaths = [
  '/login',
  '/cadastro',
  '/recuperar-senha',
  '/nova-senha',
  '/ativar-conta',
  '/reenviar-ativacao',
];

/**
 * verifica se a rota atual (em runtime no browser) não está na lista publicAuthPaths
 * @returns boolean
 */
function shouldRedirectToLogin() { 
  if (typeof window === 'undefined') return false;

  const currentPath = window.location.pathname;
  return !publicAuthPaths.some((path) => currentPath.startsWith(path));
}
/**
 * dispara window.location.replace('/login') apenas se shouldRedirectToLogin() for true e ainda não houver outro redirecionamento em andamento — protege contra múltiplos redirects.
 *
 */
function redirectToLoginOnce() {
  if (!shouldRedirectToLogin() || redirectingToLogin) return;

  redirectingToLogin = true;
  window.location.replace('/login');
}


async function tryRefresh(): Promise<boolean> {
  if (refreshFailed) return false;
  if (refreshPromise) return refreshPromise;

  refreshPromise = ( async () => {
    try {
      const response = await fetch(refreshUrl, {
        method: 'POST',
        credentials: 'include',
        cache: 'no-store',
      });

      if (!response.ok) {
        refreshFailed = true;
        setTimeout(() => { refreshFailed = false; }, 30_000); // tenta de novo em 30s
        return false;
      }

      return true;
    } catch {
      refreshFailed = true;
      setTimeout(() => { refreshFailed = false; }, 30_000); // tenta de novo em 30s
      return false;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

/**
 * Wrapper para fetch com comportamento de interceptação:
 * @param input 
 * @param init 
 * @returns Promise<Response> 
 *
 * prepara Headers e define Content-Type: application/json automaticamente, exceto quando o corpo é FormData (para não quebrar boundary);
 * inclui credentials para enviar cookies de autenticação;
 * intercepta respostas 401 para tentar renovar o token silenciosamente e repetir a requisição original;
 * se a renovação falhar ou o erro for token inválido, redireciona para login (com proteção contra múltiplos redirects e exceção para rotas públicas de auth).
 * retorna a resposta original ou a resposta da requisição repetida após refresh, conforme o caso.
 * 
 **/
export async function apiFetch(
  input: RequestInfo,
  init?: RequestInit
): Promise<Response> {
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

    const body = await response
      .clone()
      .json()
      .catch(() => ({}));

    // Só tenta refresh se o erro for token expirado ou genérico
    // token_invalid não adianta tentar refresh
    if (body.error === 'token_invalid') {
      //window.location.href = '/login';
      return response;
    }

    const refreshed = await tryRefresh();

    if (refreshed) {
      // Repete com os mesmos headers corrigidos
      return fetch(input, { ...init, headers, credentials: 'include' });
    }

    redirectToLoginOnce();
  }

  return response;
}
