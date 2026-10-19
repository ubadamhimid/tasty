import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, ProtectedRoute } from './admin/context/AuthContext';
import { CustomerLandingPage } from './components/CustomerLandingPage';
const AdminLoginPage = lazy(() => import('./admin/pages/AdminLoginPage').then(m => ({ default: m.AdminLoginPage })));
const AdminLayout = lazy(() => import('./admin/components/AdminLayout').then(m => ({ default: m.AdminLayout })));
const AdminDashboardHome = lazy(() => import('./admin/pages/AdminDashboardHome').then(m => ({ default: m.AdminDashboardHome })));
const PurchasingPage = lazy(() => import('./admin/pages/PurchasingPage').then(m => ({ default: m.PurchasingPage })));
const DailySalesPage = lazy(() => import('./admin/pages/DailySalesPage').then(m => ({ default: m.DailySalesPage })));
const DebtsPage = lazy(() => import('./admin/pages/DebtsPage').then(m => ({ default: m.DebtsPage })));
const EmployeesPage = lazy(() => import('./admin/pages/EmployeesPage').then(m => ({ default: m.EmployeesPage })));
const SettingsPage = lazy(() => import('./admin/pages/SettingsPage').then(m => ({ default: m.SettingsPage })));

import { useAdminAuth } from './admin/context/AuthContext';

const AdminDashboardIndex: React.FC = () => {
  const { isAdmin } = useAdminAuth();
  if (!isAdmin) {
    return <Navigate to="/admin/sales" replace />;
  }
  return <AdminDashboardHome />;
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={null}>
        <Routes>
          {/* Public Customer Restaurant Site */}
          <Route path="/" element={<CustomerLandingPage />} />

          {/* Admin Login */}
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* Protected Admin Dashboard */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            {/* If Manager accesses /admin, redirect to /admin/sales */}
            <Route index element={<AdminDashboardIndex />} />
            <Route path="orders" element={<PurchasingPage />} />
            <Route path="sales" element={<DailySalesPage />} />
            <Route
              path="debts"
              element={
                <ProtectedRoute requireAdmin>
                  <DebtsPage />
                </ProtectedRoute>
              }
            />
            <Route path="employees" element={<EmployeesPage />} />
            <Route
              path="settings"
              element={
                <ProtectedRoute requireAdmin>
                  <SettingsPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
