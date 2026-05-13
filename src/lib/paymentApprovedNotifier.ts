/**
 * Notificador module-level para aprovações de pagamento de torneio.
 *
 * Substitui o uso de `window.dispatchEvent` + `addEventListener` (que perde
 * eventos quando o listener não está montado no instante da emissão).
 *
 * Mantém um timestamp da última aprovação. Componentes, ao montar, comparam
 * o timestamp com o que viram por último — se houve aprovação enquanto
 * estavam desmontados, podem se atualizar mesmo assim.
 */

type Listener = () => void;

let lastApprovedAt: number | null = null;
const listeners = new Set<Listener>();

export const paymentApprovedNotifier = {
  /** Notifica todos os listeners ativos e grava o timestamp do evento. */
  notify(): void {
    lastApprovedAt = Date.now();
    listeners.forEach((l) => l());
  },

  /** Registra um listener. Retorna a função de cleanup. */
  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },

  /** Timestamp da última aprovação observada, ou null se nunca houve. */
  getLastApprovedAt(): number | null {
    return lastApprovedAt;
  },
};
