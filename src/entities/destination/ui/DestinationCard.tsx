import Image from 'next/image'
import Link from 'next/link'
import type { Destination } from '@/shared/api'
import { routes } from '@/shared/config'
import { font } from '@/shared/ui'
import { CategoryBadge } from './CategoryBadge'

export function DestinationCard({ dest }: { dest: Destination }) {
  return (
    <Link
      href={routes.destination(dest.slug)}
      className="ui-card ui-card-link block text-left w-full"
    >
      <div style={{ position: 'relative', height: '200px', backgroundColor: '#e8f0e8', overflow: 'hidden' }}>
        <Image
          src={dest.images[0]}
          alt={dest.name}
          fill
          sizes="(min-width: 1280px) 400px, (min-width: 768px) 50vw, 100vw"
          className="ui-card-img"
          style={{ objectFit: 'cover' }}
        />
        <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
          <CategoryBadge category={dest.categories[0]} />
        </div>
      </div>
      <div style={{ padding: '16px' }}>
        <div style={{ fontFamily: font.body, fontSize: '12px', fontWeight: 500, color: '#4B5563', letterSpacing: '0.08em', marginBottom: '4px' }}>{dest.municipality.toUpperCase()}</div>
        <h3 style={{ fontFamily: font.heading, fontWeight: 600, fontSize: '20px', color: '#142749', marginBottom: '8px', lineHeight: 1.2 }}>{dest.name}</h3>
        <p style={{ fontFamily: font.body, fontSize: '13px', color: '#4B5563', lineHeight: 1.6, marginBottom: '12px' }}>{dest.description}</p>
        <span style={{ fontFamily: font.body, fontSize: '12px', fontWeight: 600, color: '#007934', display: 'flex', alignItems: 'center', gap: '4px' }}>
          Explorar destino
        </span>
      </div>
    </Link>
  )
}
