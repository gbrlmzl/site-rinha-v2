/** Formatadores compartilhados pelo módulo de torneios. */

const PT_BR = 'pt-BR';

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(PT_BR, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString(PT_BR, {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** Data + hora numéricos curtos (ex.: "12/04 19:30") */
export function formatDateShort(iso: string): string {
  return new Date(iso).toLocaleString(PT_BR, {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** Data + hora completos (ex.: "12/04/2026 19:30") */
export function formatDateLong(iso: string): string {
  return new Date(iso).toLocaleString(PT_BR, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** Mês por extenso curto (ex.: "12 de abril") */
export function formatDateMonth(iso: string): string {
  return new Date(iso).toLocaleDateString(PT_BR, {
    day: '2-digit',
    month: 'long',
  });
}

export function formatPrize(value: number): string {
  return `R$ ${value.toLocaleString(PT_BR, { minimumFractionDigits: 0 })}`;
}

export function formatCurrency(value: number, fractionDigits = 2): string {
  return `R$ ${value
    .toFixed(fractionDigits)
    .replace('.', ',')}`;
}
