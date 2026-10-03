import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Clock, ExternalLink, Info, MapPin } from 'lucide-react'
import { CategoryBadge, DestinationCard } from '@/entities/destination'
import type { Metadata } from 'next'
import { getDestinationBySlug, getDestinations, type Destination } from '@/shared/api'
import { routes, site } from '@/shared/config'
import { pageMetadata, unsplashSrc, unsplashUrl } from '@/shared/lib'
import { Breadcrumb, font, JsonLd, PoliceShield } from '@/shared/ui'
import { DestinationGallery } from './DestinationGallery'

type DestinationParams = { params: Promise<{ slug: string }> }

/** Pre-renderiza una página por destino en el build. */
export function generateStaticParams() {
  return getDestinations().map(d => ({ slug: d.slug }))
}

export async function generateMetadata({ params }: DestinationParams): Promise<Metadata> {
  const dest = getDestinationBySlug((await params).slug)
  if (!dest) return {}
  return pageMetadata({
    // "Catedral de Sal en Zipaquirá", pero no "Parque y Templo de Chía en Chía"
    title: dest.name.includes(dest.municipality) ? dest.name : `${dest.name} en ${dest.municipality}`,
    description: dest.description,
    path: routes.destination(dest.slug),
    imageId: dest.imageId,
    imageAlt: dest.name,
  })
}

/** Datos estructurados para Google: el lugar turístico y su ruta de navegación. */
function destinationJsonLd(dest: Destination) {
  const url = `${site.url}${routes.destination(dest.slug)}`
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'TouristAttraction',
        '@id': url,
        name: dest.name,
        description: dest.longDescription,
        url,
        image: dest.images.map(id => unsplashUrl(id, 1200, 800)),
        address: {
          '@type': 'PostalAddress',
          streetAddress: dest.address,
          addressLocality: dest.municipality,
          addressRegion: 'Cundinamarca',
          addressCountry: 'CO',
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${site.url}${routes.home}` },
          { '@type': 'ListItem', position: 2, name: 'Explorar', item: `${site.url}${routes.explore}` },
          { '@type': 'ListItem', position: 3, name: dest.name, item: url },
        ],
      },
    ],
  }
}

export async function DestinationPage({ params }: DestinationParams) {
  const { slug } = await params
  const dest = getDestinationBySlug(slug)
  if (!dest) notFound()

  const related = getDestinations().filter(d => d.id !== dest.id && (d.municipality === dest.municipality || d.category === dest.category)).slice(0, 3)

  return (
    <div style={{ paddingTop: '64px' }}>
      <JsonLd data={destinationJsonLd(dest)} />
      {/* Hero */}
      <div style={{ position: 'relative', height: '420px', backgroundColor: '#233530', overflow: 'hidden' }}>
        <Image
          src={unsplashSrc(dest.imageId)}
          alt={dest.name}
          fill
          sizes="100vw"
          loading="eager"
          fetchPriority="high"
          style={{ objectFit: 'cover', opacity: 0.65 }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,41,20,0.85) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)' }} />
        <div style={{ position: 'absolute', bottom: '40px', left: '0', right: '0' }}>
          <div className="max-w-7xl mx-auto px-6">
            <Breadcrumb items={[
              { label: 'Inicio', href: routes.home },
              { label: 'Explorar', href: routes.explore },
              { label: dest.municipality },
              { label: dest.name },
            ]} />
            <div className="flex items-center gap-3 mt-4 mb-2">
              <CategoryBadge category={dest.category} />
            </div>
            <h1 style={{ fontFamily: font.barlow, fontSize: 'clamp(36px, 4vw, 56px)', fontWeight: 700, color: 'white', lineHeight: 1.05 }}>{dest.name}</h1>
            <p style={{ fontFamily: font.jost, color: 'rgba(255,255,255,0.8)', fontSize: '15px', marginTop: '8px' }}>{dest.municipality}, Cundinamarca</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Main content */}
          <div className="md:col-span-2">
            <h2 style={{ fontFamily: font.barlow, fontSize: '28px', fontWeight: 600, color: '#233530', marginBottom: '16px' }}>Sobre este destino</h2>
            <p style={{ fontFamily: font.jost, fontSize: '15px', color: '#333', lineHeight: 1.8, marginBottom: '32px' }}>{dest.longDescription}</p>

            {/* Gallery */}
            <h2 style={{ fontFamily: font.barlow, fontSize: '28px', fontWeight: 600, color: '#233530', marginBottom: '16px' }}>Galería fotográfica</h2>
            <DestinationGallery name={dest.name} images={dest.images} />

            {/* Security recommendations */}
            <div style={{ backgroundColor: '#233530', borderRadius: '12px', padding: '28px', marginBottom: '32px' }}>
              <div className="flex items-center gap-3">
                <PoliceShield size={32} />
                <div>
                  <h2 style={{ fontFamily: font.barlow, fontSize: '24px', fontWeight: 600, color: 'white' }}>Recomendaciones para tu visita</h2>
                  <p style={{ fontFamily: font.jost, fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>Policía Nacional de Colombia · Departamento La Sabana</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                {dest.tips.map((tip, i) => (
                  <div key={i} style={{ backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: '8px', padding: '14px', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ marginBottom: '8px' }}>
                      <Info size={16} color="#C2D500" strokeWidth={2} />
                    </div>
                    <p style={{ fontFamily: font.jost, fontSize: '13px', color: 'rgba(255,255,255,0.8)', lineHeight: 1.5 }}>{tip}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Location */}
            <h2 style={{ fontFamily: font.barlow, fontSize: '28px', fontWeight: 600, color: '#233530', marginBottom: '16px' }}>¿Cómo llegar?</h2>
            <div style={{ backgroundColor: '#F7F7F5', borderRadius: '10px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ fontFamily: font.jost, fontWeight: 500, fontSize: '14px', color: '#333', marginBottom: '6px', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <MapPin size={15} color="#007934" strokeWidth={2} style={{ flexShrink: 0, marginTop: '2px' }} />{dest.address}
                </div>
                <div style={{ fontFamily: font.jost, fontSize: '13px', color: '#76777A', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Clock size={14} color="#76777A" strokeWidth={2} />{dest.hours}
                </div>
              </div>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(dest.name + ' ' + dest.municipality + ' Colombia')}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontFamily: font.jost, fontWeight: 600, fontSize: '13px', backgroundColor: '#007934', color: 'white', padding: '10px 20px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}
              >
                <ExternalLink size={14} strokeWidth={2} />
                Abrir en Maps
              </a>
            </div>
          </div>

          {/* Sidebar info */}
          <div>
            <div style={{ position: 'sticky', top: '80px' }}>
              <div style={{ border: '1px solid #E5E5E5', borderRadius: '10px', overflow: 'hidden', marginBottom: '20px' }}>
                <div style={{ backgroundColor: '#007934', padding: '16px' }}>
                  <h3 style={{ fontFamily: font.barlow, fontSize: '18px', fontWeight: 600, color: 'white' }}>Información del destino</h3>
                </div>
                <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[
                    { label: 'Municipio', value: dest.municipality },
                    { label: 'Categoría', value: dest.category },
                    { label: 'Departamento', value: 'Cundinamarca' },
                    { label: 'Horario', value: dest.hours },
                  ].map(item => (
                    <div key={item.label} style={{ borderBottom: '1px solid #F1F1EF', paddingBottom: '10px' }}>
                      <div style={{ fontFamily: font.jost, fontSize: '11px', fontWeight: 600, color: '#76777A', letterSpacing: '0.06em', marginBottom: '2px' }}>{item.label.toUpperCase()}</div>
                      <div style={{ fontFamily: font.jost, fontSize: '14px', color: '#333', fontWeight: 500 }}>{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ border: '1px solid #E5E5E5', borderRadius: '10px', padding: '16px', backgroundColor: '#F7F7F5' }}>
                <div style={{ fontFamily: font.jost, fontSize: '12px', fontWeight: 600, color: '#007934', marginBottom: '8px' }}>EMERGENCIAS</div>
                <div style={{ fontFamily: font.jost, fontSize: '14px', color: '#333', fontWeight: 600, marginBottom: '4px' }}>Policía Nacional: 123</div>
                <div style={{ fontFamily: font.jost, fontSize: '14px', color: '#333', fontWeight: 600, marginBottom: '4px' }}>Emergencias: 112</div>
                <div style={{ fontFamily: font.jost, fontSize: '12px', color: '#76777A' }}>App MI POLICÍA disponible</div>
              </div>
            </div>
          </div>
        </div>

        {/* Related destinations */}
        {related.length > 0 && (
          <div style={{ marginTop: '48px', paddingTop: '40px', borderTop: '1px solid #E5E5E5' }}>
            <h2 style={{ fontFamily: font.barlow, fontSize: '28px', fontWeight: 600, color: '#233530', marginBottom: '24px' }}>También puedes explorar</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map(d => (
                <DestinationCard key={d.id} dest={d} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
