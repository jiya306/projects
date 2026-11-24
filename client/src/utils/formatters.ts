export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateStr: string | Date): string => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export const formatTime = (timeStr: string): string => {
  if (!timeStr) return '';
  const [hours, minutes] = timeStr.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'CONFIRMED':
    case 'PAID':
    case 'IN_STOCK':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'COMPLETED':
      return 'bg-brand-light/40 text-brand-deep border-brand/40';
    case 'IN_PROGRESS':
    case 'CHECKED_IN':
      return 'bg-sky-50 text-sky-700 border-sky-200';
    case 'PENDING':
    case 'LOW_STOCK':
    case 'PARTIALLY_PAID':
      return 'bg-amber-50 text-amber-800 border-amber-200';
    case 'CANCELLED':
    case 'OUT_OF_STOCK':
    case 'REFUNDED':
    case 'NO_SHOW':
      return 'bg-zinc-100 text-zinc-600 border-zinc-200';
    default:
      return 'bg-zinc-100 text-zinc-700 border-zinc-200';
  }
};
