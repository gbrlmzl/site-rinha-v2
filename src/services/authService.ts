import {User} from '@/types/User';
import { apiFetch } from '@/services/interceptor';

export async function getUser() : Promise<User | null> {
  try {
    const response = await apiFetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
      method: 'GET',
      credentials: 'include',
    });


    if (response.ok) {
      return await response.json();
    }

    return null;
  } catch (error) {
    return null;
  }
}