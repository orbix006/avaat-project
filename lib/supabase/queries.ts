import { supabase as browserClient } from './client';
import { createServerClient } from './server';
import {
  HeroSlide,
  Service,
  Project,
  PublishedProject,
  ProjectMedia,
  ProjectBeforeAfter,


  BlogAuthor,
  BlogPost,
  PublishedBlogPost,
  ContactInfo,
  SiteSettings,
  ProjectStatus,
  ProjectCategory,
  ServiceType,
  MediaType,
} from '@/types/database';

// ─── Environment Helpers ──────────────────────────────────────────────────────

// Obtains the correct client depending on whether execution is client-side or server-side
const getSupabaseClient = () => {
  if (typeof window === 'undefined') {
    return createServerClient();
  }
  return browserClient;
};

// ─── Mapper Functions (snake_case DB rows to camelCase TS interfaces) ───────────

const mapHeroSlide = (row: any): HeroSlide => ({
  id: row.id || '',
  sortOrder: Number(row.sort_order) || 0,
  mediaType: (row.media_type || 'image') as MediaType,
  mediaUrl: row.media_url || '',
  overlayColor: row.overlay_color || '#000000',
  overlayOpacity: Number(row.overlay_opacity) || 0.55,
  headingLine1: row.heading_line1 || null,
  headingLine2: row.heading_line2 || null,
  isActive: Boolean(row.is_active),
  createdAt: row.created_at || '',
  updatedAt: row.updated_at || '',

  // Fallback compatibility with previous structure
  heading: [row.heading_line1, row.heading_line2].filter(Boolean).join('. '),
  subheading: '',
  ctaPrimaryLabel: row.cta_text || 'View Portfolio',
  ctaPrimaryHref: row.cta_link || '/portfolio',
  ctaSecondaryLabel: 'Book Consultation',
  ctaSecondaryHref: '/contact',
  backgroundImage: row.media_url || '',
  order: Number(row.sort_order) || 0,
  active: Boolean(row.is_active),
});

const mapService = (row: any): Service => ({
  id: row.id || '',
  title: row.title || '',
  slug: row.slug || '',
  serviceType: row.service_type as ServiceType,
  description: row.long_desc || row.short_desc || '',
  shortDescription: row.short_desc || '',
  iconName: row.icon_name || 'Home',
  iconSvg: row.icon_svg || null,
  coverImage: row.cover_image || null,
  featured: Boolean(row.is_active),
  order: Number(row.sort_order) || 0,
  createdAt: row.created_at || '',
  updatedAt: row.updated_at || '',
  features: [],
  startingPrice: null,
});

const mapProject = (row: any): Project => ({
  id: row.id || '',
  title: row.title || '',
  slug: row.slug || '',
  category: row.category as ProjectCategory,
  status: row.status as ProjectStatus,
  location: row.location || '',
  city: row.city || null,
  completionYear: Number(row.completion_year) || null,
  shortDescription: row.short_desc || '',
  overview: row.full_description || null,
  designStory: row.design_story || null,
  designChallenges: row.design_challenges || null,
  materialsFinishes: row.materials_finishes || null,
  finalOutcome: row.final_outcome || null,
  coverImage: row.resolved_cover || row.featured_image || '',
  videoUrl: row.video_url || null,
  featured: Boolean(row.featured),
  order: Number(row.display_order) || 0,
  viewCount: Number(row.view_count) || 0,
  createdBy: row.created_by || null,
  createdAt: row.created_at || '',
  updatedAt: row.updated_at || '',
  clientName: row.client_name || null,
  galleryImages: Array.isArray(row.gallery_images) ? row.gallery_images : [],

  // Legacy fields compatibility
  description: row.full_description || row.short_description || '',
  tags: Array.isArray(row.tag_names) ? row.tag_names : (Array.isArray(row.tags) ? row.tags : []),
  client: row.client_name || row.location || '',
  clientUrl: null,
  year: Number(row.completion_year) || 0,
  url: row.project_url || null,
  projectUrl: row.project_url || null,
  githubUrl: row.github_url || null,
  technologies: Array.isArray(row.technologies) ? row.technologies : [],
  projectType: undefined,
  seoTitle: row.seo_title || null,
  seoDescription: row.seo_desc || null,
});

const mapProjectMedia = (row: any): ProjectMedia => ({
  id: row.id || '',
  projectId: row.project_id || '',
  type: (row.media_type || 'image') as MediaType,
  url: row.url || '',
  caption: row.caption || null,
  alt: row.alt_text || '',
  order: Number(row.sort_order) || 0,
  isCover: Boolean(row.is_cover),
  width: row.width || null,
  height: row.height || null,
  createdAt: row.created_at || '',
});

const mapProjectBeforeAfter = (row: any): ProjectBeforeAfter => ({
  id: row.id || '',
  projectId: row.project_id || '',
  beforeImage: row.before_url || '',
  afterImage: row.after_url || '',
  beforeLabel: row.label || 'Before',
  afterLabel: row.label || 'After',
  metrics: [],
  createdAt: row.created_at || '',
  updatedAt: row.created_at || '',
});

const mapPublishedProject = (row: any): PublishedProject => {
  const base = mapProject(row);
  const mediaRows = row.project_media || [];
  const beforeAfterRows = row.project_before_after || [];
  const beforeAfterRow = Array.isArray(beforeAfterRows) ? beforeAfterRows[0] : (beforeAfterRows || null);

  return {
    ...base,
    status: ProjectStatus.Published,
    media: Array.isArray(mediaRows) ? mediaRows.map(mapProjectMedia) : [],
    beforeAfter: beforeAfterRow ? mapProjectBeforeAfter(beforeAfterRow) : null,
  };
};





const mapBlogPost = (row: any): BlogPost => {
  const authorObj: BlogAuthor = {
    id: row.author_id || '',
    name: row.author_name || 'AVAAT Editorial',
    avatar: null,
    bio: null,
    role: null,
  };

  return {
    id: row.id || '',
    title: row.title || '',
    slug: row.slug || '',
    excerpt: row.excerpt || '',
    content: row.content || '',
    featuredImage: row.featured_image || '',
    categoryId: row.category_id || null,
    authorId: row.author_id || null,
    author: authorObj,
    tags: Array.isArray(row.tags) ? row.tags : [],
    readTime: Number(row.read_time_min) || 5,
    published: Boolean(row.is_published),
    publishedAt: row.published_at || null,
    seoTitle: row.seo_title || null,
    seoDescription: row.seo_desc || null,
    createdAt: row.created_at || '',
    updatedAt: row.updated_at || '',
  };
};

const mapPublishedBlogPost = (row: any): PublishedBlogPost => {
  const base = mapBlogPost(row);
  return {
    ...base,
    published: true,
    publishedAt: base.publishedAt || new Date().toISOString(),
  };
};

const mapContactInfo = (row: any): ContactInfo => {
  const parts = [];
  if (row.address_line1) parts.push(row.address_line1);
  if (row.address_line2) parts.push(row.address_line2);
  const addressVal = parts.join(', ');

  return {
    id: row.id || '',
    email: row.email || '',
    phone: row.phone || '',
    whatsapp: row.whatsapp || '',
    address: addressVal,
    city: row.city || '',
    country: row.state || '',
    instagramUrl: row.instagram_url || null,
    linkedinUrl: null,
    twitterUrl: null,
    dribbbleUrl: null,
    behanceUrl: null,
    mapEmbedUrl: row.google_maps_url || null,
    officeHours: row.business_hours || null,
    updatedAt: row.updated_at || '',
  };
};

const mapSiteSettings = (data: any): SiteSettings => {
  const settings: SiteSettings = {};
  if (!data) return settings;

  if (Array.isArray(data)) {
    data.forEach((row) => {
      const key = row.key || row.setting_key || row.name;
      const val = row.value !== undefined ? row.value : (row.setting_value !== undefined ? row.setting_value : null);
      if (key) {
        settings[key] = val;
      }
    });
  } else if (typeof data === 'object') {
    Object.keys(data).forEach((k) => {
      settings[k] = data[k] !== undefined ? String(data[k]) : null;
    });
  }
  return settings;
};

// ─── Queries ──────────────────────────────────────────────────────────────────

/**
 * Fetches all active hero slides, ordered by display order.
 */
export async function getActiveHeroSlides(): Promise<HeroSlide[]> {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) return [];

    const { data, error } = await supabase
      .from('hero_slides')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error || !data) {
      console.error('Error fetching active hero slides:', error);
      return [];
    }

    return data.map(mapHeroSlide);
  } catch (err) {
    console.error('Exception in getActiveHeroSlides:', err);
    return [];
  }
}

/**
 * Fetches all services configured in the system, ordered by display order.
 */
export async function getActiveServices(): Promise<Service[]> {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) return [];

    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error || !data) {
      console.error('Error fetching active services:', error);
      return [];
    }

    return data.map(mapService);
  } catch (err) {
    console.error('Exception in getActiveServices:', err);
    return [];
  }
}

/**
 * Fetches all completed (published) portfolio projects with their media assets and metrics.
 */
export async function getPublishedProjects(): Promise<PublishedProject[]> {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) return [];

    const { data, error } = await supabase
      .from('v_published_projects' as any)
      .select('*, project_media(*), project_before_after(*)');

    if (error || !data) {
      console.error('Error fetching published projects:', error);
      return [];
    }

    return data.map(mapPublishedProject);
  } catch (err) {
    console.error('Exception in getPublishedProjects:', err);
    return [];
  }
}

/**
 * Fetches featured completed projects.
 */
export async function getFeaturedProjects(): Promise<PublishedProject[]> {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) return [];

    const { data, error } = await supabase
      .from('v_published_projects' as any)
      .select('*, project_media(*), project_before_after(*)')
      .eq('featured', true);

    if (error || !data) {
      console.error('Error fetching featured projects:', error);
      return [];
    }

    return data.map(mapPublishedProject);
  } catch (err) {
    console.error('Exception in getFeaturedProjects:', err);
    return [];
  }
}

/**
 * Fetches a single completed project by its slug.
 */
export async function getProjectBySlug(slug: string): Promise<PublishedProject | null> {
  try {
    const supabase = getSupabaseClient();
    if (!supabase || !slug) return null;

    const { data, error } = await supabase
      .from('v_published_projects' as any)
      .select('*, project_media(*), project_before_after(*)')
      .eq('slug', slug)
      .single();

    if (error || !data) {
      console.error(`Error fetching project by slug "${slug}":`, error);
      return null;
    }

    return mapPublishedProject(data);
  } catch (err) {
    console.error(`Exception in getProjectBySlug for "${slug}":`, err);
    return null;
  }
}



/**
 * Fetches site key-value configuration settings.
 */
export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) return {};

    const { data, error } = await supabase
      .from('site_settings')
      .select('*');

    if (error || !data) {
      console.error('Error fetching site settings:', error);
      return {};
    }

    return mapSiteSettings(data);
  } catch (err) {
    console.error('Exception in getSiteSettings:', err);
    return {};
  }
}

/**
 * Fetches contact info record.
 */
export async function getContactInfo(): Promise<ContactInfo | null> {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) return null;

    const { data, error } = await supabase
      .from('contact_info')
      .select('*')
      .eq('is_active', true)
      .limit(1)
      .maybeSingle();

    if (error || !data) {
      console.error('Error fetching contact info:', error);
      return null;
    }

    return mapContactInfo(data);
  } catch (err) {
    console.error('Exception in getContactInfo:', err);
    return null;
  }
}

/**
 * Fetches published blog posts along with their author details.
 */
export async function getPublishedBlogPosts(): Promise<PublishedBlogPost[]> {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) return [];

    const { data, error } = await supabase
      .from('v_published_blog_posts' as any)
      .select('*');

    if (error || !data) {
      console.error('Error fetching published blog posts:', error);
      return [];
    }

    return data.map(mapPublishedBlogPost);
  } catch (err) {
    console.error('Exception in getPublishedBlogPosts:', err);
    return [];
  }
}

/**
 * Fetches a single published blog post by its slug.
 */
export async function getBlogPostBySlug(slug: string): Promise<PublishedBlogPost | null> {
  try {
    const supabase = getSupabaseClient();
    if (!supabase || !slug) return null;

    const { data, error } = await supabase
      .from('v_published_blog_posts' as any)
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (error) {
      console.error(`Error fetching blog post by slug "${slug}":`, error);
      return null;
    }

    if (!data) return null;

    return mapPublishedBlogPost(data);
  } catch (err) {
    console.error(`Exception in getBlogPostBySlug for "${slug}":`, err);
    return null;
  }
}