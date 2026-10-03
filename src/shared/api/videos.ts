// Videos de los destinos. Fuente: enlaces de YouTube del documento
// "SITIOS TURÍSTICOS DE LA REGIONAL METROPOLITANA DE LA SABANA.docx" (títulos y autores según YouTube).
// Fase 5: reemplazar por consultas a Supabase sin cambiar la firma.

export interface Video {
  id: string
  title: string
  /** "Municipio · Categoría" */
  subtitle: string
  /** Miniatura (URL) */
  img: string
  /** "m:ss"; vacío si no se conoce */
  duration: string
  featured: boolean
  /** Enlace para ver el video */
  url: string
  /** Canal que publicó el video */
  author?: string
}

const youtube = (id: string) => ({
  img: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
  url: `https://www.youtube.com/watch?v=${id}`,
})

const videos: Video[] = [
  { id: 'f7JbRSzF46M', title: 'Zipaquirá y todos sus encantos', subtitle: 'Zipaquirá · Patrimonio', duration: '', featured: true, author: 'Metrocuadrado Oficial', ...youtube('f7JbRSzF46M') },
  { id: 'aXDsaQ2LVcA', title: 'Balneario Termales El Zipa', subtitle: 'Tabio · Naturaleza', duration: '', featured: false, author: 'Prensa Tabio', ...youtube('aXDsaQ2LVcA') },
]

export function getVideos(): Video[] {
  return videos
}
