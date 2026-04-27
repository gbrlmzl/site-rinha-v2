'use client';
import { Box, Card, Typography } from '@mui/material';
import AmumuSad from  '@/assets/imgs/lol/AmumuSad.jpg';

function NoNews() {
  return (
    <Card
      sx={{
        paddingBlock: 10,
        paddingInline: 5,
        maxWidth: 640,
        //height: '100%',
        textAlign: 'center',
        backgroundColor: '#f5f5f5',
      }}
    >
      <Typography variant="h4" component="h1" fontWeight={700} fontFamily={'roboto'}>
        Sem notícias por enquanto...
      </Typography>
    </Card>
  );
}

export default function Home() {
  return (
    <Box sx={{pt: '13vh', height: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <NoNews />
    </Box>
  );
}
