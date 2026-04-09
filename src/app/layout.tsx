import type { Metadata, Viewport } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceSans = Space_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  preload: true,
});

const spaceHeading = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
  preload: true,
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f0f0f" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL('https://solocasaschile.com'),
  title: {
    default: "SolocasasChile | El comparador de casas prefabricadas en Chile",
    template: "%s | SolocasasChile"
  },
  description: "Compara modelos de casas prefabricadas, SIP, containers y llave en mano. Encuentra la mejor constructora verificada en Chile.",
  keywords: [
    "casas prefabricadas chile",
    "casas sip chile",
    "casas modulares chile",
    "casas container chile",
    "constructoras casas prefabricadas",
    "comprar casa prefabricada",
    "casas económicas chile",
    "viviendas prefabricadas",
    "casas llave en mano",
    "solocasaschile",
  ],
  authors: [{ name: "SolocasasChile", url: "https://solocasaschile.com" }],
  creator: "SolocasasChile",
  publisher: "SolocasasChile",
  category: "Real Estate",
  openGraph: {
    type: "website",
    locale: "es_CL",
    url: "https://solocasaschile.com",
    siteName: "SolocasasChile",
    title: "SolocasasChile | El comparador de casas prefabricadas en Chile",
    description: "Compara cientos de modelos de casas prefabricadas, descubre constructoras verificadas y cotiza online con facilidad.",
    images: [{
      url: "/og-image.jpg",
      width: 1200,
      height: 630,
      alt: "SolocasasChile: Comparador de Casas Prefabricadas en Chile"
    }]
  },
  twitter: {
    card: "summary_large_image",
    site: "@solocasaschile",
    creator: "@solocasaschile",
    title: "SolocasasChile | Comparador de Casas Prefabricadas",
    description: "La forma más fácil e inteligente de comprar tu nueva casa prefabricada en Chile.",
    images: ["/twitter-image.jpg"]
  },
  manifest: "/site.webmanifest",
  alternates: {
    canonical: "https://solocasaschile.com",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

import { ThemeProvider } from "@/components/theme-provider";
import { WhatsAppWidget } from "@/components/common/whatsapp-widget";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { AuthErrorHandler } from "@/components/common/auth-error-handler";
import { GoogleAnalytics } from '@next/third-parties/google';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${spaceSans.variable} ${spaceHeading.variable} font-sans antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <AnnouncementBar />
          <AuthErrorHandler />
          {children}
          <WhatsAppWidget />
        </ThemeProvider>
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  );
}
