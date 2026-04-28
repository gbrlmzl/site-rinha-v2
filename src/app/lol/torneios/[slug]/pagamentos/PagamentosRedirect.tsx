'use client';

import { Box, CircularProgress } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface Props {
  slug: string;
}

/**
 * Client-side redirect from /lol/torneios/[slug]/pagamentos to /inscricoes.
 *
 * This only runs on hard refresh / direct URL access — during soft navigation
 * from the listing or the tournament detail, the parent layout's `@modal`
 * slot intercepts the route and the `children` slot keeps the previous page
 * mounted, so this component is never rendered in that flow.
 *
 * We can't use server-side `redirect()` here because it would race the
 * parallel `@modal` slot resolution and abort the interception entirely.
 */
export default function PagamentosRedirect({ slug }: Props) {
  const router = useRouter();

  useEffect(() => {
    router.replace(`/lol/torneios/${slug}/inscricoes`);
  }, [router, slug]);

  return (
    <Box
      sx={{
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <CircularProgress sx={{ color: '#11B5E4' }} />
    </Box>
  );
}
