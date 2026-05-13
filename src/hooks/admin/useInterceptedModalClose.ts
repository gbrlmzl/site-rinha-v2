'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Fecha modais que vivem em rotas interceptadas do App Router.
 *
 * `router.back()` é o caminho canônico — `router.push()` para a mesma rota base
 * não desmonta o slot @modal de forma confiável. O fallback `push(fallback)`
 * cobre o caso de o modal ter sido aberto via deep-link (history vazio).
 */
export function useInterceptedModalClose(fallbackPath: string) {
  const router = useRouter();
  return useCallback(() => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push(fallbackPath);
    }
  }, [router, fallbackPath]);
}
