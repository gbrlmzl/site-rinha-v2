'use client';

import { Button, ButtonProps, CircularProgress } from '@mui/material';

interface LoadingButtonProps extends ButtonProps {
  loading?: boolean;
}

export default function LoadingButton({
  loading,
  children,
  disabled,
  ...rest
}: LoadingButtonProps) {
  return (
    <Button {...rest} disabled={loading || disabled} variant="contained">
      {loading ? <CircularProgress size={22} sx={{ color: '#fff' }} /> : children}
    </Button>
  );
}
