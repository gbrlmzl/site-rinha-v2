import { NextRequest, NextResponse } from 'next/server';

const authRoutes = ['/login', '/cadastro', '/recuperar-senha'];

const protectedRoutePrefixes = ['/perfil', '/torneios/me', '/admin'];

function isTournamentRegistrationRoute(pathname: string): boolean {
  return /^\/lol\/torneios\/[^/]+\/inscricoes(?:\/.*)?$/.test(pathname);
}

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  //  Redirecionamento da raiz
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/inicio', request.url));
  }

  const hasJwt = request.cookies.has('JWT');

  const isAuthRoute = authRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  const isProtectedRoute =
    protectedRoutePrefixes.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`)
    ) || isTournamentRegistrationRoute(pathname);

  //  Usuário logado tentando acessar login/cadastro → manda pra home
  if (hasJwt && isAuthRoute) {
    return NextResponse.redirect(new URL('/inicio', request.url));
  }

  //  Usuário NÃO logado tentando acessar rota protegida → manda pra login
  if (!hasJwt && isProtectedRoute) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/admin/:path*',
    '/login',
    '/cadastro',
    '/recuperar-senha',
    '/nova-senha/:path*',
    '/perfil/:path*',
    '/lol/torneios/:path*/inscricoes/:path*',
    '/torneios/me/:path*',
  ],
};