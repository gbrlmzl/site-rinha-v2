import { cookies } from 'next/headers';

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get('JWT'); // mesmo nome do cookie que o Spring seta

  return !!token;
}