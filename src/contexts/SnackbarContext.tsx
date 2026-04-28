'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { Alert, Snackbar, type AlertColor } from '@mui/material';
import Slide, { SlideProps } from '@mui/material/Slide';

type SnackbarOptions = {
  message: string;
  severity?: AlertColor;
  autoHideDuration?: number;
};

type SnackbarContextType = {
  showSnackbar: (options: SnackbarOptions | string) => void;
  closeSnackbar: () => void;
};

type SnackbarState = {
  open: boolean;
  message: string;
  severity: AlertColor;
  autoHideDuration: number;
};

const SnackbarContext = createContext<SnackbarContextType | null>(null);

const DEFAULT_AUTO_HIDE_DURATION = 6000;

export function SnackbarProvider({ children }: { children: ReactNode }) {
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: '',
    severity: 'info',
    autoHideDuration: DEFAULT_AUTO_HIDE_DURATION,
  });

  const closeSnackbar = useCallback(() => {
    setSnackbar((prev) => ({
      ...prev,
      open: false,
    }));
  }, []);

  const showSnackbar = useCallback((options: SnackbarOptions | string) => {
    const normalizedOptions =
      typeof options === 'string' ? { message: options } : options;

    setSnackbar({
      open: true,
      message: normalizedOptions.message,
      severity: normalizedOptions.severity ?? 'info',
      autoHideDuration:
        normalizedOptions.autoHideDuration ?? DEFAULT_AUTO_HIDE_DURATION,
    });
  }, []);

  const value = useMemo(
    () => ({ showSnackbar, closeSnackbar }),
    [showSnackbar, closeSnackbar]
  );

  return (
    <SnackbarContext.Provider value={value}>
      {children}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={snackbar.autoHideDuration}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        slots={{transition : Slide}}
        
      >
        <Alert
          onClose={closeSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%', whiteSpace: 'pre-line' }} // Permite quebra de linha nas mensagens
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
}

export function useSnackbarContext() {
  const context = useContext(SnackbarContext);

  if (!context) {
    throw new Error(
      'useSnackbarContext deve ser usado dentro de <SnackbarProvider>'
    );
  }

  return context;
}