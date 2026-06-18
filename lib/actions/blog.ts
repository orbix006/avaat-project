'use server';

import { createServerClient } from '../supabase/server';
import { Database } from '@/types/database';

export type BlogPostRow = Database['public']['Tables']['blog_posts']['Row'];
export type BlogCategoryRow = Database['public']['Tables']['blog_categories']['Row'];

export interface BlogPostWithRelations extends BlogPostRow {
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
  author: {
    id: string;
    full_name: string;
    email: string;
    avatar_url: string | null;
  } | null;
}

/**
 * Fetches all blog posts with category and author relationships
 */
export async function fetchBlogPosts(): Promise<{ data?: BlogPostWithRelations[]; error?: string }> {
  const supabase = createServerClient();
  try {
    const { data, error } = await (supabase
      .from('blog_posts' as any) as any)
      .select('*, category:blog_categories(id, name, slug), author:profiles(id, full_name, email, avatar_url)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data: data || [] };
  } catch (err: any) {
    console.error('fetchBlogPosts error:', err);
    return { error: err?.message || 'Failed to fetch blog posts.' };
  }
}

/**
 * Fetches all blog categories
 */
export async function fetchBlogCategories(): Promise<{ data?: BlogCategoryRow[]; error?: string }> {
  const supabase = createServerClient();
  try {
    const { data, error } = await (supabase
      .from('blog_categories' as any) as any)
      .select('*')
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true });

    if (error) throw error;
    return { data: data || [] };
  } catch (err: any) {
    console.error('fetchBlogCategories error:', err);
    return { error: err?.message || 'Failed to fetch blog categories.' };
  }
}

/**
 * Calculates estimated reading time based on word count (average 200 words per minute)
 */
function estimateReadTime(content: string | null): number {
  if (!content) return 1;
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

/**
 * Creates a new blog post
 */
export async function createBlogPost(data: {
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  featured_image: string | null;
  category_id: string | null;
  is_published: boolean;
  published_at: string | null;
  seo_title: string | null;
  seo_desc: string | null;
}): Promise<{ success?: boolean; data?: BlogPostRow; error?: string }> {
  const supabase = createServerClient();
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { error: 'Not authenticated.' };

    // Check slug uniqueness
    const { data: existing } = await (supabase
      .from('blog_posts' as any) as any)
      .select('id')
      .eq('slug', data.slug)
      .maybeSingle();

    if (existing) {
      return { error: 'A blog post with this URL slug already exists.' };
    }

    const readTimeMin = estimateReadTime(data.content);

    const { data: newPost, error } = await (supabase
      .from('blog_posts' as any) as any)
      .insert({
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        featured_image: data.featured_image,
        category_id: data.category_id,
        author_id: user.id,
        is_published: data.is_published,
        published_at: data.is_published ? (data.published_at || new Date().toISOString()) : null,
        seo_title: data.seo_title,
        seo_desc: data.seo_desc,
        read_time_min: readTimeMin,
        view_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select('*')
      .single();

    if (error) throw error;
    return { success: true, data: newPost };
  } catch (err: any) {
    console.error('createBlogPost error:', err);
    return { error: err?.message || 'Failed to create blog post.' };
  }
}

/**
 * Updates an existing blog post
 */
export async function updateBlogPost(
  id: string,
  data: {
    title: string;
    slug: string;
    excerpt: string | null;
    content: string | null;
    featured_image: string | null;
    category_id: string | null;
    is_published: boolean;
    published_at: string | null;
    seo_title: string | null;
    seo_desc: string | null;
  }
): Promise<{ success?: boolean; data?: BlogPostRow; error?: string }> {
  const supabase = createServerClient();
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { error: 'Not authenticated.' };

    // Check slug uniqueness excluding current post
    const { data: existing } = await (supabase
      .from('blog_posts' as any) as any)
      .select('id')
      .eq('slug', data.slug)
      .neq('id', id)
      .maybeSingle();

    if (existing) {
      return { error: 'A blog post with this URL slug already exists.' };
    }

    const readTimeMin = estimateReadTime(data.content);

    const { data: updatedPost, error } = await (supabase
      .from('blog_posts' as any) as any)
      .update({
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        featured_image: data.featured_image,
        category_id: data.category_id,
        is_published: data.is_published,
        published_at: data.is_published ? (data.published_at || new Date().toISOString()) : null,
        seo_title: data.seo_title,
        seo_desc: data.seo_desc,
        read_time_min: readTimeMin,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw error;
    return { success: true, data: updatedPost };
  } catch (err: any) {
    console.error('updateBlogPost error:', err);
    return { error: err?.message || 'Failed to update blog post.' };
  }
}

/**
 * Deletes a blog post
 */
export async function deleteBlogPost(id: string): Promise<{ success?: boolean; error?: string }> {
  const supabase = createServerClient();
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { error: 'Not authenticated.' };

    const { error } = await (supabase
      .from('blog_posts' as any) as any)
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    console.error('deleteBlogPost error:', err);
    return { error: err?.message || 'Failed to delete blog post.' };
  }
}

/**
 * Bulk publishes multiple blog posts
 */
export async function bulkPublishBlogPosts(ids: string[]): Promise<{ success?: boolean; error?: string }> {
  const supabase = createServerClient();
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { error: 'Not authenticated.' };

    for (const id of ids) {
      const { data: post } = await (supabase.from('blog_posts' as any) as any)
        .select('published_at')
        .eq('id', id)
        .maybeSingle();

      const publishedAt = post?.published_at || new Date().toISOString();

      const { error } = await (supabase.from('blog_posts' as any) as any)
        .update({
          is_published: true,
          published_at: publishedAt,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;
    }

    return { success: true };
  } catch (err: any) {
    console.error('bulkPublishBlogPosts error:', err);
    return { error: err?.message || 'Failed to bulk publish blog posts.' };
  }
}

/**
 * Bulk archives multiple blog posts
 */
export async function bulkArchiveBlogPosts(ids: string[]): Promise<{ success?: boolean; error?: string }> {
  const supabase = createServerClient();
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { error: 'Not authenticated.' };

    for (const id of ids) {
      const { data: post } = await (supabase.from('blog_posts' as any) as any)
        .select('published_at')
        .eq('id', id)
        .maybeSingle();

      const publishedAt = post?.published_at || new Date().toISOString();

      const { error } = await (supabase.from('blog_posts' as any) as any)
        .update({
          is_published: false,
          published_at: publishedAt,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;
    }

    return { success: true };
  } catch (err: any) {
    console.error('bulkArchiveBlogPosts error:', err);
    return { error: err?.message || 'Failed to bulk archive blog posts.' };
  }
}
