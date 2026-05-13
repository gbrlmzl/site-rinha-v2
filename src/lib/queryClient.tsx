'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { ReactNode, useState } from 'react';
import 'dayjs/locale/pt-br';

interface AdminClientProvidersProps {
  children: ReactNode;
}

/**
 * Providers client-side do painel admin:
 * - React Query (cache de queries/mutations)
 * - LocalizationProvider (dayjs em pt-br para os DateTimePickers)
 */
export function ReactQueryProvider({ children }: AdminClientProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            refetchOnWindowFocus: false,
            retry: 1,
          },
          mutations: { retry: 0 },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
        {children}
      </LocalizationProvider>
    </QueryClientProvider>
  );
}
