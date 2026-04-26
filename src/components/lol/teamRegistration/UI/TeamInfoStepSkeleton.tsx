'use client';

import { Box, Skeleton, Stack } from '@mui/material';
import { TEAM_REGISTRATION_TOKENS } from '@/theme';

export default function TeamInfoStepSkeleton() {

   const THEME_COLORS = TEAM_REGISTRATION_TOKENS.colors;
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
        spacing={1}
        sx={{
          width: '100%',
          maxWidth: 500,
          p: { xs: 2, md: 3 },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Skeleton
            variant="rounded"
            width={180}
            height={38}
            sx={{ backgroundColor: THEME_COLORS.surfaceHigh }}
          />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Skeleton
            variant="rounded"
            width={250}
            height={250}
            sx={{ backgroundColor: THEME_COLORS.surfaceHigh, borderRadius: 3 }}
          />
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr',
            alignItems: 'center',
            width: '100%',
            mt: 1,
          }}
        >
          <Skeleton
            variant="rounded"
            width={180}
            height={40}
            sx={{
              gridColumn: 2,
              justifySelf: 'center',
              backgroundColor: THEME_COLORS.surfaceHigh,
            }}
          />
        </Box>

        <Box sx={{ mt: 2 }}>
          <Skeleton
            variant="rounded"
            width="100%"
            height={58}
            sx={{ backgroundColor: THEME_COLORS.surfaceHigh, borderRadius: 2 }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 0.75 }}>
            <Skeleton
              variant="text"
              width={120}
              sx={{ fontSize: '0.875rem', backgroundColor: THEME_COLORS.surfaceHigh }}
            />
          </Box>
        </Box>
      </Stack>
    </Box>
  );
}