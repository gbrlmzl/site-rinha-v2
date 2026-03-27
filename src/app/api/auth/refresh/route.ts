// src/app/api/auth/refresh/route.ts
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  const cookieStore = await cookies();
  const refresh = cookieStore.get('REFRESH');

  if (!refresh) {
    return NextResponse.json({ error: 'no_refresh_token' }, { status: 401 });
  }

  const response = await fetch('http://localhost:8080/auth/refresh', {
    method: 'POST',
    headers: { Cookie: `REFRESH=${refresh.value}` },
    cache: 'no-store',
  });

  if (!response.ok) {
    return NextResponse.json({ error: 'refresh_failed' }, { status: 401 });
  }

  const setCookie = response.headers.get('set-cookie');
  console.log('[REFRESH] Set-Cookie header do backend:', setCookie);
  
  const nextResponse = NextResponse.json({ status: 'ok' });

  if (setCookie) {
    const jwtMatch = setCookie.match(/JWT=([^;]+)/);
    console.log('[REFRESH] JWT extraído do regex:', jwtMatch?.[1]);
    
    if (jwtMatch) {
      nextResponse.cookies.set('JWT', jwtMatch[1], {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 15 * 60,
      });
      console.log('[REFRESH] JWT setado no NextResponse:', jwtMatch[1]);
    }
  } else {
    console.log('[REFRESH] Nenhum Set-Cookie recebido do backend');
  }

  return nextResponse;
}