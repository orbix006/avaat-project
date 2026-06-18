import type { Metadata } from 'next';
import { Suspense } from 'react';
import nextDynamic from 'next/dynamic';
import { Navbar } from '@/components/layout/Navbar';
import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Services, ServicesSkeleton } from '@/components/sections/Services';
import { Portfolio, PortfolioSkeleton } from '@/components/sections/Portfolio';
import { WhyAvaat } from '@/components/sections/WhyAvaat';
import { BeforeAfter, BeforeAfterSkeleton } from '@/components/sections/BeforeAfter';

import { Footer } from '@/components/layout/Footer';
import { getActiveHeroSlides, getSiteSettings } from '@/lib/supabase/queries';

import { ProcessSkeleton, SocialConnectSkeleton } from '@/components/ui/Skeletons';

const Process = nextDynamic(
  () => import('@/components/sections/Process').then((mod) => mod.Process),
  {
    ssr: true,
    loading: () => <ProcessSkeleton />,
  }
);

const SocialConnect = nextDynamic(
  () => import('@/components/sections/SocialConnect').then((mod) => mod.SocialConnect),
  {
    ssr: true,
    loading: () => <SocialConnectSkeleton />,
  }
);

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'AVAAT Design | Premium Architectural & Interior Design Agency',
  description:
    'AVAAT Design creates refined architectural and interior environments that balance beauty, functionality, and individuality.',
};

export default async function Home() {
  // Fetch active hero slides and settings in parallel on the server
  const [slides, settings] = await Promise.all([
    getActiveHeroSlides(),
    getSiteSettings(),
  ]);

  return (
    <>
      <Navbar />
      <Hero slides={slides} settings={settings} />
      <About />
      <Suspense fallback={<ServicesSkeleton />}>
        <Services />
      </Suspense>
      <Suspense fallback={<PortfolioSkeleton />}>
        <Portfolio />
      </Suspense>
      <Process />
      <WhyAvaat />
      <Suspense fallback={<BeforeAfterSkeleton />}>
        <BeforeAfter />
      </Suspense>

      <SocialConnect />
      <Footer />
    </>
  );
}

