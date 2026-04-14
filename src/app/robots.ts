import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard/', '/api/', '/login', '/register', '/auth/'],
      },
    ],
    sitemap: 'https://solocasaschile.com/sitemap.xml',
    host: 'https://solocasaschile.com',
  }
}
