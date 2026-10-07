'use client'

import { useState } from 'react'
import { MorphIcon } from 'morphicons/react'
import { font } from '@/shared/ui'
import type { Channel, ContactItem } from '../model/contact-data'
import styles from './contact-cards.module.css'

const externalProps = (href: string) => (href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})

/** Recuadro de datos institucionales (dirección, conmutador, correo, web). El ícono se transforma al pasar el mouse por la fila. */
export function ContactInfoCard({ items }: { items: ContactItem[] }) {
  const [active, setActive] = useState<string | null>(null)
  return (
    <div className="ui-card">
      {items.map((item, i) => (
        <div
          key={item.label}
          className={styles.row}
          style={{ borderBottom: i < items.length - 1 ? '1px solid #E8EEF2' : 'none' }}
          onMouseEnter={() => setActive(item.label)}
          onMouseLeave={() => setActive(null)}
        >
          <span className={`ui-icon-circle ${styles.rowIcon}`}>
            <MorphIcon icon={active === item.label ? item.hoverIcon : item.icon} size={17} strokeWidth={1.75} spring="snappy" />
          </span>
          <div>
            <div style={{ fontFamily: font.body, fontSize: '12px', fontWeight: 600, color: '#4B5563', letterSpacing: '0.06em', marginBottom: '2px' }}>{item.label.toUpperCase()}</div>
            <div style={{ fontFamily: font.body, fontSize: '14px', color: '#333' }}>
              {item.href ? (
                <a href={item.href} className="hover:underline" onFocus={() => setActive(item.label)} onBlur={() => setActive(null)} {...externalProps(item.href)}>{item.value}</a>
              ) : item.value}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

/** Canales de atención: tarjetas (enlaces si tienen href) con ícono animado. */
export function ChannelCards({ channels }: { channels: Channel[] }) {
  const [active, setActive] = useState<string | null>(null)
  return (
    <div className="flex flex-col gap-3 mb-8">
      {channels.map(ch => {
        const content = (
          <>
            <span className="ui-icon-circle">
              <MorphIcon icon={active === ch.title ? ch.hoverIcon : ch.icon} size={20} strokeWidth={1.75} spring="snappy" />
            </span>
            <div>
              <div style={{ fontFamily: font.body, fontWeight: 600, fontSize: '14px', color: '#142749' }}>{ch.title}</div>
              <div style={{ fontFamily: font.body, fontSize: '12px', color: '#4B5563' }}>{ch.desc}</div>
            </div>
          </>
        )
        const hover = {
          onMouseEnter: () => setActive(ch.title),
          onMouseLeave: () => setActive(null),
          onFocus: () => setActive(ch.title),
          onBlur: () => setActive(null),
        }
        return ch.href ? (
          <a key={ch.title} href={ch.href} className={`ui-card ui-card-link ${styles.channel}`} {...externalProps(ch.href)} {...hover}>{content}</a>
        ) : (
          <div key={ch.title} className={`ui-card ${styles.channel}`} {...hover}>{content}</div>
        )
      })}
    </div>
  )
}
