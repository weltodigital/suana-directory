import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center space-y-6">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-sauna-600 to-cold-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">SC</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold">Sauna & Cold</span>
            </div>
          </Link>

          <p className="text-gray-400 text-sm leading-relaxed text-center max-w-2xl">
            The UK's premier directory for saunas, cold plunges, ice baths, and wellness facilities.
            Discover heat and cold therapy options across England, Scotland, and Wales.
          </p>

          <div>
            <Link href="/saunas" className="text-gray-400 hover:text-white transition-colors">
              Saunas
            </Link>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-sm text-gray-400">
              <Link href="/privacy-policy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms-of-service" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookie-policy" className="hover:text-white transition-colors">
                Cookie Policy
              </Link>
              <Link href="/sitemap.xml" className="hover:text-white transition-colors">
                Sitemap
              </Link>
            </div>
          </div>

          <div className="text-center mt-6 pt-6 border-t border-gray-800">
            <p className="text-sm text-gray-400">
              © {currentYear} Sauna & Cold. All rights reserved.
              <span className="block md:inline md:ml-2">
                The UK's most comprehensive wellness facility directory.
              </span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}