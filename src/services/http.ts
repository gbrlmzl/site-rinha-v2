const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? '';

export function buildApiUrl(
  path: string,
  params: Record<string, string | undefined> = {}
): string {
  const url = new URL(`${BASE_URL}${path}`);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '') {
      url.searchParams.set(key, value);
    }
  }
  return url.toString();
}

export async function parseOrThrow<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    const error = new Error(body?.message ?? body?.error ?? `HTTP ${response.status}`);
    (error as Error & { status?: number }).status = response.status;
    throw error;
  }
  return response.json() as Promise<T>;
}
