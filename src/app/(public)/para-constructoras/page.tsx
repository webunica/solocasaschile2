import type { Metadata } from "next";
import { ParaConstructorasClient } from "./client";

export const metadata: Metadata = {
  title: "Para Constructoras | Publica tus Modelos y Accede a Clientes Potenciales en Chile",
  description:
    "Conoce cómo funciona SolocasasChile para constructoras. No pagas por aparecer, pagas por acceder a clientes potenciales. Conoce nuestros planes Basic, Crece, Pro y Pro+.",
  alternates: {
    canonical: "https://solocasaschile.com/para-constructoras",
  },
  openGraph: {
    title: "Para Constructoras | Publica tus Modelos en SolocasasChile",
    description:
      "Accede a clientes potenciales en tu región con nuestros planes Basic, Crece, Pro y Pro+. Comienza hoy o prueba gratis por 30 días.",
    url: "https://solocasaschile.com/para-constructoras",
    siteName: "SolocasasChile",
    locale: "es_CL",
    type: "website",
  },
};

export default function ParaConstructorasPage() {
  return <ParaConstructorasClient />;
}
