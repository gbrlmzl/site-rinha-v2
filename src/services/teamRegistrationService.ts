/**
 * Serviço de integração com APIs externas
 * - Upload de escudo para Imgur
 * - Envio de inscrição
 * - WebSocket listener para pagamento PIX
 */

import { PaymentStatusMessage, PaymentResponse } from '@/types/teamRegistration';
import { API_ENDPOINTS, PAYMENT_STATUS } from '@/hooks/lol/teamRegistration/constants';

// ─── Upload Shield to Imgur ────────────────────────────────────────────────

export async function uploadShieldToImgur(file: File, teamName: string): Promise<string> {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('title', teamName || 'Escudo');

  const response = await fetch(API_ENDPOINTS.UPLOAD_SHIELD, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erro ao fazer upload do escudo');
  }

  const data = await response.json();
  if (!data.link) {
    throw new Error('Resposta inválida do servidor de upload');
  }

  return data.link;
}

// ─── Submit Registration ───────────────────────────────────────────────────

export async function submitTeamRegistration(
  payload: any
): Promise<PaymentResponse> {
  const response = await fetch(API_ENDPOINTS.SUBMIT_REGISTRATION, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erro ao enviar inscrição');
  }

  const data = await response.json();

  if (!data.uuid || !data.qrCodeBase64 || !data.qrCode) {
    throw new Error('Resposta inválida: faltam dados de pagamento');
  }

  return {
    uuid: data.uuid,
    qrCode: data.qrCode,
    qrCodeBase64: `data:image/png;base64,${data.qrCodeBase64}`,
    valor: data.valor || 0,
  };
}

// ─── WebSocket: Payment Listener ───────────────────────────────────────────

interface WebSocketListenerOptions {
  onPaymentApproved?: () => void;
  onPaymentPending?: () => void;
  onError?: (error: Error) => void;
  onConnect?: () => void;
}

/**
 * Cria um listener WebSocket para monitorar status de pagamento PIX
 * Implementação dinâmica para evitar dependências obrigatórias em build time
 * @param uuidPagamento - UUID da transação PIX
 * @param options - Callbacks para diferentes eventos
 * @returns Função para desconectar
 */
export function setupPaymentWebSocketListener(
  uuidPagamento: string,
  options: WebSocketListenerOptions = {}
): () => void {
  const { onPaymentApproved, onPaymentPending, onError, onConnect } = options;

  // Tentativa de importação dinâmica de SockJS/STOMP
  // Em produção, essas bibliotecas devem estar instaladas
  const setupListener = async () => {
    try {
      // Verificar se as libs estão disponíveis
      // @ts-ignore - Dynamic imports podem não estar disponíveis em build
      const { Client } = await import('@stomp/stompjs');
      // @ts-ignore - Dynamic imports podem não estar disponíveis em build
      const SockJS = (await import('sockjs-client')).default;

      let client: any = null;
      let unsubscribeFn: (() => void) | null = null;

      try {
        const socket = new SockJS(API_ENDPOINTS.WEBSOCKET_URL);

        client = new Client({
          webSocketFactory: () => socket,
          reconnectDelay: 5000,
          debug: (msg: string) => {
            // console.log('WebSocket Debug:', msg);
          },
          onConnect: (frame: any) => {
            // Inscrever no tópico específico de pagamento
            unsubscribeFn = client.subscribe(
              `/topic/pagamentos/${uuidPagamento}`,
              (message: any) => {
                try {
                  const body: PaymentStatusMessage = JSON.parse(message.body);

                  if (body.status === PAYMENT_STATUS.APPROVED) {
                    onPaymentApproved?.();
                  } else if (body.status === PAYMENT_STATUS.PENDING) {
                    onPaymentPending?.();
                  }
                } catch (err) {
                  onError?.(
                    new Error(
                      `Erro ao processar mensagem de pagamento: ${err}`
                    )
                  );
                }
              }
            );

            onConnect?.();
          },
          onStompError: (frame: any) => {
            onError?.(
              new Error(`WebSocket STOMP Error: ${frame.body}`)
            );
          },
          onWebSocketError: (event: Event) => {
            onError?.(
              new Error('Erro na conexão WebSocket')
            );
          },
        });

        client.activate();

        // Retornar função de cleanup
        return () => {
          if (unsubscribeFn) {
            unsubscribeFn();
          }
          if (client) {
            client.deactivate();
          }
        };
      } catch (err) {
        onError?.(
          new Error(
            err instanceof Error
              ? err.message
              : 'Erro ao conectar ao WebSocket'
          )
        );
        return () => {}; // Return dummy cleanup function
      }
    } catch (importErr) {
      // Se as libs não estão instaladas, avisar mas não falhar
      console.warn(
        'Bibliotecas @stomp/stompjs ou sockjs-client não estão instaladas. WebSocket de pagamento desabilitado.'
      );
      return () => {}; // Return dummy cleanup function
    }
  };

  // Chamar assincronamente (não vai bloquear)
  setupListener().catch((err) => {
    console.error('Erro ao setup WebSocket listener:', err);
  });

  // Retornar função dummy de cleanup
  return () => {};
}

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
