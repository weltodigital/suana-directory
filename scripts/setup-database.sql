-- Create facilities table
CREATE TABLE IF NOT EXISTS public.facilities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    facility_type TEXT NOT NULL CHECK (facility_type IN ('sauna', 'cold_plunge', 'ice_bath', 'wellness_centre', 'spa_hotel', 'thermal_bath')),
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    county TEXT NOT NULL,
    postcode TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    website TEXT,
    latitude DECIMAL(10, 7),
    longitude DECIMAL(10, 7),
    opening_hours JSONB,
    amenities TEXT[],
    images TEXT[],
    rating DECIMAL(3, 2) CHECK (rating >= 0 AND rating <= 5),
    review_count INTEGER DEFAULT 0,
    price_range TEXT,
    verified BOOLEAN DEFAULT FALSE,
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    facility_id UUID NOT NULL REFERENCES public.facilities(id) ON DELETE CASCADE,
    user_name TEXT NOT NULL,
    user_email TEXT,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title TEXT,
    comment TEXT NOT NULL,
    verified_visit BOOLEAN DEFAULT FALSE,
    helpful_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create locations table
CREATE TABLE IF NOT EXISTS public.locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    type TEXT NOT NULL CHECK (type IN ('city', 'county', 'region')),
    parent_id UUID REFERENCES public.locations(id),
    latitude DECIMAL(10, 7),
    longitude DECIMAL(10, 7),
    facility_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_facilities_city ON public.facilities(city);
CREATE INDEX IF NOT EXISTS idx_facilities_county ON public.facilities(county);
CREATE INDEX IF NOT EXISTS idx_facilities_facility_type ON public.facilities(facility_type);
CREATE INDEX IF NOT EXISTS idx_facilities_rating ON public.facilities(rating);
CREATE INDEX IF NOT EXISTS idx_facilities_featured ON public.facilities(featured);
CREATE INDEX IF NOT EXISTS idx_facilities_verified ON public.facilities(verified);
CREATE INDEX IF NOT EXISTS idx_facilities_location ON public.facilities(latitude, longitude);

CREATE INDEX IF NOT EXISTS idx_reviews_facility_id ON public.reviews(facility_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON public.reviews(rating);

CREATE INDEX IF NOT EXISTS idx_locations_slug ON public.locations(slug);
CREATE INDEX IF NOT EXISTS idx_locations_type ON public.locations(type);
CREATE INDEX IF NOT EXISTS idx_locations_parent_id ON public.locations(parent_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Enable read access for all users" ON public.facilities
    FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON public.reviews
    FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON public.locations
    FOR SELECT USING (true);

-- Create policies for authenticated write access (you can modify these as needed)
CREATE POLICY "Enable insert for authenticated users only" ON public.facilities
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users only" ON public.facilities
    FOR UPDATE USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON public.reviews
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users only" ON public.reviews
    FOR UPDATE USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON public.locations
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users only" ON public.locations
    FOR UPDATE USING (true);

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_facilities_updated_at BEFORE UPDATE ON public.facilities
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON public.reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_locations_updated_at BEFORE UPDATE ON public.locations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();