import dayjs from 'dayjs';

export function formatDateOnly(iso: string): string {
  return dayjs(iso).format('DD/MM/YYYY');
}

export function formatDateTime(iso: string): string {
  return dayjs(iso).format('DD/MM/YYYY, HH:mm');
}

export function formatPrize(amount: number): string {
  if (amount == null) return 'R$ 0';
  return amount.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  });
}
