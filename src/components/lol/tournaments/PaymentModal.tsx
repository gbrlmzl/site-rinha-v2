'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Card,
  CircularProgress,
  Dialog,
  DialogContent,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import Image from 'next/image';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { apiFetch } from '@/services/interceptor';
import { subscribeToPayment } from '@/services/paymentWebSocketService';
import {
  copyToClipboard,
  formatTimeRemaining,
} from '@/services/teamRegistrationUtils';
import {
  GeneratedPaymentData,
  RegisterStatusResponse,
} from '@/types/teamRegistration';
import qrCodeExpiredImage from '@/assets/imgs/lol/AmumuSad.jpg';
import { TOURNAMENT_PAYMENT_APPROVED_EVENT } from '@/hooks/lol/tournaments/useTournamentPaymentApproved';
import { LOL_TOURNAMENT_COLORS as C } from './tournamentsTheme';
import { formatCurrency } from '@/utils/tournaments/formatters';

interface PaymentModalProps {
  torneioId: string;
}

const APPROVED_GREEN = '#4caf50';
const QR_SIZE = 220;

export default function PaymentModal({ torneioId }: PaymentModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState<GeneratedPaymentData | null>(
    null
  );
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [paymentApproved, setPaymentApproved] = useState(false);
  const [copied, setCopied] = useState(false);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await apiFetch(
          `http://localhost:8080/tournaments/${torneioId}/registrations`,
          { method: 'GET' }
        );
        if (!response.ok) return;

        const data: RegisterStatusResponse = await response.json();

        if (data.paymentData) {
          setPaymentData(data.paymentData);
          subscribeToPayment(data.paymentData.uuid, () => {
            setPaymentApproved(true);
            window.dispatchEvent(
              new CustomEvent(TOURNAMENT_PAYMENT_APPROVED_EVENT)
            );
          }).then((unsub) => {
            unsubscribeRef.current = unsub;
          });
        }
      } finally {
        setLoading(false);
      }
    };

    load();
    return () => {
      unsubscribeRef.current?.();
    };
  }, [torneioId]);

  // Timer do QR code: recalcula via Date.now() a cada segundo
  // (resiliente a abas em background, ao contrário de decremento simples).
  useEffect(() => {
    if (!paymentData?.expiresAt || paymentApproved) {
      const t = setTimeout(() => setTimeRemaining(0), 0);
      return () => clearTimeout(t);
    }

    const expiresAtMs = new Date(paymentData.expiresAt).getTime();
    if (Number.isNaN(expiresAtMs)) {
      const t = setTimeout(() => setTimeRemaining(0), 0);
      return () => clearTimeout(t);
    }

    const update = () => {
      setTimeRemaining(
        Math.max(Math.floor((expiresAtMs - Date.now()) / 1000), 0)
      );
    };

    const initial = setTimeout(update, 0);
    const interval = setInterval(update, 1000);
    return () => {
      clearTimeout(initial);
      clearInterval(interval);
    };
  }, [paymentData?.expiresAt, paymentApproved]);

  const handleCopyPix = async () => {
    if (!paymentData?.qrCode) return;
    if (await copyToClipboard(paymentData.qrCode)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isExpiringSoon = timeRemaining < 60;

  return (
    <Dialog
      open
      onClose={() => router.back()}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: 3,
          color: C.text,
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 3,
          pt: 2.5,
          pb: 0,
        }}
      >
        <Typography
          sx={{ fontWeight: 700, fontSize: '1rem', letterSpacing: 0.4 }}
        >
          Pagamento — Torneio #{torneioId}
        </Typography>
        <IconButton
          onClick={() => router.back()}
          size="small"
          sx={{ color: 'rgba(255,255,255,0.5)', '&:hover': { color: C.text } }}
        >
          <CloseRoundedIcon fontSize="small" />
        </IconButton>
      </Box>

      <DialogContent sx={{ px: 3, py: 3 }}>
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress size={36} />
          </Box>
        )}

        {!loading && paymentApproved && (
          <Stack
            spacing={2}
            sx={{
              textAlign: 'center',
              py: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <CheckCircleIcon
              sx={{ fontSize: 64, color: APPROVED_GREEN, margin: 'auto' }}
            />
            <Typography variant="h6" sx={{ color: C.accent, fontWeight: 700 }}>
              Pagamento Aprovado!
            </Typography>
            <Typography sx={{ color: C.textMuted, fontSize: '0.9rem' }}>
              Sua inscrição foi confirmada. Boa sorte!
            </Typography>
            <Button
              variant="outlined"
              onClick={() => router.back()}
              sx={{ borderColor: C.accent, color: C.accent }}
            >
              Fechar
            </Button>
          </Stack>
        )}

        {!loading && !paymentApproved && paymentData && (
          <Stack
            spacing={2.5}
            sx={{
              textAlign: 'center',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Box
              sx={{
                p: 1.5,
                backgroundColor: C.surfaceHigh,
                borderRadius: 2,
                border: `1px solid ${C.accent}`,
                width: '100%',
              }}
            >
              <Typography variant="caption" sx={{ color: C.textMuted }}>
                Valor a Pagar
              </Typography>
              <Typography
                variant="h5"
                sx={{ color: C.accent, fontWeight: 700 }}
              >
                {formatCurrency(paymentData.value)}
              </Typography>
            </Box>

            <Card
              sx={{
                width: QR_SIZE,
                height: QR_SIZE,
                mx: 'auto',
                backgroundColor: C.surfaceHigh,
                border: `2px solid ${C.border}`,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {timeRemaining > 0 ? (
                <img
                  src={`data:image/png;base64,${paymentData.qrCodeBase64}`}
                  alt="QR Code PIX"
                  width={QR_SIZE}
                  height={QR_SIZE}
                  style={{ objectFit: 'contain', padding: 8 }}
                />
              ) : (
                <Image
                  src={qrCodeExpiredImage}
                  alt="QR Code Expirado"
                  width={QR_SIZE}
                  height={QR_SIZE}
                  style={{ objectFit: 'contain', padding: 8 }}
                />
              )}
            </Card>

            <Box
              sx={{
                p: 1.5,
                backgroundColor: isExpiringSoon
                  ? 'rgba(255,107,107,0.1)'
                  : C.surfaceHigh,
                border: `1px solid ${isExpiringSoon ? C.danger : C.border}`,
                borderRadius: 2,
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: isExpiringSoon ? C.danger : C.textMuted,
                  fontWeight: isExpiringSoon ? 700 : 500,
                }}
              >
                {timeRemaining > 0 ? (
                  <>
                    QR Code expira em:{' '}
                    <strong>{formatTimeRemaining(timeRemaining)}</strong>
                  </>
                ) : (
                  <>QR Code expirado.</>
                )}
              </Typography>
            </Box>

            {timeRemaining > 0 ? (
              <>
                <Typography variant="body2" sx={{ color: C.textMuted }}>
                  Ou copie a chave PIX:
                </Typography>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={
                    copied ? (
                      <CheckCircleIcon sx={{ color: APPROVED_GREEN }} />
                    ) : (
                      <ContentCopyIcon />
                    )
                  }
                  onClick={handleCopyPix}
                  sx={{
                    borderColor: C.accent,
                    color: copied ? APPROVED_GREEN : C.accent,
                    py: 1.2,
                  }}
                >
                  {copied ? 'Copiado!' : 'Copiar Chave PIX'}
                </Button>
              </>
            ) : (
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={() => router.back()}
              >
                Fechar
              </Button>
            )}
          </Stack>
        )}

        {!loading && !paymentData && !paymentApproved && (
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <Typography sx={{ color: C.textMuted, fontSize: '0.9rem' }}>
              Nenhum pagamento pendente encontrado para este torneio.
            </Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
