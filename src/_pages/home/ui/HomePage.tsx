import Image from 'next/image'
import Link from 'next/link'
import { Play } from 'lucide-react'
import { DestinationCard } from '@/entities/destination'
import { CATEGORIES, getDestinationBySlug, getDestinations, getFeaturedPolicePhotos, getMunicipalities, getSecurityTips, getVideos, policeTeamPhoto, type Category } from '@/shared/api'
import { routes, site } from '@/shared/config'
import { pageMetadata } from '@/shared/lib'
import { font, JsonLd } from '@/shared/ui'
import { CategoryCards } from './CategoryCards'
import { SafetyTipCards } from './SafetyTipCards'
import { TerritoryCarousel, type TerritorySlide } from './TerritoryCarousel'
import styles from './home-page.module.css'

export const metadata = {
  ...pageMetadata({ title: site.title, description: site.description, path: routes.home, imageAlt: 'Grupo de Protección al Turismo y Patrimonio Nacional del Departamento de Policía La Sabana' }),
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

// Destinos del carrusel de "Explora el territorio" (fotos de buena resolución y municipios distintos)
const TERRITORY_SLUGS = ['piedras-de-chivonegro', 'cerro-el-tablazo', 'catedral-de-sal', 'embalse-del-neusa', 'termales-de-guasca', 'parque-jaime-duque', 'mina-de-sal-de-nemocon']

export function HomePage() {
  const destinations = getDestinations()
  const municipalities = getMunicipalities()
  const videos = getVideos()
  const securityTips = getSecurityTips()
  const categoryCounts = Object.fromEntries(CATEGORIES.map(c => [c, destinations.filter(d => d.categories.includes(c)).length])) as Record<Category, number>
  const heroPhoto = policeTeamPhoto
  const territorySlides: TerritorySlide[] = TERRITORY_SLUGS.flatMap(slug => {
    const d = getDestinationBySlug(slug)
    return d ? [{ src: d.images[0], name: d.name, municipality: d.municipality, href: routes.destination(d.slug) }] : []
  })
  const escortPhotos = getFeaturedPolicePhotos()

  return (
    <div>
      <JsonLd data={websiteJsonLd} />
      {/* Hero: en escritorio la foto del equipo a la derecha, fundida con el azul (ver .hero en el CSS);
          en móvil se muestra completa arriba, se funde con el azul y el texto va debajo. */}
      <section className={styles.hero} style={{ backgroundColor: '#142749' }}>
        <div className={styles.heroMedia}>
          <Image
            src={heroPhoto.src}
            alt={heroPhoto.caption}
            fill
            sizes="(min-width: 1024px) 62vw, 100vw"
            loading="eager"
            fetchPriority="high"
            style={{ objectFit: 'cover', objectPosition: 'center 45%' }}
          />
          <div className={styles.heroShade} />
        </div>
        <div className={styles.heroContent}>
          <div className="max-w-7xl mx-auto px-6 w-full">
            <div className={styles.heroText} style={{ textShadow: '0 1px 12px rgba(20,39,73,0.45)' }}>
              <div style={{ fontFamily: font.body, fontSize: '12px', fontWeight: 500, color: '#BAFF00', letterSpacing: '0.18em', marginBottom: '16px' }}>
                POLICÍA NACIONAL DE COLOMBIA
              </div>
              <h1 style={{ fontFamily: font.heading, fontSize: 'clamp(34px, 4vw, 52px)', fontWeight: 800, color: 'white', lineHeight: 1.05, marginBottom: '20px' }}>
                Guía turística<br />
                <span style={{ color: '#BAFF00' }}>Departamento de Policía La Sabana</span>
              </h1>
              <p style={{ fontFamily: font.body, fontSize: '17px', color: 'rgba(255,255,255,0.82)', lineHeight: 1.7, marginBottom: '32px', fontWeight: 300 }}>
                Explora municipios, patrimonio, naturaleza y lugares turísticos de manera segura.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href={routes.explore}
                  className={`${styles.heroPrimary} flex items-center`}
                  style={{ fontFamily: font.body, fontWeight: 600, fontSize: '14px', color: 'white', padding: '12px 28px', borderRadius: '7px', letterSpacing: '0.02em' }}
                >
                  Explorar destinos
                </Link>
                <Link
                  href={routes.map}
                  className={`${styles.heroSecondary} flex items-center`}
                  style={{ fontFamily: font.body, fontWeight: 600, fontSize: '14px', backgroundColor: 'transparent', color: 'white', padding: '12px 28px', borderRadius: '7px', letterSpacing: '0.02em' }}
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
          <h2 style={{ fontFamily: font.heading, fontSize: '32px', fontWeight: 600, color: '#142749', marginBottom: '8px' }}>¿Qué quieres descubrir?</h2>
          <p style={{ fontFamily: font.body, color: '#4B5563', fontSize: '15px', marginBottom: '36px' }}>Selecciona una categoría para explorar destinos de tu interés</p>
          <CategoryCards counts={categoryCounts} />
        </div>
      </section>

      {/* Featured Destinations */}
      <section style={{ padding: '72px 0', backgroundColor: 'white' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
            <div>
              <div style={{ fontFamily: font.body, fontSize: '12px', fontWeight: 600, color: '#007934', letterSpacing: '0.12em', marginBottom: '8px' }}>DESCUBRE</div>
              <h2 style={{ fontFamily: font.heading, fontSize: '32px', fontWeight: 600, color: '#142749' }}>Destinos destacados</h2>
            </div>
            <Link
              href={routes.explore}
              style={{ fontFamily: font.body, fontWeight: 600, fontSize: '13px', color: '#007934', border: '1.5px solid #007934', padding: '8px 20px', borderRadius: '6px' }}
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
              <div style={{ fontFamily: font.body, fontSize: '12px', fontWeight: 600, color: '#007934', letterSpacing: '0.12em', marginBottom: '8px' }}>TERRITORIO</div>
              <h2 style={{ fontFamily: font.heading, fontSize: '40px', fontWeight: 600, color: '#142749', lineHeight: 1.1, marginBottom: '16px' }}>Explora el<br />territorio</h2>
              <p style={{ fontFamily: font.body, color: '#4B5563', fontSize: '15px', lineHeight: 1.7, marginBottom: '28px' }}>
                Encuentra los municipios y lugares turísticos del Departamento de Policía La Sabana en nuestro mapa interactivo. Selecciona un municipio y descubre sus destinos.
              </p>
              <div className="hidden md:flex flex-col gap-3 mb-8">
                {municipalities.slice(0, 4).map(m => (
                  <div key={m} className="flex items-center gap-3">
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#007934', flexShrink: 0 }} />
                    <span style={{ fontFamily: font.body, fontSize: '14px', color: '#333' }}>{m}</span>
                  </div>
                ))}
                <div style={{ fontFamily: font.body, fontSize: '13px', color: '#4B5563' }}>y más municipios...</div>
              </div>
              <Link
                href={routes.map}
                className="inline-block"
                style={{ fontFamily: font.body, fontWeight: 600, fontSize: '14px', backgroundColor: '#007934', color: 'white', padding: '12px 28px', borderRadius: '7px' }}
              >
                Abrir mapa interactivo
              </Link>
            </div>
            <TerritoryCarousel slides={territorySlides} stats={`${destinations.length} destinos · ${municipalities.length} municipios`} />
          </div>
        </div>
      </section>

      {/* Travel Safe */}
      <section style={{ backgroundColor: '#142749', padding: '72px 0' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
            <div>
              <div style={{ fontFamily: font.body, fontSize: '12px', fontWeight: 600, color: '#BAFF00', letterSpacing: '0.12em', marginBottom: '8px' }}>POLICÍA NACIONAL</div>
              <h2 style={{ fontFamily: font.heading, fontSize: '32px', fontWeight: 600, color: 'white' }}>Viaja seguro</h2>
              <p style={{ fontFamily: font.body, color: 'rgba(255,255,255,0.65)', fontSize: '15px', marginTop: '8px' }}>Recomendaciones para disfrutar tu visita de manera responsable y segura</p>
            </div>
            <Link
              href={routes.security}
              className={styles.heroPrimary}
              style={{ fontFamily: font.body, fontWeight: 600, fontSize: '14px', color: 'white', padding: '10px 22px', borderRadius: '8px' }}
            >
              Ver todas las recomendaciones
            </Link>
          </div>
          <SafetyTipCards tips={securityTips.slice(0, 4)} />
        </div>
      </section>

      {/* Acompañamiento policial */}
      <section style={{ padding: '72px 0', backgroundColor: '#F7F7F5' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
            <div>
              <div style={{ fontFamily: font.body, fontSize: '12px', fontWeight: 600, color: '#007934', letterSpacing: '0.12em', marginBottom: '8px' }}>POLICÍA DE TURISMO</div>
              <h2 style={{ fontFamily: font.heading, fontSize: '32px', fontWeight: 600, color: '#142749' }}>Te acompañamos</h2>
              <p style={{ fontFamily: font.body, color: '#4B5563', fontSize: '15px', marginTop: '8px', maxWidth: '560px' }}>La Policía de La Sabana acompaña a los visitantes en cada destino, evento y recorrido de la región.</p>
            </div>
            <Link
              href={`${routes.security}#acompanamiento`}
              style={{ fontFamily: font.body, fontWeight: 600, fontSize: '13px', color: '#007934', border: '1.5px solid #007934', padding: '8px 20px', borderRadius: '6px' }}
            >
              Ver todas las fotos
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[130px] md:auto-rows-[190px] gap-3">
            {escortPhotos.map((photo, i) => (
              <Link
                key={photo.src}
                href={`${routes.security}#acompanamiento`}
                aria-label={photo.caption}
                className={`${i === 0 ? 'col-span-2 row-span-2' : ''} relative block overflow-hidden group`}
                style={{ borderRadius: '12px', backgroundColor: '#e8f0e8' }}
              >
                <Image
                  src={photo.src}
                  alt={photo.caption}
                  fill
                  sizes={i === 0 ? '(min-width: 1280px) 620px, (min-width: 768px) 50vw, 100vw' : '(min-width: 1280px) 300px, (min-width: 768px) 25vw, 50vw'}
                  className="transition-transform duration-300 group-hover:scale-105"
                  style={{ objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', inset: 'auto 0 0 0', padding: '28px 12px 10px', background: 'linear-gradient(to top, rgba(0,0,0,0.65), transparent)', fontFamily: font.body, fontSize: i === 0 ? '14px' : '12px', color: 'white', lineHeight: 1.35 }}>
                  {photo.caption}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Video highlight */}
      <section style={{ padding: '72px 0', backgroundColor: 'white' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div style={{ fontFamily: font.body, fontSize: '12px', fontWeight: 600, color: '#007934', letterSpacing: '0.12em', marginBottom: '8px' }}>CONOCE LA SABANA</div>
          <h2 style={{ fontFamily: font.heading, fontSize: '32px', fontWeight: 600, color: '#142749', marginBottom: '32px' }}>Destinos en video</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {videos.slice(0, 3).map(video => (
              <Link
                key={video.title}
                href={routes.videos}
                className="ui-card ui-card-link block text-left"
              >
                <div style={{ position: 'relative', height: '180px', backgroundColor: '#142749' }}>
                  <Image src={video.img} alt={video.title} fill sizes="(min-width: 1280px) 400px, (min-width: 768px) 33vw, 100vw" style={{ objectFit: 'cover', opacity: 0.75 }} />
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(0,121,52,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Play size={18} fill="white" color="white" strokeWidth={0} style={{ marginLeft: '3px' }} />
                    </div>
                  </div>
                  {video.duration && <div style={{ position: 'absolute', bottom: '10px', right: '10px', backgroundColor: 'rgba(0,0,0,0.7)', color: 'white', fontSize: '12px', padding: '2px 6px', borderRadius: '3px', fontFamily: font.body }}>{video.duration}</div>}
                </div>
                <div style={{ padding: '14px' }}>
                  <p style={{ fontFamily: font.body, fontWeight: 500, fontSize: '14px', color: '#142749', lineHeight: 1.4 }}>{video.title}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
