import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { Promotion } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { formatCurrency } from '../../utils/formatters';
import { Tag, Copy, Check, Sparkles, ArrowRight } from 'lucide-react';

export const OffersPage: React.FC = () => {
  const navigate = useNavigate();
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const res = await api.get<{ success: boolean; data: Promotion[] }>('/promotions?active=true');
        if (res.success) setPromotions(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPromotions();
  }, []);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-12">
      <div className="max-w-2xl space-y-4">
        <Badge variant="brand" size="sm">
          Studio Privileges
        </Badge>
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-text-primary">
          Promotions & Privileges.
        </h1>
        <p className="text-text-secondary text-base leading-relaxed">
          Redeem seasonal discounts, welcome savings for new clients, and birthday pampering packages on your next SalonFlow visit.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {promotions.map((promo) => (
          <Card
            key={promo._id}
            variant="white"
            className="border-2 border-dashed border-brand/50 p-6 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 rounded-full bg-brand-light/50 text-text-primary">
                  <Tag className="w-5 h-5" />
                </div>
                <span className="font-mono text-sm font-bold text-brand-deep">
                  {promo.discountType === 'PERCENTAGE'
                    ? `${promo.discountValue}% OFF`
                    : `₹${promo.discountValue} OFF`}
                </span>
              </div>

              <h3 className="font-display text-xl font-bold text-text-primary">{promo.title}</h3>
              <p className="text-xs text-text-secondary mt-2 leading-relaxed">
                {promo.description}
              </p>

              <div className="mt-4 p-3 rounded-lg bg-surface-bone text-xs space-y-1">
                <p className="text-text-muted">
                  Minimum service spend: <strong className="text-text-primary">{formatCurrency(promo.minPurchase)}</strong>
                </p>
                {promo.maxDiscount && (
                  <p className="text-text-muted">
                    Maximum discount cap: <strong className="text-text-primary">{formatCurrency(promo.maxDiscount)}</strong>
                  </p>
                )}
                <p className="text-text-muted">
                  Valid until: <span className="font-mono text-text-primary">{promo.endDate}</span>
                </p>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-salon-border flex items-center justify-between">
              <button
                onClick={() => handleCopy(promo.code)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-brand-light/40 border border-salon-border text-xs font-mono font-bold text-text-primary transition-colors"
              >
                {copiedCode === promo.code ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-text-muted" />
                    <span>{promo.code}</span>
                  </>
                )}
              </button>

              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate(`/book?coupon=${promo.code}`)}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Apply Coupon
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
