import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { Staff } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Star, ArrowRight, Award } from 'lucide-react';

export const StylistsPage: React.FC = () => {
  const navigate = useNavigate();
  const [stylists, setStylists] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const res = await api.get<{ success: boolean; data: Staff[] }>('/staff?active=true');
        if (res.success) setStylists(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStaff();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-12">
      {/* Header */}
      <div className="max-w-2xl space-y-4">
        <Badge variant="brand" size="sm">
          Master Artists
        </Badge>
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-text-primary">
          Meet the Artists Behind Your Look.
        </h1>
        <p className="text-text-secondary text-base leading-relaxed">
          From Vidal Sassoon-trained precision cutters to celebrity bridal artists and CIDESCO dermal therapists, our hand-selected team brings global craftsmanship to every appointment.
        </p>
      </div>

      {/* Stylist Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stylists.map((stylist) => (
          <Card
            key={stylist._id}
            variant="white"
            hoverEffect
            className="flex flex-col p-6 text-center group justify-between"
          >
            <div>
              <div className="relative mx-auto w-32 h-32 rounded-full overflow-hidden border-2 border-brand/50 shadow-subtle mb-4">
                <img
                  src={stylist.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300'}
                  alt={stylist.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="flex items-center justify-center gap-1 text-xs text-amber-500 font-bold mb-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="text-text-primary">{stylist.rating}</span>
                <span className="text-text-muted font-normal">({stylist.reviewCount || 100}+ reviews)</span>
              </div>

              <h3 className="font-display text-xl font-bold text-text-primary">{stylist.name}</h3>
              <p className="text-xs text-brand-deep font-semibold mt-0.5">
                {stylist.specialization?.join(' • ')}
              </p>
              <p className="text-[11px] text-text-muted mt-1 font-mono">
                {stylist.experienceYears}+ years in luxury styling
              </p>

              <p className="text-xs text-text-body mt-4 leading-relaxed line-clamp-3">
                {stylist.bio}
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-salon-border">
              <Button
                variant="primary"
                size="md"
                className="w-full"
                onClick={() => navigate(`/book?stylistId=${stylist._id}`)}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Book with {stylist.name.split(' ')[0]}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
