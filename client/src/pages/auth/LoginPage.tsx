import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Sparkles, Mail, Lock, LogIn, ShieldAlert } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid email or password.');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
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
            Sign In to Your Account
          </h1>
          <p className="text-xs text-text-muted">
            Enter your registered credentials to access your account.
          </p>
        </div>

        {/* Main Card Form */}
        <Card variant="white" className="p-8 shadow-card border border-salon-border">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-600 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              required
              placeholder="e.g. you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
            />

            <Input
              label="Password"
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
            />

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-text-secondary">
                <input type="checkbox" defaultChecked className="rounded border-salon-border text-brand" />
                <span>Remember me</span>
              </label>
              <Link to="/contact" className="text-brand-deep hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              isLoading={isLoading}
              rightIcon={<LogIn className="w-4 h-4" />}
            >
              Sign In
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-salon-border text-center text-xs text-text-muted">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-bold text-text-primary hover:text-brand-deep underline">
              Create an account
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};
