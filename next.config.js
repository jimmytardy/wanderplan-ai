const createNextIntlPlugin = require('next-intl/plugin')(
  './i18n.ts'
)

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Configuration pour Docker - output standalone
  output: 'standalone',
  // Configuration pour les variables d'environnement
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
}

module.exports = createNextIntlPlugin(nextConfig)
