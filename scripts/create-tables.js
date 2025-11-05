require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTables() {
  console.log('Creating database tables...');

  // Create facilities table
  const facilitiesSQL = `
    CREATE TABLE IF NOT EXISTS facilities (
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
  `;

  // Create reviews table
  const reviewsSQL = `
    CREATE TABLE IF NOT EXISTS reviews (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      facility_id UUID NOT NULL,
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
  `;

  // Create locations table
  const locationsSQL = `
    CREATE TABLE IF NOT EXISTS locations (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      type TEXT NOT NULL CHECK (type IN ('city', 'county', 'region')),
      parent_id UUID,
      latitude DECIMAL(10, 7),
      longitude DECIMAL(10, 7),
      facility_count INTEGER DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `;

  try {
    console.log('Creating facilities table...');
    let { error } = await supabase.rpc('exec_sql', { sql_query: facilitiesSQL });
    if (error) {
      console.error('Error creating facilities table:', error);
    } else {
      console.log('Facilities table created successfully');
    }

    console.log('Creating reviews table...');
    ({ error } = await supabase.rpc('exec_sql', { sql_query: reviewsSQL }));
    if (error) {
      console.error('Error creating reviews table:', error);
    } else {
      console.log('Reviews table created successfully');
    }

    console.log('Creating locations table...');
    ({ error } = await supabase.rpc('exec_sql', { sql_query: locationsSQL }));
    if (error) {
      console.error('Error creating locations table:', error);
    } else {
      console.log('Locations table created successfully');
    }

    // Create indexes
    const indexSQL = `
      CREATE INDEX IF NOT EXISTS idx_facilities_city ON facilities(city);
      CREATE INDEX IF NOT EXISTS idx_facilities_county ON facilities(county);
      CREATE INDEX IF NOT EXISTS idx_facilities_facility_type ON facilities(facility_type);
      CREATE INDEX IF NOT EXISTS idx_reviews_facility_id ON reviews(facility_id);
      CREATE INDEX IF NOT EXISTS idx_locations_slug ON locations(slug);
    `;

    console.log('Creating indexes...');
    ({ error } = await supabase.rpc('exec_sql', { sql_query: indexSQL }));
    if (error) {
      console.error('Error creating indexes:', error);
    } else {
      console.log('Indexes created successfully');
    }

    console.log('Database setup completed!');

  } catch (error) {
    console.error('Failed to create tables:', error);

    // Alternative: try using direct table creation via Supabase admin
    console.log('Trying alternative approach...');

    try {
      // Test if we can insert a sample record to see if tables exist
      const { data, error: testError } = await supabase
        .from('facilities')
        .select('*')
        .limit(1);

      if (testError) {
        console.error('Tables do not exist:', testError);
        console.log('Please create the tables manually in the Supabase dashboard');
      } else {
        console.log('Tables already exist!');
      }
    } catch (testException) {
      console.error('Test query failed:', testException);
    }
  }
}

// Run the setup
if (require.main === module) {
  createTables()
    .then(() => {
      console.log('Table creation completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Table creation failed:', error);
      process.exit(1);
    });
}

module.exports = { createTables };