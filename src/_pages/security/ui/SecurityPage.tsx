import { getPolicePhotos, getSecurityTips } from '@/shared/api'
import { routes } from '@/shared/config'
import { pageMetadata } from '@/shared/lib'
import { Breadcrumb, font, PoliceShield } from '@/shared/ui'
import { PoliceGallery } from './PoliceGallery'
import { SecurityTipCards } from './SecurityTipCards'

export const metadata = pageMetadata({
  title: 'Viaja seguro: recomendaciones de la Policía Nacional',
  description: 'Consejos de la Policía Nacional para visitar los municipios del Departamento de Policía La Sabana de forma segura: pertenencias, seguridad digital, transporte y números de emergencia.',
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
      <div className="pt-20 pb-7 md:pb-12" style={{ backgroundColor: '#142749' }}>
        <div className="max-w-7xl mx-auto px-6">
          <Breadcrumb items={[{ label: 'Inicio', href: routes.home }, { label: 'Viaja seguro' }]} />
          <div className="flex items-center gap-4 mt-6">
            <PoliceShield size={48} />
            <div>
              <h1 className="text-[34px] md:text-[48px]" style={{ fontFamily: font.heading, fontWeight: 700, color: 'white', lineHeight: 1 }}>Viaja seguro</h1>
              <p style={{ fontFamily: font.body, color: 'rgba(255,255,255,0.7)', fontSize: '16px', marginTop: '8px' }}>Recomendaciones de la Policía Nacional para tu visita a la Sabana</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12">
          <SecurityTipCards tips={securityTips} />
        </div>

        {/* Emergency numbers */}
        <div className="px-6 py-8 md:px-10 md:py-9" style={{ backgroundColor: '#142749', borderRadius: '12px', marginBottom: '12px' }}>
          <h2 style={{ fontFamily: font.heading, fontSize: '32px', fontWeight: 700, color: 'white', marginBottom: '8px' }}>Números de emergencia</h2>
          <p style={{ fontFamily: font.body, color: 'rgba(255,255,255,0.75)', fontSize: '14px', marginBottom: '28px' }}>Guárdalos en tu teléfono antes de salir</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {emergencyNumbers.map(item => (
              <a key={item.number} href={`tel:${item.number}`} aria-label={`Llamar a ${item.label}: ${item.number}`} className="block" style={{ backgroundColor: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
                <div style={{ fontFamily: font.heading, fontSize: '36px', fontWeight: 800, color: '#BAFF00' }}>{item.number}</div>
                <div style={{ fontFamily: font.body, fontSize: '12px', color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>{item.label}</div>
              </a>
            ))}
          </div>
        </div>

        {/* Institutional message */}
        <div style={{ backgroundColor: '#F7F7F5', borderRadius: '12px', padding: '28px', borderLeft: '4px solid #007934', marginTop: '24px' }}>
          <div className="flex items-start gap-4">
            <PoliceShield size={40} />
            <div>
              <h3 style={{ fontFamily: font.heading, fontSize: '22px', fontWeight: 600, color: '#142749', marginBottom: '8px' }}>Policía Nacional de Colombia a tu servicio</h3>
              <p style={{ fontFamily: font.body, fontSize: '14px', color: '#4B5563', lineHeight: 1.7 }}>
                El Departamento de Policía La Sabana trabaja permanentemente para garantizar la seguridad de los visitantes y residentes de la región. Ante cualquier situación de riesgo, no dudes en comunicarte con nosotros. Recuerda: una denuncia oportuna puede salvar vidas.
              </p>
            </div>
          </div>
        </div>

        {/* Acompañamiento: fotos del Grupo de Protección al Turismo */}
        <section id="acompanamiento" className="mt-14 scroll-mt-24">
          <div style={{ fontFamily: font.body, fontSize: '12px', fontWeight: 600, color: '#007934', letterSpacing: '0.12em', marginBottom: '8px' }}>TE ACOMPAÑAMOS</div>
          <h2 style={{ fontFamily: font.heading, fontSize: '32px', fontWeight: 600, color: '#142749', marginBottom: '8px' }}>Policía de Turismo en la Sabana</h2>
          <p style={{ fontFamily: font.body, fontSize: '14px', color: '#4B5563', lineHeight: 1.7, marginBottom: '24px', maxWidth: '720px' }}>
            El Grupo de Protección al Turismo y Patrimonio Nacional acompaña a visitantes en los destinos, eventos y recorridos de la región, y adelanta campañas de prevención y control a prestadores turísticos.
          </p>
          <PoliceGallery photos={getPolicePhotos()} />
        </section>
      </div>
    </div>
  )
}
