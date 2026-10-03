'use client'

import { useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { DestinationCard } from '@/entities/destination'
import { CATEGORIES, type Destination } from '@/shared/api'
import { font } from '@/shared/ui'
import { activeFilterCount, ALL, defaultFilters, filterDestinations, filtersToQuery, parseFilters, type ExploreFilters } from '../model/explore-filters'
import styles from './explore-results.module.css'

const filters = [ALL, ...CATEGORIES] as const

interface ExploreViewProps {
  destinations: Destination[]
  municipalities: string[]
  value: ExploreFilters
  onChange?: (next: ExploreFilters) => void
}

/** Buscador, filtros y resultados. Sin `onChange` se renderiza estático (fallback en el servidor). */
export function ExploreView({ destinations, municipalities, value, onChange }: ExploreViewProps) {
  const { search, category: activeFilter, municipality: activeMunicipality } = value
  const set = (patch: Partial<ExploreFilters>) => onChange?.({ ...value, ...patch })
  const allMunicipalities = [ALL, ...municipalities]
  const filtered = filterDestinations(destinations, value)
  const activeCount = activeFilterCount(value)
  const hasAnyFilter = activeCount > 0 || search !== ''
  const countByMunicipality = (m: string) => destinations.filter(d => d.municipality === m).length
  // En móvil los filtros van plegados tras un botón; en escritorio siempre están a la vista.
  const [filtersOpen, setFiltersOpen] = useState(false)
  const appliedChips: { label: string; clear: Partial<ExploreFilters> }[] = []
  if (activeFilter !== ALL) appliedChips.push({ label: activeFilter, clear: { category: ALL } })
  if (activeMunicipality !== ALL) appliedChips.push({ label: activeMunicipality, clear: { municipality: ALL } })
  const resultsLabel =`${filtered.length} destino${filtered.length !== 1 ? 's' : ''}`

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 md:py-10">
      {/* Search + botón de filtros (móvil) */}
      <div className="flex gap-2 mb-4 md:mb-6" style={{ maxWidth: '560px' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={17} color="#76777A" strokeWidth={2} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            value={search}
            onChange={e => set({ search: e.target.value })}
            readOnly={!onChange}
            placeholder="¿Qué lugar quieres conocer?"
            aria-label="Buscar destino"
            className={styles.search}
            style={{ width: '100%', padding: '12px 14px 12px 42px', borderRadius: '8px', fontFamily: font.jost, fontSize: '14px', color: '#333', outline: 'none' }}
          />
        </div>
        <button
          type="button"
          onClick={() => setFiltersOpen(o => !o)}
          aria-expanded={filtersOpen}
          aria-controls="explore-filters"
          className="md:hidden flex items-center gap-2 shrink-0"
          style={{
            fontFamily: font.jost, fontSize: '14px', fontWeight: 600, padding: '0 14px', borderRadius: '8px',
            border: '1.5px solid', borderColor: filtersOpen || activeCount > 0 ? '#007934' : '#E5E5E5',
            backgroundColor: filtersOpen ? '#007934' : 'white', color: filtersOpen ? 'white' : '#233530',
          }}
        >
          <SlidersHorizontal size={16} strokeWidth={2} />
          Filtros
          {activeCount > 0 && (
            <span aria-label={`${activeCount} aplicados`} style={{ minWidth: '20px', height: '20px', borderRadius: '10px', fontSize: '12px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', backgroundColor: filtersOpen ? 'white' : '#007934', color: filtersOpen ? '#007934' : 'white' }}>
              {activeCount}
            </span>
          )}
        </button>
      </div>

      <div id="explore-filters" className={filtersOpen ? 'block' : 'hidden md:block'}>
      {/* Category filters */}
      <div className="md:hidden" style={{ fontFamily: font.jost, fontSize: '12px', fontWeight: 600, color: '#76777A', letterSpacing: '0.06em', marginBottom: '8px' }}>CATEGORÍA</div>
      <div className="flex flex-wrap gap-2 mb-4">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => set({ category: f })}
            aria-pressed={activeFilter === f}
            style={{
              fontFamily: font.jost,
              fontSize: '13px',
              fontWeight: activeFilter === f ? 600 : 400,
              padding: '8px 16px',
              borderRadius: '100px',
              border: '1.5px solid',
              borderColor: activeFilter === f ? '#007934' : '#E5E5E5',
              backgroundColor: activeFilter === f ? '#007934' : 'white',
              color: activeFilter === f ? 'white' : '#333',
              transition: 'all 0.15s',
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Municipality filter: en móvil un selector (22 botones llenarían la pantalla) */}
      <label className="md:hidden block mb-4">
        <span style={{ display: 'block', fontFamily: font.jost, fontSize: '12px', fontWeight: 600, color: '#76777A', letterSpacing: '0.06em', marginBottom: '8px' }}>MUNICIPIO</span>
        <select
          value={activeMunicipality}
          onChange={e => set({ municipality: e.target.value })}
          disabled={!onChange}
          style={{ width: '100%', padding: '11px 12px', border: '1.5px solid', borderColor: activeMunicipality !== ALL ? '#61A60E' : '#E5E5E5', borderRadius: '8px', fontFamily: font.jost, fontSize: '14px', color: '#333', backgroundColor: 'white' }}
        >
          <option value={ALL}>Todos los municipios</option>
          {municipalities.map(m => {
            const n = countByMunicipality(m)
            return <option key={m} value={m} disabled={n === 0 && m !== activeMunicipality}>{m} ({n})</option>
          })}
        </select>
      </label>
      <button
        type="button"
        onClick={() => setFiltersOpen(false)}
        className="md:hidden w-full mb-6"
        style={{ padding: '12px', backgroundColor: '#007934', color: 'white', borderRadius: '8px', fontFamily: font.jost, fontWeight: 600, fontSize: '14px' }}
      >
        Ver {resultsLabel}
      </button>

      <div className="hidden md:flex flex-wrap gap-2 mb-8">
        {allMunicipalities.map(m => (
          <button
            key={m}
            onClick={() => set({ municipality: m })}
            aria-pressed={activeMunicipality === m}
            style={{
              fontFamily: font.jost,
              fontSize: '12px',
              fontWeight: 500,
              padding: '7px 12px',
              borderRadius: '4px',
              border: '1px solid',
              borderColor: activeMunicipality === m ? '#61A60E' : '#E5E5E5',
              backgroundColor: activeMunicipality === m ? '#61A60E' : '#F7F7F5',
              color: activeMunicipality === m ? 'white' : '#76777A',
            }}
          >
            {m}
          </button>
        ))}
      </div>
      </div>

      {/* Results count + filtros aplicados (con los filtros plegados, recuerdan qué se está viendo) */}
      <div className="flex flex-wrap items-center gap-2" style={{ fontFamily: font.jost, fontSize: '13px', color: '#76777A', marginBottom: '24px' }}>
        <span aria-live="polite">{resultsLabel} encontrado{filtered.length !== 1 ? 's' : ''}</span>
        {appliedChips.map(chip => (
          <button
            key={chip.label}
            type="button"
            onClick={() => set(chip.clear)}
            aria-label={`Quitar filtro ${chip.label}`}
            className="md:hidden inline-flex items-center gap-1"
            style={{ padding: '4px 8px 4px 10px', borderRadius: '100px', backgroundColor: 'rgba(0,121,52,0.08)', color: '#007934', fontWeight: 600, fontSize: '12px' }}
          >
            {chip.label} <X size={13} strokeWidth={2.5} />
          </button>
        ))}
        {hasAnyFilter && (
          <button
            type="button"
            onClick={() => set(defaultFilters)}
            className="hover:underline"
            style={{ marginLeft: 'auto', color: '#007934', fontWeight: 600, fontSize: '13px' }}
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Grid or empty state */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🗺️</div>
          <h3 style={{ fontFamily: font.barlow, fontSize: '28px', fontWeight: 600, color: '#233530', marginBottom: '8px' }}>No encontramos destinos</h3>
          <p style={{ fontFamily: font.jost, color: '#76777A', marginBottom: '24px' }}>Prueba con otra categoría, municipio o término de búsqueda.</p>
          <button
            onClick={() => set(defaultFilters)}
            style={{ fontFamily: font.jost, fontWeight: 600, fontSize: '13px', color: '#007934', border: '1.5px solid #007934', padding: '8px 20px', borderRadius: '6px' }}
          >
            Limpiar filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(dest => (
            <DestinationCard key={dest.id} dest={dest} />
          ))}
        </div>
      )}
    </div>
  )
}

/** Versión interactiva: los filtros viven en la URL (?categoria=…&municipio=…&q=…). */
export function ExploreResults({ destinations, municipalities }: Omit<ExploreViewProps, 'value' | 'onChange'>) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const fromUrl = parseFilters(searchParams, municipalities)
  // El texto del buscador vive en estado local: si saliera de la URL, al escribir rápido se perderían letras.
  const [search, setSearch] = useState(fromUrl.search)
  const value = { ...fromUrl, search }

  const onChange = (next: ExploreFilters) => {
    setSearch(next.search)
    router.replace(`${pathname}${filtersToQuery(next)}`, { scroll: false })
  }

  return <ExploreView destinations={destinations} municipalities={municipalities} value={value} onChange={onChange} />
}
