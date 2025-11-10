import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Thermometer, MapPin, Star, Phone, Globe, ArrowRight, Award, Users } from 'lucide-react'
import SchemaMarkup from '@/components/SchemaMarkup'
import dynamic from 'next/dynamic'

const SaunaMap = dynamic(() => import('@/components/SaunaMap'), {
  ssr: false,
  loading: () => <div className="w-full h-[500px] bg-gray-100 rounded-lg flex items-center justify-center">Loading map...</div>
})

interface Props {
  params: {
    county: string
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
  // Main geographical counties with their database entries
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

async function getCountyData(countySlug: string) {
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

    // Filter saunas for all mapped database counties
    const countySaunas = allSaunas.filter(sauna =>
      mappedCounties.includes(sauna.county)
    )

    if (countySaunas.length === 0) {
      return null
    }

    // Get the proper county name for display (convert from slug)
    const properCountyName = countySlug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')

    // Group by city
    const cityStats = countySaunas.reduce((acc: any, sauna) => {
      const city = sauna.city
      if (!acc[city]) {
        acc[city] = {
          name: city,
          saunas: [],
          count: 0,
          slug: city.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-')
        }
      }
      acc[city].saunas.push(sauna)
      acc[city].count++
      return acc
    }, {})

    const cities = Object.values(cityStats).sort((a: any, b: any) => b.count - a.count)

    // Get featured saunas (top rated)
    const featuredSaunas = countySaunas
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 6)

    return {
      county: properCountyName,
      totalSaunas: countySaunas.length,
      cities,
      featuredSaunas,
      countySaunas,
      averageRating: countySaunas.reduce((sum, s) => sum + (s.rating || 0), 0) / countySaunas.length,
      allSaunas
    }
  } catch (error) {
    console.error('Error in getCountyData:', error)
    return null
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const countyData = await getCountyData(params.county)

  if (!countyData) {
    return {
      title: 'County Not Found',
      description: 'The requested county could not be found.'
    }
  }

  const { county, totalSaunas, cities } = countyData

  return {
    title: `${totalSaunas} Best Saunas in ${county} | UK Sauna Directory`,
    description: `Discover ${totalSaunas} sauna facilities across ${county}. Find saunas in ${cities.slice(0, 3).map((c: any) => c.name).join(', ')} and more. Traditional Finnish saunas, infrared saunas, and steam rooms.`,
    keywords: `${county} saunas, saunas in ${county}, Finnish sauna ${county}, infrared sauna ${county}, ${cities.slice(0, 5).map((c: any) => `${c.name} saunas`).join(', ')}`,
    openGraph: {
      title: `${totalSaunas} Best Saunas in ${county}`,
      description: `Discover sauna facilities across ${county}. ${totalSaunas} saunas in ${cities.length} cities.`,
      type: 'website',
      url: `https://sauna-directory.co.uk/saunas/${params.county}`,
    },
    alternates: {
      canonical: `https://sauna-directory.co.uk/saunas/${params.county}`
    }
  }
}

export default async function CountySaunasPage({ params }: Props) {
  const countyData = await getCountyData(params.county)

  if (!countyData) {
    notFound()
  }

  const { county, totalSaunas, cities, featuredSaunas, countySaunas, averageRating, allSaunas } = countyData

  const breadcrumbs = [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://sauna-directory.co.uk" },
    { "@type": "ListItem", "position": 2, "name": "Saunas", "item": "https://sauna-directory.co.uk/saunas" },
    { "@type": "ListItem", "position": 3, "name": `${county} Saunas`, "item": `https://sauna-directory.co.uk/saunas/${params.county}` }
  ]

  return (
    <>
      <SchemaMarkup
        type="webpage"
        data={{
          name: `Saunas in ${county}`,
          description: `Find the best sauna facilities in ${county}. ${totalSaunas} locations across ${cities.length} cities.`,
          url: `https://sauna-directory.co.uk/saunas/${params.county}`,
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
            <li className="text-orange-600 font-semibold">{county}</li>
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
              Find <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">Saunas</span> in {county} Near You
            </h1>

            <p className="text-lg text-gray-600 mb-6">
              Explore sauna facilities across <strong>{county}</strong>. From traditional Finnish saunas to modern infrared therapy centres in {cities.length} cities and towns.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white rounded-xl shadow-lg p-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{totalSaunas}</div>
                <div className="text-sm text-gray-600">Total Saunas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{cities.length}</div>
                <div className="text-sm text-gray-600">Cities & Towns</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{averageRating.toFixed(1)}★</div>
                <div className="text-sm text-gray-600">Average Rating</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">100%</div>
                <div className="text-sm text-gray-600">FREE to Use</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Sauna Locations Map - {county}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore {totalSaunas} sauna {totalSaunas === 1 ? 'facility' : 'facilities'} across {county} on our interactive map.
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <SaunaMap
              saunas={countySaunas.map(sauna => ({
                id: sauna.id,
                name: sauna.name,
                latitude: sauna.latitude,
                longitude: sauna.longitude,
                address: sauna.address,
                city: sauna.city,
                rating: sauna.rating,
                website: sauna.website
              }))}
              height="500px"
            />
          </div>
        </div>
      </section>

      {/* Cities in County */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Sauna Locations in {county}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Browse saunas by city and town across {county}. Find the perfect sauna facility for your wellness needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {cities.map((city: any) => (
              <Link
                key={city.name}
                href={`/saunas/${params.county}/${city.slug}`}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group border border-gray-100"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                    {city.name}
                  </h3>
                  <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-semibold">
                    {city.count} {city.count === 1 ? 'sauna' : 'saunas'}
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-4">
                  {city.count === 1 ? 'One sauna facility' : `${city.count} sauna facilities`}
                </p>

                <div className="flex items-center text-orange-600 font-semibold">
                  <span>View saunas</span>
                  <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Saunas */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Featured Saunas in {county}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Top-rated sauna facilities across {county}, showcasing the best heat therapy experiences.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredSaunas.map((sauna, index) => (
              <div key={sauna.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
                {sauna.images && sauna.images.length > 0 && (
                  <div className="h-48 relative overflow-hidden">
                    <img
                      src={sauna.images[0]}
                      alt={sauna.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        #{index + 1}
                      </span>
                    </div>
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2">
                      {sauna.name}
                    </h3>
                    {sauna.rating && (
                      <div className="flex items-center text-yellow-500 ml-4">
                        <Star size={16} fill="currentColor" />
                        <span className="ml-1 text-gray-700 font-semibold">{sauna.rating}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center text-gray-600 mb-3">
                    <MapPin size={14} className="mr-2 flex-shrink-0" />
                    <span className="text-sm">{sauna.city}</span>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {sauna.description}
                  </p>

                  <div className="flex flex-col gap-2">
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
                      href={`/saunas/${params.county}/${sauna.city.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-')}/${sauna.name.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-')}`}
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
            ))}
          </div>
        </div>
      </section>

      {/* Local SEO Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Why Choose Saunas in {county}?
            </h2>

            <div className="prose prose-lg max-w-none text-gray-600">
              <p>
                {county} offers an exceptional selection of sauna facilities with {totalSaunas} locations
                across {cities.length} cities and towns. Whether you're seeking traditional Finnish sauna experiences,
                modern infrared therapy, or relaxing steam rooms, {county} provides diverse options for heat therapy
                enthusiasts of all levels.
              </p>

              <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">Popular Sauna Cities in {county}</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 not-prose">
                {cities.slice(0, 6).map((city: any) => (
                  <Link
                    key={city.name}
                    href={`/saunas/${params.county}/${city.slug}`}
                    className="bg-gray-50 rounded-lg p-3 hover:bg-orange-50 transition-colors"
                  >
                    <div className="font-semibold text-gray-900">{city.name}</div>
                    <div className="text-sm text-gray-600">{city.count} saunas</div>
                  </Link>
                ))}
              </div>

              <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">Sauna Types Available in {county}</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Traditional Finnish Saunas:</strong> Authentic dry heat experiences with temperatures 70-100°C</li>
                <li><strong>Infrared Saunas:</strong> Modern heat therapy using infrared light for deeper tissue penetration</li>
                <li><strong>Steam Rooms:</strong> High humidity heat therapy perfect for respiratory and skin benefits</li>
                <li><strong>Outdoor Saunas:</strong> Natural settings combining heat therapy with fresh air and scenic views</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}