const BASE_URL = '/api';

export function buildApiUrl(
  path: string,
  params: Record<string, string | undefined> = {}
): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '') {
      search.set(key, value);
    }
  }
  const qs = search.toString();
  return qs ? `${BASE_URL}${path}?${qs}` : `${BASE_URL}${path}`;
}

export async function parseOrThrow<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    const error = new Error(body?.message ?? body?.error ?? `HTTP ${response.status}`);
    (error as Error & { status?: number }).status = response.status;
    throw error;
  }
  if (response.status === 204 || response.headers.get('content-length') === '0') {
    return undefined as T;
  }
  const text = await response.text();
  return (text ? JSON.parse(text) : undefined) as T;
}
