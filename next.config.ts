import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  // swcMinify is no longer needed in Next.js 16 - Turbopack handles minification automatically
  // Turbopack is the default bundler in Next.js 16 for both dev and build
  // No explicit configuration needed - it works automatically
  output: 'standalone',

  // Optimizaciones adicionales de bundle (Next.js 16 maneja esto automáticamente con Turbopack)
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080], // Optimizado para móvil, remover tamaños grandes innecesarios
    // Optimizado para móvil
    imageSizes: [16, 32, 48, 64, 96, 128, 256], // Remover 384 ya que no es necesario
    // Aumentar cache para mejor rendimiento
    minimumCacheTTL: 31536000, // 1 año para mejor caching
    // Next.js 16 default qualities is [75], optimizado para móvil
    qualities: [75, 85, 90, 100],
  },
  experimental: {
    // Tree-shaking agresivo para paquetes comunes
    optimizePackageImports: [
      'lucide-react',
      'clsx',
      'tailwind-merge',
    ],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Removed experimental.optimizeCss - not stable in Next.js 16 and incompatible with App Router
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/logo.webp",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
