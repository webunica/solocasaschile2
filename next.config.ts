import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/comprar-casa-prefabricaca',
        destination: '/comprar-casa-prefabricada',
        permanent: true,
      },
      {
        source: '/comprar-casa-prefabricadas',
        destination: '/comprar-casa-prefabricada',
        permanent: true,
      },
      {
        source: '/comprar-casas-prefabricadas',
        destination: '/comprar-casa-prefabricada',
        permanent: true,
      },
      {
        source: '/construir-casas-prefabricadas',
        destination: '/construir-casa-prefabricada',
        permanent: true,
      },
      {
        source: '/construccion-de-casas-prefabricadas',
        destination: '/construccion-casas-prefabricadas',
        permanent: true,
      },
      {
        source: '/construir-casas-sip',
        destination: '/construir-casa-sip',
        permanent: true,
      },
      {
        source: '/comprar-casas-sip',
        destination: '/comprar-casa-sip',
        permanent: true,
      },
      {
        source: '/modelo-casa-sip',
        destination: '/modelos-casas-sip',
        permanent: true,
      },
      {
        source: '/modelos-casa-sip',
        destination: '/modelos-casas-sip',
        permanent: true,
      },
      {
        source: '/modelo-casa-prefabricada',
        destination: '/modelos-casas-prefabricadas',
        permanent: true,
      },
      {
        source: '/comprar-tiny-house',
        destination: '/comprar-casa-tiny-house',
        permanent: true,
      },
      {
        source: '/comprar-casas-tiny-house',
        destination: '/comprar-casa-tiny-house',
        permanent: true,
      },
      {
        source: '/construir-casa-tiny-house',
        destination: '/construir-tiny-house',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload', // 2 years
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY', // Prevent clickjacking
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff', // Prevent MIME-sniffing
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pereskyvymsyiqbihydj.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'pereskyvymsyiqbihydj.supabase.co',
        port: '',
        pathname: '/storage/v1/object/sign/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default withSentryConfig(nextConfig, {
  silent: true,
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  widenClientFileUpload: true,
  tunnelRoute: "/monitoring",
  telemetry: false,
});
