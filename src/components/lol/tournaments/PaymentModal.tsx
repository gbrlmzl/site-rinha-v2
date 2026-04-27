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
import {TEAM_REGISTRATION_TOKENS} from '@/theme';

interface PaymentModalProps {
  torneioId: string;
}
const THEME_COLORS = TEAM_REGISTRATION_TOKENS.colors;

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
              new CustomEvent('tournament-payment-approved')
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
  // Timer para QR Code
  useEffect(() => {
    // 1. Condição de saída: Se não tem data ou já está aprovado, zera.
    if (!paymentData?.expiresAt || paymentApproved) {
      // Usamos setTimeout para não gerar cascata (Cascading Render)
      const timeout = setTimeout(() => setTimeRemaining(0), 0);
      return () => clearTimeout(timeout);
    }

    const expiresAtMs = new Date(paymentData.expiresAt).getTime();

    // 2. Sua excelente proteção contra datas inválidas!
    if (Number.isNaN(expiresAtMs)) {
      const timeout = setTimeout(() => setTimeRemaining(0), 0);
      return () => clearTimeout(timeout);
    }

    // 3. Função que sempre calcula o tempo REAL baseado no relógio do sistema
    const updateTimer = () => {
      const remaining = Math.max(
        Math.floor((expiresAtMs - Date.now()) / 1000),
        0
      );
      setTimeRemaining(remaining);
    };

    // 4. Inicializa o timer empurrando para a fila de eventos (Resolve o erro do React)
    const initialTimeout = setTimeout(updateTimer, 0);

    // 5. Atualiza a cada segundo de forma imune a abas minimizadas
    const interval = setInterval(updateTimer, 1000);

    // Limpa tudo ao desmontar o componente ou mudar as dependências
    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [paymentData?.expiresAt, paymentApproved]);

  const handleCopyPix = async () => {
    if (!paymentData?.qrCode) return;
    const ok = await copyToClipboard(paymentData.qrCode);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Dialog
      open
      onClose={() => router.back()}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: '#0E1241',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 3,
          color: '#ffffff',
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
          sx={{
            color: 'rgba(255,255,255,0.5)',
            '&:hover': { color: '#ffffff' },
          }}
        >
          <CloseRoundedIcon fontSize="small" />
        </IconButton>
      </Box>

      <DialogContent sx={{ px: 3, py: 3 }}>
        {/* ─── Loading ─────────────────────────────────────────── */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress size={36} />
          </Box>
        )}

        {/* ─── Pagamento aprovado ──────────────────────────────── */}
        {!loading && paymentApproved && (
          <Stack
            spacing={2}
            sx={{ textAlign: 'center', py: 1, justifyContent: 'center' }}
          >
            <CheckCircleIcon
              sx={{ fontSize: 64, color: '#4caf50', mx: 'auto' }}
            />
            <Typography
              variant="h6"
              sx={{ color: THEME_COLORS.accent, fontWeight: 700 }}
            >
              Pagamento Aprovado!
            </Typography>
            <Typography
              sx={{ color: THEME_COLORS.textMuted, fontSize: '0.9rem' }}
            >
              Sua inscrição foi confirmada. Boa sorte!
            </Typography>
            <Button
              variant="outlined"
              onClick={() => router.back()}
              sx={{
                borderColor: THEME_COLORS.accent,
                color: THEME_COLORS.accent,
              }}
            >
              Fechar
            </Button>
          </Stack>
        )}

        {/* ─── QR Code ────────────────────────────────────────── */}
        {!loading && !paymentApproved && paymentData && (
          <Stack
            spacing={2.5}
            sx={{
              textAlign: 'center',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {/* Valor */}
            <Box
              sx={{
                p: 1.5,
                backgroundColor: THEME_COLORS.surfaceHigh,
                borderRadius: 2,
                border: `1px solid ${THEME_COLORS.accent}`,
                width: '100%',
              }}
            >
              <Typography
                variant="caption"
                sx={{ color: THEME_COLORS.textMuted }}
              >
                Valor a Pagar
              </Typography>
              <Typography
                variant="h5"
                sx={{ color: THEME_COLORS.accent, fontWeight: 700 }}
              >
                R$ {paymentData.value.toFixed(2).replace('.', ',')}
              </Typography>
            </Box>

            {/* QR Code */}
            <Card
              sx={{
                width: 220,
                height: 220,
                mx: 'auto',
                backgroundColor: THEME_COLORS.surfaceHigh,
                border: `2px solid ${THEME_COLORS.border}`,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {timeRemaining > 0 ? (
                <img
                  src={`data:image/png;base64,${paymentData.qrCodeBase64}`}
                  alt="QR Code PIX"
                  width={220}
                  height={220}
                  style={{ objectFit: 'contain', padding: 8 }}
                />
              ) : (
                <Image
                  src={qrCodeExpiredImage}
                  alt="QR Code Expirado"
                  width={220}
                  height={220}
                  style={{ objectFit: 'contain', padding: 8 }}
                />
              )}
            </Card>

            {/* Timer */}
            <Box
              sx={{
                p: 1.5,
                backgroundColor:
                  timeRemaining < 60
                    ? 'rgba(255,107,107,0.1)'
                    : THEME_COLORS.surfaceHigh,
                border: `1px solid ${
                  timeRemaining < 60 ? THEME_COLORS.danger : THEME_COLORS.border
                }`,
                borderRadius: 2,
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color:
                    timeRemaining < 60
                      ? THEME_COLORS.danger
                      : THEME_COLORS.textMuted,
                  fontWeight: timeRemaining < 60 ? 700 : 500,
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

            {/* Copia e cola / Fechar */}
            {timeRemaining > 0 ? (
              <>
                <Typography
                  variant="body2"
                  sx={{ color: THEME_COLORS.textMuted }}
                >
                  Ou copie a chave PIX:
                </Typography>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={
                    copied ? (
                      <CheckCircleIcon sx={{ color: '#4caf50' }} />
                    ) : (
                      <ContentCopyIcon />
                    )
                  }
                  onClick={handleCopyPix}
                  sx={{
                    borderColor: THEME_COLORS.accent,
                    color: copied ? '#4caf50' : THEME_COLORS.accent,
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

        {/* ─── Sem dados ──────────────────────────────────────── */}
        {!loading && !paymentData && !paymentApproved && (
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <Typography
              sx={{ color: THEME_COLORS.textMuted, fontSize: '0.9rem' }}
            >
              Nenhum pagamento pendente encontrado para este torneio.
            </Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
