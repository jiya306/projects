import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { Service } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { formatCurrency } from '../../utils/formatters';
import { Search, Clock, Sparkles, ArrowRight } from 'lucide-react';

export const ServicesPage: React.FC = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const res = await api.get<{ success: boolean; data: Service[] }>('/services');
        if (res.success) setServices(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const categories = ['ALL', 'HAIR', 'BEAUTY', 'NAILS', 'BRIDAL', 'TREATMENT'];

  const filteredServices = services.filter((s) => {
    const matchesCategory = category === 'ALL' || s.category === category;
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-12">
      {/* Header */}
      <div className="max-w-2xl space-y-4">
        <Badge variant="brand" size="sm">
          Service Menu
        </Badge>
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-text-primary">
          Artistry, Care & Radiance.
        </h1>
        <p className="text-text-secondary text-base leading-relaxed">
          Explore our complete service menu designed for restorative beauty, precision haircutting, custom color placement, and luxury bridal transformations.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-6 border-b border-salon-border">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                category === cat
                  ? 'bg-brand text-text-primary shadow-subtle'
                  : 'bg-white border border-salon-border text-text-secondary hover:bg-surface-bone'
              }`}
            >
              {cat === 'ALL' ? 'All Services' : cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="w-full sm:w-72">
          <Input
            placeholder="Search service..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-text-muted" />}
          />
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredServices.map((service) => (
          <Card
            key={service._id}
            variant="white"
            hoverEffect
            className="p-0 overflow-hidden flex flex-col justify-between group"
          >
            <div>
              <div className="relative aspect-[16/10] overflow-hidden bg-surface-bone">
                <img
                  src={service.image || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600'}
                  alt={service.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3">
                  <Badge variant="muted" size="sm" className="bg-white/95">
                    {service.category}
                  </Badge>
                </div>
                {service.popular && (
                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-brand text-text-primary text-[10px] font-bold">
                      POPULAR
                    </span>
                  </div>
                )}
              </div>

              <div className="p-6">
                <h3 className="font-display text-lg font-bold text-text-primary group-hover:text-brand-deep transition-colors">
                  {service.name}
                </h3>
                <p className="text-xs text-text-secondary mt-2 leading-relaxed">
                  {service.description}
                </p>
              </div>
            </div>

            <div className="p-6 pt-0 mt-4 border-t border-salon-border/60 flex items-center justify-between">
              <div>
                <span className="text-xs text-text-muted flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {service.durationMinutes} mins
                </span>
                <span className="font-display text-xl font-bold text-text-primary">
                  {formatCurrency(service.price)}
                </span>
              </div>

              <Button
                variant="primary"
                size="md"
                onClick={() => navigate(`/book?serviceId=${service._id}`)}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Book
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
