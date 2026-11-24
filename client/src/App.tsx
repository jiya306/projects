import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

// Layouts
import { PublicLayout } from './components/layout/PublicLayout';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { ProtectedRoute } from './components/ProtectedRoute';

// Public Pages
import { LandingPage } from './pages/public/LandingPage';
import { ServicesPage } from './pages/public/ServicesPage';
import { StylistsPage } from './pages/public/StylistsPage';
import { OffersPage } from './pages/public/OffersPage';
import { AboutPage } from './pages/public/AboutPage';
import { ContactPage } from './pages/public/ContactPage';
import { BookingWizardPage } from './pages/public/BookingWizardPage';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';

// Dashboard Pages
import { DashboardOverviewPage } from './pages/dashboard/DashboardOverviewPage';
import { AppointmentsPage } from './pages/dashboard/AppointmentsPage';
import { CustomersPage } from './pages/dashboard/CustomersPage';
import { StaffPage } from './pages/dashboard/StaffPage';
import { ServicesManagementPage } from './pages/dashboard/ServicesManagementPage';
import { InventoryPage } from './pages/dashboard/InventoryPage';
import { BillingPage } from './pages/dashboard/BillingPage';
import { AnalyticsPage } from './pages/dashboard/AnalyticsPage';
import { PromotionsPage } from './pages/dashboard/PromotionsPage';
import { ReviewsPage } from './pages/dashboard/ReviewsPage';
import { SettingsPage } from './pages/dashboard/SettingsPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <Routes>
            {/* Public Layout */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/stylists" element={<StylistsPage />} />
              <Route path="/offers" element={<OffersPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/book" element={<BookingWizardPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Route>

            {/* Dashboard Layout (Protected) */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<DashboardOverviewPage />} />

                {/* Admin & Salon Owner Only */}
                <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'SALON_OWNER']} />}>
                  <Route path="staff" element={<StaffPage />} />
                  <Route path="inventory" element={<InventoryPage />} />
                  <Route path="analytics" element={<AnalyticsPage />} />
                  <Route path="settings" element={<SettingsPage />} />
                  <Route path="promotions" element={<PromotionsPage />} />
                </Route>

                {/* Admin, Salon Owner & Receptionist */}
                <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'SALON_OWNER', 'RECEPTIONIST']} />}>
                  <Route path="customers" element={<CustomersPage />} />
                  <Route path="services" element={<ServicesManagementPage />} />
                </Route>

                {/* Staff Operations (Admin, Owner, Receptionist, Stylist) */}
                <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'SALON_OWNER', 'RECEPTIONIST', 'STYLIST']} />}>
                  <Route path="appointments" element={<AppointmentsPage />} />
                </Route>

                {/* Reviews */}
                <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'SALON_OWNER', 'STYLIST']} />}>
                  <Route path="reviews" element={<ReviewsPage />} />
                </Route>

                {/* Billing / Invoices */}
                <Route path="billing" element={<BillingPage />} />
              </Route>
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
