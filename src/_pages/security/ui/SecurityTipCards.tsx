'use client'

import { useState } from 'react'
import { CircleCheck } from 'lucide-react'
import { MorphIcon } from 'morphicons/react'
import type { SecurityTip } from '@/shared/api'
import { font } from '@/shared/ui'
import styles from './security-tip-cards.module.css'

/** Recomendaciones completas (página Seguridad) con el estilo de tarjeta estándar; el ícono se transforma al pasar el mouse. */
export function SecurityTipCards({ tips }: { tips: SecurityTip[] }) {
  const [active, setActive] = useState<string | null>(null)

  return (
    <div className={styles.grid}>
      {tips.map(tip => (
        <article
          key={tip.title}
          className={`ui-card ui-card-link ${styles.card}`}
          onMouseEnter={() => setActive(tip.title)}
          onMouseLeave={() => setActive(null)}
        >
          <div className={styles.head}>
            <span className="ui-icon-circle">
              <MorphIcon icon={active === tip.title ? tip.hoverIcon : tip.icon} size={22} strokeWidth={1.75} spring="snappy" />
            </span>
            <h3 className={styles.title} style={{ fontFamily: font.heading }}>{tip.title}</h3>
          </div>
          <ul className={styles.list}>
            {tip.tips.map(t => (
              <li key={t} className={styles.item} style={{ fontFamily: font.body }}>
                <CircleCheck className={styles.check} color="#007934" strokeWidth={2} />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  )
}
