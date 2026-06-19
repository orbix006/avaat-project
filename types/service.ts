// Responsibility: TypeScript interfaces for Services
export interface Service {
  id: string;
  title: string;
  slug: string;
  description: string;
  iconName: string;
  features: string[];
  startingPrice?: string;
  image_url?: string | null;
  imageUrl?: string | null;
}