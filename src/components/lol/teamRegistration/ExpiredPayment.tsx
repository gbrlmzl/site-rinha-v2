import { useState } from 'react';
import Image from 'next/image';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import BlitzcrankImage from '@/assets/imgs/lol/BlitzcrankExpiredPayment.jpg';

type ExpiredPaymentProps = {
  loading: boolean;
  onCancel: () => void;
  onRetryPayment: () => void;
};

export default function ExpiredPayment({ loading, onCancel, onRetryPayment }: ExpiredPaymentProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <Card sx={{ maxWidth: { xs: '100%', md: '30vw', lg: '33vw' }, boxShadow: 3 }}>
      <Box sx={{ position: 'relative', width: '100%', height: { xs: '33vh', md: '40vh' } }}>
        <Image
          src={BlitzcrankImage}
          alt="Blitzcrank"
          fill
          sizes="33vw"
          onLoad={() => setImageLoaded(true)}
          style={{
            objectFit: 'cover',
          }}
          placeholder="blur"
        />
      </Box>
      <CardContent
        sx={{
          px: 3,
          py: 2,
          opacity: imageLoaded ? 1 : 0,
          visibility: imageLoaded ? 'visible' : 'hidden',
          transition: 'opacity 0.5s ease',
        }}
      >
        <Typography gutterBottom variant="h5" component="div" >
          Pagamento expirado!
        </Typography>
        <Typography >
          O pagamento da inscrição da sua equipe expirou.
        </Typography>
        Você pode reaproveitar o formulário e gerar um novo pagamento, ou
        cancelar e preencher um novo formulário.
        <Typography></Typography>
      </CardContent>
      <CardActions
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          width: '100%',
          px: 3,
          py: 2,
          opacity: imageLoaded ? 1 : 0,
          visibility: imageLoaded ? 'visible' : 'hidden',
          transition: 'opacity 0.2s ease',
        }}
      >
        <Button
          size="small"
          variant="contained"
          onClick={onCancel}
          sx={{ justifySelf: 'start' }}
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button
          size="small"
          variant="contained"
          color="success"
          onClick={onRetryPayment}
          sx={{ justifySelf: 'end' }}
        >
          Novo Pagamento
        </Button>
      </CardActions>
    </Card>
  );
}
