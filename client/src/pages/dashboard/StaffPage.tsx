import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Staff } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { formatCurrency } from '../../utils/formatters';
import {
  UserCheck,
  Plus,
  Star,
  Calendar,
  IndianRupee,
  Phone,
  Mail,
  Award,
  Check,
  Edit2,
  TrendingUp,
} from 'lucide-react';

export const StaffPage: React.FC = () => {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);

  // Performance Modal
  const [performanceStaff, setPerformanceStaff] = useState<any>(null);
  const [performanceData, setPerformanceData] = useState<any>(null);
  const [loadingPerf, setLoadingPerf] = useState(false);

  // Add/Edit Staff Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'STYLIST',
    specialization: 'Haircut & Styling',
    experienceYears: 3,
    salary: 40000,
    commissionPercentage: 15,
    image: '',
    bio: '',
  });

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const res = await api.get<{ success: boolean; data: Staff[] }>('/staff');
      if (res.success) setStaffList(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleOpenPerformance = async (stf: Staff) => {
    setPerformanceStaff(stf);
    try {
      setLoadingPerf(true);
      const res = await api.get<{ success: boolean; data: any }>(`/staff/${stf._id}/performance`);
      if (res.success) {
        setPerformanceData(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingPerf(false);
    }
  };

  const handleSaveStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        specialization: [formData.specialization],
      };
      if (editingStaff) {
        await api.put(`/staff/${editingStaff._id}`, payload);
      } else {
        await api.post('/staff', payload);
      }
      setIsModalOpen(false);
      setEditingStaff(null);
      fetchStaff();
    } catch (err: any) {
      alert(err.message || 'Failed to save staff member');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-salon-border">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-text-primary">
            Staff & Stylist Management
          </h1>
          <p className="text-xs text-text-muted mt-0.5">
            Manage artist profiles, working hours, commissions, and individual performance metrics.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => {
            setEditingStaff(null);
            setFormData({
              name: '',
              email: '',
              phone: '',
              role: 'STYLIST',
              specialization: 'Haircut & Styling',
              experienceYears: 3,
              salary: 40000,
              commissionPercentage: 15,
              image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
              bio: '',
            });
            setIsModalOpen(true);
          }}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add Staff Member
        </Button>
      </div>

      {/* Staff Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {staffList.map((stf) => (
          <Card
            key={stf._id}
            variant="white"
            className="flex flex-col justify-between p-6 border border-salon-border shadow-subtle text-center group"
          >
            <div>
              <div className="relative mx-auto w-24 h-24 rounded-full overflow-hidden border-2 border-brand/50 shadow-subtle mb-3">
                <img
                  src={stf.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300'}
                  alt={stf.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex items-center justify-center gap-1 text-xs text-amber-500 font-bold mb-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="text-text-primary">{stf.rating}</span>
                <span className="text-text-muted font-normal">({stf.reviewCount || 100})</span>
              </div>

              <h3 className="font-display text-lg font-bold text-text-primary">{stf.name}</h3>
              <p className="text-xs text-brand-deep font-semibold mt-0.5">
                {stf.specialization?.[0] || stf.role}
              </p>
              <span className="text-[10px] font-mono text-text-muted block mt-1">
                {stf.employeeId} • {stf.experienceYears}+ yrs
              </span>

              <div className="mt-4 p-3 rounded-xl bg-surface-bone text-left space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-text-muted">Salary:</span>
                  <strong className="font-mono">{formatCurrency(stf.salary)}/mo</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Commission:</span>
                  <strong className="font-mono">{stf.commissionPercentage}%</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Hours:</span>
                  <span className="font-mono text-text-primary">10:00 – 20:00</span>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-salon-border flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => handleOpenPerformance(stf)}
              >
                Performance
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setEditingStaff(stf);
                  setFormData({
                    name: stf.name,
                    email: stf.email,
                    phone: stf.phone,
                    role: stf.role,
                    specialization: stf.specialization?.[0] || 'Haircut & Styling',
                    experienceYears: stf.experienceYears,
                    salary: stf.salary,
                    commissionPercentage: stf.commissionPercentage,
                    image: stf.image || '',
                    bio: stf.bio || '',
                  });
                  setIsModalOpen(true);
                }}
              >
                <Edit2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Staff Performance Modal */}
      <Modal
        isOpen={!!performanceStaff}
        onClose={() => setPerformanceStaff(null)}
        title={`${performanceStaff?.name} — Performance Review`}
        subtitle="Live metrics calculated directly from MongoDB appointments and settlements"
      >
        {loadingPerf ? (
          <div className="py-12 text-center text-xs text-text-muted">Loading performance data...</div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-card bg-surface-bone border border-salon-border">
              <div>
                <span className="text-[10px] font-mono uppercase text-text-muted block">Delivered Services</span>
                <p className="font-display text-2xl font-bold text-text-primary">
                  {performanceData?.completedAppointments || 0}
                </p>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-text-muted block">Revenue Generated</span>
                <p className="font-display text-2xl font-bold text-emerald-700">
                  {formatCurrency(performanceData?.totalRevenueGenerated || 0)}
                </p>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-text-muted block">Commissions Earned</span>
                <p className="font-display text-2xl font-bold text-brand-deep">
                  {formatCurrency(performanceData?.estimatedCommission || 0)}
                </p>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-text-muted block">Guest Rating</span>
                <p className="font-display text-2xl font-bold text-amber-500">
                  ★ {performanceData?.rating || 4.9}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-salon-border text-xs space-y-2">
              <h4 className="font-bold text-text-primary">Stylist Summary:</h4>
              <p className="text-text-secondary leading-relaxed">
                {performanceStaff?.bio || 'Dedicated master stylist with consistent 5-star ratings and steady revenue generation.'}
              </p>
            </div>
          </div>
        )}
      </Modal>

      {/* Add / Edit Staff Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingStaff ? 'Edit Staff Profile' : 'Add New Salon Artist'}
        subtitle="Manage employee profile, compensation, and specializations"
      >
        <form onSubmit={handleSaveStaff} className="space-y-4">
          <Input
            label="Artist Name *"
            required
            placeholder="e.g. Ananya Sharma"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Email Address *"
              type="email"
              required
              placeholder="ananya@salonflow.demo"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <Input
              label="Phone Number *"
              required
              placeholder="+91 98200 00000"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Specialization"
              placeholder="e.g. Hair Coloring"
              value={formData.specialization}
              onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
            />
            <Input
              label="Experience (Years)"
              type="number"
              value={formData.experienceYears}
              onChange={(e) => setFormData({ ...formData, experienceYears: Number(e.target.value) })}
            />
            <Input
              label="Commission %"
              type="number"
              value={formData.commissionPercentage}
              onChange={(e) => setFormData({ ...formData, commissionPercentage: Number(e.target.value) })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Base Salary (₹)"
              type="number"
              value={formData.salary}
              onChange={(e) => setFormData({ ...formData, salary: Number(e.target.value) })}
            />
            <Input
              label="Photo URL"
              placeholder="https://images.unsplash.com/..."
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
              Bio & Highlights
            </label>
            <textarea
              rows={2}
              placeholder="Specialist credentials, certifications, styling philosophy..."
              className="w-full rounded-2xl border border-salon-border px-4 py-2 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-brand"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            />
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-salon-border">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Artist
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
