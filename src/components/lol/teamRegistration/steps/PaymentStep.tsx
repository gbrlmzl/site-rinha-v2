'use client';

/**
 * Passo 4: Pagamento via PIX
 * Formulário de dados de pagamento + QR Code + Countdown
 */

import React, { useEffect, useState } from 'react';
import {
  Box,
  TextField,
  Stack,
  Typography,
  Button,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material';
import Image from 'next/image';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { PaymentForm } from '@/types/teamRegistration';
import { THEME_COLORS, PAYMENT_TIMEOUT_SECONDS } from '@/hooks/lol/teamRegistration/constants';
import { formatTimeRemaining, copyToClipboard } from '@/services/teamRegistrationService';

interface PaymentStepProps {
  data: PaymentForm;
  onDataChange: (updates: Partial<PaymentForm>) => void;
  paymentValue: number;
  qrCodeData?: {
    uuid: string;
    qrCode: string;
    qrCodeBase64: string;
    valor: number;
  } | null;
  paymentApproved?: boolean;
  loading?: boolean;
  error?: string | null;
}

export const PaymentStep: React.FC<PaymentStepProps> = ({
  data,
  onDataChange,
  paymentValue,
  qrCodeData,
  paymentApproved = false,
  loading = false,
  error = null,
}) => {
  const [timeRemaining, setTimeRemaining] = useState(PAYMENT_TIMEOUT_SECONDS);
  const [copied, setCopied] = useState(false);

  // Timer para QR Code
  useEffect(() => {
    if (!qrCodeData || paymentApproved) {
      setTimeRemaining(PAYMENT_TIMEOUT_SECONDS);
      return;
    }

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [qrCodeData, paymentApproved]);

  const handleChange = (field: keyof PaymentForm) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    onDataChange({ [field]: e.target.value });
  };

  const handleCopyPix = async () => {
    if (qrCodeData?.qrCode) {
      const success = await copyToClipboard(qrCodeData.qrCode);
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
        <Stack spacing={2} sx={{ textAlign: 'center', maxWidth: 500 }}>
          <CheckCircleIcon
            sx={{
              fontSize: 80,
              color: '#4caf50',
              mx: 'auto',
            }}
          />

          <Typography
            variant="h5"
            sx={{
              color: THEME_COLORS.accent,
              fontWeight: 700,
            }}
          >
            Pagamento Aprovado! 🎉
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: THEME_COLORS.text,
            }}
          >
            Sua inscrição foi confirmada com sucesso!
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: THEME_COLORS.textMuted,
            }}
          >
            Você receberá um email de confirmação em breve com os detalhes da sua equipe e os próximos passos.
          </Typography>

          <Divider sx={{ borderColor: THEME_COLORS.border, my: 2 }} />

          <Typography
            variant="caption"
            sx={{
              color: THEME_COLORS.textMuted,
            }}
          >
            Acompanhe o torneio em nossa plataforma. Boa sorte! ⚔️
          </Typography>
        </Stack>
      </Box>
    );
  }

  // ─── Tela: QR Code Gerado ───────────────────────────────────────────────

  if (qrCodeData) {
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
            <Typography variant="caption" sx={{ color: THEME_COLORS.textMuted }}>
              Valor a Pagar
            </Typography>
            <Typography
              variant="h4"
              sx={{
                color: THEME_COLORS.accent,
                fontWeight: 700,
              }}
            >
              R$ {(qrCodeData.valor / 100).toFixed(2).replace('.', ',')}
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
              <Image
                src={qrCodeData.qrCodeBase64}
                alt="QR Code PIX"
                width={220}
                height={220}
                style={{ objectFit: 'contain', padding: 8 }}
              />
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
                timeRemaining < 60
                  ? THEME_COLORS.danger
                  : THEME_COLORS.border
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
              QR Code expira em: <strong>{formatTimeRemaining(timeRemaining)}</strong>
            </Typography>
          </Box>

          {/* PIX Copy */}
          <Box>
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
          </Box>

          {/* Info */}
          <Alert severity="info" sx={{ borderRadius: 2 }}>
            Após confirmar o pagamento, você receberá um email de confirmação.
            Se o QR Code expirar, será gerado um novo automaticamente.
          </Alert>
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
        spacing={3}
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
            color: THEME_COLORS.accent,
            fontWeight: 700,
            textAlign: 'center',
          }}
        >
          Pagamento de Inscrição
        </Typography>

        {/* Payment Info */}
        <Box
          sx={{
            p: 2,
            backgroundColor: THEME_COLORS.surfaceHigh,
            borderRadius: 2,
            border: `1px solid ${THEME_COLORS.border}`,
            textAlign: 'center',
          }}
        >
          <Typography variant="caption" sx={{ color: THEME_COLORS.textMuted }}>
            Taxa de Inscrição
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: THEME_COLORS.text,
              fontWeight: 600,
            }}
          >
            R$ 10,00 por jogador × {Math.ceil(paymentValue / 10)} jogadores
          </Typography>
          <Divider sx={{ borderColor: THEME_COLORS.border, my: 1 }} />
          <Typography
            variant="h5"
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
            inputProps={{
              pattern: '[0-9]*',
              maxLength: 11,
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

        {/* Error */}
        {error && (
          <Alert severity="error" sx={{ borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {/* Loading State */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Info */}
        <Alert severity="info" sx={{ borderRadius: 2 }}>
          Seus dados serão usados para gerar o QR Code PIX. Eles não serão compartilhados.
        </Alert>
      </Stack>
    </Box>
  );
};
