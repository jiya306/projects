import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { formatCurrency } from '../../utils/formatters';
import {
  BarChart3,
  TrendingUp,
  CreditCard,
  Scissors,
  Users,
  Award,
  Calendar,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

export const AnalyticsPage: React.FC = () => {
  const [revenueData, setRevenueData] = useState<any>(null);
  const [customerData, setCustomerData] = useState<any>(null);
  const [serviceData, setServiceData] = useState<any>(null);
  const [staffData, setStaffData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllAnalytics = async () => {
      try {
        setLoading(true);
        const [revRes, custRes, srvRes, stfRes] = await Promise.all([
          api.get<{ success: boolean; data: any }>('/analytics/revenue'),
          api.get<{ success: boolean; data: any }>('/analytics/customers'),
          api.get<{ success: boolean; data: any }>('/analytics/services'),
          api.get<{ success: boolean; data: any }>('/analytics/staff'),
        ]);

        if (revRes.success) setRevenueData(revRes.data);
        if (custRes.success) setCustomerData(custRes.data);
        if (srvRes.success) setServiceData(srvRes.data);
        if (stfRes.success) setStaffData(stfRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center text-xs text-text-muted">
        Computing salon metrics and intelligence charts...
      </div>
    );
  }

  const dailyTrend = revenueData?.dailyData || [];
  const paymentMethods = revenueData?.paymentMethods?.map((pm: any) => ({
    name: pm._id,
    value: pm.total,
    count: pm.count,
  })) || [];

  const categoryRevenue = revenueData?.categoryRevenue?.map((cr: any) => ({
    category: cr._id,
    revenue: cr.total,
    bookings: cr.count,
  })) || [];

  const popularServices = serviceData?.servicePopularity?.map((sp: any) => ({
    name: sp._id.length > 20 ? sp._id.substring(0, 18) + '...' : sp._id,
    bookings: sp.bookings,
    revenue: sp.revenue,
  })) || [];

  const staffPerformance = staffData?.staffPerformance?.map((sp: any) => ({
    stylist: sp._id,
    revenue: sp.totalRevenue,
    appointments: sp.totalAppointments,
  })) || [];

  const tierBreakdown = customerData?.tierBreakdown?.map((tb: any) => ({
    name: tb._id,
    value: tb.count,
  })) || [];

  const COLORS = ['#7CCBEE', '#42A9D8', '#202020', '#2B9A66', '#94A3B8'];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-salon-border">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-text-primary">
            SalonFlow Business Intelligence
          </h1>
          <p className="text-xs text-text-muted mt-0.5">
            Real-time revenue, guest retention rates, service profitability, and artist performance analytics.
          </p>
        </div>
        <Badge variant="brand" size="sm">
          Connected to MongoDB Engine
        </Badge>
      </div>

      {/* Customer Retention KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card variant="white" className="p-5">
          <span className="text-[10px] font-mono uppercase text-text-muted">Total Client Base</span>
          <h3 className="font-display text-2xl font-bold text-text-primary mt-1">
            {customerData?.totalCustomers || 0}
          </h3>
          <p className="text-xs text-text-muted mt-0.5">Active profiles</p>
        </Card>

        <Card variant="white" className="p-5">
          <span className="text-[10px] font-mono uppercase text-text-muted">Repeat Guest Rate</span>
          <h3 className="font-display text-2xl font-bold text-emerald-700 mt-1">
            {customerData?.retentionRate || 0}%
          </h3>
          <p className="text-xs text-text-muted mt-0.5">{customerData?.repeatCustomers || 0} returning clients</p>
        </Card>

        <Card variant="white" className="p-5">
          <span className="text-[10px] font-mono uppercase text-text-muted">Average Ticket Value</span>
          <h3 className="font-display text-2xl font-bold text-brand-deep mt-1">
            {formatCurrency(customerData?.avgSpending || 0)}
          </h3>
          <p className="text-xs text-text-muted mt-0.5">Spend per customer</p>
        </Card>

        <Card variant="white" className="p-5">
          <span className="text-[10px] font-mono uppercase text-text-muted">Top Revenue Stream</span>
          <h3 className="font-display text-xl font-bold text-text-primary mt-1">
            Hair & Bridal
          </h3>
          <p className="text-xs text-text-muted mt-0.5">Highest margin categories</p>
        </Card>
      </div>

      {/* 30-Day Revenue Trend Chart */}
      <Card variant="white" className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display text-lg font-bold text-text-primary">
              30-Day Revenue Performance (₹ INR)
            </h3>
            <p className="text-xs text-text-muted">Daily settlement trajectory across all salon departments</p>
          </div>
          <Badge variant="muted" size="sm">Past 30 Days</Badge>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dailyTrend}>
              <defs>
                <linearGradient id="brandGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7CCBEE" stopOpacity={0.8} />
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
                dataKey="revenue"
                stroke="#42A9D8"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#brandGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Two Column Grid: Category Revenue & Payment Methods */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Category Revenue Bar Chart */}
        <Card variant="white" className="lg:col-span-7 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-base font-bold text-text-primary">
              Revenue by Service Department
            </h3>
            <span className="text-xs text-text-muted">Hair, Beauty, Nails, Bridal</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryRevenue}>
                <XAxis dataKey="category" stroke="#646464" fontSize={11} tickLine={false} />
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
                <Bar dataKey="revenue" fill="#7CCBEE" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Payment Channels Pie Chart */}
        <Card variant="white" className="lg:col-span-5 p-6 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-display text-base font-bold text-text-primary">
              Settlement Channels
            </h3>
            <p className="text-xs text-text-muted">UPI vs Card vs Cash vs Online</p>
          </div>

          <div className="h-52 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentMethods}
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {paymentMethods.map((_: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => [formatCurrency(val), 'Volume']}
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
            {paymentMethods.map((pm: any, idx: number) => (
              <div key={pm.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                <span className="text-text-secondary">{pm.name}:</span>
                <strong className="font-mono text-text-primary">{formatCurrency(pm.value)}</strong>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Staff Performance & Loyalty Tiers */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Staff Performance Bar Chart */}
        <Card variant="white" className="lg:col-span-8 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-base font-bold text-text-primary">
              Stylist Revenue Generation
            </h3>
            <span className="text-xs text-text-muted">Total delivered bookings</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={staffPerformance} layout="vertical">
                <XAxis
                  type="number"
                  stroke="#646464"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(val) => `₹${val / 1000}k`}
                />
                <YAxis dataKey="stylist" type="category" stroke="#646464" fontSize={11} tickLine={false} width={120} />
                <Tooltip
                  formatter={(val: any) => [formatCurrency(val), 'Revenue Generated']}
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    borderColor: 'rgba(32,32,32,0.12)',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="revenue" fill="#42A9D8" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Customer Tiers Breakdown */}
        <Card variant="white" className="lg:col-span-4 p-6 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-display text-base font-bold text-text-primary">
              Loyalty Tiers Breakdown
            </h3>
            <p className="text-xs text-text-muted">Guest progression across loyalty tiers</p>
          </div>

          <div className="space-y-3 my-auto">
            {tierBreakdown.map((t: any) => (
              <div key={t.name} className="flex items-center justify-between p-2.5 rounded-lg bg-surface-bone">
                <Badge variant="tier" tier={t.name} size="sm">
                  {t.name}
                </Badge>
                <span className="font-mono font-bold text-text-primary">
                  {t.value} guests
                </span>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-text-muted text-center pt-2 border-t border-salon-border">
            Configured in SalonFlow Loyalty Matrix (₹100 = 1 pt)
          </p>
        </Card>
      </div>
    </div>
  );
};
