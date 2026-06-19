'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Phone, MapPin, Loader2, ArrowRight } from 'lucide-react';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { consultationSchema, ConsultationFormData } from '@/lib/validations/consultation';
import { useToast } from '@/components/ui/Toast';

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.703 1.457h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const PROJECT_TYPE_OPTIONS = [
  { value: '', label: 'Select project type' },
  { value: 'Residential Interior', label: 'Residential Interior' },
  { value: 'Commercial Interior', label: 'Commercial Interior' },
  { value: 'Architecture', label: 'Architecture' },
  { value: 'Renovation', label: 'Renovation' },
  { value: 'Turnkey Project', label: 'Turnkey Project' },
  { value: 'Other', label: 'Other' },
];

const BUDGET_OPTIONS = [
  { value: '', label: 'Select budget range' },
  { value: 'Under ₹5L', label: 'Under ₹5L' },
  { value: '₹5L–₹15L', label: '₹5L–₹15L' },
  { value: '₹15L–₹30L', label: '₹15L–₹30L' },
  { value: '₹30L–₹50L', label: '₹30L–₹50L' },
  { value: '₹50L+', label: '₹50L+' },
];

export function Contact() {
  const [serverError, setServerError] = useState('');
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ConsultationFormData>({
    resolver: zodResolver(consultationSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      projectType: undefined,
      budget: undefined,
      message: '',
    },
  });

  const onSubmit = async (data: ConsultationFormData) => {
    setServerError('');
    toast('Submitting your consultation request...', 'loading');
    try {
      const res = await fetch('/api/consultation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (res.ok && result.success) {
        toast('Consultation request submitted successfully.', 'success');
        reset();
      } else {
        const errMsg = result.message || result.error || 'Submission failed. Please try again.';
        setServerError(errMsg);
        toast(errMsg, 'error');
      }
    } catch {
      const errMsg = 'Unable to connect to server.';
      setServerError(errMsg);
      toast(errMsg, 'error');
    }
  };

  const contactDetails = [
    {
      label: 'Email',
      value: 'avaatdesigns.info@gmail.com',
      href: 'mailto:avaatdesigns.info@gmail.com',
      icon: Mail,
      ariaLabel: 'Email AVAAT Designs',
    },
    {
      label: 'Phone',
      value: '+91 7976267147',
      href: 'tel:+917976267147',
      icon: Phone,
      ariaLabel: 'Call AVAAT Designs',
    },
    {
      label: 'WhatsApp',
      value: '+91 7976267147',
      href: 'https://wa.me/917976267147',
      icon: WhatsAppIcon,
      ariaLabel: 'Chat with AVAAT Designs on WhatsApp',
    },
    {
      label: 'Location',
      value: 'AVAAT - Designs, Jodhpur',
      href: 'https://www.google.com/maps/place/AVAAT+-+Designs/@26.2434387,72.9837706,17z/data=!3m1!4b1!4m6!3m5!1s0x39418face511eb55:0xf766215a1c449db5!8m2!3d26.2434387!4d72.9837706!16s%2Fg%2F11jkyfnkw5',
      icon: MapPin,
      ariaLabel: 'Open AVAAT Designs on Google Maps',
    },
  ];

  return (
    <section id="contact" className="relative py-28 bg-[#0F0F10] overflow-hidden">
      {/* Background Glow Elements */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 rounded-full bg-[#D4AF37]/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-48 w-96 h-96 rounded-full bg-[#E6C26E]/5 blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center max-w-7xl mx-auto">
          {/* Left Side: Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-6 space-y-12"
          >
            <div className="space-y-6">
              <span className="font-jost text-[10px] tracking-[0.3em] uppercase text-[#D4AF37] block">
                Contact Studio
              </span>
              <h2 className="font-cormorant text-5xl md:text-6xl text-[#F5EFE6] leading-tight font-bold">
                Let&apos;s Create Something Exceptional
              </h2>
              <div className="w-24 h-[1px] bg-gradient-to-r from-[#D4AF37] to-transparent" />
              <p className="font-jost text-sm text-[#F5EFE6]/70 leading-relaxed max-w-xl">
                Whether you&apos;re planning a luxury residence, commercial space, renovation, or architectural project, our team is ready to discuss your vision.
              </p>
            </div>

            {/* Clickable Info Items */}
            <div className="space-y-6 pt-4">
              {contactDetails.map((detail) => {
                const Icon = detail.icon;
                return (
                  <div key={detail.label} className="group">
                    <a
                      href={detail.href}
                      target={detail.label === 'Location' || detail.label === 'WhatsApp' ? '_blank' : undefined}
                      rel={detail.label === 'Location' || detail.label === 'WhatsApp' ? 'noopener noreferrer' : undefined}
                      aria-label={detail.ariaLabel}
                      className="flex items-center gap-5 p-4 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] hover:border-[#D4AF37]/35 transition-all duration-300"
                    >
                      <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-[#0F0F10] transition-colors duration-300">
                        <Icon className="w-4.5 h-4.5" />
                      </div>
                      <div className="flex-1">
                        <span className="block font-jost text-[9px] tracking-widest text-[#F5EFE6]/40 uppercase mb-0.5">
                          {detail.label}
                        </span>
                        <span className="block font-jost text-sm text-[#F5EFE6] group-hover:text-[#D4AF37] transition-colors duration-300">
                          {detail.value}
                        </span>
                      </div>
                      <div className="text-[#D4AF37]/30 group-hover:text-[#D4AF37] transition-colors duration-300 font-jost text-xs pr-2">
                        →
                      </div>
                    </a>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Right Side: Floating Consultation Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-6 flex justify-center"
          >
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-lg p-8 md:p-10 rounded-2xl border border-white/10 hover:border-[#D4AF37]/30 bg-white/[0.02] dark:bg-[#121213]/40 shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:shadow-[0_25px_60px_rgba(212,175,55,0.12)] transition-all duration-300 backdrop-blur-md"
            >
              <div className="mb-8">
                <h3 className="font-cormorant text-3xl font-bold text-[#F5EFE6] mb-2">Book a Consultation</h3>
                <p className="font-jost text-xs text-[#F5EFE6]/60">Share your vision to schedule an design conversation with our curation leads.</p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
                <Input
                  id="contact-name"
                  label="Full Name"
                  placeholder="e.g. Jane Smith"
                  error={errors.name?.message}
                  {...register('name')}
                />

                <Input
                  id="contact-email"
                  label="Email Address"
                  type="email"
                  placeholder="e.g. jane@example.com"
                  error={errors.email?.message}
                  {...register('email')}
                />

                <Input
                  id="contact-phone"
                  label="Phone Number"
                  type="tel"
                  placeholder="e.g. +91 98765 43210"
                  error={errors.phone?.message}
                  {...register('phone')}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Select
                    id="contact-project-type"
                    label="Project Type"
                    options={PROJECT_TYPE_OPTIONS}
                    error={errors.projectType?.message}
                    {...register('projectType')}
                  />

                  <Select
                    id="contact-budget"
                    label="Project Budget"
                    options={BUDGET_OPTIONS}
                    error={errors.budget?.message}
                    {...register('budget')}
                  />
                </div>

                <Textarea
                  id="contact-message"
                  label="Message"
                  placeholder="Briefly describe your space, requirements, and design preferences..."
                  rows={4}
                  error={errors.message?.message}
                  {...register('message')}
                />

                {serverError && (
                  <p className="font-jost text-xs text-red-400 font-medium">{serverError}</p>
                )}

                <button
                  id="contact-submit"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#D4AF37] hover:bg-[#E6C26E] text-[#0F0F10] font-jost text-xs tracking-[0.15em] uppercase font-bold py-4 rounded-lg transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Booking...</span>
                    </>
                  ) : (
                    <>
                      <span>Book Consultation</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}