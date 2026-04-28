'use client';

import { ReactNode } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { ADMIN_TOKENS } from '@/components/admin/adminTheme';

interface AdminPageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export default function AdminPageHeader({
  title,
  subtitle,
  actions,
}: AdminPageHeaderProps) {
  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      alignItems={{ xs: 'flex-start', md: 'flex-end' }}
      justifyContent="space-between"
      gap={2}
      sx={{ mb: { xs: 3, md: 4 } }}
    >
      <Box>
        <Typography component="h1" sx={ADMIN_TOKENS.typography.pageTitle}>
          {title}
        </Typography>
        {subtitle && (
          <Typography sx={ADMIN_TOKENS.typography.pageSubtitle}>
            {subtitle}
          </Typography>
        )}
      </Box>
      {actions && <Box sx={{ width: { xs: '100%', md: 'auto' } }}>{actions}</Box>}
    </Stack>
  );
}
