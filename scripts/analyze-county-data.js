require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function analyzeCountyData() {
  console.log('Analyzing county and city distribution...');

  try {
    // Get all saunas with county and city data
    const { data: saunas, error } = await supabase
      .from('facilities')
      .select('county, city')
      .eq('facility_type', 'sauna');

    if (error) {
      console.error('Error fetching data:', error);
      return;
    }

    // Group by county and city
    const countyData = {};

    saunas.forEach(sauna => {
      const county = sauna.county;
      const city = sauna.city;

      if (!countyData[county]) {
        countyData[county] = {
          totalSaunas: 0,
          cities: {}
        };
      }

      if (!countyData[county].cities[city]) {
        countyData[county].cities[city] = 0;
      }

      countyData[county].totalSaunas++;
      countyData[county].cities[city]++;
    });

    // Sort counties by sauna count
    const sortedCounties = Object.entries(countyData)
      .sort(([,a], [,b]) => b.totalSaunas - a.totalSaunas);

    console.log('\nCounty Distribution (Top 20):');
    console.log('==============================');

    sortedCounties.slice(0, 20).forEach(([county, data]) => {
      console.log(`${county}: ${data.totalSaunas} saunas across ${Object.keys(data.cities).length} cities`);

      // Show top cities in this county
      const topCities = Object.entries(data.cities)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5);

      topCities.forEach(([city, count]) => {
        console.log(`  - ${city}: ${count} saunas`);
      });
      console.log('');
    });

    // Generate slug mappings
    console.log('\nSample URL Structure:');
    console.log('====================');

    sortedCounties.slice(0, 10).forEach(([county, data]) => {
      const countySlug = county.toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-');

      console.log(`/saunas/${countySlug} (${data.totalSaunas} saunas)`);

      const topCities = Object.entries(data.cities)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3);

      topCities.forEach(([city, count]) => {
        const citySlug = city.toLowerCase()
          .replace(/[^a-z0-9\s]/g, '')
          .replace(/\s+/g, '-');
        console.log(`  /saunas/${countySlug}/${citySlug} (${count} saunas)`);
      });
      console.log('');
    });

    return { countyData, sortedCounties };

  } catch (error) {
    console.error('Analysis failed:', error);
  }
}

if (require.main === module) {
  analyzeCountyData()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('Analysis failed:', error);
      process.exit(1);
    });
}

module.exports = { analyzeCountyData };