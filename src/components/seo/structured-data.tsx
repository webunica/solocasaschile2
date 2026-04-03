import React from 'react';

interface StructuredDataProps {
  type: string;
  data: Record<string, any>;
}

export function StructuredData({ type, data }: StructuredDataProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": type,
          ...data,
        }),
      }}
    />
  );
}

/** Helper: builds a rich House/Residence JSON-LD object from model data */
export function buildModelJsonLd(modelo: {
  nombre: string;
  descripcion?: string | null;
  imagenes_urls?: string[];
  precio_desde_uf?: number;
  superficie_m2?: number;
  dormitorios?: number;
  banos?: number;
  pisos?: number;
  tiempo_entrega?: string | null;
  garantia_anos?: number | null;
  recintos?: string[] | null;
  tipo?: string;
  uso?: string | null;
  terminaciones?: Record<string, string> | null;
  aislacion?: { calificacion_energetica?: string } | null;
  slug: string;
  constructora?: {
    nombre?: string;
    sitio_web?: string | null;
    logo_url?: string | null;
  } | null;
}) {
  const baseUrl = 'https://solocasaschile.com';
  const amenities: any[] = [];

  // Add terminaciones as amenity features
  if (modelo.terminaciones) {
    const labels: Record<string, string> = {
      ventanas: 'Ventanas',
      puertas_exteriores: 'Puerta exterior',
      cocina: 'Cocina equipada',
      bano_principal: 'Baño principal',
      pisos: 'Pisos',
      climatizacion: 'Climatización',
    };
    for (const [k, label] of Object.entries(labels)) {
      const val = (modelo.terminaciones as any)[k];
      if (val) {
        amenities.push({
          "@type": "LocationFeatureSpecification",
          "name": label,
          "value": val,
        });
      }
    }
  }

  // Energy class
  if (modelo.aislacion?.calificacion_energetica) {
    amenities.push({
      "@type": "LocationFeatureSpecification",
      "name": "Calificación Energética",
      "value": modelo.aislacion.calificacion_energetica,
    });
  }

  // Recintos
  if (modelo.recintos?.length) {
    amenities.push({
      "@type": "LocationFeatureSpecification",
      "name": "Recintos incluidos",
      "value": modelo.recintos.join(", "),
    });
  }

  const jsonLd: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": "House",
    "name": modelo.nombre,
    "description": modelo.descripcion || undefined,
    "url": `${baseUrl}/modelo/${modelo.slug}`,
    "image": modelo.imagenes_urls?.[0] || undefined,
    "numberOfRooms": modelo.dormitorios || undefined,
    "numberOfBedrooms": modelo.dormitorios || undefined,
    "numberOfBathroomsTotal": modelo.banos || undefined,
    "numberOfFullBathrooms": modelo.banos || undefined,
    "floorSize": modelo.superficie_m2
      ? { "@type": "QuantitativeValue", "value": modelo.superficie_m2, "unitCode": "MTK" }
      : undefined,
    "numberOfFloors": modelo.pisos || 1,
    "leaseLength": modelo.tiempo_entrega ? { "@type": "QuantitativeValue", "value": modelo.tiempo_entrega } : undefined,
    "offers": {
      "@type": "Offer",
      "priceCurrency": "CLF",
      "price": modelo.precio_desde_uf,
      "availability": "https://schema.org/InStock",
      "seller": modelo.constructora
        ? {
            "@type": "Organization",
            "name": modelo.constructora.nombre,
            "url": modelo.constructora.sitio_web || undefined,
            "logo": modelo.constructora.logo_url || undefined,
          }
        : undefined,
    },
    "amenityFeature": amenities.length ? amenities : undefined,
  };

  // Clean undefined values
  Object.keys(jsonLd).forEach(k => jsonLd[k] === undefined && delete jsonLd[k]);

  return jsonLd;
}

/** Helper: builds a BreadcrumbList JSON-LD */
export function buildBreadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url,
    })),
  };
}

/** Helper: builds an Organization JSON-LD for the homepage */
export function buildOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "SolocasasChile",
    "url": "https://solocasaschile.com",
    "logo": "https://solocasaschile.com/images/logo.png",
    "description": "El comparador inteligente de casas prefabricadas, SIP, container y llave en mano en Chile.",
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "email": "solicitud@solocasaschile.com",
      "availableLanguage": "Spanish",
    },
    "sameAs": [
      "https://www.instagram.com/solocasaschile",
      "https://www.facebook.com/solocasaschile",
    ],
    "areaServed": { "@type": "Country", "name": "Chile" },
  };
}

/** Helper: builds a WebSite JSON-LD with SearchAction (sitelinks searchbox) */
export function buildWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "SolocasasChile",
    "url": "https://solocasaschile.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://solocasaschile.com/catalogo?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/** Helper: builds a FAQPage JSON-LD */
export function buildFAQJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
      },
    })),
  };
}

