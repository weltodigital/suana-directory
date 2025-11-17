-- Create waitlist table for community email signups
CREATE TABLE IF NOT EXISTS public.waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  source VARCHAR(50) DEFAULT 'community_page',
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON public.waitlist(email);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON public.waitlist(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Create policy to allow inserting new emails (public can signup)
CREATE POLICY "Anyone can insert waitlist emails" ON public.waitlist
    FOR INSERT WITH CHECK (true);

-- Create policy to allow reading for authenticated users only (admin access)
CREATE POLICY "Authenticated users can view waitlist" ON public.waitlist
    FOR SELECT USING (auth.role() = 'authenticated');

-- Grant permissions
GRANT INSERT ON public.waitlist TO anon;
GRANT SELECT ON public.waitlist TO authenticated;

-- Add helpful comment
COMMENT ON TABLE public.waitlist IS 'Stores email signups for the Sauna & Cold community waitlist';