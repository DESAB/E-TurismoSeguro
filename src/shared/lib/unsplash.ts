/** URL de una foto de Unsplash recortada al tamaño pedido. */
export function unsplashUrl(photoId: string, width: number, height: number): string {
  return `https://images.unsplash.com/photo-${photoId}?w=${width}&h=${height}&fit=crop&auto=format`
}
