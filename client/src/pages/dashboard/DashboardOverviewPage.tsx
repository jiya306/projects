import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { formatCurrency, formatTime, formatDate, getStatusColor } from '../../utils/formatters';
import {
  Calendar,
  Users,
  IndianRupee,
  TrendingUp,
  UserCheck,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Scissors,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export const DashboardOverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [customerBookings, setCustomerBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const isCustomer = user?.role === 'CUSTOMER';

  const fetchSummary = async () => {
    try {
      setLoading(true);
      if (isCustomer) {
        const res = await api.get<{ success: boolean; data: any[] }>('/appointments');
        if (res.success) {
          setCustomerBookings(res.data || []);
        }
      } else {
        const res = await api.get<{ success: boolean; data: any }>('/analytics/dashboard');
        if (res.success) {
          setDashboardData(res.data);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, [user?.role]);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await api.patch(`/appointments/${id}/status`, { status: newStatus });
      fetchSummary();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-xs text-text-muted">
        Loading live salon intelligence...
      </div>
    );
  }

  // --- Customer Portal View ---
  if (isCustomer) {
    const upcoming = customerBookings.filter((b) =>
      ['CONFIRMED', 'PENDING', 'CHECKED_IN', 'IN_PROGRESS'].includes(b.status)
    );
    const past = customerBookings.filter((b) => ['COMPLETED', 'CANCELLED'].includes(b.status));

    return (
      <div className="space-y-8">
        {/* Welcome Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-salon-border">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-text-muted">
              Guest Portal
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-text-primary">
              Welcome, {user?.name.split(' ')[0]}
            </h1>
            <p className="text-xs text-text-secondary mt-0.5">
              Manage your personal salon reservations, loyalty rewards, and bookings.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/services')}
            >
              Browse Services
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/book')}
              rightIcon={<Sparkles className="w-3.5 h-3.5" />}
            >
              Book Service
            </Button>
          </div>
        </div>

        {/* Customer Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card variant="white" className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-mono uppercase text-text-muted">Membership Tier</p>
              <h3 className="font-display text-2xl font-bold text-text-primary mt-1">
                {user?.tier || 'SILVER'}
              </h3>
              <span className="text-[10px] text-brand-deep font-semibold">VIP Privilege</span>
            </div>
            <div className="w-11 h-11 rounded-full bg-brand-light/50 text-text-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
          </Card>

          <Card variant="white" className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-mono uppercase text-text-muted">Loyalty Balance</p>
              <h3 className="font-display text-2xl font-bold text-emerald-700 mt-1">
                {user?.loyaltyPoints || 0} pts
              </h3>
              <span className="text-[10px] text-emerald-700">Redeemable at checkout</span>
            </div>
            <div className="w-11 h-11 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </Card>

          <Card variant="white" className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-mono uppercase text-text-muted">Upcoming Visits</p>
              <h3 className="font-display text-2xl font-bold text-text-primary mt-1">
                {upcoming.length}
              </h3>
              <span className="text-[10px] text-brand-deep font-semibold">Scheduled sessions</span>
            </div>
            <div className="w-11 h-11 rounded-full bg-brand-light/50 text-text-primary flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </Card>

          <Card variant="white" className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-mono uppercase text-text-muted">Total Visits</p>
              <h3 className="font-display text-2xl font-bold text-text-primary mt-1">
                {customerBookings.length}
              </h3>
              <span className="text-[10px] text-text-muted font-mono">Completed experiences</span>
            </div>
            <div className="w-11 h-11 rounded-full bg-surface-bone text-text-primary flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
          </Card>
        </div>

        {/* Customer Bookings Table */}
        <Card variant="white" className="p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-salon-border">
            <div>
              <h3 className="font-display text-base font-bold text-text-primary">
                My Appointments
              </h3>
              <p className="text-xs text-text-muted">All past and upcoming reservations with our stylists</p>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/book')}
              rightIcon={<Scissors className="w-3.5 h-3.5" />}
            >
              Book New Appointment
            </Button>
          </div>

          {customerBookings.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-surface-bone text-text-muted mx-auto flex items-center justify-center">
                <Calendar className="w-6 h-6" />
              </div>
              <h4 className="font-display text-sm font-bold text-text-primary">No appointments yet</h4>
              <p className="text-xs text-text-muted max-w-sm mx-auto">
                You haven't scheduled any salon visits yet. Pick your favorite stylist and service to get started!
              </p>
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate('/book')}
                className="mt-2"
              >
                Book Your First Visit
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-salon-border text-text-muted font-mono uppercase text-[10px]">
                    <th className="py-2.5">Booking Ref</th>
                    <th>Service</th>
                    <th>Stylist</th>
                    <th>Date & Time</th>
                    <th>Price</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-salon-border">
                  {customerBookings.map((appt: any) => (
                    <tr key={appt._id} className="hover:bg-surface-bone/40 transition-colors">
                      <td className="py-3 font-mono font-bold text-text-primary">{appt.appointmentId}</td>
                      <td className="font-semibold text-text-primary">{appt.serviceName}</td>
                      <td>{appt.stylistName}</td>
                      <td>
                        <span>{formatDate(appt.appointmentDate)}</span>
                        <span className="text-text-muted block font-mono text-[10px]">{formatTime(appt.startTime)}</span>
                      </td>
                      <td className="font-bold font-mono text-text-primary">{formatCurrency(appt.finalPrice)}</td>
                      <td>
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusColor(appt.status)}`}>
                          {appt.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    );
  }

  // --- Executive Dashboard View (Admin, Salon Owner, Receptionist, Stylist) ---

  const kpi = dashboardData?.kpi || {};
  const revenueTrend = dashboardData?.revenueTrend || [];
  const statusCounts = dashboardData?.statusCounts || [];
  const recentAppointments = dashboardData?.recentAppointments || [];
  const upcomingAppointments = dashboardData?.upcomingAppointments || [];
  const lowStockProducts = dashboardData?.lowStockProducts || [];

  const pieColors: Record<string, string> = {
    COMPLETED: '#7CCBEE',
    CONFIRMED: '#2B9A66',
    PENDING: '#F59E0B',
    CANCELLED: '#94A3B8',
    IN_PROGRESS: '#42A9D8',
  };

  const statusPieData = statusCounts.map((sc: any) => ({
    name: sc._id,
    value: sc.count,
    color: pieColors[sc._id] || '#CBD5E1',
  }));

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-salon-border">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-text-muted">
            Executive Studio Dashboard
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-text-primary">
            Welcome back, {user?.name.split(' ')[0]}
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Here is your live salon operations summary for today.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/dashboard/appointments')}
          >
            All Appointments
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/book')}
            rightIcon={<Sparkles className="w-3.5 h-3.5" />}
          >
            New Booking
          </Button>
        </div>
      </div>

      {/* KPI 8-Card Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Today's Appointments */}
        <Card variant="white" className="p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-mono uppercase text-text-muted">Today's Bookings</p>
            <h3 className="font-display text-2xl font-bold text-text-primary mt-1">
              {kpi.todayAppointmentsCount || 0}
            </h3>
            <span className="text-[10px] text-brand-deep font-semibold">Active schedule</span>
          </div>
          <div className="w-11 h-11 rounded-full bg-brand-light/50 text-text-primary flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
        </Card>

        {/* 2. Today's Revenue */}
        <Card variant="white" className="p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-mono uppercase text-text-muted">Today's Revenue</p>
            <h3 className="font-display text-2xl font-bold text-text-primary mt-1">
              {formatCurrency(kpi.todayRevenue || 0)}
            </h3>
            <span className="text-[10px] text-emerald-700 font-semibold">Real-time settlements</span>
          </div>
          <div className="w-11 h-11 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <IndianRupee className="w-5 h-5" />
          </div>
        </Card>

        {/* 3. Monthly Revenue */}
        <Card variant="white" className="p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-mono uppercase text-text-muted">Monthly Revenue</p>
            <h3 className="font-display text-2xl font-bold text-text-primary mt-1">
              {formatCurrency(kpi.monthlyRevenue || 0)}
            </h3>
            <span className="text-[10px] text-brand-deep font-semibold">Current billing cycle</span>
          </div>
          <div className="w-11 h-11 rounded-full bg-brand-light/50 text-text-primary flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
        </Card>

        {/* 4. Total Customers */}
        <Card variant="white" className="p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-mono uppercase text-text-muted">Total Guests</p>
            <h3 className="font-display text-2xl font-bold text-text-primary mt-1">
              {kpi.totalCustomers || 0}
            </h3>
            <span className="text-[10px] text-text-muted font-mono">Registered CRM profiles</span>
          </div>
          <div className="w-11 h-11 rounded-full bg-surface-bone text-text-primary flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </Card>

        {/* 5. Active Staff */}
        <Card variant="white" className="p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-mono uppercase text-text-muted">Master Stylists</p>
            <h3 className="font-display text-2xl font-bold text-text-primary mt-1">
              {kpi.activeStaff || 8}
            </h3>
            <span className="text-[10px] text-emerald-700 font-semibold">On-duty today</span>
          </div>
          <div className="w-11 h-11 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <UserCheck className="w-5 h-5" />
          </div>
        </Card>

        {/* 6. Pending Appointments */}
        <Card variant="white" className="p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-mono uppercase text-text-muted">Pending Check-in</p>
            <h3 className="font-display text-2xl font-bold text-amber-800 mt-1">
              {kpi.pendingAppointments || 0}
            </h3>
            <span className="text-[10px] text-amber-700">Awaiting arrival</span>
          </div>
          <div className="w-11 h-11 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </Card>

        {/* 7. Completed Appointments */}
        <Card variant="white" className="p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-mono uppercase text-text-muted">Completed Services</p>
            <h3 className="font-display text-2xl font-bold text-emerald-700 mt-1">
              {kpi.completedAppointments || 0}
            </h3>
            <span className="text-[10px] text-emerald-700">All-time delivered</span>
          </div>
          <div className="w-11 h-11 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </Card>

        {/* 8. Cancelled Appointments */}
        <Card variant="white" className="p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-mono uppercase text-text-muted">Cancellations</p>
            <h3 className="font-display text-2xl font-bold text-text-muted mt-1">
              {kpi.cancelledAppointments || 0}
            </h3>
            <span className="text-[10px] text-text-muted font-mono">Within refund rules</span>
          </div>
          <div className="w-11 h-11 rounded-full bg-zinc-100 text-zinc-500 flex items-center justify-center">
            <XCircle className="w-5 h-5" />
          </div>
        </Card>
      </div>

      {/* Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Revenue Trend Chart */}
        <Card variant="white" className="lg:col-span-8 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-base font-bold text-text-primary">
                Revenue Trajectory (Past 7 Days)
              </h3>
              <p className="text-xs text-text-muted">Live daily revenue from completed appointments</p>
            </div>
            <Badge variant="brand" size="sm">
              Live Mongo Stream
            </Badge>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrend}>
                <defs>
                  <linearGradient id="blueGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7CCBEE" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#7CCBEE" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#646464" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#646464"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(val) => `₹${val / 1000}k`}
                />
                <Tooltip
                  formatter={(val: any) => [formatCurrency(val), 'Revenue']}
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    borderColor: 'rgba(32,32,32,0.12)',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#42A9D8"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#blueGlow)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Status Breakdown Donut */}
        <Card variant="white" className="lg:col-span-4 p-6 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-display text-base font-bold text-text-primary">
              Appointment Distribution
            </h3>
            <p className="text-xs text-text-muted">Current booking statuses</p>
          </div>

          <div className="h-48 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusPieData}
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {statusPieData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    borderColor: 'rgba(32,32,32,0.12)',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {statusPieData.map((entry: any) => (
              <div key={entry.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-text-secondary text-[11px] truncate">{entry.name}:</span>
                <strong className="text-text-primary font-mono text-[11px]">{entry.value}</strong>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Two Column: Upcoming Schedule & Recent Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Appointments */}
        <Card variant="white" className="p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-salon-border">
            <h3 className="font-display text-base font-bold text-text-primary">
              Upcoming Studio Schedule
            </h3>
            <span className="text-xs text-brand-deep font-medium">Next 6 clients</span>
          </div>

          <div className="space-y-3">
            {upcomingAppointments.length === 0 ? (
              <p className="text-xs text-text-muted py-4 text-center">No upcoming appointments scheduled.</p>
            ) : (
              upcomingAppointments.map((appt: any) => (
                <div
                  key={appt._id}
                  className="p-3 rounded-xl bg-surface-bone/70 border border-salon-border/70 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white border border-salon-border flex items-center justify-center text-xs font-mono font-bold text-text-primary">
                      {appt.startTime}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-text-primary">{appt.customerName}</p>
                      <p className="text-[11px] text-text-muted">{appt.serviceName}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] text-brand-deep font-semibold block">
                      with {appt.stylistName?.split(' ')[0]}
                    </span>
                    <span className="text-[10px] text-text-muted font-mono">
                      {formatDate(appt.appointmentDate)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Low Stock Alert Table */}
        <Card variant="white" className="p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-salon-border">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <h3 className="font-display text-base font-bold text-text-primary">
                Low Stock Product Alerts
              </h3>
            </div>
            <button
              onClick={() => navigate('/dashboard/inventory')}
              className="text-xs text-brand-deep hover:underline"
            >
              Restock Inventory
            </button>
          </div>

          <div className="space-y-2">
            {lowStockProducts.length === 0 ? (
              <p className="text-xs text-text-muted py-4 text-center">All product stocks are healthy.</p>
            ) : (
              lowStockProducts.map((p: any) => (
                <div
                  key={p._id}
                  className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/80 flex items-center justify-between text-xs"
                >
                  <div>
                    <p className="font-bold text-text-primary">{p.name}</p>
                    <span className="font-mono text-[10px] text-text-muted">{p.sku} • {p.supplier}</span>
                  </div>

                  <div className="text-right">
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-mono font-bold text-[11px] block">
                      {p.stockQuantity} remaining
                    </span>
                    <span className="text-[10px] text-text-muted">Min threshold: {p.minStockLevel}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Recent Appointments with Quick Status Action Buttons */}
      <Card variant="white" className="p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-salon-border">
          <div>
            <h3 className="font-display text-base font-bold text-text-primary">
              Recent Studio Appointments
            </h3>
            <p className="text-xs text-text-muted">Live appointment management and workflow transitions</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/dashboard/appointments')}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            Manage All
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-salon-border text-text-muted font-mono uppercase text-[10px]">
                <th className="py-2.5">ID</th>
                <th>Guest</th>
                <th>Service</th>
                <th>Stylist</th>
                <th>Date & Time</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-salon-border">
              {recentAppointments.map((appt: any) => (
                <tr key={appt._id} className="hover:bg-surface-bone/40 transition-colors">
                  <td className="py-3 font-mono font-bold text-text-primary">{appt.appointmentId}</td>
                  <td>
                    <p className="font-bold text-text-primary">{appt.customerName}</p>
                    <p className="text-[10px] text-text-muted font-mono">{appt.customerPhone}</p>
                  </td>
                  <td>{appt.serviceName}</td>
                  <td>{appt.stylistName}</td>
                  <td>
                    <span>{formatDate(appt.appointmentDate)}</span>
                    <span className="text-text-muted block font-mono text-[10px]">{formatTime(appt.startTime)}</span>
                  </td>
                  <td className="font-bold font-mono text-text-primary">{formatCurrency(appt.finalPrice)}</td>
                  <td>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusColor(appt.status)}`}>
                      {appt.status}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-1.5">
                      {appt.status === 'PENDING' && (
                        <button
                          onClick={() => handleUpdateStatus(appt._id, 'CONFIRMED')}
                          className="px-2 py-1 rounded bg-brand text-text-primary font-bold text-[10px] hover:bg-brand-hover"
                        >
                          Confirm
                        </button>
                      )}
                      {appt.status === 'CONFIRMED' && (
                        <button
                          onClick={() => handleUpdateStatus(appt._id, 'CHECKED_IN')}
                          className="px-2 py-1 rounded bg-sky-100 text-sky-800 font-bold text-[10px] hover:bg-sky-200"
                        >
                          Check In
                        </button>
                      )}
                      {appt.status === 'CHECKED_IN' && (
                        <button
                          onClick={() => handleUpdateStatus(appt._id, 'IN_PROGRESS')}
                          className="px-2 py-1 rounded bg-purple-100 text-purple-800 font-bold text-[10px] hover:bg-purple-200"
                        >
                          Start
                        </button>
                      )}
                      {appt.status === 'IN_PROGRESS' && (
                        <button
                          onClick={() => handleUpdateStatus(appt._id, 'COMPLETED')}
                          className="px-2 py-1 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px] hover:bg-emerald-200"
                        >
                          Complete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
