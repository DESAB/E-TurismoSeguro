import { Globe, Mail, MapPin, Phone, Search, Shield, Smartphone } from 'lucide-react'
import { routes } from '@/shared/config'
import { pageMetadata } from '@/shared/lib'
import { Breadcrumb, font, PoliceShield } from '@/shared/ui'

export const metadata = pageMetadata({
  title: 'Contacto · Departamento de Policía La Sabana',
  description: 'Dirección, teléfonos, correo y canales de atención del Departamento de Policía La Sabana. Emergencias: línea 123.',
  path: routes.contact,
})

const contactInfo = [
  { Icon: MapPin, label: 'Dirección',  value: 'Cra. 13 No. 1-78, Zipaquirá, Cundinamarca' },
  { Icon: Phone,  label: 'Conmutador', value: '(601) 851-5151' },
  { Icon: Mail,   label: 'Correo',     value: 'dpolicialasabana@policia.gov.co' },
  { Icon: Globe,  label: 'Web',        value: 'www.policia.gov.co' },
]

const channels = [
  { title: 'Denuncia en línea',    desc: 'Plataforma ADENUNCIAR para reportar delitos',     color: '#007934', Icon: Shield },
  { title: 'App MI POLICÍA',       desc: 'Descarga la aplicación oficial en iOS y Android', color: '#61A60E', Icon: Smartphone },
  { title: 'CICRI',                desc: 'Centro Investigación Criminal Regional',          color: '#006937', Icon: Search },
  { title: 'Línea anticorrupción', desc: '018000910600 — gratuita las 24 horas',            color: '#316649', Icon: Phone },
]

export function ContactPage() {
  return (
    <div style={{ paddingTop: '64px' }}>
      <div style={{ backgroundColor: '#007934', padding: '80px 0 48px' }}>
        <div className="max-w-7xl mx-auto px-6">
          <Breadcrumb items={[{ label: 'Inicio', href: routes.home }, { label: 'Contacto' }]} />
          <h1 style={{ fontFamily: font.barlow, fontSize: '48px', fontWeight: 700, color: 'white', marginTop: '16px' }}>Contacto</h1>
          <p style={{ fontFamily: font.jost, color: 'rgba(255,255,255,0.75)', fontSize: '16px' }}>Información institucional y canales de comunicación</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Institutional info */}
          <div>
            <div className="flex items-center gap-4 mb-6">
              <PoliceShield size={52} />
              <div>
                <h2 style={{ fontFamily: font.barlow, fontSize: '26px', fontWeight: 700, color: '#233530' }}>Policía Nacional de Colombia</h2>
                <p style={{ fontFamily: font.jost, color: '#76777A', fontSize: '14px' }}>Departamento de Policía La Sabana</p>
              </div>
            </div>
            <p style={{ fontFamily: font.jost, fontSize: '14px', color: '#76777A', lineHeight: 1.8, marginBottom: '24px' }}>
              El Departamento de Policía La Sabana tiene jurisdicción sobre los municipios de la Sabana de Bogotá en el departamento de Cundinamarca. Trabajamos por la seguridad, la convivencia y el bienestar de ciudadanos y visitantes.
            </p>
            <div style={{ border: '1px solid #E5E5E5', borderRadius: '10px', overflow: 'hidden' }}>
              {contactInfo.map((item, i) => (
                <div key={item.label} style={{ padding: '16px 20px', borderBottom: i < 3 ? '1px solid #E5E5E5' : 'none', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '6px', backgroundColor: '#F7F7F5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <item.Icon size={16} color="#007934" strokeWidth={1.75} />
                  </div>
                  <div>
                    <div style={{ fontFamily: font.jost, fontSize: '11px', fontWeight: 600, color: '#76777A', letterSpacing: '0.06em', marginBottom: '2px' }}>{item.label.toUpperCase()}</div>
                    <div style={{ fontFamily: font.jost, fontSize: '14px', color: '#333' }}>{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact channels + emergency */}
          <div>
            <h3 style={{ fontFamily: font.barlow, fontSize: '24px', fontWeight: 600, color: '#233530', marginBottom: '16px' }}>Canales de atención</h3>
            <div className="flex flex-col gap-3 mb-8">
              {channels.map(ch => (
                <div key={ch.title} style={{ display: 'flex', alignItems: 'center', gap: '14px', border: '1px solid #E5E5E5', borderRadius: '8px', padding: '14px 16px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '8px', backgroundColor: ch.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <ch.Icon size={20} color="white" strokeWidth={1.75} />
                  </div>
                  <div>
                    <div style={{ fontFamily: font.jost, fontWeight: 600, fontSize: '14px', color: '#233530' }}>{ch.title}</div>
                    <div style={{ fontFamily: font.jost, fontSize: '12px', color: '#76777A' }}>{ch.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ backgroundColor: '#C2D500', borderRadius: '10px', padding: '24px' }}>
              <h3 style={{ fontFamily: font.barlow, fontSize: '22px', fontWeight: 700, color: '#233530', marginBottom: '4px' }}>¿Necesitas ayuda inmediata?</h3>
              <p style={{ fontFamily: font.jost, fontSize: '13px', color: '#316649', marginBottom: '16px' }}>Llama a la línea de emergencias de la Policía Nacional</p>
              <div style={{ fontFamily: font.barlow, fontSize: '52px', fontWeight: 700, color: '#233530', lineHeight: 1 }}>123</div>
              <p style={{ fontFamily: font.jost, fontSize: '12px', color: '#316649', marginTop: '4px' }}>Disponible las 24 horas, los 365 días del año</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
