import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { formatTime, formatDate } from '../../utils/formatters';
import {
  Bell,
  CheckCheck,
  ExternalLink,
  Sparkles,
  Menu,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const Topbar: React.FC<{ onToggleMobileMenu: () => void }> = ({ onToggleMobileMenu }) => {
  const { user } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="h-16 bg-surface-cream border-b border-salon-border px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left: Mobile Toggle & Context */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleMobileMenu}
          className="md:hidden p-2 rounded-full border border-salon-border text-text-primary hover:bg-surface-bone"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h2 className="font-display text-lg font-bold text-text-primary leading-tight">
            Studio Management
          </h2>
          <p className="text-[11px] text-text-muted hidden sm:block">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Right Actions: Notifications + Portal Link */}
      <div className="flex items-center gap-3">
        {/* Public Website Preview Link */}
        <Link
          to="/"
          target="_blank"
          className="hidden lg:flex items-center gap-1.5 text-xs text-text-secondary hover:text-text-primary px-3 py-1.5 rounded-full border border-salon-border hover:bg-surface-bone transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-brand" />
          <span>View Public Site</span>
          <ExternalLink className="w-3 h-3 text-text-muted" />
        </Link>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2.5 rounded-full border border-salon-border bg-white text-text-primary hover:bg-surface-bone relative transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand text-text-primary text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-card shadow-card border border-salon-border z-50 overflow-hidden">
              <div className="p-4 border-b border-salon-border flex items-center justify-between bg-surface-bone/50">
                <div className="flex items-center gap-2">
                  <h4 className="font-display text-sm font-bold text-text-primary">Studio Alerts</h4>
                  {unreadCount > 0 && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-light/50 text-text-primary font-bold">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-brand-deep hover:underline flex items-center gap-1"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span>Mark all read</span>
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-salon-border">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-text-muted">
                    No notifications right now.
                  </div>
                ) : (
                  notifications.slice(0, 10).map((n) => (
                    <div
                      key={n._id}
                      onClick={() => markAsRead(n._id)}
                      className={`p-3.5 text-xs transition-colors cursor-pointer hover:bg-surface-bone ${
                        !n.read ? 'bg-brand-light/10 font-medium' : 'text-text-secondary'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-text-primary">{n.title}</span>
                        <span className="text-[10px] text-text-muted font-mono">
                          {formatDate(n.createdAt)}
                        </span>
                      </div>
                      <p className="text-text-body line-clamp-2">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
