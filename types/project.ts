// Responsibility: TypeScript interfaces for Portfolio projects
export interface Project {
  id: string;
  title: string;
  slug: string;
  category: 'residential' | 'commercial' | 'architecture' | 'hospitality' | 'renovation';
  description: string;
  coverImage: string;
  tags: string[];
  client: string;
  year: number;
  featured: boolean;
  url?: string;
}