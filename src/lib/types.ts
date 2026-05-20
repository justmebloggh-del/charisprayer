export type UserRole = 'user' | 'moderator' | 'admin' | 'super_admin'
export type PrayerStatus = 'pending' | 'prayed'
export type TestimonyStatus = 'pending' | 'approved' | 'rejected'
export type BlogStatus = 'draft' | 'published'

export interface UserProfile {
  id: string
  email: string
  name: string
  role: UserRole
  avatar_url?: string
  country?: string
  created_at: string
  updated_at: string
}

export interface Audio {
  id: string
  title: string
  description?: string
  category: string
  scripture?: string
  duration: string
  file_url: string
  cover_url?: string
  day_of_week: string
  featured: boolean
  plays: number
  downloads: number
  created_at: string
  updated_at: string
}

export interface Video {
  id: string
  title: string
  youtube_url: string
  thumbnail_url?: string
  is_live: boolean
  scheduled_at?: string
  featured: boolean
  archived: boolean
  views: number
  created_at: string
  updated_at: string
}

export interface PrayerRequest {
  id: string
  name: string
  email?: string
  request: string
  urgent: boolean
  is_private: boolean
  status: PrayerStatus
  created_at: string
  updated_at: string
}

export interface Testimony {
  id: string
  name: string
  location?: string
  tag: string
  quote: string
  image_url?: string
  status: TestimonyStatus
  created_at: string
  updated_at: string
}

export interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  category: string
  author: string
  cover_url?: string
  status: BlogStatus
  views: number
  created_at: string
  updated_at: string
}

export interface Devotion {
  id: string
  title: string
  scripture_reference?: string
  scripture_text?: string
  message: string
  excerpt?: string
  featured_image_url?: string
  author: string
  published: boolean
  featured: boolean
  scheduled_at?: string
  views: number
  created_at: string
  updated_at: string
}

export interface LivestreamSettings {
  id: number
  youtube_url?: string
  replay_url?: string
  is_live: boolean
  title?: string
  description?: string
  thumbnail_url?: string
  channel_id?: string
  updated_at: string
}
