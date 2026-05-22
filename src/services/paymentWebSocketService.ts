// src/services/paymentWebSocketService.ts
import SockJS from 'sockjs-client';
import { Client, IMessage } from '@stomp/stompjs';

// SockJS usa HTTP(S) para handshake; o protocolo ws:// e gerenciado internamente.
// Em prod: NEXT_PUBLIC_WS_URL=https://rinhacampusiv.org (Cloudflare encaminha /ws pro back).
const WS_BASE = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:8080';
const WS_URL = `${WS_BASE}/ws`;

let stompClient: Client | null = null;

// Inicializa e conecta o cliente STOMP uma única vez
function getStompClient(): Promise<Client> {
  return new Promise((resolve, reject) => {
    if (stompClient?.connected) {
      resolve(stompClient);
      return;
    }

    const client = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      reconnectDelay: 5000,
      onConnect: () => resolve(client),
      onStompError: (frame) => reject(new Error(frame.body)),
    });

    client.activate();
    stompClient = client;
  });
}

// Inscreve no tópico do pagamento e retorna função de cleanup
export async function subscribeToPayment(
  uuid: string,
  onApproved: () => void
): Promise<() => void> {
  const client = await getStompClient();

  const subscription = client.subscribe(
    `/topic/payment/${uuid}`,
    (message: IMessage) => {
      const body = JSON.parse(message.body);
      if (body.status === 'APPROVED') {
        onApproved();
      }
    }
  );

  // Retorna função de cleanup para cancelar a inscrição
  return () => subscription.unsubscribe();
}

// Desconecta completamente o cliente
export function disconnectWebSocket(): void {
  stompClient?.deactivate();
  stompClient = null;
}
