import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Customer } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { formatCurrency, formatDate } from '../../utils/formatters';
import {
  Users,
  Search,
  Plus,
  Phone,
  Mail,
  Award,
  Sparkles,
  Calendar,
  CreditCard,
  History,
  User,
  Edit2,
  Trash2,
} from 'lucide-react';

export const CustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState('ALL');

  // Customer Detail Profile Modal
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [customerDetails, setCustomerDetails] = useState<any>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Add/Edit Customer Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    dateOfBirth: '',
    address: '',
    gender: 'FEMALE',
    notes: '',
  });

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      let query = `/customers?`;
      if (tierFilter !== 'ALL') query += `tier=${tierFilter}&`;
      if (search) query += `search=${encodeURIComponent(search)}&`;

      const res = await api.get<{ success: boolean; data: Customer[] }>(query);
      if (res.success) setCustomers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [tierFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCustomers();
  };

  const handleOpenDetails = async (cust: Customer) => {
    setSelectedCustomer(cust);
    try {
      setLoadingDetails(true);
      const res = await api.get<{ success: boolean; data: any; appointments: any[]; payments: any[]; loyaltyHistory: any[] }>(
        `/customers/${cust._id}`
      );
      if (res.success) {
        setCustomerDetails(res);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleSaveCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCustomer) {
        await api.put(`/customers/${editingCustomer._id}`, formData);
      } else {
        await api.post('/customers', formData);
      }
      setIsModalOpen(false);
      setEditingCustomer(null);
      fetchCustomers();
    } catch (err: any) {
      alert(err.message || 'Failed to save customer');
    }
  };

  const tiers = ['ALL', 'BRONZE', 'SILVER', 'GOLD', 'PLATINUM'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-salon-border">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-text-primary">
            Customer CRM & Loyalty
          </h1>
          <p className="text-xs text-text-muted mt-0.5">
            Manage guest profiles, loyalty tiers, lifetime spend, and service history.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => {
            setEditingCustomer(null);
            setFormData({
              name: '',
              phone: '',
              email: '',
              dateOfBirth: '',
              address: '',
              gender: 'FEMALE',
              notes: '',
            });
            setIsModalOpen(true);
          }}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add New Guest
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <Card variant="white" className="p-4 border border-salon-border">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
            {tiers.map((t) => (
              <button
                key={t}
                onClick={() => setTierFilter(t)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  tierFilter === t
                    ? 'bg-brand text-text-primary shadow-subtle'
                    : 'bg-surface-bone text-text-secondary hover:bg-surface-bone/80'
                }`}
              >
                {t === 'ALL' ? 'All Tiers' : t}
              </button>
            ))}
          </div>

          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <input
              placeholder="Search by name, phone or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="text-xs rounded-full border border-salon-border bg-white px-4 py-2 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-brand"
            />
            <button
              type="submit"
              className="p-2 rounded-full bg-surface-dark text-white hover:bg-black"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </Card>

      {/* Customers Table */}
      <Card variant="white" className="p-0 overflow-hidden border border-salon-border shadow-subtle">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-bone border-b border-salon-border text-text-muted font-mono uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Guest</th>
                <th>Contact</th>
                <th>Tier</th>
                <th>Visits</th>
                <th>Total Spent</th>
                <th>Loyalty Points</th>
                <th>Preferred Stylist</th>
                <th className="text-right px-4">Profile</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-salon-border">
              {customers.map((cust) => (
                <tr key={cust._id} className="hover:bg-surface-bone/40 transition-colors">
                  <td className="py-3 px-4">
                    <p className="font-bold text-text-primary">{cust.name}</p>
                    <span className="text-[10px] text-text-muted font-mono">
                      Registered {formatDate(cust.createdAt)}
                    </span>
                  </td>
                  <td>
                    <p className="font-mono">{cust.phone}</p>
                    <p className="text-[10px] text-text-muted">{cust.email}</p>
                  </td>
                  <td>
                    <Badge variant="tier" tier={cust.tier} size="sm">
                      {cust.tier}
                    </Badge>
                  </td>
                  <td className="font-bold font-mono text-text-primary">{cust.totalVisits}</td>
                  <td className="font-bold font-mono text-text-primary">
                    {formatCurrency(cust.totalSpending)}
                  </td>
                  <td>
                    <span className="px-2 py-0.5 rounded-full bg-brand-light/40 text-text-primary font-mono font-bold text-[11px]">
                      ★ {cust.loyaltyPoints} pts
                    </span>
                  </td>
                  <td className="text-text-secondary">
                    {cust.preferredStylist?.name || 'Any Stylist'}
                  </td>
                  <td className="text-right px-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenDetails(cust)}
                    >
                      View Dossier
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Customer Profile Dossier Modal */}
      <Modal
        isOpen={!!selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
        title={selectedCustomer?.name}
        subtitle={`Guest CRM Profile • Registered ${formatDate(selectedCustomer?.createdAt)}`}
        maxWidth="xl"
      >
        {loadingDetails ? (
          <div className="py-12 text-center text-xs text-text-muted">Loading profile dossier...</div>
        ) : (
          <div className="space-y-6">
            {/* Top Quick Stats */}
            <div className="grid grid-cols-4 gap-4 p-4 rounded-card bg-surface-bone border border-salon-border">
              <div>
                <span className="text-[10px] font-mono uppercase text-text-muted block">Tier Status</span>
                <Badge variant="tier" tier={selectedCustomer?.tier} size="sm" className="mt-1">
                  {selectedCustomer?.tier}
                </Badge>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-text-muted block">Total Visits</span>
                <p className="font-display text-xl font-bold text-text-primary">{selectedCustomer?.totalVisits}</p>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-text-muted block">Lifetime Spend</span>
                <p className="font-display text-xl font-bold text-text-primary">
                  {formatCurrency(selectedCustomer?.totalSpending || 0)}
                </p>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-text-muted block">Loyalty Points</span>
                <p className="font-display text-xl font-bold text-brand-deep">
                  ★ {selectedCustomer?.loyaltyPoints} pts
                </p>
              </div>
            </div>

            {/* Appointment History */}
            <div>
              <h4 className="font-display text-sm font-bold text-text-primary mb-2 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-brand-deep" />
                <span>Appointment History</span>
              </h4>
              <div className="border border-salon-border rounded-xl overflow-hidden max-h-48 overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-surface-bone text-text-muted font-mono uppercase text-[10px]">
                    <tr>
                      <th className="py-2 px-3">Date</th>
                      <th>Service</th>
                      <th>Stylist</th>
                      <th>Price</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-salon-border">
                    {customerDetails?.appointments?.map((a: any) => (
                      <tr key={a._id}>
                        <td className="py-2 px-3 font-mono">{formatDate(a.appointmentDate)}</td>
                        <td className="font-bold">{a.serviceName}</td>
                        <td>{a.stylistName}</td>
                        <td className="font-mono">{formatCurrency(a.finalPrice)}</td>
                        <td>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                            {a.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Loyalty Transactions Log */}
            <div>
              <h4 className="font-display text-sm font-bold text-text-primary mb-2 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-brand-deep" />
                <span>Loyalty Point History</span>
              </h4>
              <div className="space-y-1.5 max-h-36 overflow-y-auto">
                {customerDetails?.loyaltyHistory?.map((l: any) => (
                  <div
                    key={l._id}
                    className="p-2.5 rounded-lg bg-surface-bone/60 border border-salon-border flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-semibold text-text-primary">{l.reason}</span>
                      <span className="text-[10px] text-text-muted block font-mono">{formatDate(l.date)}</span>
                    </div>
                    <span className="font-mono font-bold text-brand-deep">
                      +{l.points} pts
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Add / Edit Customer Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCustomer ? 'Edit Guest Profile' : 'Register New Guest'}
        subtitle="Maintain comprehensive customer profiles and preferences"
      >
        <form onSubmit={handleSaveCustomer} className="space-y-4">
          <Input
            label="Full Name *"
            required
            placeholder="e.g. Shalini Roy"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Phone Number *"
              required
              placeholder="+91 98765 00000"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            <Input
              label="Email Address *"
              type="email"
              required
              placeholder="shalini@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Date of Birth"
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
            />
            <Input
              label="Address / Area"
              placeholder="Indiranagar, Bengaluru"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
              Guest Notes & Preferences
            </label>
            <textarea
              rows={2}
              placeholder="Hair allergy history, favorite tea, scalp sensitivity..."
              className="w-full rounded-2xl border border-salon-border px-4 py-2 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-brand"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-salon-border">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Profile
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
