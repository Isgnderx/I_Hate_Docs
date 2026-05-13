import { createContext, PropsWithChildren, useCallback, useContext, useMemo, useState } from 'react';

type ToastItem = {
  id: string;
  message: string;
};

type ToastContextValue = {
  toasts: ToastItem[];
  pushToast: (message: string) => void;
  removeToast: (id: string) => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: PropsWithChildren) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const pushToast = useCallback((message: string) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => removeToast(id), 3200);
  }, [removeToast]);

  const value = useMemo(
    () => ({
      toasts,
      pushToast,
      removeToast
    }),
    [toasts, pushToast, removeToast]
  );

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}
