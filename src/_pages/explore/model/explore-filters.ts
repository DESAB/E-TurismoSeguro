import { CATEGORIES, type Category, type Destination } from '@/shared/api'
import { exploreParams } from '@/shared/config'
import { slugify } from '@/shared/lib'

export const ALL = 'Todos'

export interface ExploreFilters {
  category: Category | typeof ALL
  municipality: string
  search: string
}

export const defaultFilters: ExploreFilters = { category: ALL, municipality: ALL, search: '' }

/** Lee los filtros de la URL. Valores desconocidos caen en "Todos". */
export function parseFilters(params: URLSearchParams, municipalities: string[]): ExploreFilters {
  const categorySlug = params.get(exploreParams.category)
  const municipalitySlug = params.get(exploreParams.municipality)
  return {
    category: CATEGORIES.find(c => slugify(c) === categorySlug) ?? ALL,
    municipality: municipalities.find(m => slugify(m) === municipalitySlug) ?? ALL,
    search: params.get(exploreParams.search) ?? '',
  }
}

/** Query string para unos filtros (sin los que están en "Todos" o vacíos). */
export function filtersToQuery(filters: ExploreFilters): string {
  const params = new URLSearchParams()
  if (filters.category !== ALL) params.set(exploreParams.category, slugify(filters.category))
  if (filters.municipality !== ALL) params.set(exploreParams.municipality, slugify(filters.municipality))
  if (filters.search) params.set(exploreParams.search, filters.search)
  const query = params.toString()
  return query ? `?${query}` : ''
}

export function filterDestinations(destinations: Destination[], { category, municipality, search }: ExploreFilters): Destination[] {
  return destinations.filter(d => {
    const matchCategory = category === ALL || d.category === category
    const matchMunicipality = municipality === ALL || d.municipality === municipality
    const matchSearch = search === '' || d.name.toLowerCase().includes(search.toLowerCase()) || d.municipality.toLowerCase().includes(search.toLowerCase())
    return matchCategory && matchMunicipality && matchSearch
  })
}
