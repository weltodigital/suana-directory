import Link from 'next/link'
import { MapPin, Star, Users, Clock, Thermometer, Snowflake, Heart, Award, Shield, TrendingUp } from 'lucide-react'
import SchemaMarkup from '@/components/SchemaMarkup'

export default function HomePage() {
  return (
    <>
      <SchemaMarkup type="website" />
      <SchemaMarkup type="organization" />
      <SchemaMarkup type="localbusiness" />

      <section className="relative bg-gradient-to-br from-blue-50 via-white to-pink-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Find Premium
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sauna-600 to-cold-600"> Saunas</span>,
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cold-600 to-sauna-600"> Cold Plunge</span> &
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sauna-600 to-cold-600"> Ice Baths</span> in the UK
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Discover the UK's most comprehensive directory of heat and cold therapy facilities.
              From traditional Finnish saunas to cutting-edge cryotherapy centres across England, Scotland, and Wales.
            </p>


            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center max-w-3xl mx-auto">
              <div>
                <div className="text-3xl font-bold text-sauna-600">500+</div>
                <div className="text-gray-600">Sauna Facilities</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-sauna-600">50+</div>
                <div className="text-gray-600">UK Cities</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-sauna-600">100%</div>
                <div className="text-gray-600">Free to Use</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Discover UK Saunas
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Find traditional Finnish saunas, infrared saunas, steam rooms, and hot therapy facilities across the UK.
            </p>
          </div>

          <div className="flex justify-center">
            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 group max-w-md">
              <div className="w-16 h-16 bg-gradient-to-r from-sauna-500 to-sauna-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Thermometer className="text-white" size={28} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Saunas</h3>
              <p className="text-gray-600 mb-6">
                Traditional Finnish saunas, infrared saunas, steam rooms, and hot therapy facilities across the UK.
              </p>
              <Link href="/saunas" className="text-sauna-600 font-semibold hover:text-sauna-700 transition-colors">
                Explore Saunas →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Popular Sauna Locations
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover sauna facilities in major UK cities and regions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { city: 'London', count: '7+ saunas', countySlug: 'greater-london' },
              { city: 'Manchester', count: '12+ saunas', countySlug: 'greater-manchester' },
              { city: 'Birmingham', count: '5+ saunas', countySlug: 'west-midlands' },
              { city: 'Edinburgh', count: '4+ saunas', countySlug: 'city-of-edinburgh' },
              { city: 'Bristol', count: '9+ saunas', countySlug: 'bristol' },
              { city: 'Leeds', count: '7+ saunas', countySlug: 'west-yorkshire' },
              { city: 'Glasgow', count: '16+ saunas', countySlug: 'glasgow-city' },
              { city: 'Liverpool', count: '4+ saunas', countySlug: 'lancashire' },
            ].map((location) => (
              <Link
                key={location.city}
                href={`/saunas/${location.countySlug}`}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <div className="h-48 bg-gradient-to-br from-blue-200 to-purple-200 relative overflow-hidden">
                  <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all duration-300"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold">{location.city}</h3>
                    <p className="text-sm opacity-90">{location.count}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Sauna & Cold Directory UK?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The UK's most trusted and comprehensive wellness facility directory.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Quality Facilities</h3>
              <p className="text-gray-600">
                All our listed facilities are carefully curated and regularly updated to ensure accuracy and quality.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Trusted Reviews</h3>
              <p className="text-gray-600">
                Read authentic reviews from real users to make informed decisions about your wellness journey.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Growing Network</h3>
              <p className="text-gray-600">
                Constantly expanding our network to include the latest and best heat and cold therapy facilities.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-sauna-600 to-cold-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Start Your Wellness Journey?
          </h2>
          <p className="text-xl text-white mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of wellness enthusiasts discovering the benefits of heat and cold therapy across the UK.
          </p>
          <div className="flex justify-center">
            <Link
              href="/saunas"
              className="bg-white text-gray-900 px-8 py-4 rounded-xl hover:bg-gray-100 transition-all duration-300 font-semibold text-lg"
            >
              Browse All Facilities
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}