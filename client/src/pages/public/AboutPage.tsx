import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Sparkles, ShieldCheck, HeartHandshake, Feather, ArrowRight } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-16">
      {/* Editorial Intro */}
      <div className="max-w-3xl space-y-6">
        <Badge variant="brand" size="sm">
          Our Philosophy
        </Badge>
        <h1 className="font-display text-4xl sm:text-6xl font-extrabold tracking-tight text-text-primary leading-tight">
          Where European Precision Meets Indian Radiance.
        </h1>
        <p className="text-text-body text-lg leading-relaxed">
          Founded in Indiranagar, Bengaluru, SalonFlow Luxe Studio was conceived to eliminate the hurried, transactional atmosphere of conventional salons. We believe beauty is an intimate art form requiring deep listening, scientific knowledge, and organic care.
        </p>
      </div>

      {/* Visual Composition */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="rounded-[24px] overflow-hidden border border-salon-border shadow-card aspect-[4/3]">
          <img
            src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=900&fit=crop"
            alt="SalonFlow Studio Interior"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="space-y-6">
          <h2 className="font-display text-3xl font-bold text-text-primary">
            An Unhurried Sanctuary
          </h2>
          <p className="text-text-secondary text-sm sm:text-base leading-relaxed">
            Our private styling suites, dedicated color lounge, and soothing dermal treatment rooms are acoustically insulated and bathed in soft ambient daylight. Guests enjoy single-origin artisanal brews, loose-leaf herbal teas, and custom music playlists.
          </p>
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-card bg-white border border-salon-border">
              <span className="font-display text-2xl font-bold text-text-primary">100%</span>
              <p className="text-xs text-text-muted mt-1">Cruelty-free & formaldehyhe-free treatments</p>
            </div>
            <div className="p-4 rounded-card bg-white border border-salon-border">
              <span className="font-display text-2xl font-bold text-text-primary">CIDESCO</span>
              <p className="text-xs text-text-muted mt-1">Certified dermal and skincare therapists</p>
            </div>
          </div>
        </div>
      </div>

      {/* Core Values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-salon-border">
        <div className="space-y-3">
          <div className="w-10 h-10 rounded-full bg-brand-light/50 flex items-center justify-center text-brand-deep">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-display text-lg font-bold text-text-primary">Clean Hygiene Guarantee</h3>
          <p className="text-xs text-text-secondary leading-relaxed">
            All metal tools undergo a 3-stage ultrasonic cleansing and clinical autoclave cycle, sealed in individual surgical pouches opened only in your presence.
          </p>
        </div>

        <div className="space-y-3">
          <div className="w-10 h-10 rounded-full bg-brand-light/50 flex items-center justify-center text-brand-deep">
            <Feather className="w-5 h-5" />
          </div>
          <h3 className="font-display text-lg font-bold text-text-primary">Authentic Formulations</h3>
          <p className="text-xs text-text-secondary leading-relaxed">
            We source directly from manufacturer partners including Olaplex, L'Oréal Professionnel, Kérastase Paris, and OPI, ensuring zero counterfeit dilution.
          </p>
        </div>

        <div className="space-y-3">
          <div className="w-10 h-10 rounded-full bg-brand-light/50 flex items-center justify-center text-brand-deep">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <h3 className="font-display text-lg font-bold text-text-primary">Digital Transparency</h3>
          <p className="text-xs text-text-secondary leading-relaxed">
            No surprise add-ons. Our full-stack platform provides upfront fixed pricing, automated loyalty perks, and digital GST invoices.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="p-8 md:p-12 rounded-card bg-white border border-salon-border flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="font-display text-2xl font-bold text-text-primary">Ready to visit our studio?</h3>
          <p className="text-xs text-text-muted mt-1">Experience bespoke hair and skin care with our master artists.</p>
        </div>
        <Button
          variant="primary"
          size="lg"
          onClick={() => navigate('/book')}
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          Book Your Appointment
        </Button>
      </div>
    </div>
  );
};
