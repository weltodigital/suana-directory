'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, MapPin, Phone, Mail } from 'lucide-react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-sauna-600 to-cold-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">SC</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-900">Sauna & Cold</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/saunas" className="text-gray-700 hover:text-sauna-600 font-medium transition-colors">
              Saunas
            </Link>
          </nav>

          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-3">
              <Link href="/saunas" className="text-gray-700 hover:text-sauna-600 font-medium py-2 transition-colors">
                Saunas
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}