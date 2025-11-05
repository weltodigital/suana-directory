import { Metadata } from 'next'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Thermometer, MapPin, Star, Users, Clock, ArrowRight, Phone, Globe, Award } from 'lucide-react'
import SchemaMarkup from '@/components/SchemaMarkup'

export const metadata: Metadata = {
  title: 'UK Saunas Directory - Find Traditional Finnish & Infrared Saunas Near You',
  description: 'Discover the best saunas across the UK. From traditional Finnish saunas to modern infrared facilities. Over 500 sauna locations in England, Scotland & Wales.',
  keywords: 'UK saunas, Finnish sauna, infrared sauna, steam room, hot therapy, wellness, spa, London saunas, Manchester saunas, Birmingham saunas',
  openGraph: {
    title: 'UK Saunas Directory - Find Premium Saunas Near You',
    description: 'Discover over 500 sauna facilities across the UK. Traditional Finnish saunas, infrared saunas, and steam rooms.',
    type: 'website',
    url: 'https://sauna-directory.co.uk/saunas',
    siteName: 'UK Sauna Directory'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UK Saunas Directory - Find Premium Saunas Near You',
    description: 'Discover over 500 sauna facilities across the UK.'
  },
  alternates: {
    canonical: 'https://sauna-directory.co.uk/saunas'
  }
}

// Proper counties organized by country (based on actual data analysis)
const countiesByCountry = {
  England: [
    { county: 'Greater Manchester', totalSaunas: 12, cityCount: 1, slug: 'greater-manchester' },
    { county: 'Devon', totalSaunas: 11, cityCount: 5, slug: 'devon' },
    { county: 'Dorset', totalSaunas: 11, cityCount: 3, slug: 'dorset' },
    { county: 'Norfolk', totalSaunas: 10, cityCount: 1, slug: 'norfolk' },
    { county: 'Bristol', totalSaunas: 9, cityCount: 1, slug: 'bristol' },
    { county: 'Somerset', totalSaunas: 9, cityCount: 4, slug: 'somerset' },
    { county: 'East Sussex', totalSaunas: 9, cityCount: 2, slug: 'east-sussex' },
    { county: 'North Yorkshire', totalSaunas: 9, cityCount: 2, slug: 'north-yorkshire' },
    { county: 'Cornwall', totalSaunas: 7, cityCount: 3, slug: 'cornwall' },
    { county: 'Greater London', totalSaunas: 7, cityCount: 1, slug: 'greater-london' },
    { county: 'Hampshire', totalSaunas: 7, cityCount: 2, slug: 'hampshire' },
    { county: 'West Yorkshire', totalSaunas: 7, cityCount: 1, slug: 'west-yorkshire' },
    { county: 'Nottinghamshire', totalSaunas: 6, cityCount: 1, slug: 'nottinghamshire' },
    { county: 'East Riding of Yorkshire', totalSaunas: 6, cityCount: 1, slug: 'east-riding-of-yorkshire' },
    { county: 'West Midlands', totalSaunas: 5, cityCount: 1, slug: 'west-midlands' },
    { county: 'Cambridgeshire', totalSaunas: 5, cityCount: 1, slug: 'cambridgeshire' },
    { county: 'Derbyshire', totalSaunas: 4, cityCount: 2, slug: 'derbyshire' },
    { county: 'Oxfordshire', totalSaunas: 4, cityCount: 2, slug: 'oxfordshire' },
    { county: 'Lancashire', totalSaunas: 4, cityCount: 1, slug: 'lancashire' },
    { county: 'South Yorkshire', totalSaunas: 3, cityCount: 1, slug: 'south-yorkshire' },
    { county: 'Wiltshire', totalSaunas: 3, cityCount: 1, slug: 'wiltshire' }
  ],
  Scotland: [
    { county: 'Glasgow City', totalSaunas: 16, cityCount: 1, slug: 'glasgow-city' },
    { county: 'Aberdeenshire', totalSaunas: 7, cityCount: 2, slug: 'aberdeenshire' },
    { county: 'Highland', totalSaunas: 4, cityCount: 3, slug: 'highland' },
    { county: 'City of Edinburgh', totalSaunas: 4, cityCount: 1, slug: 'city-of-edinburgh' },
    { county: 'Moray', totalSaunas: 3, cityCount: 1, slug: 'moray' },
    { county: 'Fife', totalSaunas: 3, cityCount: 1, slug: 'fife' },
    { county: 'City of Dundee', totalSaunas: 3, cityCount: 1, slug: 'city-of-dundee' },
    { county: 'North Ayrshire', totalSaunas: 2, cityCount: 1, slug: 'north-ayrshire' },
    { county: 'Inverclyde', totalSaunas: 2, cityCount: 1, slug: 'inverclyde' },
    { county: 'Argyll and Bute', totalSaunas: 2, cityCount: 1, slug: 'argyll-and-bute' },
    { county: 'Stirling', totalSaunas: 2, cityCount: 1, slug: 'stirling' },
    { county: 'Shetland Islands', totalSaunas: 3, cityCount: 1, slug: 'shetland-islands' }
  ],
  Wales: [
    { county: 'Swansea', totalSaunas: 7, cityCount: 1, slug: 'swansea' },
    { county: 'Cardiff', totalSaunas: 3, cityCount: 1, slug: 'cardiff' },
    { county: 'Gwynedd', totalSaunas: 2, cityCount: 2, slug: 'gwynedd' },
    { county: 'Ceredigion', totalSaunas: 1, cityCount: 1, slug: 'ceredigion' },
    { county: 'Denbighshire', totalSaunas: 1, cityCount: 1, slug: 'denbighshire' },
    { county: 'Vale of Glamorgan', totalSaunas: 1, cityCount: 1, slug: 'vale-of-glamorgan' }
  ],
  'Northern Ireland': [
    { county: 'Belfast', totalSaunas: 6, cityCount: 1, slug: 'belfast' },
    { county: 'Mid Ulster', totalSaunas: 3, cityCount: 1, slug: 'mid-ulster' },
    { county: 'Antrim', totalSaunas: 2, cityCount: 1, slug: 'antrim' },
    { county: 'Down', totalSaunas: 2, cityCount: 1, slug: 'down' },
    { county: 'Fermanagh', totalSaunas: 2, cityCount: 1, slug: 'fermanagh' },
    { county: 'Armagh', totalSaunas: 2, cityCount: 1, slug: 'armagh' }
  ]
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

async function getSaunaData() {
  try {
    // Get total sauna count
    const { count: totalSaunas } = await supabase
      .from('facilities')
      .select('*', { count: 'exact', head: true })
      .eq('facility_type', 'sauna')

    // Get all saunas for unique slug generation
    const { data: allSaunas } = await supabase
      .from('facilities')
      .select('*')
      .eq('facility_type', 'sauna')

    // Get featured saunas (top 6 by rating)
    const featuredSaunas = allSaunas
      ?.sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 6) || []

    return {
      totalSaunas: totalSaunas || 626,
      featuredSaunas,
      allSaunas: allSaunas || [],
      countiesByCountry
    }
  } catch (error) {
    console.error('Error fetching sauna data:', error)
    return {
      totalSaunas: 626,
      featuredSaunas: [],
      countiesByCountry
    }
  }
}

export default async function SaunasPage() {
  const { totalSaunas, featuredSaunas, allSaunas, countiesByCountry } = await getSaunaData()

  return (
    <>
      <SchemaMarkup
        type="webpage"
        data={{
          name: "UK Saunas Directory",
          description: "Find the best saunas across the UK. Traditional Finnish saunas, infrared saunas, and steam rooms.",
          url: "https://sauna-directory.co.uk/saunas"
        }}
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-orange-500 to-red-600 rounded-3xl mb-8">
              <Thermometer className="text-white" size={36} />
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Find UK <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">Saunas</span> Near You
            </h1>

            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Discover over <strong>{totalSaunas} sauna facilities</strong> across England, Scotland, and Wales.
              From traditional Finnish saunas to modern infrared therapy centres.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-white rounded-2xl shadow-xl p-8 mb-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">{totalSaunas}</div>
                <div className="text-sm text-gray-600">Total Saunas</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">250+</div>
                <div className="text-sm text-gray-600">Cities Covered</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">4.8★</div>
                <div className="text-sm text-gray-600">Avg Rating</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">100%</div>
                <div className="text-sm text-gray-600">FREE to Use</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Featured Saunas */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Featured Sauna Facilities
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover top-rated saunas across the UK, from traditional Finnish experiences to modern wellness centres.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredSaunas.map((sauna) => (
              <div key={sauna.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
                {sauna.images && sauna.images.length > 0 && (
                  <div className="h-48 bg-gradient-to-br from-orange-200 to-red-200 relative overflow-hidden">
                    <img
                      src={sauna.images[0]}
                      alt={sauna.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4">
                      </div>
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                      {sauna.name}
                    </h3>
                    {sauna.rating && (
                      <div className="flex items-center text-yellow-500">
                        <Star size={16} fill="currentColor" />
                        <span className="ml-1 text-gray-700 font-semibold">{sauna.rating}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center text-gray-600 mb-4">
                    <MapPin size={16} className="mr-2" />
                    <span>{sauna.city}, {sauna.county}</span>
                  </div>

                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {sauna.description}
                  </p>

                  <div className="flex flex-col gap-3">
                    {sauna.website && (
                      <a
                        href={sauna.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors font-medium flex items-center justify-center"
                      >
                        <Globe size={16} className="mr-2" />
                        Visit Website
                      </a>
                    )}

                    <Link
                      href={`/sauna/${createUniqueSlug(sauna, allSaunas)}`}
                      className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors font-medium flex items-center justify-center"
                    >
                      <ArrowRight size={16} className="mr-2" />
                      View Details
                    </Link>

                    <div className="flex items-center justify-center">
                      {sauna.phone && (
                        <a href={`tel:${sauna.phone}`} className="text-gray-400 hover:text-orange-600 transition-colors">
                          <Phone size={18} />
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

      {/* Counties by Country */}
      <section id="counties" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Sauna Locations Across the UK
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore saunas across England, Scotland, Wales, and Northern Ireland. Each county page shows all cities and towns with sauna facilities.
            </p>
          </div>

          {Object.entries(countiesByCountry).map(([country, counties]) => (
            <div key={country} className="mb-16">
              <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center border-b-2 border-orange-200 pb-4">
                {country}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {counties.map((county) => (
                  <Link
                    key={county.county}
                    href={`/saunas/${county.slug}`}
                    className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group border border-gray-100"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                        {county.county}
                      </h4>
                      <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-semibold">
                        {county.totalSaunas} {county.totalSaunas === 1 ? 'sauna' : 'saunas'}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">
                      {county.cityCount} {county.cityCount === 1 ? 'city' : 'cities'}
                    </p>
                    <div className="flex items-center text-orange-600 font-semibold">
                      <span>Explore county</span>
                      <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}

        </div>
      </section>

      {/* Types of Saunas */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Types of Saunas in the UK
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From traditional Finnish saunas to cutting-edge infrared technology, discover the perfect heat therapy for you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-8">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mb-6">
                <Thermometer className="text-white" size={28} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Finnish Saunas</h3>
              <p className="text-gray-600 mb-6">
                Traditional dry heat saunas with temperatures between 70-100°C. The authentic sauna experience with optional löyly (steam from water on hot stones).
              </p>
              <ul className="text-gray-600 space-y-2">
                <li>• High temperature (70-100°C)</li>
                <li>• Low humidity (10-20%)</li>
                <li>• Wood-heated or electric</li>
                <li>• Traditional Finnish design</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8">
              <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6">
                <Thermometer className="text-white" size={28} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Infrared Saunas</h3>
              <p className="text-gray-600 mb-6">
                Modern heat therapy using infrared light to heat the body directly. Lower temperatures but deeper heat penetration.
              </p>
              <ul className="text-gray-600 space-y-2">
                <li>• Lower temperature (45-65°C)</li>
                <li>• Direct body heating</li>
                <li>• Energy efficient</li>
                <li>• Easier to tolerate</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-6">
                <Thermometer className="text-white" size={28} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Steam Rooms</h3>
              <p className="text-gray-600 mb-6">
                High humidity heat therapy with temperatures around 40-50°C. Moist heat perfect for respiratory benefits.
              </p>
              <ul className="text-gray-600 space-y-2">
                <li>• Lower temperature (40-50°C)</li>
                <li>• High humidity (100%)</li>
                <li>• Moist heat therapy</li>
                <li>• Respiratory benefits</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-br from-orange-600 to-red-600">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Health Benefits of Regular Sauna Use
            </h2>
            <p className="text-xl text-white opacity-90 max-w-3xl mx-auto">
              Backed by scientific research, regular sauna use offers numerous health and wellness benefits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Cardiovascular Health",
                description: "Improves heart health, reduces blood pressure, and enhances circulation through heat-induced cardiovascular exercise."
              },
              {
                title: "Stress Relief",
                description: "Reduces cortisol levels and promotes relaxation through heat therapy and quiet meditation time."
              },
              {
                title: "Muscle Recovery",
                description: "Accelerates muscle recovery after exercise by increasing blood flow and reducing inflammation."
              },
              {
                title: "Improved Sleep",
                description: "The drop in body temperature after sauna use promotes deeper, more restful sleep patterns."
              },
              {
                title: "Skin Health",
                description: "Opens pores, promotes sweating for detoxification, and improves overall skin tone and texture."
              },
              {
                title: "Mental Clarity",
                description: "Enhances mental well-being, reduces anxiety, and provides a meditative environment for mental clarity."
              }
            ].map((benefit, index) => (
              <div key={index} className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">{benefit.title}</h3>
                <p className="text-white opacity-90">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Experience the Benefits of Sauna Therapy?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Find the perfect sauna facility near you and start your heat therapy journey today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="#counties"
              className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-8 py-4 rounded-xl hover:from-orange-700 hover:to-red-700 transition-all duration-300 font-semibold text-lg"
            >
              Browse by County
            </Link>
            <Link
              href="/add-sauna"
              className="border-2 border-orange-600 text-orange-600 px-8 py-4 rounded-xl hover:bg-orange-600 hover:text-white transition-all duration-300 font-semibold text-lg"
            >
              List Your Sauna
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}