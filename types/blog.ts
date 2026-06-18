// Responsibility: TypeScript interfaces for Blog posts
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  author: {
    name: string;
    avatar?: string;
  };
  publishedAt: string;
  tags: string[];
  readTime: number;
  content?: string;
}