'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MorphIcon } from 'morphicons/react'
import type { SecurityTip } from '@/shared/api'
import { routes } from '@/shared/config'
import { font } from '@/shared/ui'
import styles from './safety-tip-cards.module.css'

/** Tarjetas de "Viaja seguro" en el inicio (fondo azul): primera recomendación de cada grupo. Llevan a Seguridad. */
export function SafetyTipCards({ tips }: { tips: SecurityTip[] }) {
  const [active, setActive] = useState<string | null>(null)

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
      {tips.map(tip => (
        <Link
          key={tip.title}
          href={routes.security}
          className={styles.card}
          onMouseEnter={() => setActive(tip.title)}
          onMouseLeave={() => setActive(null)}
          onFocus={() => setActive(tip.title)}
          onBlur={() => setActive(null)}
        >
          <span className={styles.icon}>
            <MorphIcon icon={active === tip.title ? tip.hoverIcon : tip.icon} size={22} strokeWidth={1.75} spring="snappy" />
          </span>
          <h3 style={{ fontFamily: font.heading, fontWeight: 600, fontSize: '15px', color: 'white', margin: '14px 0 8px' }}>{tip.title}</h3>
          <p style={{ fontFamily: font.body, fontSize: '13px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.6 }}>{tip.tips[0]}</p>
        </Link>
      ))}
    </div>
  )
}
