import Image from 'next/image'
import { Play } from 'lucide-react'
import { getVideos } from '@/shared/api'
import { routes } from '@/shared/config'
import { pageMetadata } from '@/shared/lib'
import { Breadcrumb, font } from '@/shared/ui'

export const metadata = pageMetadata({
  title: 'Videos de la Sabana de Bogotá',
  description: 'Conoce en video la Catedral de Sal, la Laguna de Neusa, las Lagunas de Siecha y otros destinos de la Sabana de Bogotá.',
  path: routes.videos,
  image: '/destinos/catedral-de-sal/1.jpg',
  imageAlt: 'Catedral de Sal de Zipaquirá',
})

export function VideosPage() {
  const videos = getVideos()
  const featured = videos[0]

  return (
    <div style={{ paddingTop: '64px' }}>
      <div style={{ backgroundColor: '#007934', padding: '80px 0 40px' }}>
        <div className="max-w-7xl mx-auto px-6">
          <Breadcrumb items={[{ label: 'Inicio', href: routes.home }, { label: 'Videos' }]} />
          <h1 style={{ fontFamily: font.barlow, fontSize: '48px', fontWeight: 700, color: 'white', marginTop: '16px' }}>Videos</h1>
          <p style={{ fontFamily: font.jost, color: 'rgba(255,255,255,0.75)', fontSize: '16px' }}>Conoce la Sabana de Bogotá a través de sus imágenes</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Featured video */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ fontFamily: font.jost, fontSize: '12px', fontWeight: 600, color: '#007934', letterSpacing: '0.12em', marginBottom: '12px' }}>DESTACADO</div>
          <a href={featured.url} target="_blank" rel="noopener noreferrer" aria-label={`Ver en YouTube: ${featured.title}`} className="block" style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#233530' }}>
            <Image
              src={featured.img}
              alt={featured.title}
              width={1232}
              height={420}
              sizes="(min-width: 1280px) 1232px, 100vw"
              loading="eager"
              fetchPriority="high"
              style={{ width: '100%', height: '420px', objectFit: 'cover', opacity: 0.65, display: 'block' }}
            />
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: '72px', height: '72px', borderRadius: '50%', backgroundColor: '#007934', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 24px rgba(0,121,52,0.5)', cursor: 'pointer' }}>
                <Play size={28} fill="white" color="white" strokeWidth={0} style={{ marginLeft: '4px' }} />
              </div>
            </div>
            <div style={{ position: 'absolute', bottom: '24px', left: '24px' }}>
              <div style={{ fontFamily: font.jost, fontSize: '12px', color: '#C2D500', letterSpacing: '0.1em', marginBottom: '6px' }}>{featured.subtitle.toUpperCase()}</div>
              <h2 style={{ fontFamily: font.barlow, fontWeight: 700, fontSize: '32px', color: 'white' }}>{featured.title}</h2>
              <span style={{ fontFamily: font.jost, fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>{featured.duration || (featured.author && `Video de ${featured.author}`)}</span>
            </div>
          </a>
        </div>

        {/* Video grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {videos.slice(1).map(video => (
            <a key={video.title} href={video.url} target="_blank" rel="noopener noreferrer" aria-label={`Ver en YouTube: ${video.title}`} className="block" style={{ border: '1px solid #E5E5E5', borderRadius: '10px', overflow: 'hidden', cursor: 'pointer', backgroundColor: 'white' }}>
              <div style={{ position: 'relative', backgroundColor: '#233530' }}>
                <Image src={video.img} alt={video.title} width={400} height={170} sizes="(min-width: 1280px) 400px, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" style={{ width: '100%', height: '170px', objectFit: 'cover', opacity: 0.75, display: 'block' }} />
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: 'rgba(0,121,52,0.88)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Play size={16} fill="white" color="white" strokeWidth={0} style={{ marginLeft: '2px' }} />
                  </div>
                </div>
                {video.duration && <div style={{ position: 'absolute', bottom: '8px', right: '10px', backgroundColor: 'rgba(0,0,0,0.7)', color: 'white', fontSize: '12px', padding: '2px 7px', borderRadius: '3px', fontFamily: font.jost }}>{video.duration}</div>}
              </div>
              <div style={{ padding: '14px' }}>
                <div style={{ fontFamily: font.jost, fontSize: '12px', color: '#007934', fontWeight: 600, letterSpacing: '0.06em', marginBottom: '4px' }}>{video.subtitle.toUpperCase()}</div>
                <p style={{ fontFamily: font.jost, fontWeight: 500, fontSize: '14px', color: '#233530', lineHeight: 1.4 }}>{video.title}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
