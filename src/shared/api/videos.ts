// Datos locales de videos (copiados del prototipo de Figma Make).
// Fase 5: reemplazar por consultas a Supabase sin cambiar la firma.

export interface Video {
  id: string
  title: string
  subtitle: string
  /** ID de foto de Unsplash usada como miniatura */
  img: string
  duration: string
  featured: boolean
}

const videos: Video[] = [
  { id: 'v1', title: 'Catedral de Sal — Una maravilla subterránea', subtitle: 'Zipaquirá · Patrimonio',       img: '1724027212141-7244bc12678a', duration: '4:32', featured: true  },
  { id: 'v2', title: 'Laguna de Neusa — Naturaleza en el páramo',   subtitle: 'Cogua · Naturaleza',           img: '1761542547086-fbeb20f23e3a', duration: '3:18', featured: false },
  { id: 'v3', title: 'La Sabana desde el aire',                      subtitle: 'Cundinamarca · Territorio',    img: '1568489711036-9c94a7d5aea6', duration: '5:47', featured: false },
  { id: 'v4', title: 'Ruta de la sal — Nemocón y Zipaquirá',         subtitle: 'Nemocón · Patrimonio',         img: '1756354149164-a573e5125d32', duration: '6:14', featured: false },
  { id: 'v5', title: 'Lagunas de Siecha — Sendero sagrado',          subtitle: 'Guasca · Naturaleza',          img: '1742648816955-047429b281bf', duration: '4:55', featured: false },
  { id: 'v6', title: 'Chía — Ciudad de la Luna',                     subtitle: 'Chía · Cultura',               img: '1700769670643-14361ffa6dfe', duration: '3:42', featured: false },
  { id: 'v7', title: 'Guía de seguridad para viajeros',              subtitle: 'Policía Nacional · Seguridad', img: '1568796687013-b5a1eb6b46c6', duration: '2:30', featured: false },
]

export function getVideos(): Video[] {
  return videos
}
