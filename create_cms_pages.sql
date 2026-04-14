-- Run this SQL in your Supabase SQL Editor to create the missing cms_pages table

CREATE TABLE IF NOT EXISTS public.cms_pages (
    page_key text NOT NULL,
    section_key text NOT NULL,
    content jsonb NOT NULL DEFAULT '{}'::jsonb,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    PRIMARY KEY (page_key, section_key)
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.cms_pages ENABLE ROW LEVEL SECURITY;

-- Allow public read access (if needed for the frontend, though currently it seems to use the service key in actions)
CREATE POLICY "Enable read access for all users" 
ON public.cms_pages 
FOR SELECT 
USING (true);

-- The service_role key bypasses RLS, so it will be able to insert/update.
