import { Box, Container, Typography } from '@mui/material';

export default function SobrePage() {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Box>
        <Typography variant="h3" component="h1" gutterBottom>
          Sobre
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Em breve.
        </Typography>
      </Box>
    </Container>
  );
}
