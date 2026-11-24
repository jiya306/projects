import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { SalonSettings } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Settings, Save, ShieldCheck, Sparkles } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<SalonSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const res = await api.get<{ success: boolean; data: SalonSettings }>('/settings');
        if (res.success) setSettings(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    try {
      setSaving(true);
      await api.put('/settings', settings);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return <div className="py-20 text-center text-xs text-text-muted">Loading studio settings...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-salon-border">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-text-primary">
            Salon Configuration & Policies
          </h1>
          <p className="text-xs text-text-muted mt-0.5">
            Configure studio metadata, booking rules, GST tax rates, and customer loyalty parameters.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Salon Profile Settings */}
        <Card variant="white" className="p-6 space-y-4">
          <h3 className="font-display text-base font-bold text-text-primary pb-2 border-b border-salon-border">
            Studio Identity & Concierge
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Salon Name"
              required
              value={settings.salonName}
              onChange={(e) => setSettings({ ...settings, salonName: e.target.value })}
            />
            <Input
              label="Brand Tagline"
              value={settings.tagline}
              onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Contact Phone"
              value={settings.phone}
              onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
            />
            <Input
              label="Email Address"
              type="email"
              value={settings.email}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
            />
          </div>

          <Input
            label="Studio Address"
            value={settings.address}
            onChange={(e) => setSettings({ ...settings, address: e.target.value })}
          />
        </Card>

        {/* Operating Hours & Booking Rules */}
        <Card variant="white" className="p-6 space-y-4">
          <h3 className="font-display text-base font-bold text-text-primary pb-2 border-b border-salon-border">
            Operating Hours & Scheduling Engine
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Opening Time (HH:mm)"
              value={settings.openingHours}
              onChange={(e) => setSettings({ ...settings, openingHours: e.target.value })}
            />
            <Input
              label="Closing Time (HH:mm)"
              value={settings.closingHours}
              onChange={(e) => setSettings({ ...settings, closingHours: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Buffer Time Between Appointments (Minutes)"
              type="number"
              value={settings.bufferTimeMinutes}
              onChange={(e) => setSettings({ ...settings, bufferTimeMinutes: Number(e.target.value) })}
            />
            <Input
              label="Max Advance Booking Limit (Days)"
              type="number"
              value={settings.advanceBookingDays}
              onChange={(e) => setSettings({ ...settings, advanceBookingDays: Number(e.target.value) })}
            />
          </div>

          <Input
            label="Cancellation Policy Notice"
            value={settings.cancellationPolicy}
            onChange={(e) => setSettings({ ...settings, cancellationPolicy: e.target.value })}
          />
        </Card>

        {/* Tax and Loyalty Rules */}
        <Card variant="white" className="p-6 space-y-4">
          <h3 className="font-display text-base font-bold text-text-primary pb-2 border-b border-salon-border">
            Tax Configuration & Loyalty Formula
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Standard Tax Rate (%)"
              type="number"
              value={settings.taxRatePercent}
              onChange={(e) => setSettings({ ...settings, taxRatePercent: Number(e.target.value) })}
            />
            <Input
              label="Tax Label (e.g. GST)"
              value={settings.taxName}
              onChange={(e) => setSettings({ ...settings, taxName: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Loyalty Point Earn Rate (₹ spend = 1 point)"
              type="number"
              value={settings.loyaltyEarnRate}
              onChange={(e) => setSettings({ ...settings, loyaltyEarnRate: Number(e.target.value) })}
            />
            <Input
              label="Loyalty Point Redemption Value (1 point = ₹ discount)"
              type="number"
              value={settings.loyaltyRedeemRate}
              onChange={(e) => setSettings({ ...settings, loyaltyRedeemRate: Number(e.target.value) })}
            />
          </div>
        </Card>

        {/* Action Button */}
        <div className="flex items-center justify-between pt-4">
          {savedSuccess ? (
            <span className="text-xs text-emerald-700 font-bold">
              ✓ All studio settings successfully saved to MongoDB!
            </span>
          ) : (
            <span />
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={saving}
            rightIcon={<Save className="w-4 h-4" />}
          >
            Save Configuration
          </Button>
        </div>
      </form>
    </div>
  );
};
