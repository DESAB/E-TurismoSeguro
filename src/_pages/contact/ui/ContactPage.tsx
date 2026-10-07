import Image from 'next/image'
import { getMunicipalities, policeTeamPhoto } from '@/shared/api'
import { routes } from '@/shared/config'
import { pageMetadata } from '@/shared/lib'
import { Breadcrumb, font, PoliceShield } from '@/shared/ui'
import { channels, contactInfo } from '../model/contact-data'
import { ChannelCards, ContactInfoCard } from './ContactCards'

export const metadata = pageMetadata({
  title: 'Contacto · Departamento de Policía La Sabana',
  description: 'Dirección, teléfonos, correo y canales de atención del Departamento de Policía La Sabana. Emergencias: línea 123.',
  path: routes.contact,
})

export function ContactPage() {
  return (
    <div style={{ paddingTop: '64px' }}>
      <div className="pt-20 pb-7 md:pb-12" style={{ backgroundColor: '#142749' }}>
        <div className="max-w-7xl mx-auto px-6">
          <Breadcrumb items={[{ label: 'Inicio', href: routes.home }, { label: 'Contacto' }]} />
          <h1 className="text-[34px] md:text-[48px]" style={{ fontFamily: font.heading, fontWeight: 700, color: 'white', marginTop: '16px' }}>Contacto</h1>
          <p style={{ fontFamily: font.body, color: 'rgba(255,255,255,0.75)', fontSize: '16px' }}>Información institucional y canales de comunicación</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Institutional info */}
          <div>
            <div className="flex items-center gap-4 mb-6">
              <PoliceShield size={52} />
              <div>
                <h2 style={{ fontFamily: font.heading, fontSize: '26px', fontWeight: 700, color: '#142749' }}>Policía Nacional de Colombia</h2>
                <p style={{ fontFamily: font.body, color: '#4B5563', fontSize: '14px' }}>Departamento de Policía La Sabana</p>
              </div>
            </div>
            <p style={{ fontFamily: font.body, fontSize: '14px', color: '#4B5563', lineHeight: 1.8, marginBottom: '24px' }}>
              El Departamento de Policía La Sabana tiene jurisdicción sobre {getMunicipalities().length} municipios del departamento de Cundinamarca. Trabajamos por la seguridad, la convivencia y el bienestar de ciudadanos y visitantes.
            </p>
            <ContactInfoCard items={contactInfo} />
          </div>

          {/* Contact channels + emergency */}
          <div>
            <h3 style={{ fontFamily: font.heading, fontSize: '24px', fontWeight: 600, color: '#142749', marginBottom: '16px' }}>Canales de atención</h3>
            <ChannelCards channels={channels} />

            <div style={{ backgroundColor: '#142749', borderRadius: '12px', padding: '24px' }}>
              <h3 style={{ fontFamily: font.heading, fontSize: '22px', fontWeight: 700, color: 'white', marginBottom: '4px' }}>¿Necesitas ayuda inmediata?</h3>
              <p style={{ fontFamily: font.body, fontSize: '13px', color: 'rgba(255,255,255,0.75)', marginBottom: '16px' }}>Llama a la línea de emergencias de la Policía Nacional</p>
              <a href="tel:123" aria-label="Llamar al 123" className="block" style={{ fontFamily: font.heading, fontSize: '52px', fontWeight: 800, color: '#BAFF00', lineHeight: 1 }}>123</a>
              <p style={{ fontFamily: font.body, fontSize: '12px', color: 'rgba(255,255,255,0.75)', marginTop: '4px' }}>Disponible las 24 horas, los 365 días del año</p>
            </div>
          </div>
        </div>

        {/* DESAB — Grupo de Protección al Turismo y Patrimonio Nacional */}
        <div className="mt-12">
          <h3 style={{ fontFamily: font.heading, fontSize: '24px', fontWeight: 600, color: '#142749', marginBottom: '4px' }}>Protección al Turismo</h3>
          <p style={{ fontFamily: font.body, fontSize: '14px', color: '#4B5563', marginBottom: '16px' }}>
            Grupo de Protección al Turismo y Patrimonio Nacional (DESAB):{' '}
            <a href="tel:+573223486067" className="hover:underline" style={{ color: '#007934', fontWeight: 600 }}>322 348 6067</a>
            {' / '}
            <a href="tel:+573223486071" className="hover:underline" style={{ color: '#007934', fontWeight: 600 }}>322 348 6071</a>
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <figure style={{ margin: 0 }}>
              <Image
                src={policeTeamPhoto.src}
                alt={policeTeamPhoto.caption}
                width={policeTeamPhoto.width}
                height={policeTeamPhoto.height}
                sizes="(min-width: 1280px) 604px, (min-width: 768px) 50vw, 100vw"
                style={{ width: '100%', height: 'auto', borderRadius: '12px' }}
              />
              <figcaption style={{ fontFamily: font.body, fontSize: '12px', color: '#4B5563', marginTop: '8px' }}>El equipo que te atiende: {policeTeamPhoto.caption}</figcaption>
            </figure>
            <Image
              src="/contacto/desab.jpg"
              alt="DESAB — Grupo de Protección al Turismo y Patrimonio Nacional. Teléfonos 3223486067 y 3223486071"
              width={1600}
              height={908}
              sizes="(min-width: 1280px) 604px, (min-width: 768px) 50vw, 100vw"
              style={{ width: '100%', height: 'auto', borderRadius: '12px', border: '1px solid #E8EEF2' }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
