'use client'

import { useState } from 'react'
import { useEmailPopup } from '@/hooks/useEmailPopup'
import EmailPopup from '@/components/EmailPopup'

export default function TestPopupPage() {
  const { isPopupOpen, closePopup, openPopup, resetPopup } = useEmailPopup({
    delay: 5000, // 5 seconds for testing
    scrollThreshold: 0.3, // 30% scroll
    exitIntentEnabled: true,
    storageKey: 'test-popup-shown'
  })

  const handleEmailSubmit = async (email: string) => {
    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          source: 'test-popup'
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 409) {
          return // Email already exists, treat as success
        }
        throw new Error(data.error || 'Failed to join waitlist')
      }

      return data
    } catch (error) {
      console.error('Error submitting email:', error)
      throw error
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">
            Email Popup Test Page
          </h1>

          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Test Controls</h2>
            <div className="flex gap-4 flex-wrap">
              <button
                onClick={openPopup}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Open Popup
              </button>
              <button
                onClick={resetPopup}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Reset Popup State
              </button>
              <button
                onClick={closePopup}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Close Popup
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-4">How to Test</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li><strong>Time-based trigger:</strong> Wait 5 seconds and the popup should appear automatically</li>
              <li><strong>Scroll trigger:</strong> Scroll down 30% of the page to trigger the popup</li>
              <li><strong>Exit intent:</strong> Move your mouse quickly to the top of the browser window to trigger</li>
              <li><strong>Manual trigger:</strong> Click "Open Popup" button above</li>
              <li><strong>Reset state:</strong> Click "Reset Popup State" to clear localStorage and allow triggers again</li>
            </ul>
          </div>

          {/* Add content to enable scrolling */}
          <div className="space-y-8">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-xl font-semibold mb-4">Content Block {i}</h3>
                <p className="text-gray-700 leading-relaxed">
                  This is content block {i}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                  veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                  nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
                  officia deserunt mollit anim id est laborum.
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <EmailPopup
        isOpen={isPopupOpen}
        onClose={closePopup}
        onSubmit={handleEmailSubmit}
      />
    </div>
  )
}