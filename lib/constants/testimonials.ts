// Responsibility: Static testimonial data for AVAAT Design
export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  company: string;
  rating: number;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    quote:
      'AVAAT completely transformed our online presence. The attention to detail, the animations, the overall feel — it exceeded every expectation. Our conversions are up 240% since launch.',
    name: 'Alexandra Chen',
    role: 'CEO',
    company: 'Luminary Gems',
    rating: 5,
  },
  {
    id: '2',
    quote:
      'Working with AVAAT was an absolute pleasure. They took our vague vision and turned it into a brand identity that perfectly captures who we are. Truly world-class work.',
    name: 'Marcus Williams',
    role: 'Founder',
    company: 'Verde Organics',
    rating: 5,
  },
  {
    id: '3',
    quote:
      "The new website has completely elevated our studio's reputation. Clients consistently mention it as the reason they chose us over competitors. Phenomenal ROI.",
    name: 'Isabella Torres',
    role: 'Principal Architect',
    company: 'Apex Studio',
    rating: 5,
  },
  {
    id: '4',
    quote:
      'From the initial consultation to final delivery, AVAAT was professional, creative, and deeply committed to excellence. The results speak for themselves.',
    name: 'James Hartley',
    role: 'Director',
    company: 'Meridian Partners',
    rating: 5,
  },
  {
    id: '5',
    quote:
      'The level of craft AVAAT brings to every pixel is extraordinary. Our new site is not just beautiful — it performs. Page speed scores went from 42 to 98 overnight.',
    name: 'Sofia Laurent',
    role: 'CMO',
    company: 'Solstice Wellness',
    rating: 5,
  },
];

export const BLOG_POSTS = [
  {
    id: '1',
    title: 'The Psychology of Luxury Web Design',
    slug: 'psychology-luxury-web-design',
    excerpt:
      'How premium brands use typography, whitespace, and motion to signal quality and drive trust before a single word is read.',
    coverImage: 'https://picsum.photos/seed/blog1/800/500',
    author: { name: 'AVAAT Editorial' },
    publishedAt: '2024-11-12',
    tags: ['Design', 'Psychology', 'Luxury'],
    readTime: 6,
  },
  {
    id: '2',
    title: 'Why Your Website Speed Is Killing Your Conversions',
    slug: 'website-speed-conversions',
    excerpt:
      'A 1-second delay in page response causes a 7% reduction in conversions. Here is how we tackle performance at the code level.',
    coverImage: 'https://picsum.photos/seed/blog2/800/500',
    author: { name: 'AVAAT Editorial' },
    publishedAt: '2024-10-28',
    tags: ['Performance', 'Development', 'SEO'],
    readTime: 8,
  },
  {
    id: '3',
    title: 'Building Brand Trust Through Consistent Design Systems',
    slug: 'brand-trust-design-systems',
    excerpt:
      'Inconsistency is the silent killer of brand credibility. Learn how a solid design system protects your reputation at scale.',
    coverImage: 'https://picsum.photos/seed/blog3/800/500',
    author: { name: 'AVAAT Editorial' },
    publishedAt: '2024-10-05',
    tags: ['Branding', 'Design Systems', 'Strategy'],
    readTime: 5,
  },
  {
    id: '4',
    title: 'Next.js 14 App Router: Our Production Experience',
    slug: 'nextjs-14-app-router-production',
    excerpt:
      'After shipping 12 client projects with the App Router, here are the patterns that work, the pitfalls to avoid, and our go-to stack.',
    coverImage: 'https://picsum.photos/seed/blog4/800/500',
    author: { name: 'AVAAT Editorial' },
    publishedAt: '2024-09-18',
    tags: ['Next.js', 'Development', 'React'],
    readTime: 10,
  },
  {
    id: '5',
    title: 'The ROI of Premium Web Design',
    slug: 'roi-premium-web-design',
    excerpt:
      'Investing in premium design is not a cost — it is your highest-leverage marketing spend. The data behind the case for quality.',
    coverImage: 'https://picsum.photos/seed/blog5/800/500',
    author: { name: 'AVAAT Editorial' },
    publishedAt: '2024-09-02',
    tags: ['Business', 'Design', 'ROI'],
    readTime: 7,
  },
  {
    id: '6',
    title: 'Micro-Animations That Actually Improve UX',
    slug: 'micro-animations-ux',
    excerpt:
      'Not all motion is equal. The science-backed principles we use to decide when animation helps and when it hurts the user experience.',
    coverImage: 'https://picsum.photos/seed/blog6/800/500',
    author: { name: 'AVAAT Editorial' },
    publishedAt: '2024-08-14',
    tags: ['Animation', 'UX', 'Framer Motion'],
    readTime: 6,
  },
];
