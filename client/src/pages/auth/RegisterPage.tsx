import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Sparkles, User, Mail, Phone, Lock, UserPlus } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'CUSTOMER',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      await register(formData);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-9 h-9 rounded-full bg-surface-dark flex items-center justify-center text-brand">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="font-display text-2xl font-bold tracking-tight text-text-primary">
              SalonFlow
            </span>
          </Link>
          <h1 className="font-display text-2xl font-bold text-text-primary">
            Create Your Account
          </h1>
          <p className="text-xs text-text-muted">
            Join SalonFlow for personalized bookings, loyalty points, and exclusive privileges.
          </p>
        </div>

        <Card variant="white" className="p-8 shadow-card border border-salon-border">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              required
              placeholder="e.g. Anjali Rao"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              leftIcon={<User className="w-4 h-4" />}
            />

            <Input
              label="Email Address"
              type="email"
              required
              placeholder="anjali@gmail.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              leftIcon={<Mail className="w-4 h-4" />}
            />

            <Input
              label="Phone Number"
              required
              placeholder="+91 98765 43210"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              leftIcon={<Phone className="w-4 h-4" />}
            />

            <Input
              label="Create Password"
              type="password"
              required
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              leftIcon={<Lock className="w-4 h-4" />}
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              isLoading={isLoading}
              rightIcon={<UserPlus className="w-4 h-4" />}
            >
              Register Account
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-salon-border text-center text-xs text-text-muted">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-text-primary hover:text-brand-deep underline">
              Sign In
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};
