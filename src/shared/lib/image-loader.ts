'use client'

import type { ImageLoaderProps } from 'next/image'

// Loader global de next/image (configurado en next.config.ts → images.loaderFile).
// En Cloudflare Workers no hay `sharp`, así que el redimensionado lo hace el origen de la imagen:
// - Unsplash: su CDN (imgix) acepta ?w= y &auto=format (WebP/AVIF según el navegador).
// - Imágenes propias (/_next/static/…): se sirven tal cual.
// Fase 5: añadir aquí la rama de Supabase Storage (transformaciones) o Cloudflare Images.
export default function imageLoader({ src, width, quality }: ImageLoaderProps): string {
  if (src.startsWith('https://images.unsplash.com/')) {
    return `${src}?w=${width}&q=${quality ?? 75}&auto=format&fit=max`
  }
  return `${src}?w=${width}`
}
