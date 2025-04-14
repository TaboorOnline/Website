
// src/modules/landing/services/blogService.ts
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../../app/supabaseClient';
import { BlogPost } from '../../../shared/types/types';

// Get published blog posts
export const useBlogPosts = (limit?: number) => {
  return useQuery({
    queryKey: ['blogPosts', limit],
    queryFn: async () => {
      let query = supabase
        .from('blog_posts')
        .select('*, profiles!inner(name, avatar_url)')
        .eq('published', true)
        .order('published_at', { ascending: false });
      
      if (limit) {
        query = query.limit(limit);
      }
      
      const { data, error } = await query;
      
      if (error) throw new Error(error.message);
      return data as (BlogPost & { profiles: { name: string; avatar_url: string | null } })[];
    },
  });
};

// Get a single blog post by slug
export const useBlogPost = (slug: string) => {
  return useQuery({
    queryKey: ['blogPost', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*, profiles!inner(name, avatar_url)')
        .eq('slug', slug)
        .eq('published', true)
        .single();
      
      if (error) throw new Error(error.message);
      return data as (BlogPost & { profiles: { name: string; avatar_url: string | null } });
    },
    enabled: !!slug,
  });
};