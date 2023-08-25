/** @type {import('next').NextConfig} */

const withPWA = require('next-pwa')({
  dest: 'public'
})

module.exports = withPWA({
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com'
      }
    ]
  }
})
