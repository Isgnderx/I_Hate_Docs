import { PropsWithChildren } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function ProtectedRoute({ children }: PropsWithChildren) {
  const { user, loading } = useAuth();
  if (loading) {
    return <div className="page-loading">Loading workspace...</div>;
  }
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  return <>{children}</>;
}
