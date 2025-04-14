// src/shared/types/supabase.ts
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string | null
          avatar_url: string | null
          role: Role
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          name?: string | null
          avatar_url?: string | null
          role?: Role
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string | null
          avatar_url?: string | null
          role?: Role
        }
      }
      services: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          description: string
          icon: string
          featured: boolean
          order: number
          translations: Json
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          title: string
          description: string
          icon: string
          featured?: boolean
          order?: number
          translations?: Json
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          title?: string
          description?: string
          icon?: string
          featured?: boolean
          order?: number
          translations?: Json
        }
      }
      team_members: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          title: string
          bio: string
          image_url: string
          social_links: Json
          order: number
          translations: Json
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name: string
          title: string
          bio: string
          image_url: string
          social_links?: Json
          order?: number
          translations?: Json
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string
          title?: string
          bio?: string
          image_url?: string
          social_links?: Json
          order?: number
          translations?: Json
        }
      }
      projects: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          description: string
          image_url: string
          client: string
          year: number
          tags: string[]
          translations: Json
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          title: string
          description: string
          image_url: string
          client: string
          year: number
          tags?: string[]
          translations?: Json
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          title?: string
          description?: string
          image_url?: string
          client?: string
          year?: number
          tags?: string[]
          translations?: Json
        }
      }
      reviews: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          position: string
          company: string
          content: string
          rating: number
          approved: boolean
          translations: Json
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name: string
          position: string
          company: string
          content: string
          rating: number
          approved?: boolean
          translations?: Json
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string
          position?: string
          company?: string
          content?: string
          rating?: number
          approved?: boolean
          translations?: Json
        }
      }
      blog_posts: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          slug: string
          content: string
          excerpt: string
          author_id: string
          featured_image: string
          published: boolean
          published_at: string | null
          tags: string[]
          translations: Json
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          title: string
          slug: string
          content: string
          excerpt: string
          author_id: string
          featured_image: string
          published?: boolean
          published_at?: string | null
          tags?: string[]
          translations?: Json
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          title?: string
          slug?: string
          content?: string
          excerpt?: string
          author_id?: string
          featured_image?: string
          published?: boolean
          published_at?: string | null
          tags?: string[]
          translations?: Json
        }
      }
      contact_messages: {
        Row: {
          id: string
          created_at: string
          name: string
          email: string
          phone: string
          message: string
          read: boolean
          archived: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          email: string
          phone: string
          message: string
          read?: boolean
          archived?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          email?: string
          phone?: string
          message?: string
          read?: boolean
          archived?: boolean
        }
      }
      company_history: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          year: number
          title: string
          description: string
          image_url: string | null
          translations: Json
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          year: number
          title: string
          description: string
          image_url?: string | null
          translations?: Json
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          year?: number
          title?: string
          description?: string
          image_url?: string | null
          translations?: Json
        }
      }
      tasks: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          description: string
          status: TaskStatus
          priority: TaskPriority
          due_date: string | null
          assigned_to: string | null
          created_by: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          title: string
          description: string
          status?: TaskStatus
          priority?: TaskPriority
          due_date?: string | null
          assigned_to?: string | null
          created_by: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          title?: string
          description?: string
          status?: TaskStatus
          priority?: TaskPriority
          due_date?: string | null
          assigned_to?: string | null
          created_by?: string
        }
      }
      site_statistics: {
        Row: {
          id: string
          date: string
          page_views: number
          unique_visitors: number
          bounce_rate: number
          avg_session_duration: number
          top_pages: Json
          referrers: Json
        }
        Insert: {
          id?: string
          date: string
          page_views: number
          unique_visitors: number
          bounce_rate: number
          avg_session_duration: number
          top_pages?: Json
          referrers?: Json
        }
        Update: {
          id?: string
          date?: string
          page_views?: number
          unique_visitors?: number
          bounce_rate?: number
          avg_session_duration?: number
          top_pages?: Json
          referrers?: Json
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      Role: 'admin' | 'editor' | 'viewer'
      TaskStatus: 'todo' | 'in_progress' | 'review' | 'completed'
      TaskPriority: 'low' | 'medium' | 'high' | 'urgent'
    }
  }
}

// src/shared/types/index.ts
export type Role = Database['public']['Enums']['Role']
export type TaskStatus = Database['public']['Enums']['TaskStatus']
export type TaskPriority = Database['public']['Enums']['TaskPriority']

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Service = Database['public']['Tables']['services']['Row']
export type TeamMember = Database['public']['Tables']['team_members']['Row']
export type Project = Database['public']['Tables']['projects']['Row']
export type Review = Database['public']['Tables']['reviews']['Row']
export type BlogPost = Database['public']['Tables']['blog_posts']['Row']
export type ContactMessage = Database['public']['Tables']['contact_messages']['Row']
export type CompanyHistory = Database['public']['Tables']['company_history']['Row']
export type Task = Database['public']['Tables']['tasks']['Row']
export type SiteStatistic = Database['public']['Tables']['site_statistics']['Row']

export interface Translation {
  en: {
    [key: string]: string;
  };
  ar: {
    [key: string]: string;
  };
}

export interface ApiResponse<T> {
  data?: T;
  error?: {
    message: string;
    status?: number;
  };
}

// Language type for internationalization
export type Language = 'en' | 'ar';

// Theme type for dark/light mode
export type Theme = 'light' | 'dark';