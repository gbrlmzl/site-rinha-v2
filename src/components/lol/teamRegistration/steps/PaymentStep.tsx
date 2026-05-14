'use client';

/**
 * Passo 4: Pagamento via PIX
 * Formulário de dados de pagamento + QR Code + Countdown
 */

import { useEffect, useState, type ChangeEvent } from 'react';
import Link from 'next/link';
import {
  Box,
  TextField,
  Stack,
  Typography,
  Button,
  Card,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material';
import Image from 'next/image';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { GeneratedPaymentData, PaymentForm } from '@/types/teamRegistration';
import {
  formatTimeRemaining,
  copyToClipboard,
} from '@/services/teamRegistrationUtils';
import qrCodeExpiredImage from '@/assets/imgs/lol/AmumuSad.jpg';
import { TEAM_REGISTRATION_TOKENS } from '@/theme';
import { useSnackbarContext } from '@/contexts/SnackbarContext';
interface PaymentStepProps {
  data: PaymentForm;
  onDataChange: (updates: Partial<PaymentForm>) => void;
  paymentValue: number;
  paymentData?: GeneratedPaymentData | null;
  paymentApproved?: boolean;
  loading?: boolean;
  error?: string | null;
}

export function PaymentStep({
  data,
  onDataChange,
  paymentValue,
  paymentData,
  paymentApproved = false,
  loading = false,
  error = null,
}: PaymentStepProps) {
   const THEME_COLORS = TEAM_REGISTRATION_TOKENS.colors;
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);
  const { showSnackbar } = useSnackbarContext();
  

  // Timer para QR Code
  useEffect(() => {
    if (!paymentData?.expiresAt || paymentApproved) {
      setTimeRemaining(0);
      return;
    }

    const expiresAtMs = new Date(paymentData.expiresAt).getTime();

    if (Number.isNaN(expiresAtMs)) {
      setTimeRemaining(0);
      return;
    }

    const initialRemaining = Math.max(
      Math.floor((expiresAtMs - Date.now()) / 1000),
      0
    );

    setTimeRemaining(initialRemaining);

    if (initialRemaining <= 0) {
      return;
    }

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        return prev > 0 ? prev - 1 : 0;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [paymentData?.expiresAt, paymentApproved]);

  useEffect(() => {
    if(error) {
      showSnackbar({ message: error, severity: 'error' });
    }
  }, [error]);


  const handleChange =
    (field: keyof PaymentForm) => (e: ChangeEvent<HTMLInputElement>) => {
      onDataChange({ [field]: e.target.value });
    };

  const handleCopyPix = async () => {
    if (paymentData?.qrCode) {
      const success = await copyToClipboard(paymentData.qrCode);
      if (success) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };

  // ─── Tela: Pagamento Aprovado ───────────────────────────────────────────

  if (paymentApproved) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 400,
        }}
      >
        <Stack spacing={1} sx={{ textAlign: 'center', maxWidth: 500 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <CheckCircleIcon
              sx={{
                fontSize: 80,
                color: '#4caf50',
                mx: 'auto',
              }}
            />
          </Box>

          <Typography
            variant="h5"
            sx={{
              color: THEME_COLORS.accent,
              fontWeight: 700,
            }}
          >
            Pagamento Aprovado!
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: THEME_COLORS.text,
            }}
          >
            Sua inscrição foi confirmada com sucesso!
          </Typography>

          <Divider sx={{ borderColor: THEME_COLORS.border, my: 2 }} />
          <Box>
            <Image
              src="/chogat.jpg"
              alt="Pagamento aprovado"
              width={300}
              height={250}
              style={{ objectFit: 'contain' }}
            ></Image>
          </Box>

          <Typography
            variant="caption"
            sx={{
              color: THEME_COLORS.textMuted,
            }}
          >
            Você receberá um email de confirmação. Boa sorte!
          </Typography>
        </Stack>
      </Box>
    );
  }

  // ─── Tela: QR Code Gerado ───────────────────────────────────────────────

  if (paymentData) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Stack
          spacing={3}
          sx={{
            width: '100%',
            maxWidth: 500,
            p: { xs: 2, md: 3 },
            textAlign: 'center',
          }}
        >
          {/* Title */}
          <Typography
            variant="h5"
            sx={{
              color: THEME_COLORS.accent,
              fontWeight: 700,
            }}
          >
            Efetuar Pagamento
          </Typography>

          {/* Value */}
          <Box
            sx={{
              p: 2,
              backgroundColor: THEME_COLORS.surfaceHigh,
              borderRadius: 2,
              border: `1px solid ${THEME_COLORS.accent}`,
            }}
          >
            <Typography
              variant="caption"
              sx={{ color: THEME_COLORS.textMuted }}
            >
              Valor a Pagar
            </Typography>
            <Typography
              variant="h4"
              sx={{
                color: THEME_COLORS.accent,
                fontWeight: 700,
              }}
            >
              R$ {paymentData.value.toFixed(2).replace('.', ',')}
            </Typography>
          </Box>

          {/* QR Code */}
          <Box>
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
          </Box>

          {/* Timer */}
          <Box
            sx={{
              p: 1.5,
              backgroundColor:
                timeRemaining < 60
                  ? 'rgba(255, 107, 107, 0.1)'
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
                whiteSpace: 'pre-line',
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

          {/* PIX Copy // Ou retornar ao inicio caso tenha expirado o QRCODE*/}
          <Box>
            {timeRemaining > 0 ? (
              <>
                <Typography
                  variant="body2"
                  sx={{
                    color: THEME_COLORS.textMuted,
                    mb: 1,
                  }}
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
                    wordBreak: 'break-all',
                    height: 'auto',
                    py: 1.5,
                  }}
                >
                  {copied ? 'Copiado!' : 'Copiar Chave PIX'}
                </Button>
              </>
            ) : (
              <Button
                component={Link}
                href="/lol/"
                fullWidth
                variant="contained"
                color="primary"
              >
                Inicio
              </Button>
            )}
          </Box>
        </Stack>
      </Box>
    );
  }

  // ─── Tela: Formulário de Pagamento ──────────────────────────────────────

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Stack
        spacing={2}
        sx={{
          width: '100%',
          maxWidth: 500,
          p: { xs: 2, md: 3 },
        }}
      >
        {/* Title */}
        <Typography
          variant="h5"
          sx={{
            color: 'white',
            fontWeight: 700,
            textAlign: 'center',
          }}
        >
          Taxa de inscrição
        </Typography>

        {/* Payment Info */}
        <Box
          sx={{
            p: 2,
            //backgroundColor: THEME_COLORS.surfaceHigh,
            borderRadius: 2,
            border: `1px solid ${THEME_COLORS.border}`,
            textAlign: 'center',
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: THEME_COLORS.accent,
              fontWeight: 700,
            }}
          >
            Total: R$ {paymentValue.toFixed(2).replace('.', ',')}
          </Typography>
        </Box>

        {/* Form */}
        <Stack spacing={2}>
          <TextField
            fullWidth
            label="Nome"
            placeholder="Seu nome"
            value={data.nome}
            onChange={handleChange('nome')}
            disabled={loading}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: THEME_COLORS.surfaceHigh,
                borderRadius: 1.5,
                color: THEME_COLORS.text,
                '& fieldset': { borderColor: THEME_COLORS.border },
                '&:hover fieldset': { borderColor: THEME_COLORS.accent },
                '&.Mui-focused fieldset': { borderColor: THEME_COLORS.accent },
              },
              '& .MuiInputLabel-root': { color: THEME_COLORS.textMuted },
            }}
          />

          <TextField
            fullWidth
            label="Sobrenome"
            placeholder="Seu sobrenome"
            value={data.sobrenome}
            onChange={handleChange('sobrenome')}
            disabled={loading}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: THEME_COLORS.surfaceHigh,
                borderRadius: 1.5,
                color: THEME_COLORS.text,
                '& fieldset': { borderColor: THEME_COLORS.border },
                '&:hover fieldset': { borderColor: THEME_COLORS.accent },
                '&.Mui-focused fieldset': { borderColor: THEME_COLORS.accent },
              },
              '& .MuiInputLabel-root': { color: THEME_COLORS.textMuted },
            }}
          />

          <TextField
            fullWidth
            label="Email"
            type="email"
            placeholder="seu.email@exemplo.com"
            value={data.email}
            onChange={handleChange('email')}
            disabled={loading}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: THEME_COLORS.surfaceHigh,
                borderRadius: 1.5,
                color: THEME_COLORS.text,
                '& fieldset': { borderColor: THEME_COLORS.border },
                '&:hover fieldset': { borderColor: THEME_COLORS.accent },
                '&.Mui-focused fieldset': { borderColor: THEME_COLORS.accent },
              },
              '& .MuiInputLabel-root': { color: THEME_COLORS.textMuted },
            }}
          />

          <TextField
            fullWidth
            label="CPF"
            placeholder="Apenas números (11 dígitos)"
            value={data.cpf}
            onChange={handleChange('cpf')}
            disabled={loading}
            slotProps={{
              htmlInput: {
                pattern: '[0-9]*',
                maxLength: 11,
              },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: THEME_COLORS.surfaceHigh,
                borderRadius: 1.5,
                color: THEME_COLORS.text,
                '& fieldset': { borderColor: THEME_COLORS.border },
                '&:hover fieldset': { borderColor: THEME_COLORS.accent },
                '&.Mui-focused fieldset': { borderColor: THEME_COLORS.accent },
              },
              '& .MuiInputLabel-root': { color: THEME_COLORS.textMuted },
            }}
          />
        </Stack>

        {/* Loading State */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Info */}
        <Alert severity="info" sx={{ borderRadius: 2 }}>
          Seus dados serão usados para gerar o QR Code PIX. Eles não serão
          compartilhados.
        </Alert>
      </Stack>
    </Box>
  );
}
