import { Suspense } from 'react'
import { getDestinations, getMunicipalities } from '@/shared/api'
import { routes } from '@/shared/config'
import { pageMetadata } from '@/shared/lib'
import { Breadcrumb, font } from '@/shared/ui'
import { defaultFilters } from '../model/explore-filters'
import { ExploreResults, ExploreView } from './ExploreResults'

// Canonical sin filtros: /explorar?categoria=… no compite con /explorar en los buscadores.
export const metadata = pageMetadata({
  title: 'Explora destinos de la Sabana de Bogotá',
  description: 'Busca lugares turísticos de la Sabana de Bogotá por categoría (naturaleza, patrimonio, cultura, gastronomía, familiar, aventura) o por municipio.',
  path: routes.explore,
})

export function ExplorePage() {
  const destinations = getDestinations()
  const municipalities = getMunicipalities()

  return (
    <div>
      {/* Page header */}
      <div className="pt-20 pb-7 md:pb-10" style={{ backgroundColor: '#007934' }}>
        <div className="max-w-7xl mx-auto px-6">
          <Breadcrumb items={[{ label: 'Inicio', href: routes.home }, { label: 'Explorar' }]} />
          <h1 className="text-[34px] md:text-[48px]" style={{ fontFamily: font.barlow, fontWeight: 700, color: 'white', marginTop: '16px', marginBottom: '8px' }}>Explora la Sabana</h1>
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
