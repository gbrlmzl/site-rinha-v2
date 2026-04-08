// src/app/api/auth/refresh/route.ts
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  const cookieStore = await cookies();
  const refresh = cookieStore.get('REFRESH');

  if (!refresh) {
    const response = NextResponse.json({ error: 'no_refresh_token' }, { status: 401 });
    response.cookies.delete('JWT');
    response.cookies.delete('REFRESH');
    return response;
  }

  const response = await fetch('http://localhost:8080/auth/refresh', {
    method: 'POST',
    headers: { Cookie: `REFRESH=${refresh.value}` },
    cache: 'no-store',
  });

  if (!response.ok) {
    const failedResponse = NextResponse.json({ error: 'refresh_failed' }, { status: 401 });
    failedResponse.cookies.delete('JWT');
    failedResponse.cookies.delete('REFRESH');
    return failedResponse;
  }

  const setCookie = response.headers.get('set-cookie');
  
  
  const nextResponse = NextResponse.json({ status: 'ok' });

  if (setCookie) {
    const jwtMatch = setCookie.match(/JWT=([^;]+)/);
    
    
    if (jwtMatch) {
      nextResponse.cookies.set('JWT', jwtMatch[1], {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 15 * 60,
      });
      
    }
  } else {
    console.log('[REFRESH] Nenhum Set-Cookie recebido do backend');
  }

  return nextResponse;
}