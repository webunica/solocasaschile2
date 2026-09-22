import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'SolocasasChile — Viviendas Prefabricadas',
    short_name: 'SolocasasChile',
    description: 'La plataforma líder de casas prefabricadas, SIP y modulares en Chile.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#082c30',
    icons: [
      {
        src: '/icon.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/favicon.png',
        sizes: '200x200',
        type: 'image/png',
      },
    ],
  }
}
