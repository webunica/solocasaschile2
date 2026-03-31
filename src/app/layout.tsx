import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-heading",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://solocasaschile.com'),
  title: {
    default: "SolocasasChile | El comparador de casas prefabricadas en Chile",
    template: "%s | SolocasasChile"
  },
  description: "Compara modelos de casas prefabricadas, SIP, containers y llave en mano. Encuentra la mejor constructora verificada en Chile.",
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
      alt: "SolocasasChile Portada"
    }]
  },
  twitter: {
    card: "summary_large_image",
    title: "SolocasasChile",
    description: "La forma más fácil e inteligente de comprar tu nueva casa prefabricada.",
    images: ["/twitter-image.jpg"]
  },
  manifest: "/site.webmanifest",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${outfit.variable} font-sans antialiased bg-background text-foreground`}
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
      </body>
    </html>
  );
}
