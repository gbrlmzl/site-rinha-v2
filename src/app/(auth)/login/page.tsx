import LoginForm from './LoginForm';
import { redirect } from 'next/navigation';


export default async function LoginPage() {

  // Aqui você pode verificar se o usuário já está autenticado, por exemplo, verificando um cookie ou token

  return (
    <div>
      <LoginForm />  
    </div>
        
  );
}