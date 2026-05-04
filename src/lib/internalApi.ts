/**
 * URL interna do back, usada apenas em codigo server-side
 * (Server Components, Server Actions, Route Handlers).
 *
 * - Em `npm run dev` na maquina: aponta pra http://localhost:8080 (back exposto pelo compose).
 * - No container do front em prod: deve ser definida pra http://backend:8080
 *   (DNS do compose), evitando ida-e-volta pelo Cloudflare.
 *
 * Codigo client-side NUNCA usa isto - usa caminhos relativos /api/... que
 * sao reescritos via `next.config.ts` ou roteados pelo Cloudflare Tunnel.
 */
export function internalApiUrl(path: string): string {
  const base = process.env.INTERNAL_API_URL ?? 'http://localhost:8080';
  return `${base}${path}`;
}
