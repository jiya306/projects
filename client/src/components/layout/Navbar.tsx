import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { Sparkles, Menu, X, ArrowRight, UserCircle, LogOut, Calendar } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Stylists', path: '/stylists' },
    { name: 'Offers', path: '/offers' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 bg-surface-cream/90 backdrop-blur-md border-b border-salon-border transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full bg-surface-dark flex items-center justify-center text-brand transition-transform group-hover:scale-105">
            <Sparkles className="w-5 h-5 text-brand" />
          </div>
          <div>
            <span className="font-display text-2xl font-bold tracking-tight text-text-primary block leading-none">
              SalonFlow
            </span>
            <span className="text-[10px] uppercase font-mono tracking-widest text-text-muted">
              Luxe Studio
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-sm font-medium transition-colors hover:text-brand-deep ${
                isActive(link.path)
                  ? 'text-text-primary font-semibold border-b-2 border-brand pb-1'
                  : 'text-text-secondary'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Right CTA Actions */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/dashboard')}
                leftIcon={<UserCircle className="w-4 h-4 text-brand-deep" />}
              >
                Dashboard ({user.role.toLowerCase()})
              </Button>
              <button
                onClick={logout}
                title="Log Out"
                className="p-2 rounded-full border border-salon-border hover:bg-surface-bone text-text-secondary transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="text-sm font-medium text-text-body hover:text-text-primary px-3 py-2 transition-colors"
            >
              Sign In
            </Link>
          )}

          <Button
            variant="primary"
            size="md"
            onClick={() => navigate('/book')}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Book Appointment
          </Button>
        </div>

        {/* Mobile Menu Toggle Button */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-full border border-salon-border text-text-primary bg-white"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-surface-cream border-b border-salon-border px-6 py-6 space-y-4">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-base font-medium py-1.5 ${
                  isActive(link.path) ? 'text-brand-deep font-bold' : 'text-text-secondary'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="pt-4 border-t border-salon-border flex flex-col gap-3">
            {user ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    navigate('/dashboard');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full"
                >
                  Go to Dashboard
                </Button>
                <Button variant="ghost" onClick={logout} className="w-full">
                  Sign Out
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                onClick={() => {
                  navigate('/login');
                  setMobileMenuOpen(false);
                }}
                className="w-full"
              >
                Sign In
              </Button>
            )}
            <Button
              variant="primary"
              onClick={() => {
                navigate('/book');
                setMobileMenuOpen(false);
              }}
              className="w-full"
            >
              Book Appointment
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};
