import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { MapPin, Phone, Mail, Clock, Send, Check } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', phone: '', message: '' });
    }, 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-12">
      <div className="max-w-2xl space-y-4">
        <Badge variant="brand" size="sm">
          Get in Touch
        </Badge>
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-text-primary">
          Visit Our Indiranagar Studio.
        </h1>
        <p className="text-text-secondary text-base leading-relaxed">
          Have an inquiry regarding bridal couture bookings, custom balayage consultations, or private events? Reach out to our concierge team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Contact Info Card */}
        <div className="lg:col-span-5 space-y-6">
          <Card variant="white" className="p-8 space-y-6">
            <h3 className="font-display text-2xl font-bold text-text-primary">Studio Location</h3>

            <div className="space-y-4 text-sm text-text-secondary">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-brand-deep shrink-0 mt-0.5" />
                <div>
                  <strong className="text-text-primary block">SalonFlow Luxe Studio</strong>
                  <span>42, Boulevard Promenade, 100ft Road, Indiranagar, Bengaluru, Karnataka 560038</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-brand-deep shrink-0" />
                <div>
                  <strong className="text-text-primary block">Concierge Desk</strong>
                  <span>+91 98765 43210</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-brand-deep shrink-0" />
                <div>
                  <strong className="text-text-primary block">Email Inquiries</strong>
                  <span>concierge@salonflow.demo</span>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-2">
                <Clock className="w-5 h-5 text-brand-deep shrink-0 mt-0.5" />
                <div>
                  <strong className="text-text-primary block">Studio Timings</strong>
                  <span>Monday – Sunday: 10:00 AM – 8:00 PM</span>
                  <p className="text-xs text-text-muted mt-0.5">Valet parking available at premises.</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Inquiry Form */}
        <div className="lg:col-span-7">
          <Card variant="white" className="p-8">
            <h3 className="font-display text-2xl font-bold text-text-primary mb-2">Send a Message</h3>
            <p className="text-xs text-text-muted mb-6">Our studio manager will respond within 2 business hours.</p>

            {submitted ? (
              <div className="p-8 rounded-card bg-emerald-50 border border-emerald-200 text-center space-y-2">
                <Check className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="font-display text-lg font-bold text-emerald-900">Message Received!</h4>
                <p className="text-xs text-emerald-700">Thank you for writing to us. Our concierge will call or message you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    required
                    placeholder="e.g. Anjali Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  <Input
                    label="Phone Number"
                    required
                    placeholder="+91 98765 00000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <Input
                  label="Email Address"
                  type="email"
                  required
                  placeholder="anjali@gmail.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary">
                    Your Message / Inquiry
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us what services or dates you have in mind..."
                    className="w-full rounded-2xl bg-white border border-salon-border px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto"
                  rightIcon={<Send className="w-4 h-4" />}
                >
                  Send Inquiry
                </Button>
              </form>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
