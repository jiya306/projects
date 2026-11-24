import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../ui/Badge';
import {
  Sparkles,
  LayoutDashboard,
  Calendar,
  Users,
  UserCheck,
  Scissors,
  Package,
  Receipt,
  BarChart3,
  Tag,
  Star,
  Settings,
  LogOut,
  ExternalLink,
} from 'lucide-react';

export const Sidebar: React.FC<{ onCloseMobile?: () => void }> = ({ onCloseMobile }) => {
  const { user, logout } = useAuth();
  const role = user?.role || 'CUSTOMER';

  // Navigation definition based on role
  const getNavItems = () => {
    switch (role) {
      case 'ADMIN':
      case 'SALON_OWNER':
        return [
          { name: 'Overview', path: '/dashboard', icon: LayoutDashboard, exact: true },
          { name: 'Appointments', path: '/dashboard/appointments', icon: Calendar },
          { name: 'Customers CRM', path: '/dashboard/customers', icon: Users },
          { name: 'Staff & Stylists', path: '/dashboard/staff', icon: UserCheck },
          { name: 'Service Catalog', path: '/dashboard/services', icon: Scissors },
          { name: 'Inventory & Stock', path: '/dashboard/inventory', icon: Package },
          { name: 'Billing & Invoices', path: '/dashboard/billing', icon: Receipt },
          { name: 'Analytics', path: '/dashboard/analytics', icon: BarChart3 },
          { name: 'Promotions & Coupons', path: '/dashboard/promotions', icon: Tag },
          { name: 'Reviews Moderation', path: '/dashboard/reviews', icon: Star },
          { name: 'Salon Settings', path: '/dashboard/settings', icon: Settings },
        ];
      case 'RECEPTIONIST':
        return [
          { name: 'Overview', path: '/dashboard', icon: LayoutDashboard, exact: true },
          { name: 'Appointments', path: '/dashboard/appointments', icon: Calendar },
          { name: 'Customers CRM', path: '/dashboard/customers', icon: Users },
          { name: 'Services', path: '/dashboard/services', icon: Scissors },
          { name: 'Billing & Invoices', path: '/dashboard/billing', icon: Receipt },
        ];
      case 'STYLIST':
        return [
          { name: 'My Schedule', path: '/dashboard', icon: LayoutDashboard, exact: true },
          { name: 'My Appointments', path: '/dashboard/appointments', icon: Calendar },
          { name: 'My Reviews', path: '/dashboard/reviews', icon: Star },
        ];
      case 'CUSTOMER':
      default:
        return [
          { name: 'My Bookings', path: '/dashboard', icon: Calendar, exact: true },
          { name: 'Book New Service', path: '/book', icon: Scissors, external: true },
          { name: 'Service Catalog', path: '/services', icon: Sparkles, external: true },
          { name: 'My Invoices', path: '/dashboard/billing', icon: Receipt },
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <aside className="w-64 bg-surface-cream border-r border-salon-border flex flex-col h-full select-none">
      {/* Brand Header */}
      <div className="p-6 border-b border-salon-border flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-surface-dark flex items-center justify-center text-brand">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="font-display text-xl font-bold tracking-tight text-text-primary block leading-none">
              SalonFlow
            </span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-text-muted">
              Studio OS
            </span>
          </div>
        </NavLink>
      </div>

      {/* Role Pill Banner */}
      <div className="px-6 py-3 bg-surface-bone/60 border-b border-salon-border flex items-center justify-between">
        <span className="text-xs font-mono uppercase text-text-muted">Access Level</span>
        <Badge variant="brand" size="sm">
          {role.replace('_', ' ')}
        </Badge>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.exact}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-full text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-brand text-text-primary font-bold shadow-subtle'
                    : 'text-text-secondary hover:bg-surface-bone hover:text-text-primary'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="flex-1 truncate">{item.name}</span>
              {item.external && <ExternalLink className="w-3 h-3 text-text-muted" />}
            </NavLink>
          );
        })}
      </nav>

      {/* User Footer Profile & Logout */}
      <div className="p-4 border-t border-salon-border bg-surface-bone/40">
        <div className="flex items-center gap-3 mb-3">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120'}
            alt={user?.name}
            className="w-10 h-10 rounded-full object-cover border border-salon-border shadow-subtle"
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-text-primary truncate">{user?.name}</p>
            <p className="text-[11px] text-text-muted truncate">{user?.email}</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-full border border-salon-border text-xs font-medium text-text-secondary hover:bg-white hover:text-rose-600 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
