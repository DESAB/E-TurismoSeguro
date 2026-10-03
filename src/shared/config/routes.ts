export const routes = {
  home: '/',
  explore: '/explorar',
  map: '/mapa',
  security: '/seguridad',
  videos: '/videos',
  contact: '/contacto',
  admin: '/admin',
  destination: (slug: string) => `/destinos/${slug}`,
} as const

/** Nombres de los parámetros de filtro de /explorar */
export const exploreParams = {
  category: 'categoria',
  municipality: 'municipio',
  search: 'q',
} as const
