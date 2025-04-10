// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_KEY;
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// تعريفات نوع البيانات للجداول
export type ContentItem = {
  id: number;
  section: string;
  key: string;
  title_ar: string;
  title_en: string;
  content_ar: string;
  content_en: string;
  created_at: string;
  updated_at: string;
};

export type Project = {
  id: number;
  title_ar: string;
  title_en: string;
  description_ar: string;
  description_en: string;
  image_url: string;
  tech_stack: string[];
  url?: string;
  order: number;
  created_at: string;
};

export type Service = {
  id: number;
  title_ar: string;
  title_en: string;
  description_ar: string;
  description_en: string;
  icon: string;
  order: number;
  created_at: string;
};

export type Testimonial = {
  id: number;
  name: string;
  company: string;
  position: string;
  content_ar: string;
  content_en: string;
  rating: number;
  image_url?: string;
  is_approved: boolean;
  created_at: string;
  email: string;
};

export type ContactMessage = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

export type SiteStats = {
  id: number;
  page: string;
  visits: number;
  unique_visitors: number;
  last_updated: string;
};

// **************** Content API ****************

// جلب محتوى محدد
export const getContent = async (section: string, key: string) => {
  const { data, error } = await supabase
    .from('content')
    .select('*')
    .eq('section', section)
    .eq('key', key)
    .single();
  
  if (error) {
    console.error('Error fetching content:', error);
    return null;
  }
  
  return data as ContentItem;
};

// جلب محتوى قسم كامل
export const getSectionContent = async (section: string) => {
  const { data, error } = await supabase
    .from('content')
    .select('*')
    .eq('section', section)
    .order('order', { ascending: true });
  
  if (error) {
    console.error('Error fetching section content:', error);
    return [];
  }
  
  return data as ContentItem[];
};

// تحديث محتوى
export const updateContent = async (id: number, updates: Partial<ContentItem>) => {
  const { data, error } = await supabase
    .from('content')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating content:', error);
    return null;
  }
  
  return data as ContentItem;
};

// **************** Projects API ****************

// جلب جميع المشاريع
export const getAllProjects = async () => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('order', { ascending: true });
  
  if (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
  
  return data as Project[];
};

// إضافة مشروع جديد
export const addProject = async (project: Omit<Project, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('projects')
    .insert([{
      ...project,
      created_at: new Date().toISOString(),
    }])
    .select()
    .single();
  
  if (error) {
    console.error('Error adding project:', error);
    return null;
  }
  
  return data as Project;
};

// تحديث مشروع
export const updateProject = async (id: number, updates: Partial<Project>) => {
  const { data, error } = await supabase
    .from('projects')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating project:', error);
    return null;
  }
  
  return data as Project;
};

// حذف مشروع
export const deleteProject = async (id: number) => {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting project:', error);
    return false;
  }
  
  return true;
};

// **************** Services API ****************

// جلب جميع الخدمات
export const getAllServices = async () => {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('order', { ascending: true });
  
  if (error) {
    console.error('Error fetching services:', error);
    return [];
  }
  
  return data as Service[];
};

// إضافة خدمة جديدة
export const addService = async (service: Omit<Service, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('services')
    .insert([{
      ...service,
      created_at: new Date().toISOString(),
    }])
    .select()
    .single();
  
  if (error) {
    console.error('Error adding service:', error);
    return null;
  }
  
  return data as Service;
};

// تحديث خدمة
export const updateService = async (id: number, updates: Partial<Service>) => {
  const { data, error } = await supabase
    .from('services')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating service:', error);
    return null;
  }
  
  return data as Service;
};

// حذف خدمة
export const deleteService = async (id: number) => {
  const { error } = await supabase
    .from('services')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting service:', error);
    return false;
  }
  
  return true;
};

// **************** Testimonials API ****************

// جلب الآراء المعتمدة
export const getApprovedTestimonials = async () => {
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .eq('is_approved', true)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching testimonials:', error);
    return [];
  }
  
  return data as Testimonial[];
};

// جلب جميع الآراء (للوحة التحكم)
export const getAllTestimonials = async () => {
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching all testimonials:', error);
    return [];
  }
  
  return data as Testimonial[];
};

// إضافة رأي جديد
export const addTestimonial = async (testimonial: Omit<Testimonial, 'id' | 'created_at' | 'is_approved'>) => {
  const { data, error } = await supabase
    .from('testimonials')
    .insert([{
      ...testimonial,
      is_approved: false,
      created_at: new Date().toISOString(),
    }])
    .select()
    .single();
  
  if (error) {
    console.error('Error adding testimonial:', error);
    return null;
  }
  
  return data as Testimonial;
};

// الموافقة على رأي
export const approveTestimonial = async (id: number) => {
  const { data, error } = await supabase
    .from('testimonials')
    .update({ is_approved: true })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error approving testimonial:', error);
    return null;
  }
  
  return data as Testimonial;
};

// رفض رأي
export const rejectTestimonial = async (id: number) => {
  const { error } = await supabase
    .from('testimonials')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error rejecting testimonial:', error);
    return false;
  }
  
  return true;
};

// **************** Contact Messages API ****************

// إرسال رسالة اتصال
export const sendContactMessage = async (message: Omit<ContactMessage, 'id' | 'created_at' | 'is_read'>) => {
  const { data, error } = await supabase
    .from('contact_messages')
    .insert([{
      ...message,
      is_read: false,
      created_at: new Date().toISOString(),
    }])
    .select()
    .single();
  
  if (error) {
    console.error('Error sending message:', error);
    return null;
  }
  
  return data as ContactMessage;
};

// جلب جميع رسائل الاتصال
export const getAllContactMessages = async () => {
  const { data, error } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching contact messages:', error);
    return [];
  }
  
  return data as ContactMessage[];
};

// تحديث حالة القراءة
export const markMessageAsRead = async (id: number) => {
  const { data, error } = await supabase
    .from('contact_messages')
    .update({ is_read: true })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error marking message as read:', error);
    return null;
  }
  
  return data as ContactMessage;
};

// حذف رسالة
export const deleteContactMessage = async (id: number) => {
  const { error } = await supabase
    .from('contact_messages')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting message:', error);
    return false;
  }
  
  return true;
};

// **************** Stats API ****************

// تحديث إحصائيات الصفحة
export const updatePageStats = async (page: string) => {
  const { data: existingStat } = await supabase
    .from('site_stats')
    .select('*')
    .eq('page', page)
    .single();
  
  if (existingStat) {
    const { error } = await supabase
      .from('site_stats')
      .update({ 
        visits: existingStat.visits + 1,
        last_updated: new Date().toISOString()
      })
      .eq('id', existingStat.id);
    
    if (error) {
      console.error('Error updating page stats:', error);
    }
  } else {
    const { error } = await supabase
      .from('site_stats')
      .insert([{
        page,
        visits: 1,
        unique_visitors: 1,
        last_updated: new Date().toISOString()
      }]);
    
    if (error) {
      console.error('Error creating page stats:', error);
    }
  }
};

// جلب إحصائيات الموقع
export const getSiteStats = async () => {
  const { data, error } = await supabase
    .from('site_stats')
    .select('*');
  
  if (error) {
    console.error('Error fetching site stats:', error);
    return [];
  }
  
  return data as SiteStats[];
};

// التحقق من المصادقة
export const checkAuth = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
};

// تسجيل الدخول
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) {
    console.error('Error signing in:', error);
    return null;
  }
  
  return data.session;
};

// تسجيل الخروج
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    console.error('Error signing out:', error);
    return false;
  }
  
  return true;
};