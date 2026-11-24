import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Review } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { formatDate } from '../../utils/formatters';
import { Star, Check, Trash2, CheckCircle2 } from 'lucide-react';

export const ReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await api.get<{ success: boolean; data: Review[] }>('/reviews');
      if (res.success) setReviews(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleToggleApprove = async (review: Review) => {
    try {
      await api.put(`/reviews/${review._id}`, { approved: !review.approved });
      fetchReviews();
    } catch (err: any) {
      alert(err.message || 'Update failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    try {
      await api.delete(`/reviews/${id}`);
      fetchReviews();
    } catch (err: any) {
      alert(err.message || 'Delete failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-salon-border">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-text-primary">
            Reviews & Testimonials Moderation
          </h1>
          <p className="text-xs text-text-muted mt-0.5">
            Verified guest ratings, service reviews, and stylist feedback.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((rev) => (
          <Card
            key={rev._id}
            variant="white"
            className="p-6 border border-salon-border shadow-subtle flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  rev.approved ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-800'
                }`}>
                  {rev.approved ? 'APPROVED' : 'PENDING'}
                </span>
              </div>

              <p className="text-xs text-text-body italic leading-relaxed">
                "{rev.reviewText}"
              </p>
            </div>

            <div className="pt-4 mt-6 border-t border-salon-border">
              <div className="flex items-center justify-between text-xs mb-3">
                <div>
                  <p className="font-bold text-text-primary">{rev.customerName}</p>
                  <p className="text-[10px] text-text-muted">{rev.serviceName}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-brand-deep font-semibold block">
                    with {rev.stylistName?.split(' ')[0]}
                  </span>
                  <span className="text-[10px] text-text-muted font-mono">{formatDate(rev.date)}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleToggleApprove(rev)}
                  className={`flex-1 py-1.5 rounded-full text-[11px] font-medium border transition-colors ${
                    rev.approved
                      ? 'border-salon-border text-text-secondary hover:bg-surface-bone'
                      : 'bg-brand text-text-primary font-bold'
                  }`}
                >
                  {rev.approved ? 'Hide from Web' : 'Approve for Web'}
                </button>
                <button
                  onClick={() => handleDelete(rev._id)}
                  className="p-1.5 rounded-full hover:bg-rose-50 text-text-muted hover:text-rose-600"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
