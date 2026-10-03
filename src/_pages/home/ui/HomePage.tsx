import type { CSSProperties } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Landmark, Leaf, Mountain, Play, Theater, Users, UtensilsCrossed, type LucideIcon } from 'lucide-react'
import { DestinationCard } from '@/entities/destination'
import { getDestinations, getMunicipalities, getSecurityTips, getVideos } from '@/shared/api'
import { exploreParams, routes, site } from '@/shared/config'
import { pageMetadata, slugify } from '@/shared/lib'
import { font, JsonLd } from '@/shared/ui'
import styles from './home-page.module.css'

export const metadata = {
  ...pageMetadata({ title: site.title, description: site.description, path: routes.home, imageAlt: 'Cerro El Tablazo, Subachoque' }),
  // El título del inicio no lleva el sufijo "· E-TurismoSeguro" del layout
  title: { absolute: site.title },
}

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: site.name,
  url: site.url,
  description: site.description,
  inLanguage: 'es-CO',
}

const categories: { name: string; Icon: LucideIcon; color: string; bg: string }[] = [
  { name: 'Naturaleza',  Icon: Leaf,            color: '#007934', bg: '#e8f5e2' },
  { name: 'Patrimonio',  Icon: Landmark,        color: '#1a56ab', bg: '#e8f0fb' },
  { name: 'Cultura',     Icon: Theater,         color: '#92500a', bg: '#fef3e2' },
  { name: 'Gastronomía', Icon: UtensilsCrossed, color: '#9b1c1c', bg: '#fde8e8' },
  { name: 'Familiar',    Icon: Users,           color: '#6b21a8', bg: '#f3e8ff' },
  { name: 'Aventura',    Icon: Mountain,        color: '#92400e', bg: '#fff3cd' },
]

export function HomePage() {
  const destinations = getDestinations()
  const municipalities = getMunicipalities()
  const videos = getVideos()
  const securityTips = getSecurityTips()

  return (
    <div>
      <JsonLd data={websiteJsonLd} />
      {/* Hero */}
      <section style={{ position: 'relative', height: '580px', overflow: 'hidden', backgroundColor: '#233530' }}>
        <Image
          src="/destinos/cerro-el-tablazo/1.jpg"
          alt="Cerro El Tablazo, Subachoque, Sabana de Bogotá"
          fill
          sizes="100vw"
          loading="eager"
          fetchPriority="high"
          style={{ objectFit: 'cover', opacity: 0.72 }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,41,20,0.82) 0%, rgba(0,41,20,0.4) 60%, transparent 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center' }}>
          <div className="max-w-7xl mx-auto px-6 w-full">
            <div style={{ maxWidth: '580px' }}>
              <div style={{ fontFamily: font.jost, fontSize: '12px', fontWeight: 500, color: '#C2D500', letterSpacing: '0.18em', marginBottom: '16px' }}>
                POLICÍA NACIONAL DE COLOMBIA · LA SABANA
              </div>
              <h1 style={{ fontFamily: font.barlow, fontSize: 'clamp(40px, 5vw, 68px)', fontWeight: 700, color: 'white', lineHeight: 1.05, marginBottom: '20px' }}>
                Descubre la<br />
                <span style={{ color: '#C2D500' }}>Sabana de Bogotá</span>
              </h1>
              <p style={{ fontFamily: font.jost, fontSize: '17px', color: 'rgba(255,255,255,0.82)', lineHeight: 1.7, marginBottom: '32px', fontWeight: 300 }}>
                Explora municipios, patrimonio, naturaleza y lugares turísticos de manera segura.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href={routes.explore}
                  className={`${styles.heroPrimary} flex items-center`}
                  style={{ fontFamily: font.jost, fontWeight: 600, fontSize: '14px', color: 'white', padding: '12px 28px', borderRadius: '7px', letterSpacing: '0.02em' }}
                >
                  Explorar destinos
                </Link>
                <Link
                  href={routes.map}
                  className={`${styles.heroSecondary} flex items-center`}
                  style={{ fontFamily: font.jost, fontWeight: 600, fontSize: '14px', backgroundColor: 'transparent', color: 'white', padding: '12px 28px', borderRadius: '7px', letterSpacing: '0.02em' }}
                >
                  Ver mapa
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section style={{ backgroundColor: '#F7F7F5', padding: '64px 0' }}>
        <div className="max-w-7xl mx-auto px-6">
          <h2 style={{ fontFamily: font.barlow, fontSize: '36px', fontWeight: 600, color: '#233530', marginBottom: '8px' }}>¿Qué quieres descubrir?</h2>
          <p style={{ fontFamily: font.jost, color: '#76777A', fontSize: '15px', marginBottom: '36px' }}>Selecciona una categoría para explorar destinos de tu interés</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {categories.map(cat => (
              <Link
                key={cat.name}
                href={`${routes.explore}?${exploreParams.category}=${slugify(cat.name)}`}
                className={styles.category}
                style={{
                  '--cat-color': cat.color,
                  '--cat-bg': cat.bg,
                  borderRadius: '10px',
                  padding: '20px 12px',
                  textAlign: 'center',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px',
                } as CSSProperties}
              >
                <div
                  className={styles.categoryIcon}
                  style={{
                    width: '44px', height: '44px', borderRadius: '10px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <cat.Icon size={22} strokeWidth={1.75} />
                </div>
                <span className={styles.categoryLabel} style={{ fontFamily: font.jost, fontWeight: 600, fontSize: '13px' }}>
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section style={{ padding: '72px 0', backgroundColor: 'white' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
            <div>
              <div style={{ fontFamily: font.jost, fontSize: '12px', fontWeight: 600, color: '#007934', letterSpacing: '0.12em', marginBottom: '8px' }}>DESCUBRE</div>
              <h2 style={{ fontFamily: font.barlow, fontSize: '36px', fontWeight: 600, color: '#233530' }}>Destinos destacados</h2>
            </div>
            <Link
              href={routes.explore}
              style={{ fontFamily: font.jost, fontWeight: 600, fontSize: '13px', color: '#007934', border: '1.5px solid #007934', padding: '8px 20px', borderRadius: '6px' }}
            >
              Ver todos
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {destinations.slice(0, 3).map(dest => (
              <DestinationCard key={dest.id} dest={dest} />
            ))}
          </div>
        </div>
      </section>

      {/* Map preview teaser */}
      <section style={{ padding: '72px 0', backgroundColor: '#F7F7F5' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div style={{ fontFamily: font.jost, fontSize: '12px', fontWeight: 600, color: '#007934', letterSpacing: '0.12em', marginBottom: '8px' }}>TERRITORIO</div>
              <h2 style={{ fontFamily: font.barlow, fontSize: '40px', fontWeight: 600, color: '#233530', lineHeight: 1.1, marginBottom: '16px' }}>Explora el<br />territorio</h2>
              <p style={{ fontFamily: font.jost, color: '#76777A', fontSize: '15px', lineHeight: 1.7, marginBottom: '28px' }}>
                Encuentra municipios y lugares turísticos de la Sabana de Bogotá en nuestro mapa interactivo. Selecciona un municipio y descubre sus destinos.
              </p>
              <div className="flex flex-col gap-3 mb-8">
                {municipalities.slice(0, 4).map(m => (
                  <div key={m} className="flex items-center gap-3">
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#007934', flexShrink: 0 }} />
                    <span style={{ fontFamily: font.jost, fontSize: '14px', color: '#333' }}>{m}</span>
                  </div>
                ))}
                <div style={{ fontFamily: font.jost, fontSize: '13px', color: '#76777A' }}>y más municipios...</div>
              </div>
              <Link
                href={routes.map}
                className="inline-block"
                style={{ fontFamily: font.jost, fontWeight: 600, fontSize: '14px', backgroundColor: '#007934', color: 'white', padding: '12px 28px', borderRadius: '7px' }}
              >
                Abrir mapa interactivo
              </Link>
            </div>
            <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 8px 40px rgba(0,0,0,0.12)' }}>
              <Image
                src="/destinos/piedras-de-chivonegro/1.jpg"
                alt="Piedras de Chivonegro, Bojacá, Sabana de Bogotá"
                width={700}
                height={380}
                sizes="(min-width: 1280px) 616px, (min-width: 768px) 50vw, 100vw"
                style={{ width: '100%', height: '380px', objectFit: 'cover', display: 'block' }}
              />
              <div style={{ position: 'absolute', bottom: '20px', left: '20px', background: 'white', borderRadius: '8px', padding: '12px 16px', boxShadow: '0 4px 16px rgba(0,0,0,0.12)' }}>
                <div style={{ fontFamily: font.barlow, fontWeight: 600, fontSize: '16px', color: '#233530' }}>Sabana de Bogotá</div>
                <div style={{ fontFamily: font.jost, fontSize: '12px', color: '#76777A' }}>{destinations.length} destinos · {municipalities.length} municipios</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Travel Safe */}
      <section style={{ backgroundColor: '#233530', padding: '72px 0' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
            <div>
              <div style={{ fontFamily: font.jost, fontSize: '12px', fontWeight: 600, color: '#C2D500', letterSpacing: '0.12em', marginBottom: '8px' }}>POLICÍA NACIONAL</div>
              <h2 style={{ fontFamily: font.barlow, fontSize: '36px', fontWeight: 600, color: 'white' }}>Viaja seguro</h2>
              <p style={{ fontFamily: font.jost, color: 'rgba(255,255,255,0.65)', fontSize: '15px', marginTop: '8px' }}>Recomendaciones para disfrutar tu visita de manera responsable y segura</p>
            </div>
            <Link
              href={routes.security}
              style={{ fontFamily: font.jost, fontWeight: 600, fontSize: '13px', color: '#C2D500', border: '1.5px solid #C2D500', padding: '8px 20px', borderRadius: '6px' }}
            >
              Ver todas las recomendaciones
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {securityTips.slice(0, 4).map(tip => (
              <div key={tip.title} style={{ backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '10px', padding: '24px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ marginBottom: '14px' }}>
                  <tip.icon size={24} color="#C2D500" strokeWidth={1.75} />
                </div>
                <h3 style={{ fontFamily: font.jost, fontWeight: 600, fontSize: '15px', color: 'white', marginBottom: '8px' }}>{tip.title}</h3>
                <p style={{ fontFamily: font.jost, fontSize: '13px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>{tip.tips[0]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video highlight */}
      <section style={{ padding: '72px 0', backgroundColor: 'white' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div style={{ fontFamily: font.jost, fontSize: '12px', fontWeight: 600, color: '#007934', letterSpacing: '0.12em', marginBottom: '8px' }}>CONOCE LA SABANA</div>
          <h2 style={{ fontFamily: font.barlow, fontSize: '36px', fontWeight: 600, color: '#233530', marginBottom: '32px' }}>Destinos en video</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {videos.slice(0, 3).map(video => (
              <Link
                key={video.title}
                href={routes.videos}
                className="block text-left"
                style={{ borderRadius: '10px', overflow: 'hidden', border: '1px solid #E5E5E5', background: 'white' }}
              >
                <div style={{ position: 'relative', height: '180px', backgroundColor: '#233530' }}>
                  <Image src={video.img} alt={video.title} fill sizes="(min-width: 1280px) 400px, (min-width: 768px) 33vw, 100vw" style={{ objectFit: 'cover', opacity: 0.75 }} />
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(0,121,52,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Play size={18} fill="white" color="white" strokeWidth={0} style={{ marginLeft: '3px' }} />
                    </div>
                  </div>
                  {video.duration && <div style={{ position: 'absolute', bottom: '10px', right: '10px', backgroundColor: 'rgba(0,0,0,0.7)', color: 'white', fontSize: '12px', padding: '2px 6px', borderRadius: '3px', fontFamily: font.jost }}>{video.duration}</div>}
                </div>
                <div style={{ padding: '14px' }}>
                  <p style={{ fontFamily: font.jost, fontWeight: 500, fontSize: '14px', color: '#233530', lineHeight: 1.4 }}>{video.title}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
