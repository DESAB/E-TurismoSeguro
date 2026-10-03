import { getPolicePhotos, getSecurityTips } from '@/shared/api'
import { routes } from '@/shared/config'
import { pageMetadata } from '@/shared/lib'
import { Breadcrumb, font, PoliceShield } from '@/shared/ui'
import { PoliceGallery } from './PoliceGallery'

export const metadata = pageMetadata({
  title: 'Viaja seguro: recomendaciones de la Policía Nacional',
  description: 'Consejos de la Policía Nacional para visitar la Sabana de Bogotá de forma segura: pertenencias, seguridad digital, transporte y números de emergencia.',
  path: routes.security,
})

const emergencyNumbers = [
  { number: '123', label: 'Policía Nacional' },
  { number: '112', label: 'Línea de emergencia' },
  { number: '132', label: 'Bomberos' },
  { number: '125', label: 'Defensa Civil' },
]

export function SecurityPage() {
  const securityTips = getSecurityTips()

  return (
    <div style={{ paddingTop: '64px' }}>
      <div className="pt-20 pb-7 md:pb-12" style={{ backgroundColor: '#233530' }}>
        <div className="max-w-7xl mx-auto px-6">
          <Breadcrumb items={[{ label: 'Inicio', href: routes.home }, { label: 'Viaja seguro' }]} />
          <div className="flex items-center gap-4 mt-6">
            <PoliceShield size={48} />
            <div>
              <h1 className="text-[34px] md:text-[48px]" style={{ fontFamily: font.barlow, fontWeight: 700, color: 'white', lineHeight: 1 }}>Viaja seguro</h1>
              <p style={{ fontFamily: font.jost, color: 'rgba(255,255,255,0.7)', fontSize: '16px', marginTop: '8px' }}>Recomendaciones de la Policía Nacional para tu visita a la Sabana</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {securityTips.map(tip => (
            <div key={tip.title} style={{ border: '1px solid #E5E5E5', borderRadius: '10px', overflow: 'hidden' }}>
              <div style={{ backgroundColor: '#007934', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <tip.icon size={22} color="#C2D500" strokeWidth={1.75} />
                <h3 style={{ fontFamily: font.barlow, fontWeight: 600, fontSize: '20px', color: 'white' }}>{tip.title}</h3>
              </div>
              <div style={{ padding: '20px' }}>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {tip.tips.map((t, i) => (
                    <li key={i} className="flex items-start gap-3 mb-3">
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#C2D500', flexShrink: 0, marginTop: '7px' }} />
                      <span style={{ fontFamily: font.jost, fontSize: '14px', color: '#333', lineHeight: 1.6 }}>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Emergency numbers */}
        <div style={{ backgroundColor: '#C2D500', borderRadius: '12px', padding: '36px 40px', marginBottom: '12px' }}>
          <h2 style={{ fontFamily: font.barlow, fontSize: '32px', fontWeight: 700, color: '#233530', marginBottom: '8px' }}>Números de emergencia</h2>
          <p style={{ fontFamily: font.jost, color: '#316649', fontSize: '14px', marginBottom: '28px' }}>Guárdalos en tu teléfono antes de salir</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {emergencyNumbers.map(item => (
              <a key={item.number} href={`tel:${item.number}`} aria-label={`Llamar a ${item.label}: ${item.number}`} className="block" style={{ backgroundColor: 'rgba(35,53,48,0.1)', borderRadius: '8px', padding: '16px', textAlign: 'center' }}>
                <div style={{ fontFamily: font.barlow, fontSize: '36px', fontWeight: 700, color: '#233530' }}>{item.number}</div>
                <div style={{ fontFamily: font.jost, fontSize: '12px', color: '#316649', fontWeight: 500 }}>{item.label}</div>
              </a>
            ))}
          </div>
        </div>

        {/* Institutional message */}
        <div style={{ backgroundColor: '#F7F7F5', borderRadius: '10px', padding: '28px', borderLeft: '4px solid #007934', marginTop: '24px' }}>
          <div className="flex items-start gap-4">
            <PoliceShield size={40} />
            <div>
              <h3 style={{ fontFamily: font.barlow, fontSize: '22px', fontWeight: 600, color: '#233530', marginBottom: '8px' }}>Policía Nacional de Colombia a tu servicio</h3>
              <p style={{ fontFamily: font.jost, fontSize: '14px', color: '#76777A', lineHeight: 1.7 }}>
                El Departamento de Policía La Sabana trabaja permanentemente para garantizar la seguridad de los visitantes y residentes de la región. Ante cualquier situación de riesgo, no dudes en comunicarte con nosotros. Recuerda: una denuncia oportuna puede salvar vidas.
              </p>
            </div>
          </div>
        </div>

        {/* Acompañamiento: fotos del Grupo de Protección al Turismo */}
        <section id="acompanamiento" className="mt-14 scroll-mt-24">
          <div style={{ fontFamily: font.jost, fontSize: '12px', fontWeight: 600, color: '#007934', letterSpacing: '0.12em', marginBottom: '8px' }}>TE ACOMPAÑAMOS</div>
          <h2 style={{ fontFamily: font.barlow, fontSize: '32px', fontWeight: 600, color: '#233530', marginBottom: '8px' }}>Policía de Turismo en la Sabana</h2>
          <p style={{ fontFamily: font.jost, fontSize: '14px', color: '#76777A', lineHeight: 1.7, marginBottom: '24px', maxWidth: '720px' }}>
            El Grupo de Protección al Turismo y Patrimonio Nacional acompaña a visitantes en los destinos, eventos y recorridos de la región, y adelanta campañas de prevención y control a prestadores turísticos.
          </p>
          <PoliceGallery photos={getPolicePhotos()} />
        </section>
      </div>
    </div>
  )
}
