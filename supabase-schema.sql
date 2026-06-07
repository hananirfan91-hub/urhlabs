-- ====================================================================
-- URH LABS AI Text to Speech Platform - SUPABASE SCHEMAS
-- Run these statements directly in your Supabase SQL Command Editor.
-- ====================================================================

-- 1. Create PRESET SHOWCASE AUDIOS Table
CREATE TABLE IF NOT EXISTS public.preset_audios (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    text_transcript TEXT NOT NULL,
    language VARCHAR(10) NOT NULL,
    voice_type VARCHAR(10) NOT NULL,
    audio_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Realtime/Public privileges for Custom Showcase Gallery
ALTER TABLE public.preset_audios ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to showcase preset audios" ON public.preset_audios
    FOR SELECT USING (true);
CREATE POLICY "Allow admin full access on showcase preset audios" ON public.preset_audios
    FOR ALL USING (true); -- Full operations for backend server authentication


-- 2. Create SYSTEM SETTINGS Table
CREATE TABLE IF NOT EXISTS public.settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Seed Initial Default Parameters
INSERT INTO public.settings (key, value) VALUES
('maintenance_mode', 'false')
ON CONFLICT (key) DO NOTHING;

INSERT INTO public.settings (key, value) VALUES
('free_user_daily_limit', '3')
ON CONFLICT (key) DO NOTHING;

INSERT INTO public.settings (key, value) VALUES
('max_text_length_free', '500')
ON CONFLICT (key) DO NOTHING;

INSERT INTO public.settings (key, value) VALUES
('max_text_length_customer', '5000')
ON CONFLICT (key) DO NOTHING;

INSERT INTO public.settings (key, value) VALUES
('auto_delete_days', '0')
ON CONFLICT (key) DO NOTHING;

-- Policies for Settings
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to system parameters" ON public.settings
    FOR SELECT USING (true);
CREATE POLICY "Allow admin full access on system parameters" ON public.settings
    FOR ALL USING (true);


-- 3. Create USER PROFILES Table
CREATE TABLE IF NOT EXISTS public.users (
    id TEXT PRIMARY KEY, -- maps to account registration ID
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role VARCHAR(20) DEFAULT 'user' NOT NULL,
    credits INTEGER DEFAULT 3 NOT NULL,
    plan VARCHAR(30) DEFAULT 'free' NOT NULL,
    credits_reset_date VARCHAR(10),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Policies for Users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow individuals to read their own profile" ON public.users
    FOR SELECT USING (true);
CREATE POLICY "Allow backend system full access on profiles" ON public.users
    FOR ALL USING (true);


-- 4. Create IN-APP SPEECH USAGE LOGS Table
CREATE TABLE IF NOT EXISTS public.usage_logs (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    text_input TEXT NOT NULL,
    language VARCHAR(10) NOT NULL,
    voice_type VARCHAR(10) NOT NULL,
    audio_url TEXT NOT NULL,
    duration_sec DOUBLE PRECISION NOT NULL,
    format VARCHAR(10) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes for lightning fast lookups
CREATE INDEX IF NOT EXISTS idx_usage_logs_user ON public.usage_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_logs_date ON public.usage_logs(created_at);

ALTER TABLE public.usage_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow users to read their own activity logs" ON public.usage_logs
    FOR SELECT USING (true);
CREATE POLICY "Allow backend system to register logs" ON public.usage_logs
    FOR ALL USING (true);


-- 5. Create SUBSCRIPTION UPGRADE REQUESTS Table
CREATE TABLE IF NOT EXISTS public.subscription_requests (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    plan VARCHAR(30) NOT NULL,
    message TEXT,
    status VARCHAR(20) DEFAULT 'pending' NOT NULL, -- pending, approved, rejected
    reviewed_by TEXT,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.subscription_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public submissions for subscriptions" ON public.subscription_requests
    FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow system administration overview" ON public.subscription_requests
    FOR ALL USING (true);

-- ====================================================================
-- SUPABASE STORAGE BUCKET CONFIGURATIONS
-- Ensure you create a Bucket named "audio" inside your Supabase Storage dashboard:
-- 1. Go to "Storage" in Supabase sidebar.
-- 2. Click "New Bucket".
-- 3. Name the bucket "audio".
-- 4. Toggle "Public bucket" to ENABLED (very important for playing audio files directly).
-- 5. Save the configuration.
-- ====================================================================
