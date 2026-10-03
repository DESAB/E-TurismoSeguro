import type { Metadata } from 'next'
import { site } from '../config/site'

interface PageSeo {
  /** Título de la página (el layout le añade "· E-TurismoSeguro") */
  title: string
  description: string
  /** Ruta canónica, p. ej. '/explorar' */
  path: string
  /** Imagen para compartir en redes (ruta del sitio o URL); por defecto, la del inicio */
  image?: string
  imageAlt?: string
}

/**
 * Metadata completa de una página. En Next, `openGraph` y `twitter` de una página reemplazan
 * por completo a los del layout (no se combinan), así que se repiten aquí siteName, locale, etc.
 */
export function pageMetadata({ title, description, path, image = site.defaultImage, imageAlt = title }: PageSeo): Metadata {
  // Las rutas relativas se resuelven con metadataBase (NEXT_PUBLIC_SITE_URL)
  const ogImage = { url: image, alt: imageAlt }
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      locale: site.locale,
      siteName: site.name,
      url: path,
      title,
      description,
      images: [ogImage],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  }
}

/** URL absoluta de una ruta del sitio (para JSON-LD, que no usa metadataBase). */
export function absoluteUrl(path: string): string {
  return path.startsWith('http') ? path : `${site.url}${path}`
}
