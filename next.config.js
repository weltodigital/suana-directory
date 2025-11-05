/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: [
      'images.unsplash.com',
      'via.placeholder.com',
      'lh3.googleusercontent.com',
      'streetviewpixels-pa.googleapis.com',
      'maps.googleapis.com',
      'googleusercontent.com',
      'cdn.worldota.net',
      'dynamic-media-cdn.tripadvisor.com',
      'images.trvl-media.com'
    ],
  },
}