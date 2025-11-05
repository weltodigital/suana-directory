interface SchemaMarkupProps {
  type: 'website' | 'organization' | 'localbusiness' | 'webpage'
  data?: any
}

export default function SchemaMarkup({ type, data }: SchemaMarkupProps) {
  const getSchema = () => {
    switch (type) {
      case 'website':
        return {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Sauna & Cold Directory UK",
          "alternateName": "UK Sauna Directory",
          "url": "https://saunaandcold.co.uk",
          "description": "The UK's premier directory of saunas, cold plunge pools, ice baths, and wellness facilities across England, Scotland, and Wales.",
          "potentialAction": {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": "https://saunaandcold.co.uk/search?q={search_term_string}"
            },
            "query-input": "required name=search_term_string"
          },
          "publisher": {
            "@type": "Organization",
            "name": "Sauna & Cold Directory UK",
            "url": "https://saunaandcold.co.uk"
          }
        }

      case 'organization':
        return {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Sauna & Cold Directory UK",
          "alternateName": "UK Sauna Directory",
          "url": "https://saunaandcold.co.uk",
          "logo": "https://saunaandcold.co.uk/logo.png",
          "description": "The UK's most comprehensive directory for saunas, cold plunge pools, ice baths, and wellness facilities.",
          "foundingDate": "2024",
          "areaServed": [
            {
              "@type": "Country",
              "name": "United Kingdom"
            }
          ],
          "serviceType": [
            "Directory Service",
            "Wellness Facility Directory",
            "Sauna Directory",
            "Cold Therapy Directory"
          ],
          "knowsAbout": [
            "Saunas",
            "Cold Plunge Pools",
            "Ice Baths",
            "Wellness Centres",
            "Thermal Therapy",
            "Heat Therapy",
            "Cold Water Therapy",
            "Spa Facilities"
          ]
        }

      case 'localbusiness':
        return {
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "@id": "https://saunaandcold.co.uk",
          "name": "Sauna & Cold Directory UK",
          "description": "Premier directory service for finding saunas, cold plunge pools, ice baths, and wellness facilities across the UK.",
          "url": "https://saunaandcold.co.uk",
          "telephone": "0203 123 4567",
          "email": "info@saunaandcold.co.uk",
          "address": {
            "@type": "PostalAddress",
            "addressCountry": "GB",
            "addressRegion": "England"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": "54.7023545",
            "longitude": "-3.2765753"
          },
          "areaServed": {
            "@type": "Country",
            "name": "United Kingdom"
          },
          "serviceArea": {
            "@type": "Country",
            "name": "United Kingdom"
          },
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Wellness Facility Directory Services",
            "itemListElement": [
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Sauna Directory Listings",
                  "description": "Comprehensive directory of sauna facilities across the UK"
                }
              },
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Cold Plunge Directory Listings",
                  "description": "Directory of cold plunge pools and ice bath facilities"
                }
              },
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Wellness Centre Directory",
                  "description": "Complete guide to wellness centres and spa facilities"
                }
              }
            ]
          }
        }

      case 'webpage':
        return {
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": data?.name || "Sauna Directory Page",
          "description": data?.description || "Find saunas and wellness facilities",
          "url": data?.url || "https://saunaandcold.co.uk",
          "mainEntity": {
            "@type": "ItemList",
            "name": "Sauna Facilities",
            "description": "List of sauna and wellness facilities",
            "numberOfItems": data?.numberOfItems || 0
          },
          "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": data?.breadcrumbs || []
          },
          "isPartOf": {
            "@type": "WebSite",
            "name": "Sauna & Cold Directory UK",
            "url": "https://saunaandcold.co.uk"
          }
        }

      default:
        return {}
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(getSchema()) }}
    />
  )
}