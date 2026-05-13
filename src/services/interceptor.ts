// ─────────────────────────────────────────────────────────────────────────────
// Estado do cliente — isolado em objeto para deixar claro que é client-only.
// Nunca acessado durante SSR (todas as funções que o usam fazem guard de window).
// ─────────────────────────────────────────────────────────────────────────────

type ClientAuthState = {
  /** Promise de refresh em andamento — evita múltiplas requisições concorrentes. */
  refreshPromise: Promise<boolean> | null;
  /** Timestamp da última falha de refresh. null = nunca falhou ou já resetou. */
  refreshFailedAt: number | null;
  /** Impede redirecionamentos repetidos para /login. */
  redirectingToLogin: boolean;
};

const authState: ClientAuthState = {
  refreshPromise: null,
  refreshFailedAt: null,
  redirectingToLogin: false,
};

/** Após esse intervalo, uma nova tentativa de refresh é permitida. */
const REFRESH_RETRY_COOLDOWN_MS = 30_000;

const REFRESH_URL = '/api/auth/refresh';

// ─────────────────────────────────────────────────────────────────────────────
// Rotas públicas de autenticação — não disparam redirect para /login
// ─────────────────────────────────────────────────────────────────────────────

const PUBLIC_AUTH_PATHS = [
  '/login',
  '/cadastro',
  '/recuperar-senha',
  '/nova-senha',
  '/ativar-conta',
  '/reenviar-ativacao',
  '/cs/torneios',
  '/lol/torneios',
  '/valorant/torneios',
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// Helpers internos
// ─────────────────────────────────────────────────────────────────────────────

/** Retorna true se a rota atual deve provocar redirect para /login. */
function shouldRedirectToLogin(): boolean {
  if (typeof window === 'undefined') return false;
  const currentPath = window.location.pathname;
  return !PUBLIC_AUTH_PATHS.some((path) => currentPath.startsWith(path));
}

/** Dispara redirect para /login uma única vez por sessão de navegação. */
function redirectToLoginOnce(): void {
  if (!shouldRedirectToLogin() || authState.redirectingToLogin) return;
  authState.redirectingToLogin = true;
  window.location.replace('/login');
}

/**
 * Retorna true se o refresh está em cooldown (falhou recentemente).
 * Reseta automaticamente após REFRESH_RETRY_COOLDOWN_MS.
 */
function isRefreshOnCooldown(): boolean {
  if (authState.refreshFailedAt === null) return false;
  const elapsed = Date.now() - authState.refreshFailedAt;
  if (elapsed >= REFRESH_RETRY_COOLDOWN_MS) {
    authState.refreshFailedAt = null; // cooldown expirou — permite nova tentativa
    return false;
  }
  return true;
}

// ─────────────────────────────────────────────────────────────────────────────
// Refresh de token
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Tenta renovar o access token via cookie.
 * Deduplica chamadas concorrentes: se já houver um refresh em andamento,
 * retorna a mesma Promise em vez de disparar uma nova requisição.
 */
async function tryRefresh(): Promise<boolean> {
  if (isRefreshOnCooldown()) return false;

  // Deduplica: reutiliza promise em andamento
  if (authState.refreshPromise) return authState.refreshPromise;

  authState.refreshPromise = (async () => {
    try {
      const response = await fetch(REFRESH_URL, {
        method: 'POST',
        credentials: 'include',
        cache: 'no-store',
      });

      if (!response.ok) {
        authState.refreshFailedAt = Date.now();
        return false;
      }

      return true;
    } catch {
      authState.refreshFailedAt = Date.now();
      return false;
    } finally {
      authState.refreshPromise = null;
    }
  })();

  return authState.refreshPromise;
}

// ─────────────────────────────────────────────────────────────────────────────
// apiFetch
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Wrapper para fetch com interceptação de autenticação.
 *
 * Comportamento:
 * - Define Content-Type: application/json automaticamente, exceto para FormData
 *   (para não quebrar o boundary multipart).
 * - Inclui credentials: 'include' para enviar cookies de autenticação.
 * - Em respostas 401, tenta renovar o token silenciosamente via tryRefresh()
 *   e repete a requisição original em caso de sucesso.
 * - Se o token for inválido (token_invalid) ou o refresh falhar,
 *   redireciona para /login — com proteção contra múltiplos redirects
 *   e exceção para rotas públicas de auth.
 */
export async function apiFetch(
  input: RequestInfo,
  init?: RequestInit,
): Promise<Response> {
  // ── Monta headers ────────────────────────────────────────────────────────
  const headers = new Headers(init?.headers);

  if (!(init?.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const requestInit: RequestInit = { ...init, headers, credentials: 'include' };

  // ── Requisição inicial ───────────────────────────────────────────────────
  const response = await fetch(input, requestInit);

  if (response.status !== 401) return response;

  // ── Interceptação 401 ────────────────────────────────────────────────────

  // Evita loop infinito se o próprio endpoint de refresh retornar 401
  const requestUrl = typeof input === 'string' ? input : input.url;
  if (requestUrl.includes('/auth/refresh')) return response;

  // Inspeciona o corpo do erro sem consumir o stream original
  const errorBody = await response
    .clone()
    .json()
    .catch(() => ({} as Record<string, unknown>));

  // token_invalid = credenciais corrompidas ou revogadas; refresh não ajuda
  if (errorBody?.error === 'token_invalid') {
    redirectToLoginOnce();
    return response;
  }

  // Tenta renovar silenciosamente
  const refreshed = await tryRefresh();

  if (!refreshed) {
    redirectToLoginOnce();
    return response;
  }

  // ── Retry com token renovado ─────────────────────────────────────────────
  // Chama apiFetch recursivamente para reaplicar toda a lógica de interceptação
  // (headers, credentials, eventual 401 no retry, etc.)
  return apiFetch(input, init);
}