'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Loader2, ArrowLeft, CheckCircle2, ShieldAlert } from 'lucide-react';
import { resetPasswordForEmailAction } from '@/lib/auth';
import { AuthShowcase } from '@/components/auth/AuthShowcase';

const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'Email address is required').email('Please enter a valid email address'),
});

type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    setSubmitError(null);

    startTransition(async () => {
      try {
        const origin = window.location.origin;
        const redirectTo = `${origin}/auth/reset-password`;
        const res = await resetPasswordForEmailAction(data.email, redirectTo);
        if (res?.error) {
          setSubmitError(res.error);
        } else {
          setSubmitted(true);
        }
      } catch (err: any) {
        setSubmitError(err?.message || 'An unexpected error occurred.');
      }
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 200, damping: 22 }
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#FDFBF7] dark:bg-[#0F0F10] text-[#141417] dark:text-[#F5EFE6] font-jost overflow-hidden relative transition-colors duration-500">
      {/* Showcase Column (55% Split) */}
      <AuthShowcase />

      {/* Form Column (45% Split) */}
      <div className="w-full lg:w-[45%] flex flex-col justify-center items-center p-6 sm:p-12 relative z-10 bg-transparent">
        
        {/* Centered Glassmorphic Authentication Card */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-[500px] bg-white/80 dark:bg-[#151516]/90 border border-[#E5E5E5] dark:border-white/10 rounded-3xl p-8 sm:p-10 shadow-[0_30px_70px_rgba(0,0,0,0.06)] dark:shadow-[0_30px_70px_rgba(0,0,0,0.4)] backdrop-blur-xl relative overflow-hidden"
        >
          {/* Subtle gold line accent on top */}
          <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-[#D4AF37]/50 via-[#E6C26E] to-[#D4AF37]/50" />

          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.div
                key="request-form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {/* Logo / Header */}
                <div className="text-center pb-6 border-b border-[#F0EFEA] dark:border-[#262626] mb-8">
                  <div className="flex justify-center items-center gap-2 mb-3">
                    <span className="font-cormorant text-2xl tracking-widest text-[#141417] dark:text-[#F5EFE6] font-bold">AVAAT</span>
                    <span className="text-[10px] bg-[#D4AF37]/10 text-[#D4AF37] px-2 py-0.5 border border-[#D4AF37]/25 tracking-widest uppercase rounded">Studio</span>
                  </div>
                  <h2 className="font-cormorant text-3xl font-bold tracking-wide text-[#141417] dark:text-[#F5EFE6]">
                    Reset Password
                  </h2>
                  <p className="text-xs text-muted/80 dark:text-[#F5EFE6]/60 mt-1.5 font-jost">
                    Welcome back to AVAAT Designs.
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {submitError && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs rounded-xl flex items-start gap-2.5">
                      <ShieldAlert className="w-4.5 h-4.5 shrink-0 mt-0.5" />
                      <span>{submitError}</span>
                    </div>
                  )}

                  {/* Email input */}
                  <motion.div variants={itemVariants} className="space-y-2">
                    <label htmlFor="email" className="text-[11px] text-[#141417]/70 dark:text-[#F5EFE6]/70 uppercase tracking-wider font-semibold">
                      Email Address
                    </label>
                    <div className="relative group">
                      <Mail className="w-4.5 h-4.5 text-muted/60 absolute left-4.5 top-1/2 -translate-y-1/2 group-focus-within:text-[#D4AF37] transition-colors" />
                      <input
                        id="email"
                        type="email"
                        placeholder="name@company.com"
                        disabled={isPending}
                        {...register('email')}
                        className={`bg-[#FAF8F5] dark:bg-[#1E1E20] border text-sm text-[#141417] dark:text-[#F5EFE6] rounded-xl pl-12 pr-4 py-4 w-full focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] transition-all duration-300 placeholder:text-muted/30 ${
                          errors.email ? 'border-red-500/50' : 'border-[#E5E5E5] dark:border-white/10'
                        }`}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-[10px] text-red-500 dark:text-red-400 font-semibold mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </motion.div>

                  {/* Submit Action Button */}
                  <motion.div 
                    variants={itemVariants}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="pt-2"
                  >
                    <button
                      type="submit"
                      disabled={isPending}
                      className="w-full bg-[#141417] dark:bg-[#D4AF37] hover:bg-[#D4AF37] dark:hover:bg-[#E6C26E] text-white dark:text-black font-jost py-4 rounded-xl flex justify-center items-center gap-2 shadow-lg transition-all duration-300 font-semibold tracking-wider uppercase text-xs disabled:opacity-55 disabled:cursor-not-allowed"
                    >
                      {isPending ? (
                        <>
                          <Loader2 className="w-4.5 h-4.5 animate-spin" />
                          <span>Sending Link...</span>
                        </>
                      ) : (
                        <span>Send Reset Link</span>
                      )}
                    </button>
                  </motion.div>
                </form>

                {/* Return link */}
                <motion.div variants={itemVariants} className="text-center mt-8 pt-6 border-t border-[#F0EFEA] dark:border-[#262626]">
                  <Link
                    href="/auth/login"
                    className="inline-flex items-center gap-2 text-xs font-semibold text-muted/80 hover:text-[#D4AF37] dark:text-muted/60 dark:hover:text-[#D4AF37] transition-colors uppercase tracking-wider"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Back to Login
                  </Link>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="success-screen"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                className="text-center py-4 flex flex-col items-center"
              >
                {/* Checkmark Animation */}
                <motion.div
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.1, type: 'spring', stiffness: 150 }}
                  className="w-16 h-16 bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 rounded-full flex items-center justify-center mb-6"
                >
                  <CheckCircle2 className="w-8 h-8" />
                </motion.div>

                <h3 className="font-cormorant text-2xl font-bold text-[#141417] dark:text-[#F5EFE6] mb-3">
                  Reset Link Dispatched
                </h3>
                <p className="text-sm text-muted/80 dark:text-[#F5EFE6]/60 leading-relaxed max-w-xs mb-8">
                  Password reset link has been sent to your email.
                </p>

                <div className="w-full">
                  <Link
                    href="/auth/login"
                    className="w-full bg-[#141417] dark:bg-[#D4AF37] hover:bg-[#D4AF37] dark:hover:bg-[#E6C26E] text-white dark:text-black font-jost py-4 rounded-xl flex justify-center items-center shadow-lg transition-all duration-300 font-semibold tracking-wider uppercase text-xs"
                  >
                    Return to Login
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
