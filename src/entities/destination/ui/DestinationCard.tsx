import Link from 'next/link'
import type { Destination } from '@/shared/api'
import { routes } from '@/shared/config'
import { unsplashUrl } from '@/shared/lib'
import { font } from '@/shared/ui'
import { CategoryBadge } from './CategoryBadge'
import styles from './destination-card.module.css'

export function DestinationCard({ dest }: { dest: Destination }) {
  return (
    <Link
      href={routes.destination(dest.slug)}
      className={`${styles.card} block text-left w-full`}
      style={{
        background: 'white',
        borderRadius: '10px',
        border: '1px solid #E5E5E5',
        overflow: 'hidden',
      }}
    >
      <div style={{ position: 'relative', height: '200px', backgroundColor: '#e8f0e8', overflow: 'hidden' }}>
        <img
          src={unsplashUrl(dest.imageId, 600, 300)}
          alt={dest.name}
          className={styles.image}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
          <CategoryBadge category={dest.category} />
        </div>
      </div>
      <div style={{ padding: '16px' }}>
        <div style={{ fontFamily: font.jost, fontSize: '10px', fontWeight: 500, color: '#76777A', letterSpacing: '0.08em', marginBottom: '4px' }}>{dest.municipality.toUpperCase()}</div>
        <h3 style={{ fontFamily: font.barlow, fontWeight: 600, fontSize: '20px', color: '#233530', marginBottom: '8px', lineHeight: 1.2 }}>{dest.name}</h3>
        <p style={{ fontFamily: font.jost, fontSize: '13px', color: '#76777A', lineHeight: 1.6, marginBottom: '12px' }}>{dest.description}</p>
        <span style={{ fontFamily: font.jost, fontSize: '12px', fontWeight: 600, color: '#007934', display: 'flex', alignItems: 'center', gap: '4px' }}>
          Explorar destino →
        </span>
      </div>
    </Link>
  )
}
