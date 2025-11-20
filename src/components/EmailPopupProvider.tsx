'use client'

import { useEmailPopup } from '@/hooks/useEmailPopup'
import EmailPopup from './EmailPopup'

export default function EmailPopupProvider() {
  const { isPopupOpen, closePopup } = useEmailPopup({
    delay: 15000, // Show after 15 seconds
    scrollThreshold: 0.4, // Show after 40% scroll
    exitIntentEnabled: true,
    storageKey: 'sauna-email-popup-shown'
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
          source: 'popup' // Track that this came from popup
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        // If it's a duplicate email, that's actually fine - don't show error
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
    <EmailPopup
      isOpen={isPopupOpen}
      onClose={closePopup}
      onSubmit={handleEmailSubmit}
    />
  )
}