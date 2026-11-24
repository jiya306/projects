import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-cream text-xs text-text-muted">
        Authenticating session...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="p-8 text-center max-w-md mx-auto my-12 bg-white rounded-card border border-salon-border space-y-3">
        <h3 className="font-display text-xl font-bold text-text-primary">Access Restricted</h3>
        <p className="text-xs text-text-muted">
          Your current account role (<strong className="text-text-primary">{user.role}</strong>) does not have access permissions for this section.
        </p>
      </div>
    );
  }

  return <Outlet />;
};
