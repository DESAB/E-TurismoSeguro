// Fotos del Grupo de Protección al Turismo y Patrimonio Nacional (DESAB), entregadas por la Policía.
// Originales en Sitios/Fotos-policia (fuera del repo). Pies de foto tomados del nombre de cada archivo;
// donde el archivo no decía el lugar, no se inventa.

export interface PolicePhoto {
  src: string
  caption: string
  width: number
  height: number
}

const p = (file: string, caption: string, width: number, height: number): PolicePhoto => ({ src: `/policia/${file}.jpg`, caption, width, height })

/** En orden de presentación: las más representativas primero. */
const photos: PolicePhoto[] = [
  p('jaime-duque', 'Acompañamiento a familias en el Parque Jaime Duque, Tocancipá', 1600, 1200),
  p('catedral-de-sal', 'Acompañamiento a visitantes en la Catedral de Sal, Zipaquirá', 1600, 1200),
  p('festival', 'Acompañamiento durante un festival al aire libre', 1184, 1052),
  p('desierto-de-checua', 'Atención a visitantes en el Desierto de Checua, Nemocón', 1600, 1200),
  p('campana-patrimonio', 'Campaña de protección al patrimonio en la Catedral de Sal, Zipaquirá', 1600, 1200),
  p('turismo-cultural', 'Turismo cultural: acompañamiento a la pintura de un mural', 989, 1200),
  p('humedal-tocancipa', 'Recorrido por un humedal en Tocancipá', 1600, 1200),
  p('catedral-diocesana-zipaquira', 'Atención a visitantes frente a la Catedral Diocesana, Zipaquirá', 739, 1600),
  p('tren-turistico-zipaquira', 'Acompañamiento a pasajeros del tren turístico en Zipaquirá', 892, 736),
  p('turismo-ecologico', 'Jornada de turismo ecológico con niñas, niños y familias', 1448, 1262),
  p('dia-del-turismo-zipaquira', 'Día Internacional del Turismo en Zipaquirá', 1600, 1200),
  p('dia-del-turismo-mural-zipaquira', 'Día Internacional del Turismo en Zipaquirá', 900, 1152),
  p('campana-escnna', 'Campaña «Ojos en todas partes» contra la explotación sexual de niñas, niños y adolescentes (ESCNNA)', 1060, 1168),
  p('campana-turismo-seguro', 'Campaña de turismo seguro', 1188, 1144),
  p('control-guias', 'Control a guías de turismo', 1096, 1200),
  p('control-rnt-checua', 'Verificación del Registro Nacional de Turismo (RNT) en el Desierto de Checua, Nemocón', 1340, 992),
  p('control-parque-tematico-tenjo', 'Control a un parque temático en Tenjo', 1600, 1200),
  p('protejo-mi-ciudad', 'Campaña «Protejo mi ciudad»', 1224, 976),
]

/** Foto del equipo (va en Contacto, no en la galería). */
export const policeTeamPhoto = p('equipo-de-turismo', 'Grupo de Protección al Turismo y Patrimonio Nacional en Zipaquirá', 1600, 1200)

export function getPolicePhotos(): PolicePhoto[] {
  return photos
}

/** Selección para el mosaico del inicio. */
export function getFeaturedPolicePhotos(): PolicePhoto[] {
  const featured = ['festival', 'catedral-de-sal', 'desierto-de-checua', 'campana-patrimonio', 'turismo-cultural', 'humedal-tocancipa']
  return featured.map(name => photos.find(ph => ph.src === `/policia/${name}.jpg`)!)
}
