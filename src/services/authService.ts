import {User} from '@/types/User';

export async function getUser() : Promise<User | null> {
    try {
        console.log('Fetching user data from /auth/me');
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
            method: 'GET',
            credentials: 'include', // Incluir os cookies para autenticação
        });

        if (!response.ok) {
            return null; // Se a resposta não for OK, retornamos null para indicar que o usuário não está autenticado
        }

        const userData: User = await response.json();
        return userData;
    } catch (error) {
        console.error('Error fetching user data:', error);
        return null;
    }
}