import RegisterForm from "./RegisterForm";
import { redirect } from "next/navigation";

export default async function paginaRegistro() {


    /*if () {
        return redirect('/'); //caso o usuário esteja logado, ele é redirecionado para a página inicial.
    }*/
    return (
        <div>
            <RegisterForm />
        </div>
        
    )

}