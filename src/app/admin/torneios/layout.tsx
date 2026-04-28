import { ReactNode } from 'react';

interface TournamentsLayoutProps {
  children: ReactNode;
  modal: ReactNode;
}

/**
 * Habilita o slot paralelo `@modal` para Intercepting Routes.
 * Modais ficam montados sobre a lista sem trocar de página, mas
 * com URL própria (deep-link, voltar do browser fecha o modal).
 */
export default function TournamentsLayout({
  children,
  modal,
}: TournamentsLayoutProps) {
  return (
    <>
      {children}
      {modal}
    </>
  );
}
