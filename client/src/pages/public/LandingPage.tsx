import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../../services/api';
import { Service, Staff, Promotion, Review } from '../../types';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { formatCurrency, formatDate } from '../../utils/formatters';
import {
  Sparkles,
  ArrowRight,
  Clock,
  Star,
  CheckCircle2,
  Tag,
  ShieldCheck,
  Feather,
  HeartHandshake,
  ChevronRight,
  Copy,
  Check,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [stylists, setStylists] = useState<Staff[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [servicesRes, stylistsRes, promosRes, reviewsRes] = await Promise.all([
          api.get<{ success: boolean; data: Service[] }>('/services'),
          api.get<{ success: boolean; data: Staff[] }>('/staff?active=true'),
          api.get<{ success: boolean; data: Promotion[] }>('/promotions?active=true'),
          api.get<{ success: boolean; data: Review[] }>('/reviews?featured=true'),
        ]);

        if (servicesRes.success) setServices(servicesRes.data);
        if (stylistsRes.success) setStylists(stylistsRes.data);
        if (promosRes.success) setPromotions(promosRes.data);
        if (reviewsRes.success) setReviews(reviewsRes.data);
      } catch (err) {
        console.error('Failed to load landing page data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const categories = ['ALL', 'HAIR', 'BEAUTY', 'NAILS', 'BRIDAL', 'TREATMENT'];

  const filteredServices =
    selectedCategory === 'ALL'
      ? services.slice(0, 8)
      : services.filter((s) => s.category === selectedCategory).slice(0, 8);

  const galleryImages = [
    {
      title: 'Balayage Glow',
      category: 'Hair Artistry',
      url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&fit=crop',
    },
    {
      title: 'Studio Interior',
      category: 'Indiranagar Sanctuary',
      url: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=800&fit=crop',
    },
    {
      title: 'Royal Bridal Glam',
      category: 'Couture Makeup',
      url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&fit=crop',
    },
    {
      title: 'Hydrafacial Dermal Therapy',
      category: 'Skin Therapy',
      url: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&fit=crop',
    },
    {
      title: 'Chrome Gel Extensions',
      category: 'Nail Craft',
      url: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&fit=crop',
    },
    {
      title: 'Precision Taper Sculpt',
      category: 'Men Grooming',
      url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&fit=crop',
    },
  ];

  return (
    <div className="space-y-24 md:space-y-32 pb-24">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 md:pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Text Column */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-light/40 border border-brand/30 text-text-primary text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-brand-deep" />
              <span>Indiranagar’s Premier Editorial Salon Sanctuary</span>
            </div>

            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-text-primary leading-[1.05]">
              Your Beauty. <br />
              <span className="italic font-light">Your Time.</span> <br />
              Your Salon.
            </h1>

            <p className="text-lg sm:text-xl text-text-body max-w-xl font-normal leading-relaxed">
              Discover premium hair, beauty, and wellness services. Book your favorite stylist, manage your appointments, and experience personalized care.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate('/book')}
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                Book Your Appointment
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/services')}
              >
                Explore Services
              </Button>
            </div>

            {/* Micro Stats */}
            <div className="pt-8 grid grid-cols-3 gap-6 border-t border-salon-border max-w-lg">
              <div>
                <p className="font-display text-2xl font-bold text-text-primary">8+</p>
                <p className="text-xs text-text-muted uppercase font-mono mt-0.5">Master Artists</p>
              </div>
              <div>
                <p className="font-display text-2xl font-bold text-text-primary">4.9★</p>
                <p className="text-xs text-text-muted uppercase font-mono mt-0.5">Customer Rating</p>
              </div>
              <div>
                <p className="font-display text-2xl font-bold text-text-primary">100%</p>
                <p className="text-xs text-text-muted uppercase font-mono mt-0.5">Organic & Cruelty-Free</p>
              </div>
            </div>
          </motion.div>

          {/* Right Editorial Image Composition */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative rounded-[24px] overflow-hidden border border-salon-border shadow-card aspect-[4/5] bg-surface-bone">
              <img
                src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=900&fit=crop"
                alt="SalonFlow Luxury Styling"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              {/* Floating Feature Tag */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-white/95 backdrop-blur-md border border-white/40 shadow-lg flex items-center justify-between">
                <div>
                  <p className="text-xs font-mono uppercase text-brand-deep font-semibold">Featured Ritual</p>
                  <p className="font-display text-sm font-bold text-text-primary">Luxe Balayage & Toning</p>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate('/book')}
                >
                  Book Now
                </Button>
              </div>
            </div>

            {/* Decorative Offset Glow Pill */}
            <div className="absolute -top-4 -right-4 bg-brand text-text-primary font-mono text-[11px] font-bold px-4 py-2 rounded-full border border-white shadow-card rotate-3">
              ✦ Open 7 Days • 10AM – 8PM
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. SERVICES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <Badge variant="brand" size="sm" className="mb-3">
              Tailored Treatments
            </Badge>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary tracking-tight">
              Services made for you.
            </h2>
            <p className="text-text-secondary text-sm sm:text-base mt-2 max-w-xl">
              Curated hair rituals, restorative dermatological therapies, meticulous nails, and couture bridal styling.
            </p>
          </div>

          <Button
            variant="outline"
            size="md"
            onClick={() => navigate('/services')}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            View All Services
          </Button>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-brand text-text-primary shadow-subtle'
                  : 'bg-white border border-salon-border text-text-secondary hover:bg-surface-bone'
              }`}
            >
              {cat === 'ALL' ? 'All Services' : cat}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredServices.map((service) => (
            <Card
              key={service._id}
              variant="white"
              hoverEffect
              className="flex flex-col p-0 overflow-hidden group"
            >
              {/* Service Image */}
              <div className="relative aspect-[16/10] overflow-hidden bg-surface-bone">
                <img
                  src={service.image || 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600'}
                  alt={service.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3">
                  <Badge variant="muted" size="sm" className="bg-white/90 backdrop-blur-sm">
                    {service.category}
                  </Badge>
                </div>
                {service.popular && (
                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-brand text-text-primary text-[10px] font-bold shadow-sm">
                      POPULAR
                    </span>
                  </div>
                )}
              </div>

              {/* Service Info */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-display text-base font-bold text-text-primary group-hover:text-brand-deep transition-colors line-clamp-1">
                    {service.name}
                  </h3>
                  <p className="text-xs text-text-muted mt-1.5 line-clamp-2 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                <div className="pt-5 mt-4 border-t border-salon-border flex items-center justify-between">
                  <div>
                    <span className="text-xs text-text-muted flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {service.durationMinutes} mins
                    </span>
                    <span className="font-display text-lg font-bold text-text-primary">
                      {formatCurrency(service.price)}
                    </span>
                  </div>

                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => navigate(`/book?serviceId=${service._id}`)}
                  >
                    Book Now
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 3. STYLIST SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <Badge variant="brand" size="sm" className="mb-3">
              The Creators
            </Badge>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary tracking-tight">
              Meet the artists behind your look.
            </h2>
            <p className="text-text-secondary text-sm sm:text-base mt-2 max-w-xl">
              Internationally trained master stylists, dermal therapists, and couture bridal artists passionate about personalized beauty.
            </p>
          </div>

          <Button
            variant="outline"
            size="md"
            onClick={() => navigate('/stylists')}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            All Artists
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stylists.slice(0, 8).map((stylist) => (
            <Card
              key={stylist._id}
              variant="white"
              hoverEffect
              className="flex flex-col p-5 text-center group"
            >
              <div className="relative mx-auto w-28 h-28 rounded-full overflow-hidden border-2 border-brand/40 shadow-subtle mb-4">
                <img
                  src={stylist.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300'}
                  alt={stylist.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="flex items-center justify-center gap-1 text-xs text-amber-500 font-bold mb-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="text-text-primary">{stylist.rating}</span>
                <span className="text-text-muted font-normal">({stylist.reviewCount || 100}+)</span>
              </div>

              <h3 className="font-display text-lg font-bold text-text-primary">{stylist.name}</h3>
              <p className="text-xs text-brand-deep font-semibold mt-0.5">
                {stylist.specialization?.[0] || 'Master Stylist'}
              </p>
              <p className="text-[11px] text-text-muted mt-1 font-mono">
                {stylist.experienceYears}+ years experience
              </p>

              <p className="text-xs text-text-body mt-3 line-clamp-2 leading-relaxed flex-1">
                {stylist.bio}
              </p>

              <div className="pt-4 mt-4 border-t border-salon-border">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full group-hover:bg-brand group-hover:text-text-primary group-hover:border-brand transition-colors"
                  onClick={() => navigate(`/book?stylistId=${stylist._id}`)}
                >
                  Book with {stylist.name.split(' ')[0]}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 4. SALON EXPERIENCE SECTION */}
      <section className="bg-surface-bone border-y border-salon-border py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <Badge variant="brand" size="sm">
                The SalonFlow Ritual
              </Badge>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary tracking-tight">
                More than a salon. <br />
                <span className="italic font-light">It’s your moment.</span>
              </h2>
              <p className="text-text-body text-base leading-relaxed">
                Step inside our sunlit Indiranagar studio, designed around unhurried consultations, warm European aesthetics, and hospital-grade sterilization protocols.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-brand-light/50 flex items-center justify-center text-brand-deep shrink-0 mt-0.5">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-display text-base font-bold text-text-primary">
                      Uncompromising Hygiene
                    </h4>
                    <p className="text-xs text-text-secondary mt-0.5 leading-relaxed">
                      Medical-grade autoclave sterilization for all metal instruments, single-use biodegradable gowns, and sanitized styling stations.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-brand-light/50 flex items-center justify-center text-brand-deep shrink-0 mt-0.5">
                    <Feather className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-display text-base font-bold text-text-primary">
                      Sustainable Luxury Products
                    </h4>
                    <p className="text-xs text-text-secondary mt-0.5 leading-relaxed">
                      We formulate and treat exclusively with authentic Olaplex, Kérastase, L'Oréal Professionnel, and Rica botanical waxes.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-brand-light/50 flex items-center justify-center text-brand-deep shrink-0 mt-0.5">
                    <HeartHandshake className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-display text-base font-bold text-text-primary">
                      Tailored Consultations
                    </h4>
                    <p className="text-xs text-text-secondary mt-0.5 leading-relaxed">
                      Every appointment begins with an in-depth conversation about your lifestyle, hair texture, skin sensitivity, and goals.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <img
                  src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=600&fit=crop"
                  alt="Salon interior styling"
                  className="rounded-card border border-salon-border shadow-subtle object-cover w-full h-64"
                />
                <img
                  src="https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=600&fit=crop"
                  alt="Botanical hair therapy"
                  className="rounded-card border border-salon-border shadow-subtle object-cover w-full h-44"
                />
              </div>
              <div className="space-y-4 pt-8">
                <img
                  src="https://images.unsplash.com/photo-1512290900672-1f55b967814b?w=600&fit=crop"
                  alt="Dermal facial spa"
                  className="rounded-card border border-salon-border shadow-subtle object-cover w-full h-44"
                />
                <img
                  src="https://images.unsplash.com/photo-1522337094344-664f3316e165?w=600&fit=crop"
                  alt="Hair treatment ritual"
                  className="rounded-card border border-salon-border shadow-subtle object-cover w-full h-64"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. OFFERS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <Badge variant="brand" size="sm" className="mb-3">
            Privileges & Promotions
          </Badge>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-text-primary tracking-tight">
            Curated Seasonal Offers
          </h2>
          <p className="text-text-secondary text-sm sm:text-base mt-2">
            Enjoy exclusive savings on signature salon services, bridal indulgences, and loyalty perks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {promotions.slice(0, 3).map((promo) => (
            <Card
              key={promo._id}
              variant="white"
              className="relative overflow-hidden border-2 border-dashed border-brand/50 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 rounded-full bg-brand-light/50 text-text-primary">
                    <Tag className="w-5 h-5" />
                  </div>
                  <span className="font-mono text-xs font-bold text-brand-deep">
                    {promo.discountType === 'PERCENTAGE'
                      ? `${promo.discountValue}% OFF`
                      : `₹${promo.discountValue} OFF`}
                  </span>
                </div>

                <h3 className="font-display text-xl font-bold text-text-primary">{promo.title}</h3>
                <p className="text-xs text-text-secondary mt-1.5 leading-relaxed">
                  {promo.description}
                </p>

                <p className="text-[11px] text-text-muted mt-3 font-mono">
                  Min spend: {formatCurrency(promo.minPurchase)}
                  {promo.maxDiscount ? ` • Max cap: ${formatCurrency(promo.maxDiscount)}` : ''}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-salon-border flex items-center justify-between">
                <button
                  onClick={() => handleCopyCode(promo.code)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-bone hover:bg-brand-light/40 border border-salon-border text-xs font-mono font-bold text-text-primary transition-colors"
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
                >
                  Apply & Book
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 6. TESTIMONIALS / REVIEWS */}
      <section className="bg-surface-bone/60 border-y border-salon-border py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Badge variant="brand" size="sm" className="mb-3">
              Client Praise
            </Badge>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-text-primary tracking-tight">
              Stories from our guests.
            </h2>
            <p className="text-text-secondary text-sm sm:text-base mt-2">
              Verified experiences from regular clients who trust SalonFlow for their signature looks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.slice(0, 6).map((rev) => (
              <Card key={rev._id} variant="white" className="flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 text-amber-500 mb-3">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-text-body italic leading-relaxed">
                    "{rev.reviewText}"
                  </p>
                </div>

                <div className="pt-4 mt-6 border-t border-salon-border flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-text-primary">{rev.customerName}</p>
                    <p className="text-[11px] text-text-muted">{rev.serviceName}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-brand-deep font-medium block">
                      with {rev.stylistName?.split(' ')[0]}
                    </span>
                    <span className="text-[10px] text-text-muted font-mono">
                      {formatDate(rev.date)}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 7. GALLERY SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <Badge variant="brand" size="sm" className="mb-3">
              Editorial Showcase
            </Badge>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-text-primary tracking-tight">
              A glimpse into the studio.
            </h2>
          </div>
          <Button
            variant="outline"
            size="md"
            onClick={() => navigate('/services')}
          >
            Explore Transformations
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryImages.map((img, i) => (
            <div
              key={i}
              className="relative rounded-card overflow-hidden border border-salon-border shadow-subtle aspect-[4/3] group bg-surface-bone"
            >
              <img
                src={img.url}
                alt={img.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 text-white">
                <span className="text-[10px] font-mono uppercase tracking-wider text-brand">
                  {img.category}
                </span>
                <h4 className="font-display text-lg font-bold">{img.title}</h4>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. FINAL BOOKING CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-[28px] bg-surface-dark text-white p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-card">
          {/* Subtle light blue radial glow in background */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl space-y-6">
            <Badge variant="brand" size="sm">
              Your Beauty Journey
            </Badge>

            <h2 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              Your next appointment <br />
              <span className="italic font-light text-brand">starts here.</span>
            </h2>

            <p className="text-zinc-300 text-base leading-relaxed">
              Experience effortless online scheduling with live stylist availability, transparent pricing, and instant booking confirmation.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate('/book')}
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                Book Appointment
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-white border-white/20 hover:bg-white/10"
                onClick={() => navigate('/services')}
              >
                Browse Price Menu
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
