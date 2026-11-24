import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Appointment, Service, Staff } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { formatCurrency, formatTime, formatDate, getStatusColor } from '../../utils/formatters';
import {
  Calendar as CalendarIcon,
  Search,
  Filter,
  Plus,
  Clock,
  User,
  CheckCircle,
  XCircle,
  Scissors,
  Check,
  ChevronLeft,
  ChevronRight,
  Receipt,
} from 'lucide-react';

export const AppointmentsPage: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [stylists, setStylists] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [stylistFilter, setStylistFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'calendar'>('table');

  // Modal State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null);

  // New Appointment Form
  const [newServiceId, setNewServiceId] = useState('');
  const [newStylistId, setNewStylistId] = useState('');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newTime, setNewTime] = useState('11:00');
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustEmail, setNewCustEmail] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [modalError, setModalError] = useState('');

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      let query = `/appointments?`;
      if (statusFilter !== 'ALL') query += `status=${statusFilter}&`;
      if (stylistFilter !== 'ALL') query += `stylistId=${stylistFilter}&`;
      if (dateFilter) query += `date=${dateFilter}&`;
      if (search) query += `search=${encodeURIComponent(search)}&`;

      const [apptRes, srvRes, staffRes] = await Promise.all([
        api.get<{ success: boolean; data: Appointment[] }>(query),
        api.get<{ success: boolean; data: Service[] }>('/services?active=true'),
        api.get<{ success: boolean; data: Staff[] }>('/staff?active=true'),
      ]);

      if (apptRes.success) setAppointments(apptRes.data);
      if (srvRes.success) setServices(srvRes.data);
      if (staffRes.success) setStylists(staffRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [statusFilter, stylistFilter, dateFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchAppointments();
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await api.patch(`/appointments/${id}/status`, { status });
      fetchAppointments();
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    }
  };

  const handleCreateAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setModalError('');
      await api.post('/appointments', {
        serviceId: newServiceId,
        stylistId: newStylistId,
        date: newDate,
        startTime: newTime,
        customerName: newCustName,
        customerPhone: newCustPhone,
        customerEmail: newCustEmail,
        notes: newNotes,
        bookingSource: 'ADMIN',
      });
      setIsCreateOpen(false);
      fetchAppointments();
    } catch (err: any) {
      setModalError(err.message || 'Failed to create appointment');
    }
  };

  const statuses = ['ALL', 'PENDING', 'CONFIRMED', 'CHECKED_IN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-salon-border">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-text-primary">
            Appointment Management
          </h1>
          <p className="text-xs text-text-muted mt-0.5">
            Monitor reservations, stylist schedules, and customer appointment states.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center border border-salon-border rounded-full p-1 bg-white">
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1 text-xs font-semibold rounded-full transition-all ${
                viewMode === 'table' ? 'bg-brand text-text-primary' : 'text-text-muted'
              }`}
            >
              Table View
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1 text-xs font-semibold rounded-full transition-all ${
                viewMode === 'calendar' ? 'bg-brand text-text-primary' : 'text-text-muted'
              }`}
            >
              Calendar Schedule
            </button>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsCreateOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            New Appointment
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <Card variant="white" className="p-4 space-y-4 border border-salon-border">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {statuses.map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  statusFilter === st
                    ? 'bg-brand text-text-primary shadow-subtle'
                    : 'bg-surface-bone text-text-secondary hover:bg-surface-bone/80'
                }`}
              >
                {st.replace('_', ' ')}
              </button>
            ))}
          </div>

          {/* Search & Stylist dropdown */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
            <select
              value={stylistFilter}
              onChange={(e) => setStylistFilter(e.target.value)}
              className="text-xs rounded-full border border-salon-border bg-white px-3 py-2 text-text-body focus:outline-none focus:ring-2 focus:ring-brand"
            >
              <option value="ALL">All Stylists</option>
              {stylists.map((st) => (
                <option key={st._id} value={st._id}>
                  {st.name}
                </option>
              ))}
            </select>

            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="text-xs rounded-full border border-salon-border bg-white px-3 py-2 text-text-body focus:outline-none focus:ring-2 focus:ring-brand"
            />

            <form onSubmit={handleSearchSubmit} className="flex gap-2">
              <input
                placeholder="Search guest or ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="text-xs rounded-full border border-salon-border bg-white px-3 py-2 w-44 focus:outline-none focus:ring-2 focus:ring-brand"
              />
              <button
                type="submit"
                className="p-2 rounded-full bg-surface-dark text-white hover:bg-black"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </Card>

      {/* Main Table or Calendar View */}
      {viewMode === 'table' ? (
        <Card variant="white" className="p-0 overflow-hidden border border-salon-border shadow-subtle">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-bone border-b border-salon-border text-text-muted font-mono uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Appointment ID</th>
                  <th>Guest</th>
                  <th>Service</th>
                  <th>Stylist</th>
                  <th>Date & Time</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Payment</th>
                  <th className="text-right px-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-salon-border">
                {appointments.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-text-muted">
                      No appointments matching the selected filters.
                    </td>
                  </tr>
                ) : (
                  appointments.map((appt) => (
                    <tr key={appt._id} className="hover:bg-surface-bone/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-text-primary">
                        {appt.appointmentId}
                      </td>
                      <td>
                        <p className="font-bold text-text-primary">{appt.customerName}</p>
                        <p className="text-[10px] text-text-muted font-mono">{appt.customerPhone}</p>
                      </td>
                      <td>
                        <span className="font-semibold text-text-primary">{appt.serviceName}</span>
                        <span className="text-text-muted block text-[10px]">{appt.durationMinutes} mins</span>
                      </td>
                      <td>{appt.stylistName}</td>
                      <td>
                        <span className="font-medium">{formatDate(appt.appointmentDate)}</span>
                        <span className="text-text-muted block font-mono text-[10px]">{formatTime(appt.startTime)}</span>
                      </td>
                      <td className="font-mono font-bold text-text-primary">
                        {formatCurrency(appt.finalPrice)}
                      </td>
                      <td>
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusColor(appt.status)}`}>
                          {appt.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          appt.paymentStatus === 'PAID' ? 'text-emerald-700 bg-emerald-50' : 'text-amber-800 bg-amber-50'
                        }`}>
                          {appt.paymentStatus}
                        </span>
                      </td>
                      <td className="text-right px-4">
                        <div className="flex items-center justify-end gap-1.5">
                          {appt.status === 'PENDING' && (
                            <button
                              onClick={() => handleUpdateStatus(appt._id, 'CONFIRMED')}
                              className="px-2 py-1 rounded-full bg-brand text-text-primary text-[10px] font-bold hover:bg-brand-hover"
                            >
                              Confirm
                            </button>
                          )}
                          {appt.status === 'CONFIRMED' && (
                            <button
                              onClick={() => handleUpdateStatus(appt._id, 'CHECKED_IN')}
                              className="px-2 py-1 rounded-full bg-sky-100 text-sky-800 text-[10px] font-bold hover:bg-sky-200"
                            >
                              Check In
                            </button>
                          )}
                          {appt.status === 'CHECKED_IN' && (
                            <button
                              onClick={() => handleUpdateStatus(appt._id, 'IN_PROGRESS')}
                              className="px-2 py-1 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold hover:bg-purple-200"
                            >
                              Start
                            </button>
                          )}
                          {appt.status === 'IN_PROGRESS' && (
                            <button
                              onClick={() => handleUpdateStatus(appt._id, 'COMPLETED')}
                              className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold hover:bg-emerald-200"
                            >
                              Complete
                            </button>
                          )}
                          {appt.status !== 'CANCELLED' && appt.status !== 'COMPLETED' && (
                            <button
                              onClick={() => handleUpdateStatus(appt._id, 'CANCELLED')}
                              className="px-2 py-1 rounded-full text-zinc-400 hover:text-rose-600 text-[10px]"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        /* Calendar View by Days */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {appointments.slice(0, 12).map((appt) => (
            <Card key={appt._id} variant="white" className="p-5 space-y-3 border border-salon-border">
              <div className="flex items-center justify-between pb-2 border-b border-salon-border">
                <span className="font-mono text-xs font-bold text-brand-deep">
                  {formatDate(appt.appointmentDate)} • {formatTime(appt.startTime)}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusColor(appt.status)}`}>
                  {appt.status}
                </span>
              </div>

              <div>
                <h4 className="font-display text-base font-bold text-text-primary">{appt.customerName}</h4>
                <p className="text-xs text-text-secondary">{appt.serviceName}</p>
                <p className="text-[11px] text-text-muted mt-1">Stylist: {appt.stylistName}</p>
              </div>

              <div className="pt-2 border-t border-salon-border flex items-center justify-between">
                <span className="font-mono font-bold text-text-primary">{formatCurrency(appt.finalPrice)}</span>
                <div className="flex gap-1.5">
                  {appt.status !== 'COMPLETED' && (
                    <button
                      onClick={() => handleUpdateStatus(appt._id, 'COMPLETED')}
                      className="px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px]"
                    >
                      Mark Complete
                    </button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create Appointment Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Create New Studio Appointment"
        subtitle="Book directly on behalf of a walk-in or telephone client"
      >
        <form onSubmit={handleCreateAppointment} className="space-y-4">
          {modalError && (
            <div className="p-3 rounded-lg bg-rose-50 text-rose-600 text-xs border border-rose-200">
              {modalError}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Select Service *
              </label>
              <select
                required
                value={newServiceId}
                onChange={(e) => setNewServiceId(e.target.value)}
                className="w-full rounded-full border border-salon-border px-4 py-2.5 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-brand min-h-[44px]"
              >
                <option value="">Select Service...</option>
                {services.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name} ({formatCurrency(s.price)})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Assign Stylist *
              </label>
              <select
                required
                value={newStylistId}
                onChange={(e) => setNewStylistId(e.target.value)}
                className="w-full rounded-full border border-salon-border px-4 py-2.5 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-brand min-h-[44px]"
              >
                <option value="">Select Stylist...</option>
                {stylists.map((st) => (
                  <option key={st._id} value={st._id}>
                    {st.name} ({st.specialization?.[0]})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Date *"
              type="date"
              required
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
            />
            <Input
              label="Start Time (HH:mm) *"
              type="time"
              required
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Guest Name *"
              required
              placeholder="e.g. Shalini Roy"
              value={newCustName}
              onChange={(e) => setNewCustName(e.target.value)}
            />
            <Input
              label="Phone Number *"
              required
              placeholder="+91 98765 00000"
              value={newCustPhone}
              onChange={(e) => setNewCustPhone(e.target.value)}
            />
          </div>

          <Input
            label="Email"
            type="email"
            placeholder="shalini@gmail.com"
            value={newCustEmail}
            onChange={(e) => setNewCustEmail(e.target.value)}
          />

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
              Notes
            </label>
            <textarea
              rows={2}
              placeholder="Special requests or client notes..."
              className="w-full rounded-2xl border border-salon-border px-4 py-2 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-brand"
              value={newNotes}
              onChange={(e) => setNewNotes(e.target.value)}
            />
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-salon-border">
            <Button variant="outline" type="button" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Confirm & Book
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
