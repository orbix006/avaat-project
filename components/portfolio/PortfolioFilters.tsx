'use client';
import { cn } from '@/lib/utils';

export type PortfolioFilterValue =
  | 'all'
  | 'residential'
  | 'commercial'
  | 'architecture'
  | 'hospitality'
  | 'renovation';

const FILTERS: { label: string; value: PortfolioFilterValue }[] = [
  { label: 'All', value: 'all' },
  { label: 'Residential', value: 'residential' },
  { label: 'Commercial', value: 'commercial' },
  { label: 'Architecture', value: 'architecture' },
  { label: 'Hospitality', value: 'hospitality' },
  { label: 'Renovation', value: 'renovation' },
];

interface PortfolioFiltersProps {
  active: PortfolioFilterValue;
  onChange: (_value: PortfolioFilterValue) => void;
  className?: string;
}

export function PortfolioFilters({ active, onChange, className }: PortfolioFiltersProps) {
  return (
    <div className={cn('flex flex-wrap gap-2.5', className)}>
      {FILTERS.map(({ label, value }) => (
        <button
          key={value}
          id={`portfolio-filter-${value}`}
          type="button"
          onClick={() => onChange(value)}
          className={cn(
            'font-jost text-[10px] tracking-[0.25em] uppercase px-5 py-3 border transition-all duration-300 select-none',
            active === value
              ? 'border-gold bg-gold text-onyx font-medium shadow-md shadow-gold/5'
              : 'border-gold/15 text-muted hover:border-gold/40 hover:text-ivory'
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}