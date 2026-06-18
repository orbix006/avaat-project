import { forwardRef, InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

/* ── Input ── */
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, id, ...props }, ref) => (
    <div className="w-full group">
      {label && (
        <label
          htmlFor={id}
          className="block font-jost text-xs text-muted tracking-[0.15em] uppercase mb-3"
        >
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        className={cn(
          'w-full bg-transparent border-b border-gold/25 pb-3 pt-1 font-jost text-sm text-ivory placeholder:text-muted/40 outline-none transition-all duration-300',
          'focus:border-gold',
          error && 'border-red-500/70 focus:border-red-500',
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-2 font-jost text-xs text-red-400">{error}</p>
      )}
    </div>
  )
);
Input.displayName = 'Input';

/* ── Textarea ── */
interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, id, ...props }, ref) => (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="block font-jost text-xs text-muted tracking-[0.15em] uppercase mb-3"
        >
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={id}
        rows={4}
        className={cn(
          'w-full bg-transparent border-b border-gold/25 pb-3 pt-1 font-jost text-sm text-ivory placeholder:text-muted/40 outline-none transition-all duration-300 resize-none',
          'focus:border-gold',
          error && 'border-red-500/70 focus:border-red-500',
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-2 font-jost text-xs text-red-400">{error}</p>
      )}
    </div>
  )
);
Textarea.displayName = 'Textarea';

/* ── Select ── */
interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, className, id, options, ...props }, ref) => (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="block font-jost text-xs text-muted tracking-[0.15em] uppercase mb-3"
        >
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={id}
        className={cn(
          'w-full bg-warm-black border-b border-gold/25 pb-3 pt-1 font-jost text-sm text-ivory outline-none transition-all duration-300 cursor-pointer appearance-none',
          'focus:border-gold',
          error && 'border-red-500/70',
          className
        )}
        {...props}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-warm-black">
            {o.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-2 font-jost text-xs text-red-400">{error}</p>
      )}
    </div>
  )
);
Select.displayName = 'Select';