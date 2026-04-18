import React from 'react';

interface StructuredDataProps {
  type: string;
  data: Record<string, unknown>;
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
  const amenities: Array<Record<string, string>> = [];

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
      const val = modelo.terminaciones[k];
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

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": ["House", "Product"],
    "name": modelo.nombre,
    "sku": `SCCH-${modelo.slug.substring(0, 8).toUpperCase()}`,
    "brand": {
      "@type": "Brand",
      "name": modelo.constructora?.nombre || "SolocasasChile"
    },
    "description": modelo.descripcion || `Casa ${modelo.tipo} de alta eficiencia en Chile.`,
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
    "offers": {
      "@type": "Offer",
      "priceCurrency": "CLF",
      "price": modelo.precio_desde_uf || 0,
      "priceValidUntil": "2026-12-31",
      "url": `${baseUrl}/modelo/${modelo.slug}`,
      "availability": "https://schema.org/InStock",
      "itemCondition": "https://schema.org/NewCondition",
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

/** Helper: builds BlogPosting JSON-LD for editorial pages */
export function buildBlogPostingJsonLd(post: {
  title: string;
  excerpt?: string | null;
  slug: string;
  cover_image_url?: string | null;
  created_at: string;
  category?: string | null;
}) {
  const baseUrl = "https://solocasaschile.com";

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt || undefined,
    "image": post.cover_image_url || undefined,
    "datePublished": post.created_at,
    "dateModified": post.created_at,
    "articleSection": post.category || "Casas prefabricadas",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${baseUrl}/blog/${post.slug}`,
    },
    "author": {
      "@type": "Organization",
      "name": "SolocasasChile",
      "url": baseUrl,
    },
    "publisher": {
      "@type": "Organization",
      "name": "SolocasasChile",
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/images/logo.png`,
      },
    },
  };
}

/** Helper: builds an ItemList JSON-LD for collection pages (like catalog or directory) */
export function buildItemListJsonLd(items: { name: string; url: string; image?: string; description?: string }[], typeName: string = "ItemList") {
  return {
    "@context": "https://schema.org",
    "@type": typeName,
    "itemListElement": items.map((item, index) => {
      const listItem: Record<string, unknown> = {
        "@type": "ListItem",
        "position": index + 1,
        "name": item.name,
        "url": item.url,
      };
      
      if (item.image) listItem.image = item.image;
      if (item.description) listItem.description = item.description;

      return listItem;
    }),
  };
}

