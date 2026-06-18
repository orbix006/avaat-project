// Responsibility: Static portfolio project data for AVAAT Design
import { Project } from '@/types/project';

export const PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Luminary Jewelry',
    slug: 'luminary-jewelry',
    category: 'hospitality',
    description:
      'A luxury e-commerce experience for a fine jewelry brand, featuring immersive product storytelling and seamless purchasing.',
    coverImage: 'https://picsum.photos/seed/luminary/800/600',
    tags: ['E-Commerce', 'UI/UX', 'Next.js', 'Shopify'],
    client: 'Luminary Gems Ltd.',
    year: 2024,
    featured: true,
    url: 'https://example.com',
  },
  {
    id: '2',
    title: 'Verde Organics',
    slug: 'verde-organics',
    category: 'residential',
    description:
      'Complete brand identity and web presence for an organic food startup, celebrating natural beauty through earthy design.',
    coverImage: 'https://picsum.photos/seed/verde/800/600',
    tags: ['Branding', 'Web Design', 'Packaging'],
    client: 'Verde Organics Co.',
    year: 2024,
    featured: true,
  },
  {
    id: '3',
    title: 'Apex Architecture',
    slug: 'apex-architecture',
    category: 'architecture',
    description:
      'A portfolio website for an award-winning architecture firm, showcasing their projects with cinematic full-screen imagery.',
    coverImage: 'https://picsum.photos/seed/apexarch/800/600',
    tags: ['Web Design', 'Portfolio', 'Animation'],
    client: 'Apex Studio',
    year: 2023,
    featured: true,
  },
  {
    id: '4',
    title: 'Solstice Spa & Wellness',
    slug: 'solstice-spa',
    category: 'architecture',
    description:
      'A serene digital retreat for a luxury spa — online booking, treatment showcases, and a calming aesthetic.',
    coverImage: 'https://picsum.photos/seed/solstice/800/600',
    tags: ['Web Design', 'Booking System', 'UI/UX'],
    client: 'Solstice Wellness Group',
    year: 2023,
    featured: false,
  },
  {
    id: '5',
    title: 'Meridian Consulting',
    slug: 'meridian-consulting',
    category: 'commercial',
    description:
      'A high-performance corporate site with custom CMS, lead-generation funnels, and advanced analytics integration.',
    coverImage: 'https://picsum.photos/seed/meridian/800/600',
    tags: ['Next.js', 'CMS', 'Analytics', 'Lead Gen'],
    client: 'Meridian Partners LLC',
    year: 2024,
    featured: false,
  },
  {
    id: '6',
    title: 'Prism Art Gallery',
    slug: 'prism-gallery',
    category: 'renovation',
    description:
      'An online gallery and auction platform for contemporary art, featuring immersive artwork showcases and live bidding.',
    coverImage: 'https://picsum.photos/seed/prismgal/800/600',
    tags: ['Web Design', 'E-Commerce', 'Art Direction'],
    client: 'Prism Contemporary Art',
    year: 2023,
    featured: false,
  },
];
