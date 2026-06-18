'use client';

import React, { Suspense, useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { signIn } from '@/lib/auth';
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight, ShieldAlert } from 'lucide-react';
import { AuthShowcase } from '@/components/auth/AuthShowcase';
import { useToast } from '@/components/ui/Toast';

const loginSchema = z.object({
  email: z.string().min(1, 'Email address is required').email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must contain at least 8 characters.'),
});

type LoginInput = z.infer<typeof loginSchema>;

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginInput) => {
    setSubmitError(null);
    const loadingToastId = toast('Authenticating...', 'loading');

    startTransition(async () => {
      const formData = new FormData();
      formData.append('email', data.email);
      formData.append('password', data.password);

      try {
        const res = await signIn(null, formData);
        if (res?.error) {
          setSubmitError(res.error);
          toast(res.error, 'error');
        } else {
          toast('Logged in successfully!', 'success');
          const nextPath = searchParams.get('next') || '/';
          router.push(nextPath);
          router.refresh();
        }
      } catch (err: any) {
        const errMsg = err?.message || 'An unexpected error occurred.';
        setSubmitError(errMsg);
        toast(errMsg, 'error');
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
      {/* Reusable Luxury Showcase Column (55% Split) */}
      <AuthShowcase />

      {/* Right Form Column (45% Split) */}
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

          {/* Logo / Header */}
          <div className="text-center pb-6 border-b border-[#F0EFEA] dark:border-[#262626] mb-8">
            <motion.div variants={itemVariants} className="flex justify-center items-center gap-2 mb-3">
              <span className="font-cormorant text-2xl tracking-widest text-[#141417] dark:text-[#F5EFE6] font-bold">AVAAT</span>
              <span className="text-[10px] bg-[#D4AF37]/10 text-[#D4AF37] px-2 py-0.5 border border-[#D4AF37]/25 tracking-widest uppercase rounded">Studio</span>
            </motion.div>
            <motion.h2 variants={itemVariants} className="font-cormorant text-3xl font-bold tracking-wide text-[#141417] dark:text-[#F5EFE6]">
              Login
            </motion.h2>
            <motion.p variants={itemVariants} className="text-xs text-muted/80 dark:text-[#F5EFE6]/60 mt-1.5 font-jost">
              Welcome back to AVAAT Designs.
            </motion.p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Error Banner */}
            {submitError && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs rounded-xl flex items-start gap-2.5"
              >
                <ShieldAlert className="w-4.5 h-4.5 shrink-0 mt-0.5" />
                <span>{submitError}</span>
              </motion.div>
            )}

            {/* Email field */}
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
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
              </div>
              {errors.email && (
                <p id="email-error" className="text-[10px] text-red-500 dark:text-red-400 font-semibold mt-1">
                  {errors.email.message}
                </p>
              )}
            </motion.div>

            {/* Password field */}
            <motion.div variants={itemVariants} className="space-y-2">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="text-[11px] text-[#141417]/70 dark:text-[#F5EFE6]/70 uppercase tracking-wider font-semibold">
                  Password
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-[11px] text-[#D4AF37] hover:text-[#E6C26E] font-semibold transition-colors uppercase tracking-wider"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative group">
                <Lock className="w-4.5 h-4.5 text-muted/60 absolute left-4.5 top-1/2 -translate-y-1/2 group-focus-within:text-[#D4AF37] transition-colors" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••••••"
                  disabled={isPending}
                  {...register('password')}
                  className={`bg-[#FAF8F5] dark:bg-[#1E1E20] border text-sm text-[#141417] dark:text-[#F5EFE6] rounded-xl pl-12 pr-12 py-4 w-full focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] transition-all duration-300 placeholder:text-muted/30 ${
                    errors.password ? 'border-red-500/50' : 'border-[#E5E5E5] dark:border-white/10'
                  }`}
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted/75 hover:text-[#D4AF37] transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
              {errors.password && (
                <p id="password-error" className="text-[10px] text-red-500 dark:text-red-400 font-semibold mt-1">
                  {errors.password.message}
                </p>
              )}
            </motion.div>

            {/* Login CTA Button */}
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
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <span>Login</span>
                    <ArrowRight className="w-4.5 h-4.5" />
                  </>
                )}
              </button>
            </motion.div>
          </form>

          {/* Secondary Actions */}
          <motion.div variants={itemVariants} className="text-center mt-8 pt-6 border-t border-[#F0EFEA] dark:border-[#262626] text-xs text-muted/80 dark:text-[#F5EFE6]/50">
            <span>Don&apos;t have an account? </span>
            <Link
              href="/auth/signup"
              className="text-[#D4AF37] hover:text-[#E6C26E] font-semibold transition-colors tracking-wide"
            >
              Create one
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FDFBF7] dark:bg-[#0F0F10] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#D4AF37]/30 border-t-[#D4AF37] rounded-full animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
