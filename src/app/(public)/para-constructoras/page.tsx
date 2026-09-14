import type { Metadata } from "next";
import { ParaConstructorasClient } from "./client";

export const metadata: Metadata = {
  title: "Para Constructoras | Publica tus Modelos y Recibe Cotizaciones en Chile",
  description:
    "Conoce cómo funciona SolocasasChile para constructoras. Publica tus modelos de casas prefabricadas y SIP, recibe cotizaciones directas en tu panel y conoce nuestros planes Gratis y Pro.",
  alternates: {
    canonical: "https://solocasaschile.com/para-constructoras",
  },
  openGraph: {
    title: "Para Constructoras | Publica tus Modelos en SolocasasChile",
    description:
      "Publica tus casas prefabricadas y SIP en el catálogo chileno. Prueba gratis por 30 días o activa el Plan Pro para mayor alcance.",
    url: "https://solocasaschile.com/para-constructoras",
    siteName: "SolocasasChile",
    locale: "es_CL",
    type: "website",
  },
};

export default function ParaConstructorasPage() {
  return <ParaConstructorasClient />;
}
