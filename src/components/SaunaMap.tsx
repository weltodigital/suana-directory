'use client'

import { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default markers
import icon from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'

const DefaultIcon = L.icon({
  iconUrl: icon.src,
  shadowUrl: iconShadow.src,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

L.Marker.prototype.options.icon = DefaultIcon

// Custom sauna icon
const createSaunaIcon = () => {
  return L.divIcon({
    className: 'custom-sauna-marker',
    html: `
      <div style="
        background-color: #cc8d5f;
        border: 3px solid white;
        border-radius: 50%;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      ">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
          <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2M21 9V7L15 1H9C7.9 1 7 1.9 7 3V9C7 10.1 7.9 11 9 11V13H7V15H9V16H11V15H13V16H15V15H17V13H15V11C16.1 11 17 10.1 17 9V7H19V9H17V11H19V13H21V11H19V9H21Z"/>
        </svg>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24]
  })
}

interface SaunaMapProps {
  saunas: Array<{
    id: string
    name: string
    latitude?: number
    longitude?: number
    address?: string
    city?: string
    rating?: number
    website?: string
  }>
  center?: [number, number]
  zoom?: number
  height?: string
  className?: string
}

// Component to handle map centering and bounds
function MapBounds({ saunas, center }: { saunas: SaunaMapProps['saunas'], center?: [number, number] }) {
  const map = useMap()

  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom())
      return
    }

    const validSaunas = saunas.filter(s => s.latitude && s.longitude)
    if (validSaunas.length === 0) return

    if (validSaunas.length === 1) {
      map.setView([validSaunas[0].latitude!, validSaunas[0].longitude!], 13)
    } else {
      const bounds = L.latLngBounds(
        validSaunas.map(s => [s.latitude!, s.longitude!])
      )
      map.fitBounds(bounds, { padding: [20, 20] })
    }
  }, [map, saunas, center])

  return null
}

export default function SaunaMap({
  saunas,
  center,
  zoom = 10,
  height = '400px',
  className = ''
}: SaunaMapProps) {
  const validSaunas = saunas.filter(s => s.latitude && s.longitude)

  // Default center to UK if no center provided and no valid saunas
  const defaultCenter: [number, number] = center || [54.5, -3.0] // Center of UK

  if (validSaunas.length === 0) {
    // If we have a specific center (like for individual sauna), show map anyway
    if (center) {
      return (
        <div className={`rounded-lg overflow-hidden shadow-lg ${className}`} style={{ height }}>
          <MapContainer
            center={center}
            zoom={zoom}
            style={{ height: '100%', width: '100%' }}
            className="z-0"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </MapContainer>
        </div>
      )
    }

    return (
      <div className={`bg-gray-100 rounded-lg flex items-center justify-center ${className}`} style={{ height }}>
        <div className="text-center">
          <p className="text-gray-500 mb-2">Map Coming Soon</p>
          <p className="text-gray-400 text-sm">Location coordinates are being added to our database</p>
          <p className="text-gray-400 text-sm">({saunas.length} saunas found, {validSaunas.length} with coordinates)</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`rounded-lg overflow-hidden shadow-lg ${className}`} style={{ height }}>
      <MapContainer
        center={defaultCenter}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapBounds saunas={validSaunas} center={center} />

        {validSaunas.map((sauna) => (
          <Marker
            key={sauna.id}
            position={[sauna.latitude!, sauna.longitude!]}
            icon={createSaunaIcon()}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                <h3 className="font-bold text-gray-900 mb-1">{sauna.name}</h3>
                {sauna.address && (
                  <p className="text-sm text-gray-600 mb-2">{sauna.address}</p>
                )}
                {sauna.rating && (
                  <div className="flex items-center mb-2">
                    <span className="text-yellow-500 mr-1">★</span>
                    <span className="text-sm font-semibold">{sauna.rating}</span>
                  </div>
                )}
                {sauna.website && (
                  <a
                    href={sauna.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-sauna-600 text-white px-3 py-1 rounded text-xs hover:bg-sauna-700 transition-colors"
                  >
                    Visit Website
                  </a>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}