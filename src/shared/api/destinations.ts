// Datos locales de destinos (copiados del prototipo de Figma Make).
// Fase 5: reemplazar el cuerpo de los getters por consultas a Supabase sin cambiar sus firmas.

export const CATEGORIES = ['Naturaleza', 'Patrimonio', 'Cultura', 'Gastronomía', 'Familiar', 'Aventura'] as const

export type Category = (typeof CATEGORIES)[number]

export interface Destination {
  id: string
  /** Segmento de URL: /destinos/[slug] */
  slug: string
  name: string
  municipality: string
  category: Category
  description: string
  longDescription: string
  /** ID de foto de Unsplash */
  imageId: string
  images: string[]
  /** Posición en el mapa (% del contenedor) */
  coordinates: { x: number; y: number }
  address: string
  hours: string
  tips: string[]
}

const destinations: Destination[] = [
  {
    id: 'catedral-sal',
    slug: 'catedral-de-sal',
    name: 'Catedral de Sal',
    municipality: 'Zipaquirá',
    category: 'Patrimonio',
    description: 'Obra maestra subterránea excavada en las minas de sal, declarada como la primera maravilla de Colombia.',
    longDescription: 'La Catedral de Sal de Zipaquirá es una iglesia católica construida dentro de las minas de sal de la ciudad. Con una capacidad para más de 8.000 personas, es considerada la primera maravilla de Colombia y atrae miles de visitantes cada año por su impresionante arquitectura subterránea y su profundo simbolismo religioso.',
    imageId: '1724027212141-7244bc12678a',
    images: ['1724027212141-7244bc12678a', '1724027212179-b5fc6989a161', '1756354149164-a573e5125d32'],
    coordinates: { x: 32, y: 28 },
    address: 'Parque de la Sal, Zipaquirá, Cundinamarca',
    hours: 'Lun–Dom 9:00am – 5:30pm',
    tips: ['Lleva ropa abrigada, la temperatura es de 14°C', 'Compra tus tiquetes en línea con anticipación', 'El recorrido dura aproximadamente 2 horas'],
  },
  {
    id: 'laguna-neusa',
    slug: 'laguna-de-neusa',
    name: 'Laguna de Neusa',
    municipality: 'Cogua',
    category: 'Naturaleza',
    description: 'Embalse rodeado de bosque de pinos y páramo, ideal para camping, senderismo y pesca deportiva.',
    longDescription: 'La Laguna de Neusa es un embalse artificial ubicado en el municipio de Cogua, a 2.600 metros sobre el nivel del mar. Está rodeado de extensos bosques de pinos y zonas de páramo, ofreciendo un entorno ideal para actividades al aire libre como senderismo, camping, pesca deportiva y avistamiento de aves.',
    imageId: '1761542547086-fbeb20f23e3a',
    images: ['1761542547086-fbeb20f23e3a', '1611148261486-4e315d904232', '1487203007409-91f19b5b4f62'],
    coordinates: { x: 28, y: 22 },
    address: 'Vereda La Playa, Cogua, Cundinamarca',
    hours: 'Lun–Dom 6:00am – 5:00pm',
    tips: ['Lleva protector solar y ropa impermeable', 'Prohibido encender fogatas fuera de zonas autorizadas', 'Los fines de semana puede haber alta afluencia de visitantes'],
  },
  {
    id: 'mina-sal-nemocon',
    slug: 'mina-de-sal-nemocon',
    name: 'Mina de Sal',
    municipality: 'Nemocón',
    category: 'Patrimonio',
    description: 'Mina de sal de más de 500 años de historia con espectaculares formaciones minerales y leyendas muiscas.',
    longDescription: 'La Mina de Sal de Nemocón data de la época prehispánica y fue explotada por los muiscas por siglos. Hoy es un sitio turístico con recorridos guiados que muestran las impresionantes formaciones de sal, estalactitas, y una laguna subterránea de aguas salinas de gran belleza natural.',
    imageId: '1756354149164-a573e5125d32',
    images: ['1756354149164-a573e5125d32', '1724027212141-7244bc12678a', '1700769670643-14361ffa6dfe'],
    coordinates: { x: 42, y: 18 },
    address: 'Calle 5 No 3-41, Nemocón, Cundinamarca',
    hours: 'Mar–Dom 9:00am – 4:00pm',
    tips: ['Los menores de 5 años no tienen acceso', 'La temperatura interior es de 16°C', 'Se recomienda calzado cerrado y cómodo'],
  },
  {
    id: 'parque-jaime-duque',
    slug: 'parque-jaime-duque',
    name: 'Parque Jaime Duque',
    municipality: 'Tocancipá',
    category: 'Familiar',
    description: 'Parque temático con réplicas de maravillas del mundo, zoológico, atracciones y espacios verdes para toda la familia.',
    longDescription: 'El Parque Jaime Duque es uno de los parques temáticos más visitados de Colombia. Cuenta con réplicas a escala de las maravillas del mundo, un extenso zoológico con fauna nacional e internacional, múltiples atracciones mecánicas, shows artísticos y amplios espacios naturales perfectos para el disfrute familiar.',
    imageId: '1535314003016-19fbc0546a8a',
    images: ['1535314003016-19fbc0546a8a', '1672851612770-f969b3efc02d', '1568489711036-9c94a7d5aea6'],
    coordinates: { x: 55, y: 42 },
    address: 'Km 3 Vía Zipaquirá, Tocancipá, Cundinamarca',
    hours: 'Sáb–Dom y festivos 9:00am – 5:00pm',
    tips: ['Ideal para niños de 4 a 12 años', 'Lleva comida propia, hay zonas de picnic', 'Compra tiquetes con anticipación en temporada alta'],
  },
  {
    id: 'lagunas-siecha',
    slug: 'lagunas-de-siecha',
    name: 'Lagunas de Siecha',
    municipality: 'Guasca',
    category: 'Naturaleza',
    description: 'Sistema de lagunas sagradas muiscas en el páramo de Chingaza, con senderos de alta montaña y biodiversidad única.',
    longDescription: 'Las Lagunas de Siecha son un sistema de lagunas de origen glacial ubicadas en el Parque Nacional Natural Chingaza. Son sitios sagrados para la cultura muisca y ofrecen una experiencia de senderismo de alta montaña entre frailejones, aves andinas y paisajes de páramo de excepcional belleza.',
    imageId: '1742648816955-047429b281bf',
    images: ['1742648816955-047429b281bf', '1761542547086-fbeb20f23e3a', '1611148261486-4e315d904232'],
    coordinates: { x: 72, y: 38 },
    address: 'PNN Chingaza, Guasca, Cundinamarca',
    hours: 'Lun–Dom 6:00am – 3:00pm',
    tips: ['Se requiere permiso previo de Parques Nacionales', 'Solo se permite acceso con guía certificado', 'Temperatura entre 4°C y 12°C, lleva ropa térmica'],
  },
  {
    id: 'iglesia-chia',
    slug: 'parque-y-templo-de-chia',
    name: 'Parque y Templo de Chía',
    municipality: 'Chía',
    category: 'Cultura',
    description: 'Centro histórico con la Iglesia de San Juan Bautista del siglo XVIII, mercado artesanal y gastronomía local.',
    longDescription: 'El municipio de Chía, llamado la Ciudad de la Luna por los muiscas, conserva un hermoso centro histórico con la Iglesia de San Juan Bautista construida en el siglo XVIII. El parque principal es punto de encuentro cultural, gastronomía local y artesanías de la región sabana.',
    imageId: '1700769670643-14361ffa6dfe',
    images: ['1700769670643-14361ffa6dfe', '1534943441045-1009d7cb0bb9', '1583531352515-8884af319dc1'],
    coordinates: { x: 60, y: 58 },
    address: 'Parque Principal, Chía, Cundinamarca',
    hours: 'Acceso libre. Mercado: Sáb 8:00am – 2:00pm',
    tips: ['Los domingos hay feria gastronómica en el parque', 'Visita el mirador del cerro de Majuy', 'Muy cerca de Bogotá, a 30 minutos'],
  },
]

const municipalities = ['Zipaquirá', 'Cogua', 'Nemocón', 'Tocancipá', 'Guasca', 'Chía']

export function getDestinations(): Destination[] {
  return destinations
}

export function getDestinationBySlug(slug: string): Destination | undefined {
  return destinations.find(d => d.slug === slug)
}

export function getMunicipalities(): string[] {
  return municipalities
}
