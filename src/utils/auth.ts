import { cookies } from 'next/headers';

/*export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get('JWT'); // mesmo nome do cookie que o Spring seta

  return !!token;
}*/

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const jwt = cookieStore.get('JWT');
  const refresh = cookieStore.get('REFRESH');
  
 console.log('[Auth Check] JWT:', jwt?.value);
 console.log('[Auth Check] REFRESH:', refresh?.value);

  return !!jwt || !!refresh; // o layout trata o caso de só ter refresh
}

export async function existsJWT(): Promise<boolean> {
  const cookieStore = await cookies();
  const jwt = cookieStore.get('JWT');
  return !!jwt;
}
