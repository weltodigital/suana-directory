require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyImport() {
  console.log('Verifying data import...');

  try {
    // Get total count
    const { count, error: countError } = await supabase
      .from('facilities')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('Error getting count:', countError);
      return;
    }

    console.log(`Total facilities in database: ${count}`);

    // Get facility type breakdown
    const { data: typeBreakdown, error: typeError } = await supabase
      .from('facilities')
      .select('facility_type')
      .then(({ data, error }) => {
        if (error) return { error };
        const breakdown = {};
        data.forEach(row => {
          breakdown[row.facility_type] = (breakdown[row.facility_type] || 0) + 1;
        });
        return { data: breakdown, error: null };
      });

    if (typeError) {
      console.error('Error getting type breakdown:', typeError);
    } else {
      console.log('\nFacility type breakdown:');
      Object.entries(typeBreakdown).forEach(([type, count]) => {
        console.log(`  ${type}: ${count}`);
      });
    }

    // Get city breakdown (top 10)
    const { data: cities, error: cityError } = await supabase
      .from('facilities')
      .select('city')
      .then(({ data, error }) => {
        if (error) return { error };
        const cityCount = {};
        data.forEach(row => {
          cityCount[row.city] = (cityCount[row.city] || 0) + 1;
        });
        const sorted = Object.entries(cityCount)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 10);
        return { data: sorted, error: null };
      });

    if (cityError) {
      console.error('Error getting city breakdown:', cityError);
    } else {
      console.log('\nTop 10 cities by facility count:');
      cities.forEach(([city, count]) => {
        console.log(`  ${city}: ${count}`);
      });
    }

    // Get sample records
    const { data: samples, error: sampleError } = await supabase
      .from('facilities')
      .select('name, city, county, facility_type, rating, website')
      .limit(5);

    if (sampleError) {
      console.error('Error getting samples:', sampleError);
    } else {
      console.log('\nSample records:');
      samples.forEach((facility, index) => {
        console.log(`  ${index + 1}. ${facility.name} (${facility.facility_type}) - ${facility.city}, ${facility.county}`);
        console.log(`     Rating: ${facility.rating || 'N/A'}, Website: ${facility.website || 'N/A'}`);
      });
    }

  } catch (error) {
    console.error('Verification failed:', error);
  }
}

if (require.main === module) {
  verifyImport()
    .then(() => {
      console.log('\nVerification completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Verification failed:', error);
      process.exit(1);
    });
}