'use client';

import React, { Suspense, useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { signIn } from '@/lib/auth';
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight, ShieldAlert } from 'lucide-react';
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
    toast('Authenticating administrative profile...', 'loading');

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
          toast('Admin authentication successful.', 'success');
          const nextPath = searchParams.get('next') || '/admin/dashboard';
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

  return (
    <div className="min-h-screen bg-onyx text-ivory font-jost flex items-center justify-center p-4 relative overflow-hidden">
      {/* Global Cursor style override for safety inside admin panels */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media (pointer: fine) {
          body, a, button, input, select, textarea, iframe, [role="button"] {
            cursor: auto !important;
          }
        }
      `}} />

      {/* Premium ambient light filters */}
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-gold/5 rounded-full blur-[100px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-gold/5 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Login Card */}
      <div className="w-full max-w-md bg-warm-black border border-gold/15 rounded-2xl p-8 shadow-2xl relative z-10 backdrop-blur-md">
        
        {/* Brand Header */}
        <div className="text-center pb-6 border-b border-gold/10 mb-8">
          <div className="flex justify-center items-center gap-2 mb-2">
            <span className="font-cormorant text-3xl tracking-widest text-gold font-bold">AVAAT</span>
            <span className="text-[10px] bg-gold/10 text-gold px-2 py-0.5 border border-gold/25 tracking-widest uppercase rounded">Admin</span>
          </div>
          <p className="text-[10px] text-muted tracking-[0.2em] uppercase">Studio Workspace Gate</p>
        </div>

        {/* Action Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          {/* Error Banner */}
          {submitError && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg flex items-start gap-2.5 animate-in fade-in duration-200">
              <ShieldAlert className="w-4.5 h-4.5 shrink-0 mt-0.5" />
              <span>{submitError}</span>
            </div>
          )}

          {/* Email Input */}
          <div className="space-y-2">
            <label className="text-[10px] text-muted uppercase tracking-wider font-semibold">Email Address</label>
            <div className="relative group">
              <Mail className="w-4.5 h-4.5 text-muted absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-gold transition-colors" />
              <input
                type="email"
                placeholder="admin@avaat.design"
                disabled={isPending}
                {...register('email')}
                className={`bg-onyx border text-xs text-ivory rounded pl-10 pr-4 py-3 w-full focus:outline-none focus:ring-1 focus:ring-gold transition-all duration-300 placeholder:text-muted/40 ${
                  errors.email ? 'border-red-500/50 focus:border-red-500' : 'border-gold/15 focus:border-gold'
                }`}
              />
            </div>
            {errors.email && (
              <p className="text-[10px] text-red-400 font-semibold mt-1 flex items-center gap-1">
                <span>{errors.email.message}</span>
              </p>
            )}
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label className="text-[10px] text-muted uppercase tracking-wider font-semibold">Password</label>
            <div className="relative group">
              <Lock className="w-4.5 h-4.5 text-muted absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-gold transition-colors" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••••••"
                disabled={isPending}
                {...register('password')}
                className={`bg-onyx border text-xs text-ivory rounded pl-10 pr-10 py-3 w-full focus:outline-none focus:ring-1 focus:ring-gold transition-all duration-300 placeholder:text-muted/40 ${
                  errors.password ? 'border-red-500/50 focus:border-red-500' : 'border-gold/15 focus:border-gold'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-gold transition-colors"
              >
                {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-[10px] text-red-400 font-semibold mt-1 flex items-center gap-1">
                <span>{errors.password.message}</span>
              </p>
            )}
          </div>

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full gold-btn-primary py-3.5 rounded flex justify-center items-center gap-2 shadow-lg shadow-gold/15 font-semibold tracking-wider uppercase text-xs transition-all disabled:opacity-55"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4.5 h-4.5 animate-spin text-onyx" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>Sign In to Studio</span>
                <ArrowRight className="w-4.5 h-4.5 text-onyx" />
              </>
            )}
          </button>
        </form>

        {/* Footer info links */}
        <div className="text-center mt-8 pt-4 border-t border-gold/5 text-[10px] text-muted leading-relaxed">
          <span>Protected Administrative Interface.<br />Unauthorised access logs will be monitored.</span>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-onyx flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
