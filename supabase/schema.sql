-- Create custom ENUM types
CREATE TYPE user_role AS ENUM ('user', 'moderator', 'admin', 'super_admin');
CREATE TYPE prayer_request_status AS ENUM ('pending', 'prayed');
CREATE TYPE testimony_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE blog_status AS ENUM ('draft', 'published');

-- 1. Users Table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  role user_role DEFAULT 'user'::user_role NOT NULL,
  avatar_url TEXT,
  country TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 2. Audios Table
CREATE TABLE public.audios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  scripture TEXT,
  duration TEXT NOT NULL,
  file_url TEXT NOT NULL,
  cover_url TEXT,
  day_of_week TEXT NOT NULL,
  featured BOOLEAN DEFAULT false NOT NULL,
  plays INTEGER DEFAULT 0 NOT NULL,
  downloads INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3. Videos Table (YouTube Links & Archives)
CREATE TABLE public.videos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  youtube_url TEXT NOT NULL,
  thumbnail_url TEXT,
  is_live BOOLEAN DEFAULT false NOT NULL,
  scheduled_at TIMESTAMPTZ,
  featured BOOLEAN DEFAULT false NOT NULL,
  archived BOOLEAN DEFAULT false NOT NULL,
  views INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 4. Prayer Requests Table
CREATE TABLE public.prayer_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  request TEXT NOT NULL,
  urgent BOOLEAN DEFAULT false NOT NULL,
  private BOOLEAN DEFAULT false NOT NULL,
  status prayer_request_status DEFAULT 'pending'::prayer_request_status NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 5. Testimonies Table
CREATE TABLE public.testimonies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT,
  tag TEXT NOT NULL,
  quote TEXT NOT NULL,
  image_url TEXT,
  status testimony_status DEFAULT 'pending'::testimony_status NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 6. Blog Posts Table
CREATE TABLE public.blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  author TEXT NOT NULL,
  cover_url TEXT,
  status blog_status DEFAULT 'draft'::blog_status NOT NULL,
  views INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Row Level Security (RLS) Setup
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prayer_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Helper Function for Admin Access
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Users Policies
CREATE POLICY "Users can read own data" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins can read all users" ON public.users FOR SELECT USING (public.is_admin());
CREATE POLICY "Users can update own data" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can update all users" ON public.users FOR UPDATE USING (public.is_admin());

-- Audios Policies
CREATE POLICY "Anyone can read audios" ON public.audios FOR SELECT USING (true);
CREATE POLICY "Admins can insert audios" ON public.audios FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update audios" ON public.audios FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete audios" ON public.audios FOR DELETE USING (public.is_admin());

-- Videos Policies
CREATE POLICY "Anyone can read videos" ON public.videos FOR SELECT USING (true);
CREATE POLICY "Admins can insert videos" ON public.videos FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update videos" ON public.videos FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete videos" ON public.videos FOR DELETE USING (public.is_admin());

-- Prayer Requests Policies
CREATE POLICY "Admins can read all prayer requests" ON public.prayer_requests FOR SELECT USING (public.is_admin());
CREATE POLICY "Anyone can insert prayer requests" ON public.prayer_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can update prayer requests" ON public.prayer_requests FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete prayer requests" ON public.prayer_requests FOR DELETE USING (public.is_admin());

-- Testimonies Policies
CREATE POLICY "Anyone can read approved testimonies" ON public.testimonies FOR SELECT USING (status = 'approved');
CREATE POLICY "Admins can read all testimonies" ON public.testimonies FOR SELECT USING (public.is_admin());
CREATE POLICY "Anyone can insert testimonies" ON public.testimonies FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can update testimonies" ON public.testimonies FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete testimonies" ON public.testimonies FOR DELETE USING (public.is_admin());

-- Blog Posts Policies
CREATE POLICY "Anyone can read published blog posts" ON public.blog_posts FOR SELECT USING (status = 'published');
CREATE POLICY "Admins can read all blog posts" ON public.blog_posts FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins can insert blog posts" ON public.blog_posts FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update blog posts" ON public.blog_posts FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete blog posts" ON public.blog_posts FOR DELETE USING (public.is_admin());

-- Create Storage Buckets (requires execution by superuser, mock structure)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('audio_files', 'audio_files', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('cover_arts', 'cover_arts', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('gallery_images', 'gallery_images', true);
