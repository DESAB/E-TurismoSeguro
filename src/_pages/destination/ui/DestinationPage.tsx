import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Clock, ExternalLink, Info, MapPin, Phone } from 'lucide-react'
import { CategoryBadge, DestinationCard } from '@/entities/destination'
import type { Metadata } from 'next'
import { getDestinationBySlug, getDestinations, getMunicipality, getPoliceStations, type Destination } from '@/shared/api'
import { exploreParams, routes, site } from '@/shared/config'
import { absoluteUrl, formatPhone, pageMetadata, slugify, telHref } from '@/shared/lib'
import { BackButton, Breadcrumb, font, JsonLd, PoliceShield } from '@/shared/ui'
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
    image: dest.images[0],
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
        image: dest.images.map(absoluteUrl),
        ...(dest.phone && { telephone: dest.phone }),
        ...(dest.website && { sameAs: [dest.website] }),
        address: {
          '@type': 'PostalAddress',
          ...(dest.address && { streetAddress: dest.address }),
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

  const related = getDestinations().filter(d => d.id !== dest.id && (d.municipality === dest.municipality || d.categories.some(c => dest.categories.includes(c)))).slice(0, 3)
  const stations = getPoliceStations(dest.municipality)
  const tourismLinks = getMunicipality(dest.municipality)?.tourismLinks ?? []

  return (
    <div style={{ paddingTop: '64px' }}>
      <JsonLd data={destinationJsonLd(dest)} />
      {/* Hero */}
      <div style={{ position: 'relative', height: '420px', backgroundColor: '#142749', overflow: 'hidden' }}>
        <Image
          src={dest.images[0]}
          alt={dest.name}
          fill
          sizes="100vw"
          loading="eager"
          fetchPriority="high"
          style={{ objectFit: 'cover', opacity: 0.65 }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(20,39,73,0.85) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)' }} />
        <div style={{ position: 'absolute', bottom: '40px', left: '0', right: '0' }}>
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-5">
              <BackButton fallbackHref={routes.explore} />
            </div>
            <Breadcrumb items={[
              { label: 'Inicio', href: routes.home },
              { label: 'Explorar', href: routes.explore },
              { label: dest.municipality, href: `${routes.explore}?${exploreParams.municipality}=${slugify(dest.municipality)}` },
              { label: dest.name },
            ]} />
            <div className="flex flex-wrap items-center gap-2 mt-4 mb-2">
              {dest.categories.map(c => <CategoryBadge key={c} category={c} />)}
            </div>
            <h1 style={{ fontFamily: font.heading, fontSize: 'clamp(36px, 4vw, 56px)', fontWeight: 700, color: 'white', lineHeight: 1.05 }}>{dest.name}</h1>
            <p style={{ fontFamily: font.body, color: 'rgba(255,255,255,0.8)', fontSize: '15px', marginTop: '8px' }}>{dest.municipality}, Cundinamarca</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Main content */}
          <div className="md:col-span-2">
            <h2 style={{ fontFamily: font.heading, fontSize: '28px', fontWeight: 600, color: '#142749', marginBottom: '16px' }}>Sobre este destino</h2>
            <div style={{ marginBottom: '32px' }}>
              {dest.longDescription.split('\n\n').map((paragraph, i) => (
                <p key={i} style={{ fontFamily: font.body, fontSize: '15px', color: '#333', lineHeight: 1.8, marginTop: i ? '12px' : 0 }}>{paragraph}</p>
              ))}
            </div>

            {/* Gallery */}
            <h2 style={{ fontFamily: font.heading, fontSize: '28px', fontWeight: 600, color: '#142749', marginBottom: '16px' }}>Galería fotográfica</h2>
            <DestinationGallery name={dest.name} images={dest.images} />

            {/* Security recommendations */}
            <div style={{ backgroundColor: '#142749', borderRadius: '12px', padding: '28px', marginBottom: '32px' }}>
              <div className="flex items-start sm:items-center gap-3">
                <PoliceShield size={32} />
                <div>
                  <h2 style={{ fontFamily: font.heading, fontSize: '24px', fontWeight: 600, color: 'white' }}>Recomendaciones para tu visita</h2>
                  <p style={{ fontFamily: font.body, fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>Policía Nacional de Colombia · Departamento La Sabana</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                {dest.tips.map((tip, i) => (
                  <div key={i} style={{ backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: '12px', padding: '14px', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ marginBottom: '8px' }}>
                      <Info size={16} color="#BAFF00" strokeWidth={2} />
                    </div>
                    <p style={{ fontFamily: font.body, fontSize: '13px', color: 'rgba(255,255,255,0.8)', lineHeight: 1.5 }}>{tip}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Location */}
            <h2 style={{ fontFamily: font.heading, fontSize: '28px', fontWeight: 600, color: '#142749', marginBottom: '16px' }}>¿Cómo llegar?</h2>
            <div style={{ backgroundColor: '#F7F7F5', borderRadius: '10px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ fontFamily: font.body, fontWeight: 500, fontSize: '14px', color: '#333', marginBottom: '6px', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <MapPin size={15} color="#007934" strokeWidth={2} style={{ flexShrink: 0, marginTop: '2px' }} />{dest.address ?? `${dest.municipality}, Cundinamarca`}
                </div>
                {dest.hours && (
                  <div style={{ fontFamily: font.body, fontSize: '13px', color: '#4B5563', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Clock size={14} color="#4B5563" strokeWidth={2} />{dest.hours}
                  </div>
                )}
                {dest.phone && (
                  <div style={{ fontFamily: font.body, fontSize: '13px', color: '#4B5563', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Phone size={14} color="#4B5563" strokeWidth={2} /><a href={telHref(dest.phone)} className="hover:underline">{dest.phone}</a>
                  </div>
                )}
              </div>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(dest.name + ' ' + dest.municipality + ' Colombia')}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontFamily: font.body, fontWeight: 600, fontSize: '13px', backgroundColor: '#007934', color: 'white', padding: '10px 20px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}
              >
                <ExternalLink size={14} strokeWidth={2} />
                Abrir en Maps
              </a>
            </div>
          </div>

          {/* Sidebar info */}
          <div>
            <div style={{ position: 'sticky', top: '80px' }}>
              <div className="ui-card" style={{ marginBottom: '20px' }}>
                <div style={{ backgroundColor: '#007934', padding: '16px' }}>
                  <h3 style={{ fontFamily: font.heading, fontSize: '18px', fontWeight: 600, color: 'white' }}>Información del destino</h3>
                </div>
                <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[
                    { label: 'Municipio', value: dest.municipality },
                    { label: dest.categories.length > 1 ? 'Categorías' : 'Categoría', value: dest.categories.join(', ') },
                    { label: 'Departamento', value: 'Cundinamarca' },
                    ...(dest.hours ? [{ label: 'Horario', value: dest.hours }] : []),
                  ].map(item => (
                    <div key={item.label} style={{ borderBottom: '1px solid #F1F1EF', paddingBottom: '10px' }}>
                      <div style={{ fontFamily: font.body, fontSize: '12px', fontWeight: 600, color: '#4B5563', letterSpacing: '0.06em', marginBottom: '2px' }}>{item.label.toUpperCase()}</div>
                      <div style={{ fontFamily: font.body, fontSize: '14px', color: '#333', fontWeight: 500 }}>{item.value}</div>
                    </div>
                  ))}
                  {(dest.website || tourismLinks.length > 0) && (
                    <div style={{ borderBottom: '1px solid #F1F1EF', paddingBottom: '10px' }}>
                      <div style={{ fontFamily: font.body, fontSize: '12px', fontWeight: 600, color: '#4B5563', letterSpacing: '0.06em', marginBottom: '2px' }}>MÁS INFORMACIÓN</div>
                      {[
                        ...(dest.website ? [{ href: dest.website, label: 'Página del sitio' }] : []),
                        ...tourismLinks.map((href, i) => ({ href, label: `Turismo ${dest.municipality}${tourismLinks.length > 1 ? ` (${i + 1})` : ''}` })),
                      ].map(link => (
                        <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:underline" style={{ fontFamily: font.body, fontSize: '14px', color: '#007934', fontWeight: 500, padding: '2px 0' }}>
                          {link.label} <ExternalLink size={12} strokeWidth={2} />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="ui-card" style={{ padding: '16px' }}>
                <div style={{ fontFamily: font.body, fontSize: '12px', fontWeight: 600, color: '#007934', marginBottom: '8px' }}>EMERGENCIAS</div>
                <div style={{ fontFamily: font.body, fontSize: '14px', color: '#333', fontWeight: 600, marginBottom: '4px' }}>Policía Nacional: <a href="tel:123">123</a></div>
                <div style={{ fontFamily: font.body, fontSize: '14px', color: '#333', fontWeight: 600, marginBottom: '4px' }}>Emergencias: <a href="tel:112">112</a></div>
                {stations.length > 0 && (
                  <div style={{ borderTop: '1px solid #E8EEF2', marginTop: '12px', paddingTop: '12px' }}>
                    <div style={{ fontFamily: font.body, fontSize: '12px', fontWeight: 600, color: '#007934', marginBottom: '6px' }}>POLICÍA EN {dest.municipality.toUpperCase()}</div>
                    {stations.map(s => (
                      <div key={s.name} style={{ fontFamily: font.body, fontSize: '13px', color: '#333', marginBottom: '6px', lineHeight: 1.4 }}>
                        {s.name}<br />
                        <a href={telHref(s.phone)} style={{ fontWeight: 600 }} className="hover:underline">{formatPhone(s.phone)}</a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related destinations */}
        {related.length > 0 && (
          <div style={{ marginTop: '48px', paddingTop: '40px', borderTop: '1px solid #E8EEF2' }}>
            <h2 style={{ fontFamily: font.heading, fontSize: '28px', fontWeight: 600, color: '#142749', marginBottom: '24px' }}>También puedes explorar</h2>
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
