import React from 'react';

export function ProcessSkeleton() {
  return (
    <section className="section-pad bg-onyx relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 animate-pulse select-none">
        <div className="text-center mb-24">
          <div className="h-4 w-20 bg-gold/5 mx-auto mb-3 rounded" />
          <div className="h-10 w-80 bg-ivory/5 mx-auto mb-6 rounded" />
          <div className="h-4 w-[450px] bg-muted/5 mx-auto rounded hidden md:block" />
        </div>

        <div className="relative">
          {/* Horizontal Line track placeholder for desktop */}
          <div className="hidden lg:block absolute top-[28px] left-[10%] right-[10%] h-px bg-gold/5 z-0 pointer-events-none" />

          {/* Grid layout */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 relative z-10">
            {Array.from({ length: 5 }).map((_, idx) => (
              <div key={idx} className="flex flex-col items-center text-center">
                {/* Node badge */}
                <div className="w-14 h-14 rounded-full border border-gold/10 bg-onyx/50 flex items-center justify-center mb-8" />
                {/* Title */}
                <div className="h-5 w-24 bg-ivory/5 mb-3 rounded" />
                {/* Description */}
                <div className="h-3 w-full bg-muted/5 mb-2 rounded" />
                <div className="h-3 w-4/5 bg-muted/5 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function SocialConnectSkeleton() {
  return (
    <section className="relative py-24 overflow-hidden bg-[#0F0F10] border-t border-white/5 animate-pulse select-none">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="h-4 w-28 bg-gold/5 mx-auto mb-4 rounded" />
          <div className="h-12 w-[450px] bg-ivory/5 mx-auto rounded hidden md:block" />
          <div className="h-8 w-80 bg-ivory/5 mx-auto rounded md:hidden" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div
              key={idx}
              className="flex flex-col justify-between p-8 rounded-2xl bg-white/[0.005] border border-white/5 h-[240px]"
            >
              <div>
                {/* Icon wrapper */}
                <div className="w-12 h-12 rounded-full bg-white/[0.01] border border-white/5 mb-6" />
                {/* Title */}
                <div className="h-6 w-24 bg-ivory/5 mb-3 rounded" />
                {/* Description */}
                <div className="h-4 w-full bg-muted/5 mb-2 rounded" />
                <div className="h-4 w-2/3 bg-muted/5 rounded" />
              </div>
              {/* Action */}
              <div className="h-3 w-16 bg-gold/5 mt-6 rounded" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
