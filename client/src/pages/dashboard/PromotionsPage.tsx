import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Promotion } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { formatCurrency } from '../../utils/formatters';
import {
  Tag,
  Plus,
  Edit2,
  Trash2,
  Copy,
  Check,
  CheckCircle,
  XCircle,
} from 'lucide-react';

export const PromotionsPage: React.FC = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<Promotion | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    code: '',
    title: '',
    description: '',
    discountType: 'PERCENTAGE' as 'PERCENTAGE' | 'FIXED',
    discountValue: 15,
    minPurchase: 1000,
    maxDiscount: 500,
    startDate: new Date().toISOString().split('T')[0],
    endDate: '2026-12-31',
    usageLimit: 500,
    active: true,
  });

  const fetchPromotions = async () => {
    try {
      setLoading(true);
      const res = await api.get<{ success: boolean; data: Promotion[] }>('/promotions');
      if (res.success) setPromotions(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleSavePromo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPromo) {
        await api.put(`/promotions/${editingPromo._id}`, formData);
      } else {
        await api.post('/promotions', formData);
      }
      setIsModalOpen(false);
      setEditingPromo(null);
      fetchPromotions();
    } catch (err: any) {
      alert(err.message || 'Failed to save promotion');
    }
  };

  const handleDeletePromo = async (id: string) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;
    try {
      await api.delete(`/promotions/${id}`);
      fetchPromotions();
    } catch (err: any) {
      alert(err.message || 'Failed to delete promotion');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-salon-border">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-text-primary">
            Promotions & Coupons
          </h1>
          <p className="text-xs text-text-muted mt-0.5">
            Configure promotional codes, seasonal campaigns, minimum spend rules, and usage caps.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => {
            setEditingPromo(null);
            setFormData({
              code: '',
              title: '',
              description: '',
              discountType: 'PERCENTAGE',
              discountValue: 15,
              minPurchase: 1000,
              maxDiscount: 500,
              startDate: new Date().toISOString().split('T')[0],
              endDate: '2026-12-31',
              usageLimit: 500,
              active: true,
            });
            setIsModalOpen(true);
          }}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Create Coupon
        </Button>
      </div>

      {/* Promotions Table */}
      <Card variant="white" className="p-0 overflow-hidden border border-salon-border shadow-subtle">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-bone border-b border-salon-border text-text-muted font-mono uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Coupon Code</th>
                <th>Campaign Title</th>
                <th>Discount</th>
                <th>Min Spend</th>
                <th>Max Cap</th>
                <th>Valid Window</th>
                <th>Redemptions</th>
                <th>Status</th>
                <th className="text-right px-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-salon-border">
              {promotions.map((p) => (
                <tr key={p._id} className="hover:bg-surface-bone/40 transition-colors">
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleCopy(p.code)}
                      className="font-mono font-bold text-brand-deep hover:underline flex items-center gap-1.5"
                    >
                      <span>{p.code}</span>
                      {copiedCode === p.code ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3 text-text-muted" />
                      )}
                    </button>
                  </td>
                  <td>
                    <p className="font-bold text-text-primary">{p.title}</p>
                    <p className="text-[10px] text-text-muted line-clamp-1">{p.description}</p>
                  </td>
                  <td className="font-mono font-bold text-text-primary">
                    {p.discountType === 'PERCENTAGE' ? `${p.discountValue}%` : formatCurrency(p.discountValue)}
                  </td>
                  <td className="font-mono">{formatCurrency(p.minPurchase)}</td>
                  <td className="font-mono">{p.maxDiscount ? formatCurrency(p.maxDiscount) : 'None'}</td>
                  <td className="font-mono text-[10px] text-text-muted">
                    {p.startDate} to {p.endDate}
                  </td>
                  <td className="font-mono text-text-primary font-bold">
                    {p.usedCount} / {p.usageLimit || '∞'}
                  </td>
                  <td>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      p.active ? 'bg-emerald-50 text-emerald-700' : 'bg-zinc-100 text-zinc-500'
                    }`}>
                      {p.active ? 'ACTIVE' : 'EXPIRED'}
                    </span>
                  </td>
                  <td className="text-right px-4">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => {
                          setEditingPromo(p);
                          setFormData({
                            code: p.code,
                            title: p.title,
                            description: p.description,
                            discountType: p.discountType,
                            discountValue: p.discountValue,
                            minPurchase: p.minPurchase,
                            maxDiscount: p.maxDiscount || 0,
                            startDate: p.startDate,
                            endDate: p.endDate,
                            usageLimit: p.usageLimit || 500,
                            active: p.active,
                          });
                          setIsModalOpen(true);
                        }}
                        className="p-1 text-text-muted hover:text-text-primary"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeletePromo(p._id)}
                        className="p-1 text-text-muted hover:text-rose-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add / Edit Promo Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPromo ? 'Edit Promotion Coupon' : 'Create New Coupon'}
        subtitle="Manage promotional discount parameters and eligibility"
      >
        <form onSubmit={handleSavePromo} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Promo Code *"
              required
              placeholder="e.g. BRIDAL2026"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
            />
            <Input
              label="Campaign Title *"
              required
              placeholder="e.g. Royal Bridal Exclusive"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Discount Type *
              </label>
              <select
                className="w-full rounded-full border border-salon-border px-4 py-2.5 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-brand min-h-[44px]"
                value={formData.discountType}
                onChange={(e) => setFormData({ ...formData, discountType: e.target.value as any })}
              >
                <option value="PERCENTAGE">PERCENTAGE (%)</option>
                <option value="FIXED">FIXED AMOUNT (₹)</option>
              </select>
            </div>

            <Input
              label={formData.discountType === 'PERCENTAGE' ? 'Discount Value (%) *' : 'Discount Value (₹) *'}
              type="number"
              required
              value={formData.discountValue}
              onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })}
            />

            <Input
              label="Min Order Spend (₹) *"
              type="number"
              value={formData.minPurchase}
              onChange={(e) => setFormData({ ...formData, minPurchase: Number(e.target.value) })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Max Discount Cap (₹)"
              type="number"
              value={formData.maxDiscount}
              onChange={(e) => setFormData({ ...formData, maxDiscount: Number(e.target.value) })}
            />
            <Input
              label="Start Date *"
              type="date"
              required
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            />
            <Input
              label="End Date *"
              type="date"
              required
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            />
          </div>

          <Input
            label="Description"
            placeholder="Promotion rules and client highlights..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />

          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-text-primary">
              <input
                type="checkbox"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                className="rounded border-salon-border text-brand"
              />
              <span>Coupon is active for bookings and checkout</span>
            </label>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-salon-border">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Promotion
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
