import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Service, ServiceCategory } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { formatCurrency } from '../../utils/formatters';
import {
  Scissors,
  Plus,
  Edit2,
  Trash2,
  Search,
  Clock,
  Sparkles,
  Check,
} from 'lucide-react';

export const ServicesManagementPage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Add/Edit Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'HAIR' as ServiceCategory,
    description: '',
    price: 1000,
    durationMinutes: 45,
    image: '',
    popular: false,
    active: true,
  });

  const fetchServices = async () => {
    try {
      setLoading(true);
      let query = `/services?`;
      if (categoryFilter !== 'ALL') query += `category=${categoryFilter}&`;
      if (search) query += `search=${encodeURIComponent(search)}&`;

      const res = await api.get<{ success: boolean; data: Service[] }>(query);
      if (res.success) setServices(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [categoryFilter]);

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingService) {
        await api.put(`/services/${editingService._id}`, formData);
      } else {
        await api.post('/services', formData);
      }
      setIsModalOpen(false);
      setEditingService(null);
      fetchServices();
    } catch (err: any) {
      alert(err.message || 'Failed to save service');
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm('Are you sure you want to remove this service?')) return;
    try {
      await api.delete(`/services/${id}`);
      fetchServices();
    } catch (err: any) {
      alert(err.message || 'Failed to delete service');
    }
  };

  const categories = ['ALL', 'HAIR', 'BEAUTY', 'NAILS', 'BRIDAL', 'TREATMENT'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-salon-border">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-text-primary">
            Service Menu Catalog
          </h1>
          <p className="text-xs text-text-muted mt-0.5">
            Configure pricing, treatment durations, descriptions, and categories.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => {
            setEditingService(null);
            setFormData({
              name: '',
              category: 'HAIR',
              description: '',
              price: 1000,
              durationMinutes: 45,
              image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600',
              popular: false,
              active: true,
            });
            setIsModalOpen(true);
          }}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add Service
        </Button>
      </div>

      {/* Filter Bar */}
      <Card variant="white" className="p-4 border border-salon-border">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  categoryFilter === cat
                    ? 'bg-brand text-text-primary shadow-subtle'
                    : 'bg-surface-bone text-text-secondary hover:bg-surface-bone/80'
                }`}
              >
                {cat === 'ALL' ? 'All Services' : cat}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              placeholder="Search service..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="text-xs rounded-full border border-salon-border bg-white px-4 py-2 w-full sm:w-60 focus:outline-none focus:ring-2 focus:ring-brand"
            />
            <button
              onClick={fetchServices}
              className="p-2 rounded-full bg-surface-dark text-white hover:bg-black"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </Card>

      {/* Services Table */}
      <Card variant="white" className="p-0 overflow-hidden border border-salon-border shadow-subtle">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-bone border-b border-salon-border text-text-muted font-mono uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Service</th>
                <th>Category</th>
                <th>Duration</th>
                <th>Price (INR)</th>
                <th>Status</th>
                <th>Popular</th>
                <th className="text-right px-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-salon-border">
              {services.map((srv) => (
                <tr key={srv._id} className="hover:bg-surface-bone/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={srv.image || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=100'}
                        alt={srv.name}
                        className="w-10 h-10 rounded-lg object-cover border border-salon-border shrink-0"
                      />
                      <div>
                        <p className="font-bold text-text-primary">{srv.name}</p>
                        <p className="text-[11px] text-text-muted line-clamp-1">{srv.description}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <Badge variant="muted" size="sm">{srv.category}</Badge>
                  </td>
                  <td className="font-mono text-text-primary">{srv.durationMinutes} mins</td>
                  <td className="font-mono font-bold text-text-primary">{formatCurrency(srv.price)}</td>
                  <td>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      srv.active ? 'bg-emerald-50 text-emerald-700' : 'bg-zinc-100 text-zinc-500'
                    }`}>
                      {srv.active ? 'ACTIVE' : 'DISABLED'}
                    </span>
                  </td>
                  <td>
                    {srv.popular && (
                      <span className="px-2 py-0.5 rounded-full bg-brand-light/40 text-text-primary text-[10px] font-bold">
                        ★ POPULAR
                      </span>
                    )}
                  </td>
                  <td className="text-right px-4">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => {
                          setEditingService(srv);
                          setFormData({
                            name: srv.name,
                            category: srv.category,
                            description: srv.description,
                            price: srv.price,
                            durationMinutes: srv.durationMinutes,
                            image: srv.image || '',
                            popular: srv.popular,
                            active: srv.active,
                          });
                          setIsModalOpen(true);
                        }}
                        className="p-1.5 rounded-full hover:bg-surface-bone text-text-secondary"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteService(srv._id)}
                        className="p-1.5 rounded-full hover:bg-rose-50 text-text-secondary hover:text-rose-600"
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

      {/* Add / Edit Service Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingService ? 'Edit Salon Service' : 'Add New Service'}
        subtitle="Manage service parameters, duration, pricing, and category"
      >
        <form onSubmit={handleSaveService} className="space-y-4">
          <Input
            label="Service Name *"
            required
            placeholder="e.g. Brazilian Keratin Smoothing"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Category *
              </label>
              <select
                className="w-full rounded-full border border-salon-border px-4 py-2.5 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-brand min-h-[44px]"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as ServiceCategory })}
              >
                <option value="HAIR">HAIR</option>
                <option value="BEAUTY">BEAUTY</option>
                <option value="NAILS">NAILS</option>
                <option value="BRIDAL">BRIDAL</option>
                <option value="TREATMENT">TREATMENT</option>
              </select>
            </div>

            <Input
              label="Price (₹ INR) *"
              type="number"
              required
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
            />

            <Input
              label="Duration (Minutes) *"
              type="number"
              required
              value={formData.durationMinutes}
              onChange={(e) => setFormData({ ...formData, durationMinutes: Number(e.target.value) })}
            />
          </div>

          <Input
            label="Image URL"
            placeholder="https://images.unsplash.com/..."
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
          />

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
              Description
            </label>
            <textarea
              rows={3}
              placeholder="Treatment steps, formulations used, benefits..."
              className="w-full rounded-2xl border border-salon-border px-4 py-2 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-brand"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-text-primary">
              <input
                type="checkbox"
                checked={formData.popular}
                onChange={(e) => setFormData({ ...formData, popular: e.target.checked })}
                className="rounded border-salon-border text-brand"
              />
              <span>Mark as Popular Service</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-text-primary">
              <input
                type="checkbox"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                className="rounded border-salon-border text-brand"
              />
              <span>Active in Online Catalog</span>
            </label>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-salon-border">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Service
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
