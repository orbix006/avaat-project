import { ReactNode } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  external?: boolean;
  id?: string;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-gold text-onyx hover:bg-gold-light focus:ring-gold focus:ring-offset-warm-black',
  outline:
    'border border-gold text-gold hover:bg-gold hover:text-onyx focus:ring-gold focus:ring-offset-warm-black',
  ghost: 'text-gold hover:text-gold-light',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-5 py-2 text-xs',
  md: 'px-8 py-3 text-sm',
  lg: 'px-10 py-4 text-base',
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  href,
  className,
  onClick,
  type = 'button',
  disabled,
  external,
  id,
}: ButtonProps) {
  const base = cn(
    'inline-flex items-center justify-center gap-2 font-jost font-medium tracking-[0.12em] uppercase transition-[background-color,border-color,color,transform,box-shadow] duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-[2px] active:translate-y-0 transform',
    variantStyles[variant],
    sizeStyles[size],
    className
  );

  if (href) {
    return (
      <Link
        href={href}
        id={id}
        className={base}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      id={id}
      onClick={onClick}
      disabled={disabled}
      className={base}
    >
      {children}
    </button>
  );
}