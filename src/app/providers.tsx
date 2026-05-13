import { PropsWithChildren } from 'react';
import { AuthProvider } from '../hooks/useAuth';
import { ToastProvider } from '../hooks/useToast';

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <AuthProvider>
      <ToastProvider>{children}</ToastProvider>
    </AuthProvider>
  );
}
