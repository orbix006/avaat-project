'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Instagram, MapPin, ArrowUpRight } from 'lucide-react';

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.703 1.457h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const socialLinks = [
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/avaatdesigns/',
    description: 'Follow our latest interior design projects',
    icon: Instagram,
    ariaLabel: 'Follow AVAAT Designs on Instagram',
  },
  {
    name: 'WhatsApp',
    url: 'https://wa.me/917976267147',
    description: 'Chat with our design experts directly',
    icon: WhatsAppIcon,
    ariaLabel: 'Connect with AVAAT Designs on WhatsApp',
  },
  {
    name: 'Google Maps',
    url: 'https://www.google.com/maps/place/AVAAT+-+Designs/@26.2434387,72.9837706,17z/data=!3m1!4b1!4m6!3m5!1s0x39418face511eb55:0xf766215a1c449db5!8m2!3d26.2434387!4d72.9837706!16s%2Fg%2F11jkyfnkw5?entry=ttu&g_ep=EgoyMDI2MDYxMy4wIKXMDSoASAFQAw%3D%3D',
    description: 'Visit our luxury design studio in Jodhpur',
    icon: MapPin,
    ariaLabel: 'Find AVAAT Designs on Google Maps',
  },
];

export function SocialConnectSkeleton() {
  return (
    <section className="relative py-24 overflow-hidden bg-[#0F0F10] border-t border-white/5 animate-pulse select-none">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="h-4 w-28 bg-gold/5 mx-auto mb-4 rounded" />
          <div className="h-12 w-[450px] bg-ivory/5 mx-auto rounded hidden md:block" />
          <div className="h-8 w-80 bg-ivory/5 mx-auto rounded md:hidden" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div
              key={idx}
              className="flex flex-col justify-between p-8 rounded-2xl bg-white/[0.005] border border-white/5 h-[240px]"
            >
              <div>
                {/* Icon wrapper */}
                <div className="w-12 h-12 rounded-full bg-white/[0.01] border border-white/5 mb-6" />
                {/* Title */}
                <div className="h-6 w-24 bg-ivory/5 mb-3 rounded" />
                {/* Description */}
                <div className="h-4 w-full bg-muted/5 mb-2 rounded" />
                <div className="h-4 w-2/3 bg-muted/5 rounded" />
              </div>
              {/* Action */}
              <div className="h-3 w-16 bg-gold/5 mt-6 rounded" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SocialConnect() {
  return (
    <section
      id="connect"
      className="relative py-24 overflow-hidden bg-[#0F0F10] border-t border-white/5"
    >
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.03)_0%,transparent_75%)] pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.65 }}
          >
            <span className="font-jost text-[10px] tracking-[0.3em] uppercase text-[#D4AF37] block mb-4">
              Connect With AVAAT
            </span>
            <h2 className="font-cormorant text-4xl md:text-5xl text-[#F5EFE6] leading-tight mb-4">
              Follow our latest projects, design insights, and studio updates.
            </h2>
          </motion.div>
        </div>

        {/* Social Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {socialLinks.map((social, index) => {
            const Icon = social.icon;
            return (
              <motion.a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.ariaLabel}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="group relative flex flex-col justify-between p-8 rounded-2xl bg-white/[0.01] border border-white/10 hover:border-[#D4AF37]/40 hover:shadow-[0_0_30px_-5px_rgba(212,175,55,0.12)] transition-all duration-300 backdrop-blur-md overflow-hidden"
              >
                {/* Subtle internal gold gradient glow on card hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                
                <div>
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center text-[#D4AF37] mb-6 group-hover:border-[#D4AF37]/25 transition-colors duration-300">
                    <Icon className="w-5 h-5" />
                  </div>

                  {/* Text Details */}
                  <h3 className="font-cormorant text-2xl font-semibold text-[#F5EFE6] mb-2">
                    {social.name}
                  </h3>
                  <p className="font-jost text-xs text-[#F5EFE6]/60 leading-relaxed mb-8">
                    {social.description}
                  </p>
                </div>

                {/* Bottom Action Area */}
                <div className="flex items-center gap-1.5 text-[10px] font-jost tracking-widest uppercase text-[#D4AF37] mt-auto">
                  <span>Open Link</span>
                  <ArrowUpRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
