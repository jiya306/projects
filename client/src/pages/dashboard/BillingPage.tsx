import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Invoice, Payment, Customer } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { formatCurrency, formatDate, getStatusColor } from '../../utils/formatters';
import {
  Receipt,
  Plus,
  Printer,
  CreditCard,
  Search,
  CheckCircle,
  Clock,
  Sparkles,
  Download,
} from 'lucide-react';

export const BillingPage: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'invoices' | 'payments'>('invoices');
  const [search, setSearch] = useState('');

  // Printable Invoice Modal
  const [viewInvoice, setViewInvoice] = useState<Invoice | null>(null);

  // Record Payment Modal
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    customerId: '',
    amount: 1500,
    method: 'UPI',
    notes: 'In-salon payment',
  });

  const fetchBilling = async () => {
    try {
      setLoading(true);
      const [invRes, payRes, custRes] = await Promise.all([
        api.get<{ success: boolean; data: Invoice[] }>('/payments/invoices'),
        api.get<{ success: boolean; data: Payment[] }>('/payments'),
        api.get<{ success: boolean; data: Customer[] }>('/customers'),
      ]);

      if (invRes.success) setInvoices(invRes.data);
      if (payRes.success) setPayments(payRes.data);
      if (custRes.success) setCustomers(custRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBilling();
  }, []);

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/payments', paymentForm);
      setIsPaymentModalOpen(false);
      fetchBilling();
    } catch (err: any) {
      alert(err.message || 'Payment recording failed');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const filteredInvoices = invoices.filter(
    (inv) =>
      inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      inv.customerName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-salon-border">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-text-primary">
            Billing & Invoices
          </h1>
          <p className="text-xs text-text-muted mt-0.5">
            GST-compliant invoices, payment recording, settlement tracking, and print receipts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center border border-salon-border rounded-full p-1 bg-white">
            <button
              onClick={() => setActiveTab('invoices')}
              className={`px-3 py-1 text-xs font-semibold rounded-full transition-all ${
                activeTab === 'invoices' ? 'bg-brand text-text-primary' : 'text-text-muted'
              }`}
            >
              Invoices ({invoices.length})
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`px-3 py-1 text-xs font-semibold rounded-full transition-all ${
                activeTab === 'payments' ? 'bg-brand text-text-primary' : 'text-text-muted'
              }`}
            >
              Settlement Logs ({payments.length})
            </button>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              if (customers.length > 0) {
                setPaymentForm({
                  customerId: customers[0]._id,
                  amount: 1500,
                  method: 'UPI',
                  notes: 'Direct salon settlement',
                });
              }
              setIsPaymentModalOpen(true);
            }}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Record Payment
          </Button>
        </div>
      </div>

      {/* Search Input */}
      <Card variant="white" className="p-4 border border-salon-border flex justify-between items-center">
        <div className="relative w-full sm:w-72">
          <Input
            placeholder="Search invoice # or guest..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-text-muted" />}
          />
        </div>
        <span className="text-xs text-text-muted font-mono hidden sm:inline">
          Official GST Registered Studio • 18% Standard Tier
        </span>
      </Card>

      {/* Main Table: Invoices or Payments */}
      {activeTab === 'invoices' ? (
        <Card variant="white" className="p-0 overflow-hidden border border-salon-border shadow-subtle">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-bone border-b border-salon-border text-text-muted font-mono uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Invoice #</th>
                  <th>Guest</th>
                  <th>Issued Date</th>
                  <th>Subtotal</th>
                  <th>Discount</th>
                  <th>GST (18%)</th>
                  <th>Final Total</th>
                  <th>Method</th>
                  <th>Status</th>
                  <th className="text-right px-4">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-salon-border">
                {filteredInvoices.map((inv) => (
                  <tr key={inv._id} className="hover:bg-surface-bone/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-text-primary">
                      {inv.invoiceNumber}
                    </td>
                    <td>
                      <p className="font-bold text-text-primary">{inv.customerName}</p>
                      <p className="text-[10px] text-text-muted font-mono">{inv.customerPhone}</p>
                    </td>
                    <td className="font-mono text-text-muted">{formatDate(inv.issuedDate)}</td>
                    <td className="font-mono">{formatCurrency(inv.subtotal)}</td>
                    <td className="font-mono text-emerald-700">
                      {inv.discount > 0 ? `-${formatCurrency(inv.discount)}` : '₹0'}
                    </td>
                    <td className="font-mono text-text-muted">{formatCurrency(inv.tax)}</td>
                    <td className="font-mono font-bold text-text-primary">
                      {formatCurrency(inv.finalAmount)}
                    </td>
                    <td>
                      <span className="font-mono font-bold text-[10px] px-2 py-0.5 rounded bg-surface-bone text-text-primary">
                        {inv.paymentMethod}
                      </span>
                    </td>
                    <td>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusColor(inv.paymentStatus)}`}>
                        {inv.paymentStatus}
                      </span>
                    </td>
                    <td className="text-right px-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setViewInvoice(inv)}
                        leftIcon={<Printer className="w-3.5 h-3.5 text-brand-deep" />}
                      >
                        Print Invoice
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        /* Settlement Logs View */
        <Card variant="white" className="p-0 overflow-hidden border border-salon-border shadow-subtle">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-bone border-b border-salon-border text-text-muted font-mono uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Payment ID</th>
                  <th>Guest</th>
                  <th>Settlement Date</th>
                  <th>Method</th>
                  <th>Transaction Ref</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-salon-border">
                {payments.map((p) => (
                  <tr key={p._id} className="hover:bg-surface-bone/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-text-primary">{p.paymentId}</td>
                    <td className="font-bold text-text-primary">{p.customerName}</td>
                    <td className="font-mono text-text-muted">{formatDate(p.date)}</td>
                    <td>
                      <span className="font-mono font-bold text-[10px] px-2 py-0.5 rounded bg-surface-bone">
                        {p.method}
                      </span>
                    </td>
                    <td className="font-mono text-[11px] text-text-secondary">{p.transactionRef || 'N/A'}</td>
                    <td className="font-mono font-bold text-text-primary">{formatCurrency(p.amount)}</td>
                    <td>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusColor(p.status)}`}>
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Record Payment Modal */}
      <Modal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        title="Record Guest Settlement"
        subtitle="Manually log cash, card, or UPI settlements and issue official receipt"
      >
        <form onSubmit={handleRecordPayment} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
              Select Guest *
            </label>
            <select
              required
              className="w-full rounded-full border border-salon-border px-4 py-2.5 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-brand min-h-[44px]"
              value={paymentForm.customerId}
              onChange={(e) => setPaymentForm({ ...paymentForm, customerId: e.target.value })}
            >
              <option value="">Select guest...</option>
              {customers.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name} ({c.phone})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Settlement Amount (₹) *"
              type="number"
              required
              value={paymentForm.amount}
              onChange={(e) => setPaymentForm({ ...paymentForm, amount: Number(e.target.value) })}
            />

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Payment Channel *
              </label>
              <select
                className="w-full rounded-full border border-salon-border px-4 py-2.5 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-brand min-h-[44px]"
                value={paymentForm.method}
                onChange={(e) => setPaymentForm({ ...paymentForm, method: e.target.value })}
              >
                <option value="UPI">UPI / QR Code</option>
                <option value="CARD">Credit / Debit Card</option>
                <option value="CASH">Cash at Counter</option>
                <option value="ONLINE">Online Portal</option>
              </select>
            </div>
          </div>

          <Input
            label="Notes / Transaction Reference"
            placeholder="e.g. UPI-REF-9921445 or POS Slip #104"
            value={paymentForm.notes}
            onChange={(e) => setPaymentForm({ ...paymentForm, notes: e.target.value })}
          />

          <div className="pt-4 flex justify-end gap-3 border-t border-salon-border">
            <Button variant="outline" type="button" onClick={() => setIsPaymentModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Record & Generate Invoice
            </Button>
          </div>
        </form>
      </Modal>

      {/* Printable / Downloadable Invoice Modal */}
      <Modal
        isOpen={!!viewInvoice}
        onClose={() => setViewInvoice(null)}
        maxWidth="lg"
      >
        <div id="printable-receipt" className="p-4 sm:p-8 bg-white space-y-6">
          {/* Studio Header */}
          <div className="flex items-start justify-between pb-6 border-b border-salon-border">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-surface-dark text-brand flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="font-display text-2xl font-bold tracking-tight text-text-primary">
                  SalonFlow
                </span>
              </div>
              <p className="text-xs text-text-secondary mt-1">
                42, Boulevard Promenade, 100ft Road, Indiranagar, Bengaluru 560038
              </p>
              <p className="text-[11px] font-mono text-text-muted">GSTIN: 29AAAAA0000A1Z5</p>
            </div>

            <div className="text-right">
              <span className="text-xs font-mono uppercase tracking-widest text-brand-deep font-bold block">
                TAX INVOICE
              </span>
              <p className="font-mono text-base font-bold text-text-primary mt-1">
                {viewInvoice?.invoiceNumber}
              </p>
              <p className="text-xs text-text-muted font-mono">
                Date: {formatDate(viewInvoice?.issuedDate || '')}
              </p>
            </div>
          </div>

          {/* Guest Info */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-text-muted font-mono uppercase block text-[10px]">Billed To:</span>
              <p className="font-bold text-text-primary text-sm mt-0.5">{viewInvoice?.customerName}</p>
              <p className="text-text-secondary font-mono">{viewInvoice?.customerPhone}</p>
            </div>

            <div className="text-right">
              <span className="text-text-muted font-mono uppercase block text-[10px]">Payment Details:</span>
              <p className="font-mono font-bold text-text-primary text-sm mt-0.5">{viewInvoice?.paymentMethod}</p>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-0.5">
                {viewInvoice?.paymentStatus}
              </span>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="border border-salon-border rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-bone text-text-muted font-mono uppercase text-[10px] border-b border-salon-border">
                <tr>
                  <th className="py-2.5 px-4">Item / Service Description</th>
                  <th className="text-center">Qty</th>
                  <th className="text-right">Unit Price</th>
                  <th className="text-right px-4">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-salon-border">
                {viewInvoice?.items?.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-3 px-4 font-semibold text-text-primary">{item.name}</td>
                    <td className="text-center font-mono">{item.quantity}</td>
                    <td className="text-right font-mono">{formatCurrency(item.unitPrice)}</td>
                    <td className="text-right px-4 font-mono font-bold text-text-primary">
                      {formatCurrency(item.totalPrice)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Calculation Breakdown */}
          <div className="space-y-1.5 text-xs pt-2 border-t border-salon-border max-w-xs ml-auto">
            <div className="flex justify-between text-text-secondary">
              <span>Subtotal:</span>
              <span className="font-mono">{formatCurrency(viewInvoice?.subtotal || 0)}</span>
            </div>
            {viewInvoice?.discount ? (
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Promotional Discount:</span>
                <span className="font-mono">-{formatCurrency(viewInvoice.discount)}</span>
              </div>
            ) : null}
            <div className="flex justify-between text-text-muted">
              <span>SGST (9%):</span>
              <span className="font-mono">{formatCurrency(Math.round((viewInvoice?.tax || 0) / 2))}</span>
            </div>
            <div className="flex justify-between text-text-muted">
              <span>CGST (9%):</span>
              <span className="font-mono">{formatCurrency(Math.round((viewInvoice?.tax || 0) / 2))}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-text-primary pt-2 border-t border-salon-border">
              <span>Final Total Paid:</span>
              <span className="font-display font-extrabold">
                {formatCurrency(viewInvoice?.finalAmount || 0)}
              </span>
            </div>
          </div>

          {/* Footer Note */}
          <div className="pt-6 border-t border-salon-border text-center text-[11px] text-text-muted">
            <p>Thank you for choosing SalonFlow Luxe Studio. Your beauty, our precision.</p>
            <p className="font-mono mt-0.5">This is an authorized computer-generated GST tax receipt.</p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setViewInvoice(null)}>
              Close
            </Button>
            <Button
              variant="primary"
              onClick={handlePrint}
              leftIcon={<Printer className="w-4 h-4" />}
            >
              Print Receipt
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
