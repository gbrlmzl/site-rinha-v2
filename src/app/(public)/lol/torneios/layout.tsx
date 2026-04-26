import { ReactNode } from 'react';

interface TorneiosLayoutProps {
  children: ReactNode;
  modal: ReactNode;
}

export default function TorneiosLayout({ children, modal }: TorneiosLayoutProps) {
  return (
    <>
      {children}
      {modal}
    </>
  );
}
