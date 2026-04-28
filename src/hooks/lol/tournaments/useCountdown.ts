'use client';

import { useEffect, useState } from 'react';

const PLACEHOLDER = '--:--:--';
const EXPIRED = '00:00:00';

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

function calculateTime(expiresAt: string | null | undefined): string {
  if (!expiresAt) return PLACEHOLDER;
  const target = new Date(expiresAt).getTime();
  if (Number.isNaN(target)) return PLACEHOLDER;

  const diff = target - Date.now();
  if (diff <= 0) return EXPIRED;

  const h = Math.floor(diff / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  const s = Math.floor((diff % 60_000) / 1_000);
  
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

export function useCountdown(expiresAt: string | null | undefined): string {

  const [, setTick] = useState(0);

  useEffect(() => {
    if (!expiresAt) return;

    const id = setInterval(() => {
      setTick(t => t + 1); 
    }, 1000);

    return () => clearInterval(id);
  }, [expiresAt]);

  return calculateTime(expiresAt);
}