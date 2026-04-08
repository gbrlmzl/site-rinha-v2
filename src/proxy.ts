import { NextRequest, NextResponse } from 'next/server';

const authRoutes = [
  '/login',
  '/cadastro',
  '/recuperar-senha',
  '/nova-senha'
];

const protectedRoutePrefixes = [
  '/perfil',
  '/lol/inscricoes',
  '/configuracoes',
];

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const hasJwt = request.cookies.has('JWT');
  const hasRefresh = request.cookies.has('REFRESH');

  const isAuthRoute = authRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
  
  const isProtectedRoute = protectedRoutePrefixes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // Para páginas de auth, só bloqueia se já houver JWT ativo.
  // Ter apenas REFRESH (possivelmente expirado) não deve impedir acesso ao login.
  if (hasJwt) {
    if (isAuthRoute) {
      const homeUrl = new URL('/', request.url);
      return NextResponse.redirect(homeUrl);
    }

    return NextResponse.next();
  }

  if (isProtectedRoute) {
    if (hasRefresh) {
      // Permite entrar e deixar o silent refresh tentar renovar o JWT.
      return NextResponse.next();
    }

    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', `${pathname}${request.nextUrl.search}`);

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/login',
    '/cadastro',
    '/recuperar-senha',
    '/nova-senha',
    '/nova-senha/:path*',
    '/perfil',
    '/perfil/:path*',
    '/lol/inscricoes',
    '/lol/inscricoes/:path*',
    '/configuracoes',
    '/configuracoes/:path*',
  ],
};
