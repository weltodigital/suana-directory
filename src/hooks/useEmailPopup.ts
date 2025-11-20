'use client'

import { useState, useEffect } from 'react'

interface UseEmailPopupOptions {
  delay?: number // Time delay in milliseconds before showing popup
  scrollThreshold?: number // Scroll percentage (0-1) to trigger popup
  exitIntentEnabled?: boolean // Show popup on exit intent
  storageKey?: string // Local storage key to track if user already saw popup
}

export function useEmailPopup({
  delay = 30000, // 30 seconds default
  scrollThreshold = 0.5, // 50% scroll default
  exitIntentEnabled = true,
  storageKey = 'email-popup-shown'
}: UseEmailPopupOptions = {}) {
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [hasTriggered, setHasTriggered] = useState(false)

  useEffect(() => {
    // Check if user has already seen the popup
    const hasSeenPopup = localStorage.getItem(storageKey) === 'true'
    if (hasSeenPopup) return

    let timeoutId: NodeJS.Timeout
    let hasScrollTriggered = false

    // Time-based trigger
    if (delay > 0) {
      timeoutId = setTimeout(() => {
        if (!hasTriggered) {
          setIsPopupOpen(true)
          setHasTriggered(true)
        }
      }, delay)
    }

    // Scroll-based trigger
    const handleScroll = () => {
      if (hasScrollTriggered || hasTriggered) return

      const scrolled = window.scrollY
      const viewHeight = window.innerHeight
      const docHeight = document.documentElement.scrollHeight
      const scrollPercentage = scrolled / (docHeight - viewHeight)

      if (scrollPercentage >= scrollThreshold) {
        hasScrollTriggered = true
        setIsPopupOpen(true)
        setHasTriggered(true)
        if (timeoutId) clearTimeout(timeoutId)
      }
    }

    // Exit intent trigger (mouse leaving viewport)
    const handleMouseLeave = (e: MouseEvent) => {
      if (!exitIntentEnabled || hasTriggered) return

      // Only trigger if mouse is leaving from the top of the page
      if (e.clientY <= 0) {
        setIsPopupOpen(true)
        setHasTriggered(true)
        if (timeoutId) clearTimeout(timeoutId)
      }
    }

    // Add event listeners
    window.addEventListener('scroll', handleScroll, { passive: true })
    document.addEventListener('mouseleave', handleMouseLeave)

    // Cleanup
    return () => {
      if (timeoutId) clearTimeout(timeoutId)
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [delay, scrollThreshold, exitIntentEnabled, storageKey, hasTriggered])

  const closePopup = () => {
    setIsPopupOpen(false)
    // Mark as seen in localStorage
    localStorage.setItem(storageKey, 'true')
  }

  const openPopup = () => {
    setIsPopupOpen(true)
    setHasTriggered(true)
  }

  // Reset the popup state (useful for testing)
  const resetPopup = () => {
    localStorage.removeItem(storageKey)
    setHasTriggered(false)
    setIsPopupOpen(false)
  }

  return {
    isPopupOpen,
    closePopup,
    openPopup,
    resetPopup,
    hasTriggered
  }
}