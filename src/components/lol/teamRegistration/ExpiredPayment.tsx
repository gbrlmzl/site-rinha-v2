import { useState } from 'react';
import Image from 'next/image';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';

import BlitzcrankImage from '@/assets/imgs/lol/BlitzcrankExpiredPayment.jpg';
import { THEME_COLORS } from '@/hooks/lol/teamRegistration/constants';

type ExpiredPaymentProps = {
  loading: boolean;
  onCancel: () => void;
  onRetryPayment: () => void;
};

export default function ExpiredPayment({ loading, onCancel, onRetryPayment }: ExpiredPaymentProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

  const handleCancel = () => {
    if (!loading) {
      setIsCancelDialogOpen(true);
    }
  };

  const handleCloseCancelDialog = () => {
    if (!loading) {
      setIsCancelDialogOpen(false);
    }
  };

  const handleConfirmCancel = () => {
    if (!loading) {
      setIsCancelDialogOpen(false);
      onCancel();
    }
  };

  const handleRetryPayment = () => {
    if (!loading) {
      onRetryPayment();
    }
  };


  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: THEME_COLORS.bg,
        px: 2,
        py: { xs: 3, md: 4 },
        display: 'flex',
        alignItems: { xs: 'center', md: 'flex-start' },
        justifyContent: 'center',
      }}
    >
      <Card
        sx={{
          mt: { xs: 0, md: '10vh' },
          width: '100%',
          maxWidth: { xs: '100%', md: '30vw', lg: '33vw' },
          boxShadow: 3,
          borderRadius: 3,
          overflow: 'hidden',
        }}
      >
        <Box sx={{ position: 'relative', width: '100%', height: { xs: '33vh', md: '40vh' } }}>
          <Image
            src={BlitzcrankImage}
            alt="Blitzcrank"
            fill
            sizes="(max-width: 900px) 100vw, 33vw"
            onLoad={() => setImageLoaded(true)}
            style={{ objectFit: 'cover' }}
            placeholder="blur"
            priority
          />

          <Box
            sx={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              height: { xs: 56, md: 72 },
              pointerEvents: 'none',
              background: `linear-gradient(to bottom, rgba(8, 13, 46, 0), ${THEME_COLORS.surface})`,
            }}
          />
        </Box>

        <CardContent
          sx={{
            px: 3,
            pt: 4,
            pb: 2,
            mt: { xs: -3, md: -4 },
            position: 'relative',
            zIndex: 1,
            backgroundColor: THEME_COLORS.surface,
            '&::before': {
              content: '""',
              position: 'absolute',
              top: -32,
              left: 0,
              right: 0,
              height: 32,
              pointerEvents: 'none',
              background: `linear-gradient(to bottom, rgba(0, 0, 0, 0), ${THEME_COLORS.surface})`,
            },
          }}
        >
          <Typography gutterBottom variant="h5" component="div" sx={{ color: THEME_COLORS.text, fontWeight: 700, mb: 1.5 }}>
            Pagamento expirado!
          </Typography>

          <Typography variant="body1" sx={{ color: THEME_COLORS.text }}>
            O pagamento da inscrição da sua equipe expirou.
          </Typography>

          <Typography variant="body1" sx={{ mt: 1.5, color: THEME_COLORS.text }}>
            Você pode gerar um novo pagamento, ou cancelar e realizar uma nova inscrição.
          </Typography>
        </CardContent>

        <CardActions
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '10%',
            width: '100%',
            px: 3,
            pb: 3,
            pt: 1,
            justifyContent: 'center',
            backgroundColor: THEME_COLORS.surface,
          }}
        >
          <Button
            variant="contained"
            onClick={handleCancel}
            disabled={loading}
            sx={{
              justifySelf: 'stretch',
              minWidth: { xs: '100%', sm: 0 },
              backgroundColor: THEME_COLORS.accent,
              '&:hover': {
                backgroundColor: THEME_COLORS.accentHover,
              },
            }}
          >
            Cancelar
          </Button>

          <Button
            variant="contained"
            onClick={handleRetryPayment}
            disabled={loading}
            sx={{
              justifySelf: 'stretch',
              minWidth: { xs: '100%', sm: 0 },
              backgroundColor: '#62eb65',
              //color: '#071022',
              '&:hover': {
                backgroundColor: '#62eb65cc',
              },
            }}
          >
           Pagamento
          </Button>
        </CardActions>
      </Card>

      <Dialog
        open={isCancelDialogOpen}
        onClose={handleCloseCancelDialog}
        aria-labelledby="cancel-registration-dialog-title"
        aria-describedby="cancel-registration-dialog-description"
        slotProps={{
          paper: { sx: {
            backgroundColor: THEME_COLORS.surface,
            border: `1px solid ${THEME_COLORS.border}`,
            color: THEME_COLORS.text,
          }}}
        }
        
      >
        <DialogTitle id="cancel-registration-dialog-title" sx={{ color: THEME_COLORS.text, fontWeight: 700 }}>
          Cancelar inscrição?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="cancel-registration-dialog-description" sx={{ color: THEME_COLORS.text }}>
            Ao confirmar, essa ação não poderá ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20%' }}>
          <Button
            variant="contained"
            onClick={handleCloseCancelDialog}
            disabled={loading}
            sx={{
              backgroundColor: THEME_COLORS.accent,
              '&:hover': {
                backgroundColor: THEME_COLORS.accentHover,
              },
            }}
          >
            Voltar
          </Button>
          <Button
            variant="contained"
            onClick={handleConfirmCancel}
            disabled={loading}
            sx={{
              backgroundColor: THEME_COLORS.accent,
              '&:hover': {
                backgroundColor: THEME_COLORS.accentHover,
              },
            }}
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
