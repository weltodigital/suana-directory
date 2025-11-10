import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import {
  Thermometer,
  MapPin,
  Star,
  Clock,
  Phone,
  Globe,
  Mail,
  Award,
  ArrowLeft,
  Navigation,
  Users,
  Wifi,
  Car,
  Coffee,
  Droplets,
  Heart
} from 'lucide-react'
import SchemaMarkup from '@/components/SchemaMarkup'
import dynamic from 'next/dynamic'

const SaunaMap = dynamic(() => import('@/components/SaunaMap'), {
  ssr: false,
  loading: () => <div className="w-full h-[400px] bg-gray-100 rounded-lg flex items-center justify-center">Loading map...</div>
})

interface Sauna {
  id: string
  name: string
  description: string
  facility_type: string
  address: string
  city: string
  county: string
  postcode: string
  phone: string | null
  email: string | null
  website: string | null
  latitude: number | null
  longitude: number | null
  opening_hours: any
  amenities: string[] | null
  images: string[]
  rating: number
  review_count: number
  price_range: string | null
  verified: boolean
  featured: boolean
  created_at: string
  updated_at: string
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

async function getSaunaData(countySlug: string, citySlug: string, saunanameSlug: string): Promise<Sauna | null> {
  try {
    // Get all saunas to handle duplicates properly
    const { data: allSaunas, error } = await supabase
      .from('facilities')
      .select('*')
      .eq('facility_type', 'sauna')

    if (error || !allSaunas) {
      console.error('Error fetching saunas:', error)
      return null
    }

    // County mapping to find the right county
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

    // Get the database county names that map to this geographical county
    const mappedCounties = countyMapping[countySlug]
    if (!mappedCounties) {
      return null
    }

    // Convert URL slugs back to proper names for matching
    const cityGuess = citySlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())

    // Find saunas that match the county mapping and city
    const matchingSaunas = allSaunas.filter(sauna => {
      const countyMatch = mappedCounties.includes(sauna.county)
      const cityMatch = sauna.city.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-') === citySlug
      return countyMatch && cityMatch
    })

    if (matchingSaunas.length === 0) {
      return null
    }

    // Find the sauna that matches the sauna name slug
    const sauna = matchingSaunas.find(s => {
      const saunaSlug = s.name.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-')
      return saunaSlug === saunanameSlug
    })

    if (!sauna) {
      console.log('No sauna found for:', { countySlug, citySlug, saunanameSlug })
      return null
    }

    return sauna
  } catch (error) {
    console.error('Error fetching sauna data:', error)
    return null
  }
}

async function getNearbySaunas(county: string, city: string, currentId: string) {
  try {
    const { data: saunas, error } = await supabase
      .from('facilities')
      .select('*')
      .eq('facility_type', 'sauna')
      .eq('county', county)
      .neq('id', currentId)
      .order('rating', { ascending: false })
      .limit(3)

    if (error) {
      console.error('Error fetching nearby saunas:', error)
      return []
    }

    return saunas || []
  } catch (error) {
    console.error('Error fetching nearby saunas:', error)
    return []
  }
}

interface Props {
  params: {
    county: string
    city: string
    saunaname: string
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const sauna = await getSaunaData(params.county, params.city, params.saunaname)

  if (!sauna) {
    return {
      title: 'Sauna Not Found',
      description: 'The requested sauna facility could not be found.'
    }
  }

  return {
    title: `${sauna.name} - ${sauna.city}, ${sauna.county} | UK Sauna Directory`,
    description: `${sauna.description} Located in ${sauna.city}, ${sauna.county}. Rating: ${sauna.rating}★ (${sauna.review_count} reviews). Visit our UK Sauna Directory for details.`,
    keywords: `${sauna.name}, sauna ${sauna.city}, ${sauna.county} sauna, Finnish sauna, infrared sauna, wellness ${sauna.city}`,
    openGraph: {
      title: `${sauna.name} - Premium Sauna in ${sauna.city}`,
      description: `${sauna.description}`,
      type: 'website',
      url: `https://sauna-directory.co.uk/saunas/${params.county}/${params.city}/${params.saunaname}`,
      siteName: 'UK Sauna Directory',
      images: sauna.images.length > 0 ? [
        {
          url: sauna.images[0],
          width: 1200,
          height: 630,
          alt: `${sauna.name} - Sauna in ${sauna.city}`
        }
      ] : []
    },
    twitter: {
      card: 'summary_large_image',
      title: `${sauna.name} - Premium Sauna in ${sauna.city}`,
      description: `${sauna.description}`,
      images: sauna.images.length > 0 ? [sauna.images[0]] : []
    },
    alternates: {
      canonical: `https://sauna-directory.co.uk/saunas/${params.county}/${params.city}/${params.saunaname}`
    }
  }
}

export default async function SaunaPage({ params }: Props) {
  const sauna = await getSaunaData(params.county, params.city, params.saunaname)

  if (!sauna) {
    notFound()
  }

  const nearbySaunas = await getNearbySaunas(sauna.county, sauna.city, sauna.id)

  // Get all saunas for unique slug generation
  const { data: allSaunas } = await supabase
    .from('facilities')
    .select('*')
    .eq('facility_type', 'sauna')

  // Use the URL params directly since they're already the proper slugs
  const countySlug = params.county
  const citySlug = params.city

  return (
    <>
      <SchemaMarkup
        type="localbusiness"
        data={{
          name: sauna.name,
          description: sauna.description,
          address: sauna.address,
          telephone: sauna.phone || undefined,
          url: sauna.website || undefined,
          geo: sauna.latitude && sauna.longitude ? {
            "@type": "GeoCoordinates",
            latitude: sauna.latitude,
            longitude: sauna.longitude
          } : undefined,
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: sauna.rating,
            reviewCount: sauna.review_count
          }
        }}
      />

      {/* Breadcrumb Navigation */}
      <nav className="bg-gray-50 py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-orange-600 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/saunas" className="hover:text-orange-600 transition-colors">Saunas</Link>
            <span>/</span>
            <Link href={`/saunas/${countySlug}`} className="hover:text-orange-600 transition-colors">
              {countySlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </Link>
            <span>/</span>
            <Link href={`/saunas/${countySlug}/${citySlug}`} className="hover:text-orange-600 transition-colors">{sauna.city}</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{sauna.name}</span>
          </div>
        </div>
      </nav>

      {/* Back Button */}
      <div className="container mx-auto px-4 py-4">
        <Link
          href={`/saunas/${countySlug}/${citySlug}`}
          className="inline-flex items-center text-orange-600 hover:text-orange-700 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to {sauna.city} Saunas
        </Link>
      </div>

      {/* Hero Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Images */}
            <div className="space-y-4">
              {sauna.images && sauna.images.length > 0 ? (
                <>
                  <div className="aspect-video rounded-2xl overflow-hidden">
                    <Image
                      src={sauna.images[0]}
                      alt={`${sauna.name} - Main view`}
                      width={800}
                      height={450}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  </div>
                  {sauna.images.length > 1 && (
                    <div className="grid grid-cols-2 gap-4">
                      {sauna.images.slice(1, 3).map((image, index) => (
                        <div key={index} className="aspect-video rounded-xl overflow-hidden">
                          <Image
                            src={image}
                            alt={`${sauna.name} - View ${index + 2}`}
                            width={400}
                            height={225}
                            className="w-full h-full object-cover"
                            unoptimized
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="aspect-video rounded-2xl bg-gradient-to-br from-orange-200 to-red-200 flex items-center justify-center">
                  <Thermometer size={48} className="text-orange-600" />
                </div>
              )}
            </div>

            {/* Details */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">{sauna.name}</h1>
                  <div className="flex items-center text-gray-600 mb-4">
                    <MapPin size={20} className="mr-2" />
                    <span>{sauna.city}, {sauna.county}</span>
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center mb-6">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={20}
                      className={i < Math.floor(sauna.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                    />
                  ))}
                </div>
                <span className="ml-2 text-lg font-semibold text-gray-900">{sauna.rating}</span>
                <span className="ml-2 text-gray-600">({sauna.review_count} reviews)</span>
              </div>

              {/* Description */}
              <p className="text-gray-700 text-lg leading-relaxed mb-8">
                {sauna.description}
              </p>

              {/* Quick Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-600">
                      <MapPin size={18} className="mr-3" />
                      <span>{sauna.address}</span>
                    </div>
                    {sauna.phone && (
                      <div className="flex items-center text-gray-600">
                        <Phone size={18} className="mr-3" />
                        <a href={`tel:${sauna.phone}`} className="hover:text-orange-600 transition-colors">
                          {sauna.phone}
                        </a>
                      </div>
                    )}
                    {sauna.email && (
                      <div className="flex items-center text-gray-600">
                        <Mail size={18} className="mr-3" />
                        <a href={`mailto:${sauna.email}`} className="hover:text-orange-600 transition-colors">
                          {sauna.email}
                        </a>
                      </div>
                    )}
                    {sauna.website && (
                      <div className="flex items-center text-gray-600">
                        <Globe size={18} className="mr-3" />
                        <a
                          href={sauna.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-orange-600 transition-colors"
                        >
                          Visit Website
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Facility Details</h3>
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-600">
                      <Thermometer size={18} className="mr-3" />
                      <span>Sauna Facility</span>
                    </div>
                    {sauna.price_range && (
                      <div className="flex items-center text-gray-600">
                        <span className="mr-3">£</span>
                        <span>Price Range: {sauna.price_range}</span>
                      </div>
                    )}
                    {sauna.amenities && sauna.amenities.length > 0 && (
                      <div className="space-y-2">
                        <span className="text-gray-900 font-medium">Amenities:</span>
                        <div className="flex flex-wrap gap-2">
                          {sauna.amenities.map((amenity, index) => (
                            <span
                              key={index}
                              className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm"
                            >
                              {amenity}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                {sauna.website && (
                  <a
                    href={sauna.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-8 py-4 rounded-xl hover:from-orange-700 hover:to-red-700 transition-all duration-300 font-semibold text-lg flex items-center justify-center"
                  >
                    <Globe size={20} className="mr-2" />
                    Visit Website
                  </a>
                )}
                {sauna.phone && (
                  <a
                    href={`tel:${sauna.phone}`}
                    className="border-2 border-orange-600 text-orange-600 px-8 py-4 rounded-xl hover:bg-orange-600 hover:text-white transition-all duration-300 font-semibold text-lg flex items-center justify-center"
                  >
                    <Phone size={20} className="mr-2" />
                    Call Now
                  </a>
                )}
                {sauna.latitude && sauna.longitude && (
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${sauna.latitude},${sauna.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl hover:bg-gray-50 transition-all duration-300 font-semibold text-lg flex items-center justify-center"
                  >
                    <Navigation size={20} className="mr-2" />
                    Get Directions
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Location Map */}
      {sauna.latitude && sauna.longitude && (
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Location & Map
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Find {sauna.name} and get directions to this sauna facility in {sauna.city}, {sauna.county}.
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <SaunaMap
                saunas={[{
                  id: sauna.id,
                  name: sauna.name,
                  latitude: sauna.latitude,
                  longitude: sauna.longitude,
                  address: sauna.address,
                  city: sauna.city,
                  rating: sauna.rating,
                  website: sauna.website || undefined
                }]}
                center={[sauna.latitude, sauna.longitude]}
                zoom={15}
                height="400px"
              />
            </div>
          </div>
        </section>
      )}

      {/* Nearby Saunas */}
      {nearbySaunas.length > 0 && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Other Saunas in {sauna.county}
              </h2>
              <p className="text-lg text-gray-600">
                Discover more premium sauna facilities in your area
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {nearbySaunas.map((nearbySauna) => (
                <Link
                  key={nearbySauna.id}
                  href={`/saunas/${countySlug}/${nearbySauna.city.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-')}/${nearbySauna.name.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-')}`}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group"
                >
                  {nearbySauna.images && nearbySauna.images.length > 0 ? (
                    <div className="h-48 relative overflow-hidden">
                      <Image
                        src={nearbySauna.images[0]}
                        alt={nearbySauna.name}
                        width={400}
                        height={192}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="h-48 bg-gradient-to-br from-orange-200 to-red-200 flex items-center justify-center">
                      <Thermometer size={32} className="text-orange-600" />
                    </div>
                  )}

                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                        {nearbySauna.name}
                      </h3>
                      {nearbySauna.rating && (
                        <div className="flex items-center text-yellow-500">
                          <Star size={16} fill="currentColor" />
                          <span className="ml-1 text-gray-700 font-semibold">{nearbySauna.rating}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center text-gray-600 mb-4">
                      <MapPin size={16} className="mr-2" />
                      <span>{nearbySauna.city}, {nearbySauna.county}</span>
                    </div>

                    <p className="text-gray-600 line-clamp-3">
                      {nearbySauna.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                href={`/saunas/${countySlug}`}
                className="inline-flex items-center bg-orange-600 text-white px-8 py-4 rounded-xl hover:bg-orange-700 transition-all duration-300 font-semibold text-lg"
              >
                View All {sauna.county} Saunas
                <MapPin size={20} className="ml-2" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-600 to-red-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Looking for More Sauna Options?
          </h2>
          <p className="text-xl text-white mb-8 max-w-2xl mx-auto opacity-90">
            Explore our comprehensive directory of premium sauna facilities across the UK.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/saunas"
              className="bg-white text-gray-900 px-8 py-4 rounded-xl hover:bg-gray-100 transition-all duration-300 font-semibold text-lg"
            >
              Browse All Saunas
            </Link>
            <Link
              href={`/saunas/${countySlug}/${citySlug}`}
              className="border-2 border-white text-white px-8 py-4 rounded-xl hover:bg-white hover:text-gray-900 transition-all duration-300 font-semibold text-lg"
            >
              More in {sauna.city}
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}