import { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'

// Base URL for the site
const baseUrl = 'https://saunaandcold.co.uk'

// Helper function to create URL-safe slugs
function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .trim()
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
    return createSlug(sauna.name + ' ' + sauna.city)
  }

  return baseSlug
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const currentDate = new Date().toISOString()

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/saunas`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms-of-service`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/cookie-policy`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
  ]

  try {
    // Get all saunas for individual sauna pages
    const { data: allSaunas } = await supabase
      .from('facilities')
      .select('id, name, city, county, updated_at')
      .eq('facility_type', 'sauna')

    // Get unique counties for county pages
    const { data: counties } = await supabase
      .from('facilities')
      .select('county')
      .eq('facility_type', 'sauna')

    // Get unique cities for city pages
    const { data: cities } = await supabase
      .from('facilities')
      .select('city, county')
      .eq('facility_type', 'sauna')

    const saunaPages = allSaunas ? allSaunas.map(sauna => ({
      url: `${baseUrl}/sauna/${createUniqueSlug(sauna, allSaunas)}`,
      lastModified: sauna.updated_at || currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })) : []

    // County pages
    const countySet = new Set(counties?.map(c => c.county) || [])
    const uniqueCounties = Array.from(countySet)
    const countyPages = uniqueCounties.map(county => ({
      url: `${baseUrl}/saunas/${createSlug(county)}`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

    // City pages
    const uniqueCities = cities ? cities.reduce((acc: any[], city) => {
      const existing = acc.find(c => c.city === city.city && c.county === city.county)
      if (!existing) {
        acc.push(city)
      }
      return acc
    }, []) : []

    const cityPages = uniqueCities.map(city => ({
      url: `${baseUrl}/saunas/${createSlug(city.county)}/${createSlug(city.city)}`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

    return [
      ...staticPages,
      ...countyPages,
      ...cityPages,
      ...saunaPages,
    ]

  } catch (error) {
    console.error('Error generating sitemap:', error)
    // Return static pages only if database query fails
    return staticPages
  }
}