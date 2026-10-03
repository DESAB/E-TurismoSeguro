// Municipios de la Regional Metropolitana de la Sabana (DESAB).
// Fuente: Sitios/Sitios_turisticos_organizados.xlsx y "LINKS DE TURISMO MUNICIPIOS DE LA SABANA.docx".
// Los enlaces se conservan tal como los entregó la Policía.
// lat/lon: centro urbano aproximado, solo para ubicar el municipio en el mapa ilustrativo.
// Revisar cuando se pase a un mapa real con coordenadas verificadas.

export interface Municipality {
  name: string
  lat: number
  lon: number
  tourismLinks: string[]
}

const municipalities: Municipality[] = [
  { name: 'Cajicá',     lat: 4.9186, lon: -74.0283, tourismLinks: ['https://www.turismocajica.gov.co/'] },
  { name: 'Chía',       lat: 4.8619, lon: -74.0583, tourismLinks: ['https://visor.turismo.chia-cundinamarca.gov.co/'] },
  { name: 'Cogua',      lat: 5.0606, lon: -73.9787, tourismLinks: [] },
  { name: 'Cota',       lat: 4.8097, lon: -74.1033, tourismLinks: ['https://www.cota-cundinamarca.gov.co/SECRETARIASYENTIDADES/Paginas/Turismo-SAMADE.aspx'] },
  { name: 'Gachancipá', lat: 4.9914, lon: -73.8722, tourismLinks: [] },
  { name: 'Guasca',     lat: 4.8661, lon: -73.8772, tourismLinks: [] },
  { name: 'La Calera',  lat: 4.7208, lon: -73.9697, tourismLinks: [] },
  { name: 'Nemocón',    lat: 5.0689, lon: -73.8780, tourismLinks: [] },
  { name: 'Sopó',       lat: 4.9078, lon: -73.9381, tourismLinks: ['https://www.sopo-cundinamarca.gov.co/turismo/?utm_source=ig&utm_medium=social&utm_content=link_in_bio'] },
  { name: 'Tabio',      lat: 4.9167, lon: -74.0961, tourismLinks: [] },
  { name: 'Tenjo',      lat: 4.8717, lon: -74.1442, tourismLinks: ['https://visitatenjo.com/'] },
  { name: 'Tocancipá',  lat: 4.9653, lon: -73.9131, tourismLinks: ['http://app.notion.com/p/288857c15e8a8011ae33f8a5d5e9b71a?v=288857c15e8a808fb538000c2b1a1e2c'] },
  { name: 'Zipaquirá',  lat: 5.0221, lon: -74.0048, tourismLinks: ['https://www.zipaquira.travel/'] },
  { name: 'Bojacá',     lat: 4.7342, lon: -74.3422, tourismLinks: [] },
  { name: 'El Rosal',   lat: 4.8517, lon: -74.2622, tourismLinks: [] },
  { name: 'Facatativá', lat: 4.8136, lon: -74.3547, tourismLinks: ['https://facaapp.gov.co/', 'https://www.tiktok.com/@facatativaturistica?_r=1&_t=ZS-9A7W451dQ9u'] },
  { name: 'Funza',      lat: 4.7164, lon: -74.2117, tourismLinks: ['https://www.detour.cundinamarca.gov.co/cities/funza'] },
  { name: 'Madrid',     lat: 4.7342, lon: -74.2642, tourismLinks: ['https://share.google/qDI0WkMu3GlFOwh3u'] },
  { name: 'Mosquera',   lat: 4.7058, lon: -74.2303, tourismLinks: ['https://www.instagram.com/turismomosquera?utm_source=qr&stkn=aHN4ejZucDZ5Nms='] },
  { name: 'Subachoque', lat: 4.9297, lon: -74.1736, tourismLinks: [] },
  { name: 'Zipacón',    lat: 4.7597, lon: -74.3797, tourismLinks: [] },
]

/** Nombres de los municipios, en el orden del documento de la Policía. */
export function getMunicipalities(): string[] {
  return municipalities.map(m => m.name)
}

export function getMunicipalityList(): Municipality[] {
  return municipalities
}

export function getMunicipality(name: string): Municipality | undefined {
  return municipalities.find(m => m.name === name)
}
