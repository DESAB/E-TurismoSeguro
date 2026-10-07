import { getDestinations, getMunicipalityList } from '@/shared/api'
import { routes } from '@/shared/config'
import { pageMetadata } from '@/shared/lib'
import { Breadcrumb, font } from '@/shared/ui'
import { MapView } from './MapView'

export const metadata = pageMetadata({
  title: 'Mapa interactivo del Departamento de Policía La Sabana',
  description: 'Ubica en el mapa los municipios y destinos turísticos del Departamento de Policía La Sabana: Zipaquirá, Nemocón, Tocancipá, Facatativá, Bojacá y más.',
  path: routes.map,
})

export function MapPage() {
  return (
    <div className="flex flex-col md:h-screen" style={{ paddingTop: '64px' }}>
      {/* Page header. El prototipo usaba padding '32px 24px' sin px-6 en el contenedor, lo que
          corría el contenido ~24px a la izquierda respecto al resto de páginas. */}
      <div style={{ backgroundColor: '#142749', padding: '32px 0 24px' }}>
        <div className="max-w-7xl mx-auto px-6">
          <Breadcrumb items={[{ label: 'Inicio', href: routes.home }, { label: 'Mapa interactivo' }]} />
          <h1 style={{ fontFamily: font.heading, fontSize: '36px', fontWeight: 700, color: 'white', marginTop: '12px' }}>Explora el territorio</h1>
        </div>
      </div>

      <MapView destinations={getDestinations()} municipalityList={getMunicipalityList()} />
    </div>
  )
}
