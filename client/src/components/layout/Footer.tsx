import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Phone, Mail, MapPin, Clock, Instagram, Facebook, Twitter } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-surface-bone border-t border-salon-border pt-16 pb-12 text-text-body">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-salon-border">
          {/* Column 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-surface-dark flex items-center justify-center text-brand">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="font-display text-2xl font-bold tracking-tight text-text-primary">
                SalonFlow
              </span>
            </Link>
            <p className="text-sm text-text-secondary max-w-sm leading-relaxed">
              Your Beauty. Your Time. Your Salon. A premier digital salon experience delivering haute couture hair styling, restorative dermatological therapies, and royal bridal artistry.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="#"
                className="w-9 h-9 rounded-full border border-salon-border flex items-center justify-center text-text-secondary hover:text-brand-deep hover:border-brand transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full border border-salon-border flex items-center justify-center text-text-secondary hover:text-brand-deep hover:border-brand transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full border border-salon-border flex items-center justify-center text-text-secondary hover:text-brand-deep hover:border-brand transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Services */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-text-primary">
              Services
            </h4>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li><Link to="/services" className="hover:text-text-primary transition-colors">Hair Styling & Cuts</Link></li>
              <li><Link to="/services" className="hover:text-text-primary transition-colors">Balayage & Color</Link></li>
              <li><Link to="/services" className="hover:text-text-primary transition-colors">24K Gold Facials</Link></li>
              <li><Link to="/services" className="hover:text-text-primary transition-colors">Gel Nails & Chrome</Link></li>
              <li><Link to="/services" className="hover:text-text-primary transition-colors">Royal Bridal Packages</Link></li>
              <li><Link to="/services" className="hover:text-text-primary transition-colors">Keratin Straightening</Link></li>
            </ul>
          </div>

          {/* Column 3: Quick Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-text-primary">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li><Link to="/services" className="hover:text-text-primary transition-colors">Service Catalog</Link></li>
              <li><Link to="/stylists" className="hover:text-text-primary transition-colors">Master Stylists</Link></li>
              <li><Link to="/offers" className="hover:text-text-primary transition-colors">Promotions & Offers</Link></li>
              <li><Link to="/book" className="hover:text-text-primary transition-colors">Book Online</Link></li>
              <li><Link to="/login" className="hover:text-text-primary transition-colors">Account Sign In</Link></li>
            </ul>
          </div>

          {/* Column 4: Salon Hours & Location */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-text-primary">
              Visit Studio
            </h4>
            <div className="space-y-2 text-xs text-text-secondary">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-brand-deep shrink-0 mt-0.5" />
                <span>42, Boulevard Promenade, 100ft Rd, Indiranagar, Bengaluru 560038</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand-deep shrink-0" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-deep shrink-0" />
                <span>concierge@salonflow.demo</span>
              </div>
              <div className="flex items-center gap-2 pt-1 text-text-primary font-medium">
                <Clock className="w-4 h-4 text-brand-deep shrink-0" />
                <span>Mon – Sun: 10:00 AM – 8:00 PM</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-text-muted gap-4">
          <p>© 2026 SalonFlow Luxe Studio. All rights reserved. Built with enterprise full-stack architecture.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-text-primary transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-text-primary transition-colors">Cancellation Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
