// src/app/registro/page.tsx
import RegisterForm from "./RegisterForm";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/utils/auth";

export default async function PaginaRegistro() {
  const isUserAuthenticated = await isAuthenticated();

  if (isUserAuthenticated) {
    redirect('/'); // já autenticado, redireciona antes de renderizar qualquer coisa
  }

  return (
  <RegisterForm />
)
}