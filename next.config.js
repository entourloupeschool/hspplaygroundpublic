/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    oWKey: process.env.OPENWEATHERMAP_API_KEY,
    mapboxKey: process.env.MAPBOX_API_KEY,
  },
}

module.exports = nextConfig
