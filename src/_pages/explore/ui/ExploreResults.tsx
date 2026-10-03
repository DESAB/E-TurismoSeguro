'use client'

import { useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'
import { DestinationCard } from '@/entities/destination'
import { CATEGORIES, type Destination } from '@/shared/api'
import { font } from '@/shared/ui'
import { ALL, filterDestinations, filtersToQuery, parseFilters, type ExploreFilters } from '../model/explore-filters'
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

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Search */}
      <div style={{ position: 'relative', marginBottom: '24px', maxWidth: '560px' }}>
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

      {/* Category filters */}
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

      {/* Municipality filter */}
      <div className="flex flex-wrap gap-2 mb-8">
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

      {/* Results count */}
      <div style={{ fontFamily: font.jost, fontSize: '13px', color: '#76777A', marginBottom: '24px' }}>
        {filtered.length} destino{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
      </div>

      {/* Grid or empty state */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🗺️</div>
          <h3 style={{ fontFamily: font.barlow, fontSize: '28px', fontWeight: 600, color: '#233530', marginBottom: '8px' }}>No encontramos destinos</h3>
          <p style={{ fontFamily: font.jost, color: '#76777A', marginBottom: '24px' }}>Prueba con otra categoría, municipio o término de búsqueda.</p>
          <button
            onClick={() => set({ search: '', category: ALL, municipality: ALL })}
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
