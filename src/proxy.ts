import { NextRequest, NextResponse } from 'next/server';

const authRoutes = ['/login', '/cadastro', '/recuperar-senha'];

const protectedRoutePrefixes = ['/perfil', '/torneios/me', '/admin'];

function isTournamentRegistrationRoute(pathname: string): boolean {
  return /^\/lol\/torneios\/[^/]+\/inscricoes(?:\/.*)?$/.test(pathname);
}

async function tryRefreshJwt(
  request: NextRequest
): Promise<NextResponse | null> {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiBaseUrl) {
    return null;
  }

  try {
    const refreshResponse = await fetch(`${apiBaseUrl}/auth/refresh`, {
      method: 'POST',
      headers: {
        cookie: request.headers.get('cookie') ?? '',
      },
      cache: 'no-store',
    });

    if (!refreshResponse.ok) {
      return null;
    }

    const response = NextResponse.next();
    const setCookieHeader = refreshResponse.headers.get('set-cookie');

    if (setCookieHeader) {
      response.headers.set('set-cookie', setCookieHeader);
    }

    return response;
  } catch {
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if(pathname === '/') {
    const homeUrl = new URL('/inicio', request.url);
      return NextResponse.redirect(homeUrl);
  }


  const hasJwt = request.cookies.has('JWT');
  const hasRefresh = request.cookies.has('REFRESH');

  const isAuthRoute = authRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  const isProtectedRoute = protectedRoutePrefixes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  ) || isTournamentRegistrationRoute(pathname);

  // Para páginas de auth, só bloqueia se já houver JWT ativo.
  // Ter apenas REFRESH (possivelmente expirado) não deve impedir acesso ao login.

  if (hasJwt) {
    if (isAuthRoute) {
      const homeUrl = new URL('/inicio', request.url);
      return NextResponse.redirect(homeUrl);
    }

    return NextResponse.next();
  } else if (!hasJwt && hasRefresh) {
    const refreshedResponse = await tryRefreshJwt(request);
    if (refreshedResponse) {
      //chama refresh
      return refreshedResponse;
    }

    return NextResponse.next();
  } else if (!hasRefresh) {
    // Se não tem JWT nem REFRESH, bloqueia acesso às rotas protegidas e redireciona para login
  }

  if (isProtectedRoute) {
    if (hasRefresh) {
      const refreshedResponse = await tryRefreshJwt(request);

      if (refreshedResponse) {
        return refreshedResponse;
      }
    }

    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', `${pathname}${request.nextUrl.search}`);

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/admin/:subpath*',
    '/login',
    '/cadastro',
    '/recuperar-senha',
    '/nova-senha',
    '/nova-senha/:path*', 
    '/perfil',
    '/perfil/:path*',
    '/lol/torneios/:path*/inscricoes/',
    '/lol/torneios/:path*/inscricoes/:path*',
    '/torneios/me',
    '/torneios/me/:path*',
  ],
};
