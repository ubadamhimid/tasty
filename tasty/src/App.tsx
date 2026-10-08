import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, ProtectedRoute } from './admin/context/AuthContext';
import { CustomerLandingPage } from './components/CustomerLandingPage';
import { AdminLoginPage } from './admin/pages/AdminLoginPage';
import { AdminLayout } from './admin/components/AdminLayout';
import { AdminDashboardHome } from './admin/pages/AdminDashboardHome';
import { PurchasingPage } from './admin/pages/PurchasingPage';
import { DailySalesPage } from './admin/pages/DailySalesPage';
import { DebtsPage } from './admin/pages/DebtsPage';
import { EmployeesPage } from './admin/pages/EmployeesPage';
import { SettingsPage } from './admin/pages/SettingsPage';

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
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
