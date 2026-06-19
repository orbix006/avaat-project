'use client';

import Link from 'next/link';
import { Instagram, MessageCircle, MapPin, Mail } from 'lucide-react';
import { NAV_LINKS } from '@/lib/constants/navigation';

export function Footer() {
  return (
    <footer className="bg-onyx border-t border-gold/10">
      {/* Large wordmark banner */}
      <div className="border-b border-gold/10 overflow-hidden py-10">
        <p className="font-cormorant text-[8rem] md:text-[12rem] lg:text-[16rem] text-gold/5 leading-none text-center tracking-[0.2em] select-none whitespace-nowrap">
          AVAAT
        </p>
      </div>

      {/* Main grid */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
          {/* Brand Column */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <img
                  src="/images/logo.png"
                  alt="Avaat Design Logo"
                  className="h-10 w-auto object-contain"
                />
                <span className="font-cormorant text-xl tracking-wider text-ivory font-semibold uppercase">
                  Avaat Design
                </span>
              </div>
              <p className="font-jost text-sm text-muted leading-relaxed mt-1 max-w-md">
                Avaat Design is an interior design and architecture studio creating thoughtful spaces that blend functionality, aesthetics, and timeless design.
              </p>
            </div>
            
            {/* Social Icons */}
            <div className="flex gap-5 mt-2">
              {[
                { 
                  href: 'https://www.instagram.com/avaatdesigns/', 
                  Icon: Instagram, 
                  label: 'Instagram' 
                },
                { 
                  href: 'https://wa.me/917976267147', 
                  Icon: MessageCircle, 
                  label: 'WhatsApp' 
                },
                { 
                  href: 'https://www.google.com/maps/place/AVAAT+-+Designs/@26.2434387,72.9837706,17z/data=!3m1!4b1!4m6!3m5!1s0x39418face511eb55:0xf766215a1c449db5!8m2!3d26.2434387!4d72.9837706!16s%2Fg%2F11jkyfnkw5?entry=ttu&g_ep=EgoyMDI2MDYxMy4wIKXMDSoASAFQAw%3D%3D', 
                  Icon: MapPin, 
                  label: 'Google Maps' 
                },
              ].map(({ href, Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="text-muted hover:text-gold transition-colors duration-300"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="font-jost text-[10px] tracking-[0.25em] uppercase text-muted mb-7">
              Company
            </h4>
            <ul className="space-y-3.5">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-jost text-sm text-muted/75 hover:text-gold transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <a
                href="mailto:avaatdesigns.info@gmail.com"
                className="flex items-center gap-2.5 font-jost text-sm text-muted/75 hover:text-gold transition-colors"
              >
                <Mail className="w-3.5 h-3.5 flex-shrink-0 text-gold" />
                avaatdesigns.info@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gold/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col items-center justify-center gap-4 text-center">
          <p className="font-jost text-xs text-muted/50 tracking-wide">
            Made with 💜 by Orbix
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="font-jost text-xs text-muted/50 hover:text-gold transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="font-jost text-xs text-muted/50 hover:text-gold transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}