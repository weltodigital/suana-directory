require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const csv = require('csv-parser');
const { createClient } = require('@supabase/supabase-js');

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Function to determine facility type based on category and title
function getFacilityType(categoryName, title) {
  const category = categoryName?.toLowerCase() || '';
  const name = title?.toLowerCase() || '';

  if (category.includes('cold') || name.includes('cold') || name.includes('plunge')) {
    return 'cold_plunge';
  }
  if (category.includes('ice') || name.includes('ice')) {
    return 'ice_bath';
  }
  if (category.includes('spa') || name.includes('spa')) {
    return 'spa_hotel';
  }
  if (category.includes('wellness') || name.includes('wellness')) {
    return 'wellness_centre';
  }
  if (category.includes('thermal') || name.includes('thermal')) {
    return 'thermal_bath';
  }
  return 'sauna'; // Default
}

// Function to clean and validate phone numbers
function cleanPhone(phone) {
  if (!phone || phone === '#ERROR!' || phone.trim() === '') return null;
  return phone.trim();
}

// Function to clean and validate websites
function cleanWebsite(website) {
  if (!website || website.trim() === '') return null;
  const url = website.trim();
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `https://${url}`;
  }
  return url;
}

// Function to extract county from city or use a mapping
function getCounty(city, state) {
  if (state && state.trim() !== '') return state.trim();

  // Basic county mapping for UK cities - this could be expanded
  const cityToCounty = {
    'London': 'Greater London',
    'Birmingham': 'West Midlands',
    'Manchester': 'Greater Manchester',
    'Liverpool': 'Merseyside',
    'Leeds': 'West Yorkshire',
    'Sheffield': 'South Yorkshire',
    'Bristol': 'Bristol',
    'Brighton': 'East Sussex',
    'Edinburgh': 'Edinburgh',
    'Glasgow': 'Glasgow',
    'Cardiff': 'Cardiff',
    'Swansea': 'Swansea',
    'Newcastle': 'Tyne and Wear',
    'Plymouth': 'Devon',
    'Norwich': 'Norfolk',
    'Chester': 'Cheshire',
    'Cheltenham': 'Gloucestershire',
    'Aberdeen': 'Aberdeenshire',
    'Thurso': 'Highland',
    'Portree': 'Highland',
    'Eastbourne': 'East Sussex',
    'Worthing': 'West Sussex',
    'Lowestoft': 'Suffolk',
    'Barmouth': 'Gwynedd',
    'Coniston': 'Cumbria',
    'Whitley Bay': 'Tyne and Wear',
    'South Shields': 'Tyne and Wear',
    'Helensburgh': 'Argyll and Bute',
    'Pwllheli': 'Gwynedd',
    'Barry': 'Vale of Glamorgan',
    'Henley-on-Thames': 'Oxfordshire',
    'Beaconsfield': 'Buckinghamshire',
    'Dulverton': 'Somerset',
    'Corwen': 'Denbighshire',
    'Ilkeston': 'Derbyshire',
    'Teignmouth': 'Devon',
    'Paignton': 'Devon',
    'Looe': 'Cornwall',
    'Seaton': 'Devon',
    'Saint Ives': 'Cornwall',
    'Helston': 'Cornwall',
    'Yelverton': 'Devon',
    'Christchurch': 'Dorset',
    'Aberystwyth': 'Ceredigion',
    'Largs': 'North Ayrshire',
    'Greenock': 'Inverclyde',
    'Cromarty': 'Highland',
    'Elgin': 'Moray',
    'Alford': 'Aberdeenshire',
    'Clevedon': 'Somerset'
  };

  return cityToCounty[city] || city || 'Unknown';
}

// Function to create a basic postcode placeholder
function generatePostcode(city) {
  if (!city) return 'XX1 1XX';

  // Basic postcode mapping for major UK cities
  const cityToPostcode = {
    'London': 'SW1A 1AA',
    'Birmingham': 'B1 1AA',
    'Manchester': 'M1 1AA',
    'Liverpool': 'L1 1AA',
    'Leeds': 'LS1 1AA',
    'Sheffield': 'S1 1AA',
    'Bristol': 'BS1 1AA',
    'Brighton': 'BN1 1AA',
    'Edinburgh': 'EH1 1AA',
    'Glasgow': 'G1 1AA',
    'Cardiff': 'CF1 1AA',
    'Newcastle': 'NE1 1AA',
    'Plymouth': 'PL1 1AA',
    'Norwich': 'NR1 1AA'
  };

  return cityToPostcode[city] || 'XX1 1XX';
}

async function importSaunaData() {
  console.log('Starting sauna data import...');

  const results = [];
  const errors = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream('/Users/edwelton/Documents/Welto Digital/sauna-directory/Sauna and Cold - Sheet1.csv')
      .pipe(csv())
      .on('data', (row) => {
        try {
          // Skip rows with missing essential data
          if (!row.title || !row.city) {
            errors.push(`Skipping row with missing title or city: ${JSON.stringify(row)}`);
            return;
          }

          const facilityData = {
            name: row.title.trim(),
            description: `${row.title.trim()} - A ${row.categoryName || 'sauna'} facility located in ${row.city}.`,
            facility_type: getFacilityType(row.categoryName, row.title),
            address: row.street ? row.street.trim() : `${row.city}, UK`,
            city: row.city.trim(),
            county: getCounty(row.city.trim(), row.state),
            postcode: generatePostcode(row.city.trim()),
            phone: cleanPhone(row.phone),
            website: cleanWebsite(row.website),
            rating: row.totalScore ? parseFloat(row.totalScore) : null,
            review_count: row.reviewsCount ? parseInt(row.reviewsCount) : 0,
            images: row.imageUrl ? [row.imageUrl] : [],
            verified: false,
            featured: false
          };

          results.push(facilityData);
        } catch (error) {
          errors.push(`Error processing row: ${error.message} - ${JSON.stringify(row)}`);
        }
      })
      .on('end', async () => {
        console.log(`Processed ${results.length} facilities`);
        console.log(`Encountered ${errors.length} errors`);

        if (errors.length > 0) {
          console.log('Errors:');
          errors.forEach(error => console.log('  -', error));
        }

        // Insert data in batches
        const batchSize = 50;
        let inserted = 0;

        for (let i = 0; i < results.length; i += batchSize) {
          const batch = results.slice(i, i + batchSize);

          try {
            const { data, error } = await supabase
              .from('facilities')
              .insert(batch)
              .select();

            if (error) {
              console.error(`Batch ${Math.floor(i/batchSize) + 1} error:`, error);
            } else {
              inserted += data.length;
              console.log(`Inserted batch ${Math.floor(i/batchSize) + 1}: ${data.length} records`);
            }
          } catch (batchError) {
            console.error(`Batch ${Math.floor(i/batchSize) + 1} exception:`, batchError);
          }
        }

        console.log(`\nImport complete!`);
        console.log(`Total records processed: ${results.length}`);
        console.log(`Total records inserted: ${inserted}`);
        console.log(`Total errors: ${errors.length}`);

        resolve({ inserted, errors: errors.length, total: results.length });
      })
      .on('error', (error) => {
        console.error('CSV parsing error:', error);
        reject(error);
      });
  });
}

// Run the import
if (require.main === module) {
  importSaunaData()
    .then((result) => {
      console.log('Import completed successfully:', result);
      process.exit(0);
    })
    .catch((error) => {
      console.error('Import failed:', error);
      process.exit(1);
    });
}

module.exports = { importSaunaData };