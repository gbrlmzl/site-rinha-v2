// src/services/paymentWebSocketService.ts
import SockJS from 'sockjs-client';
import { Client, IMessage } from '@stomp/stompjs';

const WS_URL = 'http://localhost:8080/ws'; //Dominio da aplicação backend + endpoint do websocket

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