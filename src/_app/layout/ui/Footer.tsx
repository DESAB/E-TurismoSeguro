import Link from 'next/link'
import { routes } from '@/shared/config'
import { font, PoliceShield } from '@/shared/ui'

const footerLinks = [
  { label: 'Inicio', href: routes.home },
  { label: 'Explorar', href: routes.explore },
  { label: 'Mapa', href: routes.map },
  { label: 'Seguridad', href: routes.security },
  { label: 'Videos', href: routes.videos },
  { label: 'Contacto', href: routes.contact },
]

export function Footer() {
  return (
    <footer style={{ backgroundColor: '#142749', borderTop: '4px solid #007934' }}>
      <div className="max-w-7xl mx-auto px-6 py-10 md:py-12">
        {/* Móvil: bloques apilados, pero los enlaces y los números en filas horizontales. Desde md: 4 columnas. */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-7 md:gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <PoliceShield size={56} />
              <div>
                <div style={{ fontFamily: font.body, fontWeight: 700, color: '#BAFF00', fontSize: '15px' }}>E-TurismoSeguro</div>
                <div style={{ fontFamily: font.body, color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>Departamento de Policía La Sabana</div>
              </div>
            </div>
            <p className="md:max-w-sm" style={{ fontFamily: font.body, color: 'rgba(255,255,255,0.65)', fontSize: '13px', lineHeight: 1.7 }}>
              Guía turística digital interactiva del Departamento de Policía La Sabana. Explora destinos, patrimonio y naturaleza de manera segura.
            </p>
          </div>
          <div>
            <h4 style={{ fontFamily: font.body, fontWeight: 600, color: '#BAFF00', fontSize: '13px', letterSpacing: '0.08em', marginBottom: '12px' }}>NAVEGACIÓN</h4>
            <nav aria-label="Enlaces del pie de página" className="flex flex-wrap gap-x-5 md:flex-col md:gap-0">
              {footerLinks.map(link => (
                <Link key={link.href} href={link.href} className="block py-2 md:py-0 md:mb-2 hover:text-white transition-colors" style={{ fontFamily: font.body, color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
          <div>
            <h4 style={{ fontFamily: font.body, fontWeight: 600, color: '#BAFF00', fontSize: '13px', letterSpacing: '0.08em', marginBottom: '12px' }}>EMERGENCIAS</h4>
            <div className="flex flex-wrap gap-x-5 md:block" style={{ fontFamily: font.body, color: 'rgba(255,255,255,0.7)', fontSize: '13px', lineHeight: 2 }}>
              <div>Policía Nacional: <a href="tel:123" style={{ color: 'white', fontWeight: 700 }}>123</a></div>
              <div>Línea de emergencia: <a href="tel:112" style={{ color: 'white', fontWeight: 700 }}>112</a></div>
              <div>Denuncia: <a href="tel:018000910600" style={{ color: 'white', fontWeight: 700 }}>018000910600</a></div>
            </div>
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.12)', marginTop: '28px', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <p style={{ fontFamily: font.body, color: 'rgba(255,255,255,0.45)', fontSize: '12px' }}>
            © {new Date().getFullYear()} Policía Nacional de Colombia · Departamento de Policía La Sabana
          </p>
          <p style={{ fontFamily: font.body, color: 'rgba(255,255,255,0.35)', fontSize: '12px' }}>
            E-TurismoSeguro · Todos los derechos reservados
          </p>
        </div>
      </div>
    </footer>
  )
}
