import Link from 'next/link'
import { font } from '../typography'

export interface BreadcrumbItem {
  label: string
  href?: string
}

// Todas las cabeceras donde aparece tienen fondo oscuro (verde, #233530 o foto con degradado).
// El prototipo usaba #007934 para los enlaces (invisible sobre el verde #007934) y #333333 para
// el elemento actual; aquí se usan tonos claros para que se lean sobre esos fondos.
export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Ruta de navegación" className="flex items-center gap-2 flex-wrap" style={{ fontFamily: font.jost, fontSize: '13px', color: 'rgba(255,255,255,0.75)' }}>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-2">
          {i > 0 && <span style={{ color: 'rgba(255,255,255,0.4)' }}>/</span>}
          {item.href ? (
            <Link href={item.href} className="hover:underline inline-block py-3 -my-3" style={{ color: 'rgba(255,255,255,0.75)' }}>{item.label}</Link>
          ) : (
            <span aria-current="page" style={{ color: 'white', fontWeight: 500 }}>{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
