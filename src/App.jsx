import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { MarketProvider } from './contexts/MarketContext';
import { PortfolioProvider } from './contexts/PortfolioContext';
import { useNotification } from './hooks/useNotification';
import NotificationSystem from './components/ui/NotificationSystem';
import LoadingSpinner from './components/ui/LoadingSpinner';
import Header from './components/ui/Header';
import Footer from './components/ui/Footer';
import './index.css';

// Lazy load pages for code splitting
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const PortfolioPage = lazy(() => import('./pages/PortfolioPage'));
const HistoryPage = lazy(() => import('./pages/HistoryPage'));

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/" replace />;
};

// App Layout
const AppLayout = ({ children }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <main style={{ flex: 1 }}>{children}</main>
      <Footer />
    </div>
  );
};

// App Routes
const AppRoutes = () => {
  const { isAuthenticated } = useAuth();
  const { notifications, removeNotification } = useNotification();

  return (
    <>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route
            path="/"
            element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />}
          />
          <Route
            path="/register"
            element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterPage />}
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <DashboardPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/portfolio"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <PortfolioPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <HistoryPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>

      <NotificationSystem notifications={notifications} onClose={removeNotification} />
    </>
  );
};

// Main App Component
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <MarketProvider>
          <PortfolioProvider>
            <AppRoutes />
          </PortfolioProvider>
        </MarketProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
