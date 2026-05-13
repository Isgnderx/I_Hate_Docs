import { createBrowserRouter, Navigate } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import AuthPage from '../pages/AuthPage';
import DashboardPage from '../pages/DashboardPage';
import DocumentsPage from '../pages/DocumentsPage';
import DocumentWorkspacePage from '../pages/DocumentWorkspacePage';
import AgentsPage from '../pages/AgentsPage';
import RedesignPage from '../pages/RedesignPage';
import ResearchPage from '../pages/ResearchPage';
import MultiDocPage from '../pages/MultiDocPage';
import SettingsPage from '../pages/SettingsPage';
import BillingPage from '../pages/BillingPage';
import AppShell from '../components/layout/AppShell';
import ProtectedRoute from '../components/layout/ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />
  },
  {
    path: '/auth',
    element: <AuthPage />
  },
  {
    path: '/app',
    element: (
      <ProtectedRoute>
        <AppShell />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'documents', element: <DocumentsPage /> },
      { path: 'document/:id', element: <DocumentWorkspacePage /> },
      { path: 'agents', element: <AgentsPage /> },
      { path: 'redesign', element: <RedesignPage /> },
      { path: 'research', element: <ResearchPage /> },
      { path: 'multi-doc', element: <MultiDocPage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: 'billing', element: <BillingPage /> }
    ]
  },
  { path: '*', element: <Navigate to="/" replace /> }
]);
