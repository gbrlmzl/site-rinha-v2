import { Box, Typography } from '@mui/material';

export default function NotFound() {
  return (
    <Box
      sx={{
        minHeight: '100dvh',
        width: '100%',
        display: 'grid',
        placeItems: 'start center',
        padding: "13vh",
        px: 2,
      }}
    >
      <Box sx={{ textAlign: 'start' }}>
        <Typography
          component="h1"
          sx={{
            fontWeight: 700,
            color: 'white',
            fontSize: { xs: '2rem', sm: '4rem' },
          }}
        >
          Erro 404
        </Typography>

        <Typography sx={{ mt: 1, color: '#d1d1d1', fontSize: { xs: '1rem', sm: '1.25rem' } }}>
          Recurso não encontrado!
        </Typography>
      </Box>
    </Box>
  );
}