'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Thermometer, Snowflake, Users, Calendar, MapPin, Mail, CheckCircle, ArrowRight, Heart, Zap, Shield } from 'lucide-react'

export default function CommunityPageClient() {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        setIsSubmitted(true)
        setEmail('')
      } else {
        const errorData = await response.json()
        alert(errorData.error || 'Failed to join waitlist. Please try again.')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to join waitlist. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sauna-50 via-white to-cold-50">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-8">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-sauna-500 to-sauna-600 rounded-2xl flex items-center justify-center">
                  <Thermometer className="text-white" size={32} />
                </div>
                <div className="text-4xl font-bold text-gray-400">+</div>
                <div className="w-16 h-16 bg-gradient-to-r from-cold-500 to-cold-600 rounded-2xl flex items-center justify-center">
                  <Snowflake className="text-white" size={32} />
                </div>
              </div>
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              The <span className="text-transparent bg-clip-text bg-gradient-to-r from-sauna-600 to-cold-600">Sauna & Cold</span> Community
            </h1>

            <p className="text-xl lg:text-2xl text-gray-600 mb-8 leading-relaxed">
              Building meaningful connections through shared wellness experiences.
              <br className="hidden sm:block" />
              Saunas. Ice Baths. Community.
            </p>

            <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-sauna-600 mb-2">Coffee</div>
                  <div className="text-gray-600">Warm connections over great coffee</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-cold-600 mb-2">Community</div>
                  <div className="text-gray-600">Build lasting friendships</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-sauna-600 mb-2">Cold Plunges</div>
                  <div className="text-gray-600">Transform through the cold</div>
                </div>
              </div>
            </div>

            {/* Email Signup */}
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Join the Waitlist</h3>
                  <p className="text-gray-600 mb-6">Be the first to know about our first event</p>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sauna-500 focus:border-transparent"
                      required
                    />
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="bg-gradient-to-r from-sauna-600 to-cold-600 text-white px-8 py-3 rounded-xl hover:from-sauna-700 hover:to-cold-700 transition-all duration-300 font-semibold disabled:opacity-50 flex items-center justify-center"
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>Join Waitlist <ArrowRight size={20} className="ml-2" /></>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <div className="max-w-md mx-auto bg-cold-50 border border-cold-200 rounded-2xl p-6">
                <div className="flex items-center justify-center mb-4">
                  <CheckCircle className="text-cold-600" size={48} />
                </div>
                <h3 className="text-2xl font-bold text-cold-800 mb-2">Welcome to the Community!</h3>
                <p className="text-cold-700">We'll notify you as soon as events start in your area.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">What We Do</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We create unforgettable wellness experiences that bring people together through the transformative power of heat and cold therapy.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-sauna-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Thermometer className="text-sauna-600" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Sauna Sessions</h3>
                    <p className="text-gray-600">Traditional Finnish saunas and infrared sessions to warm your body, relax your mind, and prepare for the cold.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-cold-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Snowflake className="text-cold-600" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Ice Bath Plunges</h3>
                    <p className="text-gray-600">Cold water immersion in natural settings and purpose-built ice baths. Experience the rush and recovery benefits.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Users className="text-gray-600" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Community Connection</h3>
                    <p className="text-gray-600">Meet like-minded wellness enthusiasts. Share experiences, support each other, and build lasting friendships.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-sauna-200 via-gray-100 to-cold-200 p-8">
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🔥❄️</div>
                    <p className="text-lg font-semibold text-gray-800">Sauna & Cold Therapy</p>
                    <p className="text-gray-600 mt-2">The ultimate wellness combination</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}