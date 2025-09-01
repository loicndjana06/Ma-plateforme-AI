/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuration optimisée pour production
  experimental: {
    optimizeCss: true,
  },
  
  // Images configuration
  images: {
    domains: [
      'images.unsplash.com',
      'lh3.googleusercontent.com', // Pour les avatars Google
      'avatars.githubusercontent.com', // Pour les avatars GitHub
      'cdn.openai.com', // Si vous utilisez des images d'OpenAI
    ],
    formats: ['image/webp', 'image/avif'],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Headers de sécurité
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'geolocation=(), microphone=(), camera=()'
          }
        ]
      }
    ]
  },

  // Redirections automatiques
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      {
        source: '/login',
        destination: '/auth/login',
        permanent: true,
      },
    ]
  },

  // Webpack configuration pour optimisation
  webpack: (config, { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }) => {
    // Optimisations pour la production
    if (!dev && !isServer) {
      config.optimization.splitChunks.chunks = 'all'
      
      // Réduire la taille des bundles
      config.optimization.splitChunks.cacheGroups = {
        ...config.optimization.splitChunks.cacheGroups,
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          chunks: 'all',
          priority: 1,
        },
        common: {
          name: 'common',
          minChunks: 2,
          chunks: 'all',
          priority: 0,
        },
      }
    }

    // Support pour les imports de fichiers
    config.module.rules.push({
      test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/i,
      type: 'asset',
    })

    return config
  },

  // Configuration du build
  compiler: {
    // Supprimer les console.log en production
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
    
    // Minification avancée
    styledComponents: true,
  },

  // Configuration ESLint
  eslint: {
    // Ignorer ESLint pendant le build (optionnel)
    ignoreDuringBuilds: false,
  },

  // Configuration TypeScript
  typescript: {
    // Ignorer les erreurs TypeScript pendant le build (pas recommandé)
    ignoreBuildErrors: false,
  },

  // Variables d'environnement publiques

  // Configuration pour les API routes
  async rewrites() {
    return [
      {
        source: '/api/health',
        destination: '/api/health',
      },
    ]
  },

  // Configuration PWA (Progressive Web App)
  async generateBuildId() {
    // Vous pouvez personnaliser l'ID de build
    return 'my-build-id-' + Date.now()
  },

  // Configuration pour les bundles
  productionBrowserSourceMaps: false, // Désactiver les sourcemaps en prod

  // Configuration pour les assets statiques
  trailingSlash: false,
  
  // Configuration pour les bases de données et APIs externes
  serverRuntimeConfig: {
    // Variables côté serveur uniquement
    secret: process.env.SECRET,
  },
  
  publicRuntimeConfig: {
    // Variables accessibles côté client
    staticFolder: '/static',
  },
}

module.exports = nextConfig