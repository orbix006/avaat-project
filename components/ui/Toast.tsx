'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, AlertCircle, Loader2, X } from 'lucide-react';

export type ToastType = 'success' | 'warning' | 'error' | 'loading';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextType {
  toast: (message: string, type: ToastType, duration?: number) => string;
  dismiss: (id: string) => void;
  toasts: Toast[];
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((message: string, type: ToastType, duration = 4000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => {
      // If we show a final state, automatically clear any ongoing loading toasts.
      if (type !== 'loading') {
        return [...prev.filter((t) => t.type !== 'loading'), { id, message, type, duration }];
      }
      return [...prev, { id, message, type, duration }];
    });

    if (type !== 'loading') {
      setTimeout(() => {
        dismiss(id);
      }, duration);
    }

    return id;
  }, [dismiss]);

  return (
    <ToastContext.Provider value={{ toast, dismiss, toasts }}>
      {children}
      <ToastContainer toasts={toasts} dismiss={dismiss} />
    </ToastContext.Provider>
  );
}

function ToastContainer({ toasts, dismiss }: { toasts: Toast[]; dismiss: (id: string) => void }) {
  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 w-full max-w-sm pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((t) => (
          <ToastCard key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function ToastCard({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  const { message, type } = toast;

  const Icon = {
    success: CheckCircle2,
    warning: AlertTriangle,
    error: AlertCircle,
    loading: Loader2,
  }[type];

  const styles = {
    success: 'bg-[#0F0F10]/95 border-emerald-500/30 text-[#F5EFE6] hover:border-emerald-500/50 shadow-[0_15px_40px_rgba(16,185,129,0.08)]',
    warning: 'bg-[#0F0F10]/95 border-amber-500/30 text-[#F5EFE6] hover:border-amber-500/50 shadow-[0_15px_40px_rgba(245,158,11,0.08)]',
    error: 'bg-[#1C0F0F]/95 border-red-500/30 text-[#F5EFE6] hover:border-red-500/50 shadow-[0_15px_40px_rgba(239,68,68,0.08)]',
    loading: 'bg-[#0F0F10]/95 border-gold/25 text-[#F5EFE6] shadow-[0_15px_40px_rgba(212,175,55,0.06)]',
  }[type];

  const iconColors = {
    success: 'text-emerald-400',
    warning: 'text-amber-400',
    error: 'text-red-400',
    loading: 'text-gold animate-spin',
  }[type];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 15, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      className={`pointer-events-auto flex items-center justify-between gap-3.5 p-4 rounded-xl border backdrop-blur-md transition-all duration-300 ${styles}`}
    >
      <div className="flex items-center gap-3">
        <Icon className={`w-5 h-5 shrink-0 ${iconColors}`} />
        <span className="font-jost text-xs tracking-wide font-light leading-relaxed">{message}</span>
      </div>
      {type !== 'loading' && (
        <button
          onClick={onDismiss}
          className="text-[#F5EFE6]/40 hover:text-[#F5EFE6] transition-colors p-1"
          aria-label="Dismiss toast"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </motion.div>
  );
}
