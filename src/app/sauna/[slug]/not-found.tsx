import Link from 'next/link'
import { Thermometer, ArrowLeft, Search } from 'lucide-react'

export default function SaunaNotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="w-24 h-24 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Thermometer className="text-white" size={48} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Sauna Not Found</h1>
          <p className="text-lg text-gray-600 mb-8">
            Sorry, we couldn't find the sauna you're looking for. It may have been moved or no longer exists.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/saunas"
            className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-3 rounded-xl hover:from-orange-700 hover:to-red-700 transition-all duration-300 font-semibold flex items-center justify-center"
          >
            <Search size={20} className="mr-2" />
            Browse All Saunas
          </Link>

          <Link
            href="/"
            className="w-full border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-50 transition-all duration-300 font-semibold flex items-center justify-center"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Home
          </Link>
        </div>

        <div className="mt-8 p-6 bg-white rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Looking for saunas?</h3>
          <div className="grid grid-cols-1 gap-3 text-sm">
            <Link
              href="/saunas"
              className="text-orange-600 hover:text-orange-700 transition-colors"
            >
              → Browse saunas by county and city
            </Link>
            <Link
              href="/saunas#counties"
              className="text-orange-600 hover:text-orange-700 transition-colors"
            >
              → Find saunas by location
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}