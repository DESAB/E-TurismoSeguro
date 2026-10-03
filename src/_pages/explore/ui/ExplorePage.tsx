import { Suspense } from 'react'
import { getDestinations, getMunicipalities } from '@/shared/api'
import { routes } from '@/shared/config'
import { Breadcrumb, font } from '@/shared/ui'
import { defaultFilters } from '../model/explore-filters'
import { ExploreResults, ExploreView } from './ExploreResults'

export function ExplorePage() {
  const destinations = getDestinations()
  const municipalities = getMunicipalities()

  return (
    <div>
      {/* Page header */}
      <div style={{ backgroundColor: '#007934', padding: '80px 0 40px' }}>
        <div className="max-w-7xl mx-auto px-6">
          <Breadcrumb items={[{ label: 'Inicio', href: routes.home }, { label: 'Explorar' }]} />
          <h1 style={{ fontFamily: font.barlow, fontSize: '48px', fontWeight: 700, color: 'white', marginTop: '16px', marginBottom: '8px' }}>Explora la Sabana</h1>
          <p style={{ fontFamily: font.jost, color: 'rgba(255,255,255,0.75)', fontSize: '16px' }}>Encuentra lugares según tus intereses o municipio</p>
        </div>
      </div>

      {/* El HTML estático (lo que indexa Google) lleva todos los destinos; los filtros de la URL se aplican al hidratar. */}
      <Suspense fallback={<ExploreView destinations={destinations} municipalities={municipalities} value={defaultFilters} />}>
        <ExploreResults destinations={destinations} municipalities={municipalities} />
      </Suspense>
    </div>
  )
}
