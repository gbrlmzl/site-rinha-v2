'use client';

import { useEffect, useRef } from 'react';

export const TOURNAMENT_PAYMENT_APPROVED_EVENT = 'tournament-payment-approved';

export function useTournamentPaymentApproved(callback: () => void) {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const handler = () => callbackRef.current();
    window.addEventListener(TOURNAMENT_PAYMENT_APPROVED_EVENT, handler);
    return () => {
      window.removeEventListener(TOURNAMENT_PAYMENT_APPROVED_EVENT, handler);
    };
  }, []);
}
