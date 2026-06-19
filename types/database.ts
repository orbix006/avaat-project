// Responsibility: TypeScript types for Supabase database schema and models
// This file defines all system enums, database entities, and helper types matching the database.

// ─── Enums ────────────────────────────────────────────────────────────────────

export enum ProjectCategory {
  Residential = 'residential',
  Commercial = 'commercial',
  Architecture = 'architecture',
  Hospitality = 'hospitality',
  Renovation = 'renovation',
}

export enum ProjectStatus {
  Draft = 'draft',
  Published = 'published',
  Archived = 'archived',
}

export enum ConsultationStatus {
  Pending = 'pending',
  Contacted = 'contacted',
  InProgress = 'in_progress',
  Completed = 'completed',
  Cancelled = 'cancelled',
}

export enum BudgetRange {
  Under5L = 'under_5L',
  From5LTo15L = '5L_to_15L',
  From15LTo30L = '15L_to_30L',
  From30LTo60L = '30L_to_60L',
  From60LTo1Cr = '60L_to_1Cr',
  Above1Cr = 'above_1Cr',
  ToBeDiscussed = 'to_be_discussed',
}

export enum ProjectTypeEnum {
  NewConstruction = 'new_construction',
  InteriorDesign = 'interior_design',
  Renovation = 'renovation',
  CommercialFitOut = 'commercial_fit_out',
  Landscape = 'landscape',
  ConsultationOnly = 'consultation_only',
}

export enum ServiceType {
  InteriorDesign = 'interior_design',
  ArchitecturalDesign = 'architectural_design',
  RenovationRemodeling = 'renovation_remodeling',
  SpacePlanning = 'space_planning',
  ThreeDVisualization = '3d_visualization',
  FurnitureMaterialSelection = 'furniture_material_selection',
}

export enum MediaType {
  Image = 'image',
  Video = 'video',
}

// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface HeroSlide {
  id: string;
  sortOrder?: number;
  mediaType?: MediaType;
  mediaUrl?: string;
  overlayColor?: string;
  overlayOpacity?: number;
  headingLine1?: string | null;
  headingLine2?: string | null;
  ctaText?: string | null;
  ctaLink?: string | null;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
  // Fallback compatibility with previous structure
  heading: string;
  subheading: string;
  ctaPrimaryLabel: string;
  ctaPrimaryHref: string;
  ctaSecondaryLabel: string;
  ctaSecondaryHref: string;
  backgroundImage: string;
  order: number;
  active: boolean;
}

export interface Service {
  id: string;
  title: string;
  slug: string;
  serviceType: ServiceType;
  description: string;
  shortDescription: string;
  iconName: string;
  iconSvg: string | null;
  coverImage: string | null;
  imageUrl?: string | null;
  image_url: string | null;
  featured: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
  // Frontend backward-compatibility helpers
  features: string[];
  startingPrice: string | null;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  category: ProjectCategory;
  status: ProjectStatus;
  location: string;
  city: string | null;
  completionYear: string | number | null;
  shortDescription: string;
  overview: string | null;
  designStory: string | null;
  designChallenges: string | null;
  materialsFinishes: string | null;
  finalOutcome: string | null;
  coverImage: string;
  videoUrl: string | null;
  featured: boolean;
  order: number;
  viewCount: number;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
  clientName: string | null;
  galleryImages: string[] | null;
  // Legacy / Frontend fields compatibility
  description: string;
  tags: string[];
  client: string;
  year: string | number;
  url: string | null;
  projectUrl: string | null;
  githubUrl: string | null;
  technologies: string[] | null;
  projectType?: ProjectTypeEnum;
  clientUrl?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
}

export interface ProjectMedia {
  id: string;
  projectId: string;
  type: MediaType;
  url: string;
  caption: string | null;
  alt: string;
  order: number;
  isCover: boolean;
  width: number | null;
  height: number | null;
  createdAt: string;
}

export interface ProjectBeforeAfter {
  id: string;
  projectId: string;
  beforeImage: string;
  afterImage: string;
  beforeLabel: string;
  afterLabel: string;
  metrics: any[];
  createdAt: string;
  updatedAt: string;
}

export interface PublishedProject extends Project {
  status: ProjectStatus.Published;
  media: ProjectMedia[];
  beforeAfter: ProjectBeforeAfter | null;
}

export interface Testimonial {
  id: string;
  clientName: string;
  location: string | null;
  clientImage: string | null;
  rating: number;
  review: string;
  projectId: string | null;
  featured: boolean;
  approved: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
  // Legacy mappings
  name: string;
  quote: string;
  role: string;
  company: string;
  companyUrl: string | null;
  avatarUrl: string | null;
}

export interface FeaturedTestimonial extends Testimonial {
  featured: true;
  project: PublishedProject | null;
}

export interface BlogAuthor {
  id: string;
  name: string;
  avatar: string | null;
  bio: string | null;
  role: string | null;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  categoryId: string | null;
  authorId: string | null;
  author: BlogAuthor;
  tags: string[];
  readTime: number;
  published: boolean;
  publishedAt: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PublishedBlogPost extends BlogPost {
  published: true;
  publishedAt: string;
}

export interface ContactInfo {
  id: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  city: string;
  country: string;
  instagramUrl: string | null;
  linkedinUrl: string | null;
  twitterUrl: string | null;
  dribbbleUrl: string | null;
  behanceUrl: string | null;
  mapEmbedUrl: string | null;
  officeHours: string | null;
  updatedAt: string;
}

// ─── Site Settings Type ───────────────────────────────────────────────────────

export type SiteSettings = Record<string, string | null>;

// ─── Database Client Interface ───────────────────────────────────────────────

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          role: string;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          email: string;
          role?: string;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          email?: string;
          role?: string;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      hero_slides: {
        Row: {
          id: string;
          sort_order: number;
          media_type: 'image' | 'video';
          media_url: string;
          overlay_color: string;
          overlay_opacity: number;
          heading_line1: string | null;
          heading_line2: string | null;
          cta_text: string | null;
          cta_link: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          sort_order?: number;
          media_type?: 'image' | 'video';
          media_url: string;
          overlay_color?: string;
          overlay_opacity?: number;
          heading_line1?: string | null;
          heading_line2?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          sort_order?: number;
          media_type?: 'image' | 'video';
          media_url?: string;
          overlay_color?: string;
          overlay_opacity?: number;
          heading_line1?: string | null;
          heading_line2?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      services: {
        Row: {
          id: string;
          slug: string;
          service_type: 'interior_design' | 'architectural_design' | 'renovation_remodeling' | 'space_planning' | '3d_visualization' | 'furniture_material_selection';
          title: string;
          short_desc: string;
          long_desc: string | null;
          icon_name: string | null;
          icon_svg: string | null;
          cover_image: string | null;
          sort_order: number;
          is_active: boolean;
          seo_title: string | null;
          seo_desc: string | null;
          created_at: string;
          updated_at: string;
          image_url: string | null;
        };
        Insert: {
          id?: string;
          slug: string;
          service_type: 'interior_design' | 'architectural_design' | 'renovation_remodeling' | 'space_planning' | '3d_visualization' | 'furniture_material_selection';
          title: string;
          short_desc: string;
          long_desc?: string | null;
          icon_name?: string | null;
          icon_svg?: string | null;
          cover_image?: string | null;
          sort_order?: number;
          is_active?: boolean;
          seo_title?: string | null;
          seo_desc?: string | null;
          created_at?: string;
          updated_at?: string;
          image_url?: string | null;
        };
        Update: {
          id?: string;
          slug?: string;
          service_type?: 'interior_design' | 'architectural_design' | 'renovation_remodeling' | 'space_planning' | '3d_visualization' | 'furniture_material_selection';
          title?: string;
          short_desc?: string;
          long_desc?: string | null;
          icon_name?: string | null;
          icon_svg?: string | null;
          cover_image?: string | null;
          sort_order?: number;
          is_active?: boolean;
          seo_title?: string | null;
          seo_desc?: string | null;
          created_at?: string;
          updated_at?: string;
          image_url?: string | null;
        };
        Relationships: [];
      };
      projects: {
        Row: {
          id: string;
          slug: string;
          title: string;
          category: 'residential' | 'commercial' | 'architecture' | 'hospitality' | 'renovation';
          status: 'draft' | 'published' | 'archived';
          location: string;
          city: string | null;
          completion_date: string | null;
          short_description: string;
          full_description: string | null;
          design_story: string | null;
          design_challenges: string | null;
          materials_finishes: string | null;
          final_outcome: string | null;
          featured_image: string | null;
          video_url: string | null;
          featured: boolean;
          display_order: number;
          view_count: number;
          created_by: string | null;
          created_at: string;
          updated_at: string;
          seo_title: string | null;
          seo_desc: string | null;
          project_url: string | null;
          github_url: string | null;
          technologies: string[] | null;
          client_name: string | null;
          gallery_images: string[] | null;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          category: 'residential' | 'commercial' | 'architecture' | 'hospitality' | 'renovation';
          status?: 'draft' | 'published' | 'archived';
          location: string;
          city?: string | null;
          completion_date?: string | null;
          short_description: string;
          full_description?: string | null;
          design_story?: string | null;
          design_challenges?: string | null;
          materials_finishes?: string | null;
          final_outcome?: string | null;
          featured_image?: string | null;
          video_url?: string | null;
          featured?: boolean;
          display_order?: number;
          view_count?: number;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
          seo_title?: string | null;
          seo_desc?: string | null;
          project_url?: string | null;
          github_url?: string | null;
          technologies?: string[] | null;
          client_name?: string | null;
          gallery_images?: string[] | null;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          category?: 'residential' | 'commercial' | 'architecture' | 'hospitality' | 'renovation';
          status?: 'draft' | 'published' | 'archived';
          location?: string;
          city?: string | null;
          completion_date?: string | null;
          short_description?: string;
          full_description?: string | null;
          design_story?: string | null;
          design_challenges?: string | null;
          materials_finishes?: string | null;
          final_outcome?: string | null;
          featured_image?: string | null;
          video_url?: string | null;
          featured?: boolean;
          display_order?: number;
          view_count?: number;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
          seo_title?: string | null;
          seo_desc?: string | null;
          project_url?: string | null;
          github_url?: string | null;
          technologies?: string[] | null;
          client_name?: string | null;
          gallery_images?: string[] | null;
        };
        Relationships: [
          {
            foreignKeyName: "projects_created_by_fkey";
            columns: ["created_by"];
            referencedRelation: "profiles";
            referencedSchema: "public";
          }
        ];
      };
      project_media: {
        Row: {
          id: string;
          project_id: string;
          media_type: 'image' | 'video';
          url: string;
          caption: string | null;
          alt_text: string | null;
          sort_order: number;
          is_cover: boolean;
          width: number | null;
          height: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          media_type?: 'image' | 'video';
          url: string;
          caption?: string | null;
          alt_text?: string | null;
          sort_order?: number;
          is_cover?: boolean;
          width?: number | null;
          height?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          media_type?: 'image' | 'video';
          url?: string;
          caption?: string | null;
          alt_text?: string | null;
          sort_order?: number;
          is_cover?: boolean;
          width?: number | null;
          height?: number | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "project_media_project_id_fkey";
            columns: ["project_id"];
            referencedRelation: "projects";
            referencedSchema: "public";
          }
        ];
      };
      project_before_after: {
        Row: {
          id: string;
          project_id: string;
          before_url: string;
          after_url: string;
          label: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          before_url: string;
          after_url: string;
          label?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          before_url?: string;
          after_url?: string;
          label?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "project_before_after_project_id_fkey";
            columns: ["project_id"];
            referencedRelation: "projects";
            referencedSchema: "public";
          }
        ];
      };
      tags: {
        Row: {
          id: string;
          name: string;
          slug: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      project_tags: {
        Row: {
          project_id: string;
          tag_id: string;
        };
        Insert: {
          project_id: string;
          tag_id: string;
        };
        Update: {
          project_id?: string;
          tag_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "project_tags_project_id_fkey";
            columns: ["project_id"];
            referencedRelation: "projects";
            referencedSchema: "public";
          },
          {
            foreignKeyName: "project_tags_tag_id_fkey";
            columns: ["tag_id"];
            referencedRelation: "tags";
            referencedSchema: "public";
          }
        ];
      };
      project_services: {
        Row: {
          project_id: string;
          service_id: string;
        };
        Insert: {
          project_id: string;
          service_id: string;
        };
        Update: {
          project_id?: string;
          service_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "project_services_project_id_fkey";
            columns: ["project_id"];
            referencedRelation: "projects";
            referencedSchema: "public";
          },
          {
            foreignKeyName: "project_services_service_id_fkey";
            columns: ["service_id"];
            referencedRelation: "services";
            referencedSchema: "public";
          }
        ];
      };
      testimonials: {
        Row: {
          id: string;
          client_name: string;
          location: string | null;
          client_image: string | null;
          rating: number;
          review: string;
          project_id: string | null;
          is_featured: boolean;
          is_published: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          client_name: string;
          location?: string | null;
          client_image?: string | null;
          rating?: number;
          review: string;
          project_id?: string | null;
          is_featured?: boolean;
          is_published?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          client_name?: string;
          location?: string | null;
          client_image?: string | null;
          rating?: number;
          review?: string;
          project_id?: string | null;
          is_featured?: boolean;
          is_published?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "testimonials_project_id_fkey";
            columns: ["project_id"];
            referencedRelation: "projects";
            referencedSchema: "public";
          }
        ];
      };
      team_members: {
        Row: {
          id: string;
          full_name: string;
          role: string;
          bio: string | null;
          photo_url: string | null;
          email: string | null;
          linkedin_url: string | null;
          instagram_url: string | null;
          sort_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          full_name: string;
          role: string;
          bio?: string | null;
          photo_url?: string | null;
          email?: string | null;
          linkedin_url?: string | null;
          instagram_url?: string | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          role?: string;
          bio?: string | null;
          photo_url?: string | null;
          email?: string | null;
          linkedin_url?: string | null;
          instagram_url?: string | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      awards: {
        Row: {
          id: string;
          title: string;
          awarding_body: string;
          year: number;
          description: string | null;
          logo_url: string | null;
          project_id: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          awarding_body: string;
          year: number;
          description?: string | null;
          logo_url?: string | null;
          project_id?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          awarding_body?: string;
          year?: number;
          description?: string | null;
          logo_url?: string | null;
          project_id?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "awards_project_id_fkey";
            columns: ["project_id"];
            referencedRelation: "projects";
            referencedSchema: "public";
          }
        ];
      };
      blog_categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          sort_order?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      blog_posts: {
        Row: {
          id: string;
          slug: string;
          title: string;
          excerpt: string | null;
          content: string | null;
          featured_image: string | null;
          category_id: string | null;
          author_id: string | null;
          is_published: boolean;
          published_at: string | null;
          view_count: number;
          read_time_min: number | null;
          seo_title: string | null;
          seo_desc: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          excerpt?: string | null;
          content?: string | null;
          featured_image?: string | null;
          category_id?: string | null;
          author_id?: string | null;
          is_published?: boolean;
          published_at?: string | null;
          view_count?: number;
          read_time_min?: number | null;
          seo_title?: string | null;
          seo_desc?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          excerpt?: string | null;
          content?: string | null;
          featured_image?: string | null;
          category_id?: string | null;
          author_id?: string | null;
          is_published?: boolean;
          published_at?: string | null;
          view_count?: number;
          read_time_min?: number | null;
          seo_title?: string | null;
          seo_desc?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "blog_posts_author_id_fkey";
            columns: ["author_id"];
            referencedRelation: "profiles";
            referencedSchema: "public";
          },
          {
            foreignKeyName: "blog_posts_category_id_fkey";
            columns: ["category_id"];
            referencedRelation: "blog_categories";
            referencedSchema: "public";
          }
        ];
      };
      blog_post_tags: {
        Row: {
          post_id: string;
          tag_id: string;
        };
        Insert: {
          post_id: string;
          tag_id: string;
        };
        Update: {
          post_id?: string;
          tag_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "blog_post_tags_post_id_fkey";
            columns: ["post_id"];
            referencedRelation: "blog_posts";
            referencedSchema: "public";
          },
          {
            foreignKeyName: "blog_post_tags_tag_id_fkey";
            columns: ["tag_id"];
            referencedRelation: "tags";
            referencedSchema: "public";
          }
        ];
      };
      consultation_requests: {
        Row: {
          id: string;
          name: string;
          phone: string;
          email: string;
          project_type: 'new_construction' | 'interior_design' | 'renovation' | 'commercial_fit_out' | 'landscape' | 'consultation_only' | null;
          budget_range: 'under_5L' | '5L_to_15L' | '15L_to_30L' | '30L_to_60L' | '60L_to_1Cr' | 'above_1Cr' | 'to_be_discussed' | null;
          project_location: string | null;
          message: string | null;
          status: 'pending' | 'contacted' | 'in_progress' | 'completed' | 'cancelled';
          assigned_to: string | null;
          internal_notes: string | null;
          source: string;
          utm_source: string | null;
          utm_medium: string | null;
          utm_campaign: string | null;
          ip_address: string | null;
          user_agent: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          phone: string;
          email: string;
          project_type?: 'new_construction' | 'interior_design' | 'renovation' | 'commercial_fit_out' | 'landscape' | 'consultation_only' | null;
          budget_range?: 'under_5L' | '5L_to_15L' | '15L_to_30L' | '30L_to_60L' | '60L_to_1Cr' | 'above_1Cr' | 'to_be_discussed' | null;
          project_location?: string | null;
          message?: string | null;
          status?: 'pending' | 'contacted' | 'in_progress' | 'completed' | 'cancelled';
          assigned_to?: string | null;
          internal_notes?: string | null;
          source?: string;
          utm_source?: string | null;
          utm_medium?: string | null;
          utm_campaign?: string | null;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          phone?: string;
          email?: string;
          project_type?: 'new_construction' | 'interior_design' | 'renovation' | 'commercial_fit_out' | 'landscape' | 'consultation_only' | null;
          budget_range?: 'under_5L' | '5L_to_15L' | '15L_to_30L' | '30L_to_60L' | '60L_to_1Cr' | 'above_1Cr' | 'to_be_discussed' | null;
          project_location?: string | null;
          message?: string | null;
          status?: 'pending' | 'contacted' | 'in_progress' | 'completed' | 'cancelled';
          assigned_to?: string | null;
          internal_notes?: string | null;
          source?: string;
          utm_source?: string | null;
          utm_medium?: string | null;
          utm_campaign?: string | null;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "consultation_requests_assigned_to_fkey";
            columns: ["assigned_to"];
            referencedRelation: "profiles";
            referencedSchema: "public";
          }
        ];
      };
      consultation_status_history: {
        Row: {
          id: string;
          consultation_id: string;
          old_status: 'pending' | 'contacted' | 'in_progress' | 'completed' | 'cancelled' | null;
          new_status: 'pending' | 'contacted' | 'in_progress' | 'completed' | 'cancelled';
          changed_by: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          consultation_id: string;
          old_status?: 'pending' | 'contacted' | 'in_progress' | 'completed' | 'cancelled' | null;
          new_status: 'pending' | 'contacted' | 'in_progress' | 'completed' | 'cancelled';
          changed_by?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          consultation_id?: string;
          old_status?: 'pending' | 'contacted' | 'in_progress' | 'completed' | 'cancelled' | null;
          new_status?: 'pending' | 'contacted' | 'in_progress' | 'completed' | 'cancelled';
          changed_by?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "consultation_status_history_changed_by_fkey";
            columns: ["changed_by"];
            referencedRelation: "profiles";
            referencedSchema: "public";
          },
          {
            foreignKeyName: "consultation_status_history_consultation_id_fkey";
            columns: ["consultation_id"];
            referencedRelation: "consultation_requests";
            referencedSchema: "public";
          }
        ];
      };
      newsletter_subscribers: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          is_active: boolean;
          confirmed_at: string | null;
          source: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name?: string | null;
          is_active?: boolean;
          confirmed_at?: string | null;
          source?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          is_active?: boolean;
          confirmed_at?: string | null;
          source?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      activity_logs: {
        Row: {
          id: string;
          user_id: string | null;
          action: string;
          entity_type: string | null;
          entity_id: string | null;
          details: any | null;
          ip_address: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          action: string;
          entity_type?: string | null;
          entity_id?: string | null;
          details?: any | null;
          ip_address?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          action?: string;
          entity_type?: string | null;
          entity_id?: string | null;
          details?: any | null;
          ip_address?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "activity_logs_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "profiles";
            referencedSchema: "public";
          }
        ];
      };
      site_settings: {
        Row: {
          key: string;
          value: string | null;
          label: string | null;
          group_name: string;
          updated_by: string | null;
          updated_at: string;
        };
        Insert: {
          key: string;
          value?: string | null;
          label?: string | null;
          group_name?: string;
          updated_by?: string | null;
          updated_at?: string;
        };
        Update: {
          key?: string;
          value?: string | null;
          label?: string | null;
          group_name?: string;
          updated_by?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "site_settings_updated_by_fkey";
            columns: ["updated_by"];
            referencedRelation: "profiles";
            referencedSchema: "public";
          }
        ];
      };
      contact_info: {
        Row: {
          id: string;
          phone: string | null;
          whatsapp: string | null;
          email: string | null;
          address_line1: string | null;
          address_line2: string | null;
          city: string | null;
          state: string | null;
          pincode: string | null;
          google_maps_url: string | null;
          instagram_url: string | null;
          business_hours: string;
          is_active: boolean;
          updated_at: string;
        };
        Insert: {
          id?: string;
          phone?: string | null;
          whatsapp?: string | null;
          email?: string | null;
          address_line1?: string | null;
          address_line2?: string | null;
          city?: string | null;
          state?: string | null;
          pincode?: string | null;
          google_maps_url?: string | null;
          instagram_url?: string | null;
          business_hours?: string;
          is_active?: boolean;
          updated_at?: string;
        };
        Update: {
          id?: string;
          phone?: string | null;
          whatsapp?: string | null;
          email?: string | null;
          address_line1?: string | null;
          address_line2?: string | null;
          city?: string | null;
          state?: string | null;
          pincode?: string | null;
          google_maps_url?: string | null;
          instagram_url?: string | null;
          business_hours?: string;
          is_active?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      page_views: {
        Row: {
          id: number;
          page: string;
          referrer: string | null;
          ip_address: string | null;
          user_agent: string | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          page: string;
          referrer?: string | null;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
        Update: {
          id?: number;
          page?: string;
          referrer?: string | null;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      v_published_projects: {
        Row: {
          id: string;
          slug: string;
          title: string;
          category: 'residential' | 'commercial' | 'architecture' | 'hospitality' | 'renovation';
          status: 'draft' | 'published' | 'archived';
          location: string;
          city: string | null;
          completion_date: string | null;
          short_description: string;
          full_description: string | null;
          design_story: string | null;
          design_challenges: string | null;
          materials_finishes: string | null;
          final_outcome: string | null;
          featured_image: string | null;
          video_url: string | null;
          featured: boolean;
          display_order: number;
          view_count: number;
          created_by: string | null;
          created_at: string;
          updated_at: string;
          seo_title: string | null;
          seo_desc: string | null;
          project_url: string | null;
          github_url: string | null;
          technologies: string[] | null;
          client_name: string | null;
          gallery_images: string[] | null;
          resolved_cover: string | null;
          tag_names: string[];
        };
      };
      v_featured_testimonials: {
        Row: {
          id: string;
          client_name: string;
          location: string | null;
          photo_url: string | null;
          rating: number;
          review: string;
          project_id: string | null;
          is_featured: boolean;
          is_published: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
          project_title: string | null;
          project_slug: string | null;
        };
      };
      v_published_blog_posts: {
        Row: {
          id: string;
          slug: string;
          title: string;
          excerpt: string | null;
          content: string | null;
          cover_image: string | null;
          category_id: string | null;
          author_id: string | null;
          is_published: boolean;
          published_at: string | null;
          view_count: number;
          read_time_min: number | null;
          seo_title: string | null;
          seo_desc: string | null;
          created_at: string;
          updated_at: string;
          category_name: string | null;
          category_slug: string | null;
          author_name: string | null;
        };
      };
      v_admin_dashboard: {
        Row: {
          published_projects: number;
          pending_consultations: number;
          pending_testimonials: number;
          newsletter_count: number;
          published_posts: number;
          total_project_views: number;
        };
      };
    };
    Functions: {
      increment_project_views: {
        Args: {
          project_slug: string;
        };
        Returns: void;
      };
      increment_blog_views: {
        Args: {
          post_slug: string;
        };
        Returns: void;
      };
      is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
    };
    Enums: {
      project_category: 'residential' | 'commercial' | 'architecture' | 'hospitality' | 'renovation';
      project_status: 'draft' | 'published' | 'archived';
      consultation_status: 'pending' | 'contacted' | 'in_progress' | 'completed' | 'cancelled';
      budget_range: 'under_5L' | '5L_to_15L' | '15L_to_30L' | '30L_to_60L' | '60L_to_1Cr' | 'above_1Cr' | 'to_be_discussed';
      project_type_enum: 'new_construction' | 'interior_design' | 'renovation' | 'commercial_fit_out' | 'landscape' | 'consultation_only';
      service_type: 'interior_design' | 'architectural_design' | 'renovation_remodeling' | 'space_planning' | '3d_visualization' | 'furniture_material_selection';
      media_type: 'image' | 'video';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}