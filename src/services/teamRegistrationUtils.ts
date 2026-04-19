// ─── Copy to Clipboard ────────────────────────────────────────────────────

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Erro ao copiar para clipboard:', err);
    return false;
  }
}

// ─── Format Payment Value ────────────────────────────────────────────────

export function formatPaymentValue(value: number): string {
  return `R$ ${(value / 100).toFixed(2).replace('.', ',')}`;
}

// ─── Format Time Remaining ──────────────────────────────────────────────

export function formatTimeRemaining(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}
