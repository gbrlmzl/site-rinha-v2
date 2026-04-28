export type PaymentStatus = 'PENDING' | 'APPROVED' | 'CANCELED';

export type PaymentStatusDetail =
  | 'WAITING_TRANSFER'
  | 'ACCREDITED'
  | 'EXPIRED'
  | 'CANCELED_BY_USER'
  | 'CANCELED_BY_ADMIN';

export type PaymentEventType =
  | 'PAYMENT_GENERATED'
  | 'PROCESSED'
  | 'IGNORED'
  | 'ERROR'
  | 'EXPIRED_BY_JOB'
  | 'CANCELED_BY_USER'
  | 'CANCELED_BY_ADMIN';

/** Espelha PaymentEventResponseData do back — eventos brutos do MP por pagamento. */
export interface AdminPaymentEvent {
  id: number;
  mercadoPagoId: string | null;
  eventType: PaymentEventType;
  statusFromMp: string | null;
  statusDetailFromMp: string | null;
  errorMessage: string | null;
  receivedAt: string;
}

/** Espelha PaymentEventData do back. */
export interface AdminPaymentSummary {
  paymentId: number;
  mercadoPagoId: string | null;
  uuid: string | null;
  teamName: string;
  captainUsername: string;
  value: number;
  status: PaymentStatus;
  statusDetail: PaymentStatusDetail | null;
  createdAt: string;
  expiresAt: string | null;
  paidAt: string | null;
  payer: string | null;
  lastEventType: PaymentEventType | null;
}
