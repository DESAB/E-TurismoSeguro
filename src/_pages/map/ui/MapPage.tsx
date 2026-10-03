import { getDestinations, getMunicipalities } from '@/shared/api'
import { routes } from '@/shared/config'
import { Breadcrumb, font } from '@/shared/ui'
import { MapView } from './MapView'

export function MapPage() {
  return (
    <div style={{ paddingTop: '64px', display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Page header. El prototipo usaba padding '32px 24px' sin px-6 en el contenedor, lo que
          corría el contenido ~24px a la izquierda respecto al resto de páginas. */}
      <div style={{ backgroundColor: '#007934', padding: '32px 0 24px' }}>
        <div className="max-w-7xl mx-auto px-6">
          <Breadcrumb items={[{ label: 'Inicio', href: routes.home }, { label: 'Mapa interactivo' }]} />
          <h1 style={{ fontFamily: font.barlow, fontSize: '36px', fontWeight: 700, color: 'white', marginTop: '12px' }}>Explora el territorio</h1>
        </div>
      </div>

      <MapView destinations={getDestinations()} municipalities={getMunicipalities()} />
    </div>
  )
}
