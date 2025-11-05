/**
 * Script to add coordinates to saunas using a simple geocoding approach
 * This adds approximate coordinates based on city/county for demonstration
 */

require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Approximate coordinates for major UK cities
const cityCoordinates = {
  // England
  'London': { lat: 51.5074, lng: -0.1278 },
  'Manchester': { lat: 53.4808, lng: -2.2426 },
  'Birmingham': { lat: 52.4862, lng: -1.8904 },
  'Leeds': { lat: 53.8008, lng: -1.5491 },
  'Sheffield': { lat: 53.3811, lng: -1.4701 },
  'Bristol': { lat: 51.4545, lng: -2.5879 },
  'Liverpool': { lat: 53.4084, lng: -2.9916 },
  'Newcastle upon Tyne': { lat: 54.9783, lng: -1.6178 },
  'Nottingham': { lat: 52.9548, lng: -1.1581 },
  'Plymouth': { lat: 50.3755, lng: -4.1427 },
  'Hull': { lat: 53.7676, lng: -0.3274 },
  'Preston': { lat: 53.7632, lng: -2.7031 },
  'Bath': { lat: 51.3811, lng: -2.3590 },
  'York': { lat: 53.9600, lng: -1.0873 },
  'Exeter': { lat: 50.7184, lng: -3.5339 },
  'Brighton': { lat: 50.8225, lng: -0.1372 },
  'Norwich': { lat: 52.6309, lng: 1.2974 },
  'Cambridge': { lat: 52.2053, lng: 0.1218 },
  'Oxford': { lat: 51.7520, lng: -1.2577 },
  'Portsmouth': { lat: 50.8198, lng: -1.0880 },
  'Southampton': { lat: 50.9097, lng: -1.4044 },
  'Reading': { lat: 51.4543, lng: -0.9781 },
  'Bournemouth': { lat: 50.7192, lng: -1.8808 },
  'Poole': { lat: 50.7150, lng: -1.9872 },
  'Swindon': { lat: 51.5557, lng: -1.7797 },
  'Derby': { lat: 52.9225, lng: -1.4746 },
  'Leicester': { lat: 52.6369, lng: -1.1398 },
  'Wolverhampton': { lat: 52.5862, lng: -2.1282 },
  'Blackpool': { lat: 53.8175, lng: -3.0357 },
  'Oldham': { lat: 53.5409, lng: -2.1114 },
  'Stockport': { lat: 53.4106, lng: -2.1575 },
  'Gateshead': { lat: 54.9526, lng: -1.6644 },
  'Doncaster': { lat: 53.5228, lng: -1.1285 },
  'Rotherham': { lat: 53.4302, lng: -1.3597 },
  'Barnsley': { lat: 53.5526, lng: -1.4797 },
  'Wakefield': { lat: 53.6830, lng: -1.4992 },
  'Bradford': { lat: 53.7960, lng: -1.7594 },
  'Harrogate': { lat: 54.0000, lng: -1.5373 },

  // Scotland
  'Glasgow': { lat: 55.8642, lng: -4.2518 },
  'Edinburgh': { lat: 55.9533, lng: -3.1883 },
  'Aberdeen': { lat: 57.1497, lng: -2.0943 },
  'Dundee': { lat: 56.4620, lng: -2.9707 },
  'Stirling': { lat: 56.1165, lng: -3.9369 },
  'Perth': { lat: 56.3962, lng: -3.4375 },
  'Inverness': { lat: 57.4778, lng: -4.2247 },
  'Dumfries': { lat: 55.0703, lng: -3.6140 },

  // Wales
  'Cardiff': { lat: 51.4816, lng: -3.1791 },
  'Swansea': { lat: 51.6214, lng: -3.9436 },
  'Newport': { lat: 51.5842, lng: -2.9977 },
  'Bangor': { lat: 53.2280, lng: -4.1289 },
  'Wrexham': { lat: 53.0478, lng: -2.9916 },

  // Northern Ireland
  'Belfast': { lat: 54.5973, lng: -5.9301 },
  'Derry': { lat: 54.9966, lng: -7.3086 },
  'Lisburn': { lat: 54.5162, lng: -6.0581 },

  // Additional smaller cities/towns
  'Largs': { lat: 55.7939, lng: -4.8698 },
  'Greenock': { lat: 55.9467, lng: -4.7647 },
  'Elgin': { lat: 57.6494, lng: -3.3184 },
  'Yelverton': { lat: 50.5159, lng: -4.0883 },
  'Seaton': { lat: 50.7056, lng: -3.0698 },
  'Looe': { lat: 50.3573, lng: -4.4564 },
  'Teignmouth': { lat: 50.5465, lng: -3.4986 },
  'Paignton': { lat: 50.4359, lng: -3.5606 },
  'Ilkeston': { lat: 52.9715, lng: -1.3089 },
  'Chester': { lat: 53.1906, lng: -2.8908 },
  'Coniston': { lat: 54.3698, lng: -3.0748 },
  'Barmouth': { lat: 52.7192, lng: -4.0581 },
  'Cheltenham': { lat: 51.8989, lng: -2.0781 },
  'Clevedon': { lat: 51.4417, lng: -2.8561 },
  'Whitley Bay': { lat: 55.0453, lng: -1.4474 },
  'South Shields': { lat: 54.9988, lng: -1.4323 },
  'Pwllheli': { lat: 52.8815, lng: -4.4142 },
  'Helensburgh': { lat: 56.0159, lng: -4.7330 },
  'Dulverton': { lat: 51.0344, lng: -3.5489 },
  'Barry': { lat: 51.4007, lng: -3.2837 },
  'Beaconsfield': { lat: 51.6094, lng: -0.6479 },
  'Eastbourne': { lat: 50.7684, lng: 0.2905 },
  'Worthing': { lat: 50.8179, lng: -0.3728 },
  'Portree': { lat: 57.4133, lng: -6.1942 },
  'Deal': { lat: 51.2225, lng: 1.4047 },
  'Dover': { lat: 51.1279, lng: 1.3134 },
  'Margate': { lat: 51.3813, lng: 1.3862 },
  'Sandwich': { lat: 51.2761, lng: 1.3394 },
  'Folkestone': { lat: 51.0814, lng: 1.1696 },
  'Whitstable': { lat: 51.3607, lng: 1.0252 },
  'Hythe': { lat: 51.0742, lng: 1.0865 },
  'Faversham': { lat: 51.3158, lng: 0.8914 },
  'Southsea': { lat: 50.7873, lng: -1.0905 },
  'Swanage': { lat: 50.6094, lng: -1.9594 },
  'Christchurch': { lat: 50.7358, lng: -1.7785 }
}

function addRandomOffset(coordinate, maxOffset = 0.01) {
  // Add small random offset to avoid all saunas being in exactly the same spot
  const offset = (Math.random() - 0.5) * 2 * maxOffset
  return coordinate + offset
}

async function addCoordinatesToSaunas() {
  try {
    console.log('Fetching saunas without coordinates...')

    // Get saunas that don't have coordinates
    const { data: saunas, error } = await supabase
      .from('facilities')
      .select('id, name, city, county, address')
      .eq('facility_type', 'sauna')
      .is('latitude', null)
      .limit(50) // Process in batches

    if (error) {
      console.error('Error fetching saunas:', error)
      return
    }

    console.log(`Found ${saunas.length} saunas without coordinates`)

    if (saunas.length === 0) {
      console.log('All saunas already have coordinates!')
      return
    }

    let updatedCount = 0

    for (const sauna of saunas) {
      const cityKey = sauna.city
      const coordinates = cityCoordinates[cityKey]

      if (coordinates) {
        // Add small random offset to coordinates
        const latitude = addRandomOffset(coordinates.lat, 0.005)
        const longitude = addRandomOffset(coordinates.lng, 0.005)

        const { error: updateError } = await supabase
          .from('facilities')
          .update({
            latitude: latitude,
            longitude: longitude
          })
          .eq('id', sauna.id)

        if (updateError) {
          console.error(`Error updating ${sauna.name}:`, updateError)
        } else {
          updatedCount++
          console.log(`✓ Updated ${sauna.name} in ${sauna.city}: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`)
        }
      } else {
        console.log(`⚠ No coordinates found for city: ${sauna.city} (${sauna.name})`)
      }
    }

    console.log(`\n✅ Successfully updated coordinates for ${updatedCount} saunas`)

  } catch (error) {
    console.error('Script error:', error)
  }
}

// Run the script
addCoordinatesToSaunas()