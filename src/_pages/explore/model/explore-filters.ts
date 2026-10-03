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

/** Minúsculas y sin tildes: "zipaquira" encuentra "Zipaquirá". */
const fold = (text: string) => text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

export function filterDestinations(destinations: Destination[], { category, municipality, search }: ExploreFilters): Destination[] {
  const query = fold(search.trim())
  return destinations.filter(d => {
    const matchCategory = category === ALL || d.categories.includes(category)
    const matchMunicipality = municipality === ALL || d.municipality === municipality
    const matchSearch = query === '' || fold(d.name).includes(query) || fold(d.municipality).includes(query)
    return matchCategory && matchMunicipality && matchSearch
  })
}

/** Cuántos filtros (categoría o municipio) están aplicados, sin contar el texto de búsqueda. */
export function activeFilterCount({ category, municipality }: ExploreFilters): number {
  return Number(category !== ALL) + Number(municipality !== ALL)
}
