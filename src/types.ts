export type UserRole = 'visitor' | 'user' | 'customer' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  credits: number;
  plan: string;
  credits_reset_date?: string;
  created_at?: string;
  updated_at?: string;
}

export interface UsageLog {
  id: string;
  user_id: string;
  user_email?: string; // helpful for admin logs view
  text_input: string;
  language: 'ur' | 'en';
  voice_type: 'male' | 'female';
  audio_url: string;
  duration_sec: number;
  format: 'mp3' | 'mp4';
  created_at: string;
}

export interface SubscriptionRequest {
  id: string;
  name: string;
  email: string;
  phone?: string;
  plan: string;
  message?: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewed_by?: string;
  reviewed_at?: string;
  created_at: string;
}

export interface SystemSettings {
  maintenance_mode: boolean;
  free_user_daily_limit: number;
  max_text_length_free: number;
  max_text_length_customer: number;
  auto_delete_days: number;
}

export interface PresetAudio {
  id: string;
  title: string;
  text_transcript: string;
  language: 'ur' | 'en';
  voice_type: 'male' | 'female';
  audio_url: string;
  created_at: string;
}

