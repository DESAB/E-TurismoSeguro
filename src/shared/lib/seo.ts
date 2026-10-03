import type { Metadata } from 'next'
import { site } from '../config/site'
import { unsplashUrl } from './unsplash'

interface PageSeo {
  /** Título de la página (el layout le añade "· E-TurismoSeguro") */
  title: string
  description: string
  /** Ruta canónica, p. ej. '/explorar' */
  path: string
  /** ID de Unsplash para la imagen al compartir; por defecto, el hero del inicio */
  imageId?: string
  imageAlt?: string
}

/**
 * Metadata completa de una página. En Next, `openGraph` y `twitter` de una página reemplazan
 * por completo a los del layout (no se combinan), así que se repiten aquí siteName, locale, etc.
 */
export function pageMetadata({ title, description, path, imageId = site.defaultImageId, imageAlt = title }: PageSeo): Metadata {
  const image = { url: unsplashUrl(imageId, 1200, 630), width: 1200, height: 630, alt: imageAlt }
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
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image.url],
    },
  }
}
