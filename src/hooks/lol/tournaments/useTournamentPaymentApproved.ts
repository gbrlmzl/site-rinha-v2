'use client';

import { useEffect, useRef } from 'react';

/**
 * Browser custom event emitted by `PaymentModal` whenever a PIX payment is
 * confirmed by the backend. Components that display tournament-related state
 * (lists, detail pages, badges) can subscribe to refresh themselves.
 *
 * Use the `useTournamentPaymentApproved` hook to consume it instead of
 * wiring `addEventListener` manually.
 */
export const TOURNAMENT_PAYMENT_APPROVED_EVENT = 'tournament-payment-approved';

/**
 * Subscribes to the global "payment approved" event for the lifetime of the
 * calling component, invoking `callback` every time it fires.
 *
 * The callback identity is captured via ref, so consumers don't need to
 * memoize it with `useCallback` to avoid re-subscribing on every render.
 */
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
