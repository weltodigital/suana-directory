import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Thermometer, MapPin, Star, Phone, Globe, ArrowRight, Award, Clock, Users } from 'lucide-react'
import SchemaMarkup from '@/components/SchemaMarkup'
import dynamic from 'next/dynamic'

const SaunaMap = dynamic(() => import('@/components/SaunaMap'), {
  ssr: false,
  loading: () => <div className="w-full h-[450px] bg-gray-100 rounded-lg flex items-center justify-center">Loading map...</div>
})

interface Props {
  params: {
    county: string
    city: string
  }
}

// Helper function to create URL-safe slugs
function createSlug(name: string, city?: string): string {
  const baseSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .trim()

  if (city) {
    const citySlug = city
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .trim()
    return `${baseSlug}-${citySlug}`
  }

  return baseSlug
}

// Function to create unique slugs for all saunas
function createUniqueSlug(sauna: any, allSaunas: any[]): string {
  const baseSlug = createSlug(sauna.name)

  // Check if this slug already exists in other saunas
  const duplicates = allSaunas.filter(s =>
    s.id !== sauna.id && createSlug(s.name) === baseSlug
  )

  // If there are duplicates, add the city to make it unique
  if (duplicates.length > 0) {
    return createSlug(sauna.name, sauna.city)
  }

  return baseSlug
}

// County mapping: maps database "county" values to proper geographical counties
const countyMapping: { [key: string]: string[] } = {
  'dorset': ['Poole', 'Bournemouth', 'Dorset', 'Wareham', 'Weymouth', 'Blandford Forum'],
  'greater-manchester': ['Greater Manchester', 'Manchester', 'Oldham', 'Stockport', 'Salford', 'Bury'],
  'devon': ['Devon', 'Plymouth', 'Exeter', 'Torpoint', 'Totnes', 'Newton Abbot', 'Taunton', 'Cullompton', 'Exmouth', 'Dawlish', 'Brixham', 'Honiton'],
  'norfolk': ['Norfolk', 'Norwich', 'Wells-next-the-Sea', 'Dereham'],
  'bristol': ['Bristol'],
  'east-sussex': ['East Sussex', 'Brighton', 'Eastbourne', 'Bexhill-on-Sea', 'Hastings', 'Lewes'],
  'aberdeenshire': ['Aberdeenshire', 'Aberdeen', 'Ballater', 'Stonehaven'],
  'swansea': ['Swansea'],
  'greater-london': ['Greater London', 'London', 'Enfield'],
  'west-yorkshire': ['West Yorkshire', 'Leeds', 'Bradford', 'Wakefield', 'Brighouse', 'Hebden Bridge', 'Keighley', 'Shipley'],
  'glasgow-city': ['Glasgow'],
  'belfast': ['Belfast', 'Belfast, Antrim'],
  'nottinghamshire': ['Nottingham', 'Mansfield', 'Worksop'],
  'north-yorkshire': ['York', 'Harrogate', 'Malton', 'Ripon', 'Skipton'],
  'east-riding-of-yorkshire': ['Hull', 'Bridlington'],
  'cornwall': ['Cornwall', 'Falmouth', 'Penzance', 'Newquay', 'Saint Austell', 'Saint Columb', 'Redruth', 'Camborne', 'Hayle', 'Wadebridge', 'Camelford', 'Bude'],
  'west-midlands': ['Wolverhampton', 'Stourbridge', 'Kidderminster'],
  'cambridgeshire': ['Cambridge', 'ELY', 'Peterborough'],
  'highland': ['Highland', 'Thurso', 'Cromarty', 'Portree', 'Kingussie', 'Nairn', 'Dingwall', 'Gairloch', 'Invergarry', 'Mallaig'],
  'hampshire': ['Portsmouth', 'Hampshire', 'Southampton', 'Basingstoke', 'Andover', 'Petersfield', 'Liphook', 'New Milton', 'Lymington', 'Lee-on-the-Solent', 'Hook', 'Farnborough'],
  'somerset': ['Somerset', 'Bath', 'Taunton', 'Wellington', 'Yeovil', 'Bruton', 'Shepton Mallet', 'Radstock', 'Weston-super-Mare'],
  'kent': ['Deal', 'Dover', 'Faversham', 'Folkestone', 'Maidstone', 'Margate', 'Rochester', 'Sandwich', 'Tunbridge Wells', 'Whitstable'],
  'essex': ['Brentwood', 'Chelmsford', 'Hockley', 'Leigh-on-Sea', 'Loughton', 'Romford', 'Southend-on-Sea'],
  'lancashire': ['Preston', 'Blackpool'],
  'cumbria': ['Cumbria', 'Keswick', 'Penrith', 'Workington'],
  'derbyshire': ['Derbyshire', 'Derby', 'Chesterfield', 'Dronfield', 'Matlock'],
  'lincolnshire': ['Lincoln', 'Boston', 'Market Rasen', 'Skegness', 'Sleaford'],
  'oxfordshire': ['Oxford', 'Oxfordshire', 'Abingdon', 'Didcot', 'Thame'],
  'gloucestershire': ['Gloucestershire', 'Gloucester', 'Stroud', 'Tewkesbury', 'Lydney'],
  'buckinghamshire': ['Buckinghamshire', 'High Wycombe', 'Great Missenden'],
  'berkshire': ['Reading', 'Ascot', 'Bracknell', 'Newbury', 'Slough', 'Windsor', 'Wokingham'],
  'wiltshire': ['Swindon', 'Calne', 'Melksham', 'Salisbury', 'Trowbridge'],
  'surrey': ['Guildford', 'Woking', 'Farnham', 'West Byfleet'],
  'west-sussex': ['West Sussex', 'Chichester', 'Horsham', 'Crawley', 'Hassocks', 'Haywards Heath', 'Lancing', 'Littlehampton', 'Pulborough', 'Shoreham-by-Sea'],
  'suffolk': ['Bungay', 'Saxmundham', 'Woodbridge'],
  'worcestershire': ['Worcester', 'Kidderminster'],
  'staffordshire': ['Cannock', 'Rugeley', 'Stoke-on-Trent'],
  'cheshire': ['Cheshire', 'Cheadle', 'Congleton', 'Crewe', 'Tarporley'],
  'tyne-and-wear': ['Tyne and Wear', 'Newcastle upon Tyne', 'Gateshead', 'North Shields'],
  'south-yorkshire': ['South Yorkshire', 'Doncaster', 'Rotherham', 'Sheffield', 'Barnsley'],
  'bedfordshire': ['Bedford', 'Luton', 'Shefford'],
  'hertfordshire': ['St Albans', 'Bishop Stortford', 'Borehamwood', 'Potters Bar', 'Uxbridge', 'Waltham Abbey', 'West Drayton'],
  'northumberland': ['Hexham', 'Chathill'],
  'moray': ['Moray', 'Forres'],
  'stirling': ['Stirling', 'Callander'],
  'fife': ['Cupar', 'St Andrews'],
  'perth-and-kinross': ['Perth', 'Aberfeldy', 'Crieff', 'Dunkeld'],
  'argyll-and-bute': ['Argyll and Bute', 'Oban', 'Arrochar', 'Isle of Arran', 'Isle of Mull'],
  'dumfries-and-galloway': ['Dumfries', 'Kirkcudbright', 'Lockerbie'],
  'scottish-borders': ['Kelso'],
  'falkirk': ['Falkirk'],
  'west-dunbartonshire': ['Dumbarton'],
  'inverclyde': ['Inverclyde'],
  'shetland': ['Shetland', 'Lerwick'],
  'orkney': ['Orkney', 'Stromness'],
  'eilean-siar': ['Stornoway', 'Isle of Harris'],
  'angus': ['Dundee', 'Arbroath'],
  'east-lothian': ['North Berwick'],
  'midlothian': ['Edinburgh'],
  'cardiff': ['Cardiff'],
  'gwynedd': ['Gwynedd', 'Caernarfon', 'Bangor', 'Beaumaris', 'Blaenau Ffestiniog', 'Criccieth', 'Henfaes', 'Holyhead', 'Ty Croes'],
  'ceredigion': ['Ceredigion', 'Machynlleth'],
  'denbighshire': ['Denbighshire', 'Colwyn Bay', 'Llangollen'],
  'flintshire': ['Flint', 'Flintshire'],
  'pembrokeshire': ['Haverfordwest', 'Kilgetty', 'Milford Haven', 'Saundersfoot'],
  'carmarthenshire': ['Llanelli', 'Llandysul'],
  'vale-of-glamorgan': ['Vale of Glamorgan', 'Porthcawl'],
  'neath-port-talbot': ['Port Talbot'],
  'powys': ['Welshpool'],
  'wrexham': ['Wrexham'],
  'monmouthshire': ['Cwmbran'],
  'blaenau-gwent': ['Blackwood'],
  'antrim': ['Antrim', 'Ballymena', 'Carrickfergus'],
  'armagh': ['Craigavon'],
  'down': ['Newry', 'Bangor'],
  'fermanagh': ['Enniskillen'],
  'londonderry': ['Coleraine', 'Portstewart'],
  'tyrone': ['Dungannon', 'Omagh'],
  'north-ayrshire': ['North Ayrshire', 'Ardrossan'],
  'east-ayrshire': ['Strathaven'],
  'renfrewshire': ['Paisley']
}

async function getLocationData(countySlug: string, citySlug: string) {
  try {
    // Get all saunas
    const { data: allSaunas, error } = await supabase
      .from('facilities')
      .select('*')
      .eq('facility_type', 'sauna')

    if (error || !allSaunas) {
      console.error('Error fetching sauna data:', error)
      return null
    }

    // Get the database county names that map to this geographical county
    const mappedCounties = countyMapping[countySlug]
    if (!mappedCounties) {
      return null
    }

    // Convert URL city slug back to proper city name
    const cityGuess = citySlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())

    // Find saunas that match both the county mapping and the specific city
    const matchingSaunas = allSaunas.filter(sauna => {
      const countyMatch = mappedCounties.includes(sauna.county)
      const cityMatch = sauna.city.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-') === citySlug
      return countyMatch && cityMatch
    })

    if (matchingSaunas.length === 0) {
      return null
    }

    // Get the proper county name for display (convert from slug)
    const properCountyName = countySlug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')

    const city = matchingSaunas[0].city

    // Sort by rating
    const saunas = matchingSaunas.sort((a, b) => (b.rating || 0) - (a.rating || 0))

    return {
      county: properCountyName,
      city,
      saunas,
      totalSaunas: saunas.length,
      averageRating: saunas.reduce((sum, s) => sum + (s.rating || 0), 0) / saunas.length,
      allSaunas
    }
  } catch (error) {
    console.error('Error in getLocationData:', error)
    return null
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locationData = await getLocationData(params.county, params.city)

  if (!locationData) {
    return {
      title: 'Location Not Found',
      description: 'The requested location could not be found.'
    }
  }

  const { city, county, totalSaunas } = locationData

  return {
    title: `${totalSaunas} Best Saunas in ${city}, ${county} | UK Sauna Directory`,
    description: `Discover ${totalSaunas} sauna facilities in ${city}, ${county}. Find traditional Finnish saunas, infrared saunas, and steam rooms with reviews, ratings, and contact details.`,
    keywords: `${city} saunas, ${county} saunas, Finnish sauna ${city}, infrared sauna ${city}, steam room ${city}, heat therapy ${city}, wellness ${city}`,
    openGraph: {
      title: `${totalSaunas} Best Saunas in ${city}, ${county}`,
      description: `Discover sauna facilities in ${city}. Traditional Finnish saunas, infrared saunas, and steam rooms.`,
      type: 'website',
      url: `https://sauna-directory.co.uk/saunas/${params.county}/${params.city}`,
    },
    alternates: {
      canonical: `https://sauna-directory.co.uk/saunas/${params.county}/${params.city}`
    }
  }
}

export default async function CityLocationPage({ params }: Props) {
  const locationData = await getLocationData(params.county, params.city)

  if (!locationData) {
    notFound()
  }

  const { city, county, saunas, totalSaunas, averageRating, allSaunas } = locationData

  const breadcrumbs = [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://sauna-directory.co.uk" },
    { "@type": "ListItem", "position": 2, "name": "Saunas", "item": "https://sauna-directory.co.uk/saunas" },
    { "@type": "ListItem", "position": 3, "name": `${county} Saunas`, "item": `https://sauna-directory.co.uk/saunas/${params.county}` },
    { "@type": "ListItem", "position": 4, "name": `${city} Saunas`, "item": `https://sauna-directory.co.uk/saunas/${params.county}/${params.city}` }
  ]

  return (
    <>
      <SchemaMarkup
        type="webpage"
        data={{
          name: `Saunas in ${city}, ${county}`,
          description: `Find the best sauna facilities in ${city}, ${county}. ${totalSaunas} locations.`,
          url: `https://sauna-directory.co.uk/saunas/${params.county}/${params.city}`,
          numberOfItems: totalSaunas,
          breadcrumbs
        }}
      />

      {/* Breadcrumb Navigation */}
      <nav className="bg-gray-50 py-4">
        <div className="container mx-auto px-4">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link href="/" className="text-gray-600 hover:text-orange-600 transition-colors">
                Home
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link href="/saunas" className="text-gray-600 hover:text-orange-600 transition-colors">
                Saunas
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link href={`/saunas/${params.county}`} className="text-gray-600 hover:text-orange-600 transition-colors">
                {county}
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-orange-600 font-semibold">{city}</li>
          </ol>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl mb-6">
              <Thermometer className="text-white" size={28} />
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              Find <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">Saunas</span> in {city} Near You
            </h1>

            <p className="text-lg text-gray-600 mb-6">
              Discover sauna facilities in <strong>{city}, {county}</strong>. From traditional Finnish saunas to modern infrared therapy centres.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 bg-white rounded-xl shadow-lg p-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{totalSaunas}</div>
                <div className="text-sm text-gray-600">Sauna Facilities</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{averageRating.toFixed(1)}★</div>
                <div className="text-sm text-gray-600">Average Rating</div>
              </div>
              <div className="text-center md:col-span-1 col-span-2">
                <div className="text-2xl font-bold text-orange-600">100%</div>
                <div className="text-sm text-gray-600">FREE to Use</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sauna Listings */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Sauna Facilities in {city}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our curated selection of the best sauna facilities in {city}, offering quality heat therapy experiences.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {saunas.map((sauna, index) => (
              <div key={sauna.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
                <div className="flex flex-col md:flex-row">
                  {/* Image */}
                  <div className="md:w-1/3 h-48 md:h-auto relative overflow-hidden">
                    {sauna.images && sauna.images.length > 0 ? (
                      <img
                        src={sauna.images[0]}
                        alt={sauna.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-orange-200 to-red-200 flex items-center justify-center">
                        <Thermometer className="text-orange-600" size={32} />
                      </div>
                    )}

                    <div className="absolute top-3 left-3">
                      <span className="bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        #{index + 1}
                      </span>
                    </div>

                  </div>

                  {/* Content */}
                  <div className="md:w-2/3 p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2">
                        {sauna.name}
                      </h3>
                      {sauna.rating && (
                        <div className="flex items-center text-yellow-500 ml-4">
                          <Star size={16} fill="currentColor" />
                          <span className="ml-1 text-gray-700 font-semibold">{sauna.rating}</span>
                          {sauna.review_count > 0 && (
                            <span className="ml-1 text-gray-500 text-sm">({sauna.review_count})</span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center text-gray-600 mb-3">
                      <MapPin size={14} className="mr-2 flex-shrink-0" />
                      <span className="text-sm">{sauna.address}</span>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {sauna.description}
                    </p>

                    <div className="flex flex-col gap-3">
                      {sauna.website && (
                        <a
                          href={sauna.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-orange-600 text-white px-3 py-2 rounded-lg hover:bg-orange-700 transition-colors font-medium flex items-center justify-center text-sm"
                        >
                          <Globe size={14} className="mr-2" />
                          Visit Website
                        </a>
                      )}

                      <Link
                        href={`/sauna/${createUniqueSlug(sauna, allSaunas)}`}
                        className="bg-gray-900 text-white px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors font-medium flex items-center justify-center text-sm"
                      >
                        <ArrowRight size={14} className="mr-2" />
                        View Details
                      </Link>

                      <div className="flex items-center justify-center">
                        {sauna.phone && (
                          <a
                            href={`tel:${sauna.phone}`}
                            className="text-gray-400 hover:text-orange-600 transition-colors"
                            title="Call"
                          >
                            <Phone size={16} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Sauna Locations Map - {city}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore all {totalSaunas} sauna {totalSaunas === 1 ? 'facility' : 'facilities'} in {city}, {county} on our interactive map.
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <SaunaMap
              saunas={saunas.map(sauna => ({
                id: sauna.id,
                name: sauna.name,
                latitude: sauna.latitude,
                longitude: sauna.longitude,
                address: sauna.address,
                city: sauna.city,
                rating: sauna.rating,
                website: sauna.website
              }))}
              height="450px"
            />
          </div>
        </div>
      </section>

      {/* Related Locations */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              More Sauna Locations in {county}
            </h2>
            <p className="text-lg text-gray-600">
              Explore saunas in other cities across {county}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/saunas/${params.county}`}
              className="inline-flex items-center bg-gradient-to-r from-orange-600 to-red-600 text-white px-8 py-4 rounded-xl hover:from-orange-700 hover:to-red-700 transition-all duration-300 font-semibold"
            >
              View All {county} Saunas
              <ArrowRight size={20} className="ml-2" />
            </Link>
            <Link
              href="/saunas"
              className="inline-flex items-center border-2 border-orange-600 text-orange-600 px-8 py-4 rounded-xl hover:bg-orange-600 hover:text-white transition-all duration-300 font-semibold"
            >
              All UK Counties
              <ArrowRight size={20} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Local SEO Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Why Choose Saunas in {city}, {county}?
            </h2>

            <div className="prose prose-lg max-w-none text-gray-600">
              <p>
                {city} offers {totalSaunas === 1 ? 'an exceptional sauna facility' : `${totalSaunas} exceptional sauna facilities`}
                in {county}, providing world-class heat therapy experiences. Whether you're seeking
                relaxation, health benefits, or social wellness experiences, {city}'s sauna facilities provide
                traditional and modern heat therapy options to suit all preferences.
              </p>

              <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">Popular Sauna Types in {city}</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Traditional Finnish Saunas:</strong> Authentic wood-heated or electric saunas with temperatures between 70-100°C</li>
                <li><strong>Infrared Saunas:</strong> Modern heat therapy using infrared light for deeper penetration at lower temperatures</li>
                <li><strong>Steam Rooms:</strong> High humidity heat therapy perfect for respiratory benefits and skin health</li>
                <li><strong>Wellness Centres:</strong> Comprehensive facilities offering multiple heat therapy options</li>
              </ul>

              <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">Health Benefits of Regular Sauna Use</h3>
              <p>
                Regular sauna use has been scientifically proven to provide numerous health benefits including
                improved cardiovascular health, stress reduction, enhanced muscle recovery, better sleep quality,
                and detoxification through increased sweating. The facilities in {city} offer guidance on
                optimal sauna protocols for maximum health benefits.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}