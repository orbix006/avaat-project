// Responsibility: Static service data for the AVAAT Design services
import { Service } from '@/types/service';

export const SERVICES: Service[] = [
  {
    id: '1',
    title: 'Interior Design',
    slug: 'interior-design',
    description:
      'Creating elegant, functional interiors tailored to your lifestyle and aesthetic vision.',
    iconName: 'Sparkles',
    features: [
      'Residential Interiors',
      'Commercial Spaces',
      'Material Selection',
      'Lighting & Styling',
    ],
    startingPrice: '$5,000',
  },
  {
    id: '2',
    title: 'Architectural Design',
    slug: 'architectural-design',
    description:
      'Designing innovative structures that balance beauty, efficiency, and sustainability.',
    iconName: 'Compass',
    features: [
      'Conceptual Design',
      'Spatial Planning',
      'Construction Drawings',
      'Site Inspections',
    ],
    startingPrice: '$10,000',
  },
  {
    id: '3',
    title: 'Renovation & Remodeling',
    slug: 'renovation-remodeling',
    description:
      'Transforming existing spaces into modern environments while preserving their character.',
    iconName: 'Hammer',
    features: [
      'Full Home Remodels',
      'Kitchen & Bath Styling',
      'Structural Changes',
      'Heritage Preservation',
    ],
    startingPrice: '$8,000',
  },
  {
    id: '4',
    title: 'Space Planning',
    slug: 'space-planning',
    description:
      'Optimizing layouts to enhance comfort, functionality, and flow.',
    iconName: 'Layout',
    features: [
      'Furniture Layouts',
      'Flow & Traffic Analysis',
      'Efficiency Mapping',
      'Ergonomic Design',
    ],
    startingPrice: '$2,500',
  },
  {
    id: '5',
    title: '3D Visualization',
    slug: '3d-visualization',
    description:
      'Realistic renders and visual concepts that bring ideas to life before construction begins.',
    iconName: 'Box',
    features: [
      '3D Photo Realistic Renders',
      'Virtual VR Walkthroughs',
      'Material Previews',
      'Lighting Mockups',
    ],
    startingPrice: '$4,000',
  },
  {
    id: '6',
    title: 'Furniture & Material Selection',
    slug: 'furniture-material-selection',
    description:
      'Curated finishes, furnishings, and materials that elevate every project.',
    iconName: 'Layers',
    features: [
      'Bespoke Furniture Sourcing',
      'Textile & Fabric Curation',
      'Finish Schedules',
      'Procurement Management',
    ],
    startingPrice: '$3,500',
  },
];
