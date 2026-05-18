import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "placeholder-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      users: {
        Row: { id: string; email: string; name: string; role: string; avatar_url: string | null; created_at: string };
        Insert: { email: string; name: string; role?: string; avatar_url?: string };
        Update: { name?: string; role?: string; avatar_url?: string };
      };
      audios: {
        Row: { id: string; title: string; description: string | null; category: string; scripture: string | null; duration: string; file_url: string; cover_url: string | null; day_of_week: string; featured: boolean; plays: number; downloads: number; created_at: string };
        Insert: { title: string; category: string; duration: string; file_url: string; day_of_week: string; description?: string; scripture?: string; cover_url?: string; featured?: boolean };
        Update: { title?: string; category?: string; featured?: boolean; plays?: number; downloads?: number };
      };
      videos: {
        Row: { id: string; title: string; youtube_url: string; thumbnail_url: string | null; is_live: boolean; scheduled_at: string | null; featured: boolean; archived: boolean; views: number; created_at: string };
        Insert: { title: string; youtube_url: string; is_live?: boolean; scheduled_at?: string; featured?: boolean; archived?: boolean };
        Update: { title?: string; is_live?: boolean; featured?: boolean; archived?: boolean; views?: number };
      };
      prayer_requests: {
        Row: { id: string; name: string; email: string | null; request: string; urgent: boolean; private: boolean; status: string; created_at: string };
        Insert: { name: string; request: string; email?: string; urgent?: boolean; private?: boolean };
        Update: { status?: string };
      };
      testimonies: {
        Row: { id: string; name: string; location: string | null; tag: string; quote: string; image_url: string | null; status: string; created_at: string };
        Insert: { name: string; quote: string; tag: string; location?: string; image_url?: string };
        Update: { status?: string };
      };
      blog_posts: {
        Row: { id: string; title: string; excerpt: string; content: string; category: string; author: string; cover_url: string | null; status: string; views: number; created_at: string };
        Insert: { title: string; excerpt: string; content: string; category: string; author: string; status?: string };
        Update: { title?: string; status?: string; views?: number };
      };
    };
  };
};
