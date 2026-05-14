'use client';

import { useEffect, useRef } from 'react';
import { paymentApprovedNotifier } from '@/lib/paymentApprovedNotifier';

/**
 * Reage a aprovações de pagamento de torneios.
 *
 * Cobre dois cenários:
 *   1. Aprovação chega enquanto o componente está montado — callback dispara via subscribe.
 *   2. Aprovação chegou enquanto o componente estava desmontado (ex: durante navegação) —
 *      no remount, compara o timestamp do notifier com o último visto; se mudou, dispara.
 */
export function useTournamentPaymentApproved(callback: () => void) {
  const callbackRef = useRef(callback);
  const lastSeenRef = useRef<number | null>(
    paymentApprovedNotifier.getLastApprovedAt()
  );

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    // 1) Replay: aprovação enquanto o componente estava desmontado
    const last = paymentApprovedNotifier.getLastApprovedAt();
    if (last !== null && last !== lastSeenRef.current) {
      lastSeenRef.current = last;
      callbackRef.current();
    }

    // 2) Subscribe para futuras aprovações
    return paymentApprovedNotifier.subscribe(() => {
      lastSeenRef.current = paymentApprovedNotifier.getLastApprovedAt();
      callbackRef.current();
    });
  }, []);
}
