/** URL base de una foto de Unsplash, para `next/image` (el loader añade el ancho). */
export function unsplashSrc(photoId: string): string {
  return `https://images.unsplash.com/photo-${photoId}`
}

/** URL de una foto de Unsplash recortada a un tamaño fijo (para `<img>` y Open Graph). */
export function unsplashUrl(photoId: string, width: number, height: number): string {
  return `${unsplashSrc(photoId)}?w=${width}&h=${height}&fit=crop&auto=format`
}
