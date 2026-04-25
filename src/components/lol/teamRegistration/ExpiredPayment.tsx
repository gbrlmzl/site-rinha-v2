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
import { alpha, useTheme } from '@mui/material/styles';

import BlitzcrankImage from '@/assets/imgs/lol/BlitzcrankExpiredPayment.jpg';
import  {THEME_SECTIONS}  from '@/theme';

type ExpiredPaymentProps = {
  loading: boolean;
  onCancel: () => void;
  onRetryPayment: () => void;
};

export default function ExpiredPayment({ loading, onCancel, onRetryPayment }: ExpiredPaymentProps) {
  const theme = useTheme();
  const appPalette = theme.appPalette;
  
  const themeTeamRegistration = THEME_SECTIONS.teamRegistration;

  

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
        ...themeTeamRegistration.sx.expiredPaymentPageContainer,
      }}
    >
      <Card
        sx={themeTeamRegistration.sx.expiredPaymentCard}
      >
        <Box sx={{ position: 'relative', width: '100%', height: { xs: '33vh', md: '40vh' } }}>
          <Image
            src={BlitzcrankImage}
            alt="Blitzcrank"
            fill
            sizes="(max-width: 900px) 100vw, 33vw"
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
              background: `linear-gradient(to bottom, ${alpha(appPalette.cardBackground, 0)}, ${appPalette.cardBackground})`,
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
            backgroundColor: appPalette.cardBackground,
            '&::before': {
              content: '""',
              position: 'absolute',
              top: -32,
              left: 0,
              right: 0,
              height: 32,
              pointerEvents: 'none',
              background: `linear-gradient(to bottom, ${alpha(appPalette.cardBackground, 0)}, ${appPalette.cardBackground})`,
            },
          }}
        >
          <Typography gutterBottom variant="h5" component="div" sx={{fontWeight: 700, mb: 1.5 }}>
            Pagamento expirado!
          </Typography>

          <Typography variant="body1" >
            O pagamento da inscrição da sua equipe expirou.
          </Typography>

          <Typography variant="body1">
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
          }}
        >
          <Button
            variant="contained"
            onClick={handleCancel}
            disabled={loading}
            
          >
            Cancelar
          </Button>

          <Button
            variant="contained"
            onClick={handleRetryPayment}
            disabled={loading}
            sx={{
              backgroundColor: themeTeamRegistration.colors.success,
              '&:hover': {
                backgroundColor: themeTeamRegistration.colors.successHover,
              }
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
            backgroundColor: '#0E1241',
          }}}
        }
        
      >
        <DialogTitle id="cancel-registration-dialog-title" >
          Cancelar inscrição?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="cancel-registration-dialog-description">
            Ao confirmar, essa ação não poderá ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20%' }}>
          <Button
            variant="contained"
            onClick={handleCloseCancelDialog}
            disabled={loading}
          >
            Voltar
          </Button>
          <Button
            variant="contained"
            onClick={handleConfirmCancel}
            disabled={loading}
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
