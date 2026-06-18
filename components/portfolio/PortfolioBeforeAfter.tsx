'use client';
import ReactCompareImage from 'react-compare-image';
import { ProjectBeforeAfter } from '@/types/database';

interface PortfolioBeforeAfterProps {
  beforeAfter: ProjectBeforeAfter;
}

export function PortfolioBeforeAfter({ beforeAfter }: PortfolioBeforeAfterProps) {
  return (
    <div className="relative aspect-[4/3] w-full bg-warm-black border border-gold/10 hover:border-gold/25 transition-colors duration-500 shadow-2xl overflow-hidden select-none">
      <ReactCompareImage
        leftImage={beforeAfter.beforeImage}
        rightImage={beforeAfter.afterImage}
        leftImageLabel={beforeAfter.beforeLabel || 'Before'}
        rightImageLabel={beforeAfter.afterLabel || 'After'}
        sliderLineColor="#C9A84C"
        handle={
          <div className="w-10 h-10 rounded-full bg-gold border-2 border-ivory shadow-[0_0_20px_rgba(201,168,76,0.35)] flex items-center justify-center cursor-ew-resize">
            <svg className="w-3.5 h-3.5 text-onyx" fill="currentColor" viewBox="0 0 16 16">
              <path
                d="M5 4l-3 4 3 4M11 4l3 4-3 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </div>
        }
        sliderLineWidth={1.5}
      />
    </div>
  );
}
