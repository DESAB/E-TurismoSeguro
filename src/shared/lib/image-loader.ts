'use client'

import type { ImageLoaderProps } from 'next/image'

// Loader global de next/image (configurado en next.config.ts → images.loaderFile).
// En Cloudflare Workers no hay `sharp`, así que las imágenes no se redimensionan en el servidor:
// - Fotos propias (/destinos/…): ya están optimizadas (máx. 1600 px, JPEG) y se sirven tal cual.
// - Miniaturas de YouTube (i.ytimg.com): se sirven tal cual.
// Fase 5: con fotos en Supabase Storage o Cloudflare Images, devolver aquí la URL con el ancho pedido.
export default function imageLoader({ src, width }: ImageLoaderProps): string {
  return `${src}${src.includes('?') ? '&' : '?'}w=${width}`
}
