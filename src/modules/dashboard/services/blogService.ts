// src/modules/dashboard/services/blogService.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../../app/supabaseClient';
import { BlogPost } from '../../../shared/types/types';

// Fetch all blog posts with optional filter by published status
export const useBlogPosts = (published?: boolean) => {
  return useQuery<BlogPost[]>({
    queryKey: ['blogPosts', { published }],
    queryFn: async () => {
      let query = supabase
        .from('blog_posts')
        .select('*, profiles(id, name, avatar_url)')
        .order('created_at', { ascending: false });
      
      if (published !== undefined) {
        query = query.eq('published', published);
      }
      
      const { data, error } = await query;

      console.log(data)
      
      if (error) throw new Error(error.message);
      return data.map(post => ({
        ...post,
        author: post.profiles,
      }));
    },
  });
};

// Fetch a single blog post by ID
export const useBlogPost = (id: string) => {
  return useQuery<BlogPost>({
    queryKey: ['blogPosts', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*, profiles(id, name, avatar_url)')
        .eq('id', id)
        .single();
      
      if (error) throw new Error(error.message);
      return {
        ...data,
        author: data.profiles,
      };
    },
    enabled: !!id,
  });
};

// Fetch a single blog post by slug
export const useBlogPostBySlug = (slug: string) => {
  return useQuery<BlogPost>({
    queryKey: ['blogPosts', { slug }],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*, profiles(id, name, avatar_url)')
        .eq('slug', slug)
        .single();
      
      if (error) throw new Error(error.message);
      return {
        ...data,
        author: data.profiles,
      };
    },
    enabled: !!slug,
  });
};

// Create a new blog post
export const useCreateBlogPost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newPost: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('blog_posts')
        .insert([newPost])
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
    },
  });
};

// Update an existing blog post
export const useUpdateBlogPost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<BlogPost> & { id: string }) => {
      const { data, error } = await supabase
        .from('blog_posts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
      queryClient.invalidateQueries({ queryKey: ['blogPosts', variables.id] });
    },
  });
};

// Delete a blog post
export const useDeleteBlogPost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);
      
      if (error) throw new Error(error.message);
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
    },
  });
};

// Get all authors (users with editor or admin role)
export const useGetAuthors = () => {
  return useQuery({
    queryKey: ['authors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .in('role', ['admin', 'editor'])
        .order('name');
      
      if (error) throw new Error(error.message);
      return data;
    },
  });
};

// Get blog post tags for filtering
export const useBlogTags = () => {
  return useQuery<string[]>({
    queryKey: ['blogTags'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('tags');
      
      if (error) throw new Error(error.message);
      
      // Extract unique tags
      const allTags = data.flatMap(post => post.tags || []);
      return [...new Set(allTags)];
    },
  });
};