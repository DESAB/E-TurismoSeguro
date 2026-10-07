'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChefHat, Church, Drama, Heart, Landmark, Leaf, Mountain, MountainSnow, Theater, Trees, Users, UtensilsCrossed } from 'lucide'
import { MorphIcon } from 'morphicons/react'
import type { Category } from '@/shared/api'
import { exploreParams, routes } from '@/shared/config'
import { slugify } from '@/shared/lib'
import { font } from '@/shared/ui'
import styles from './category-cards.module.css'

type IconData = typeof Leaf

// Cada categoría tiene su ícono y el ícono al que se transforma al pasar el mouse (datos de `lucide`, no componentes).
const categories: { name: Category; desc: string; icon: IconData; hoverIcon: IconData }[] = [
  { name: 'Naturaleza',  desc: 'Embalses, páramos y senderos',     icon: Leaf,            hoverIcon: Trees },
  { name: 'Patrimonio',  desc: 'Catedrales, plazas y centros históricos', icon: Landmark, hoverIcon: Church },
  { name: 'Cultura',     desc: 'Museos, arte y tradiciones',        icon: Theater,         hoverIcon: Drama },
  { name: 'Gastronomía', desc: 'Sabores de la región',              icon: UtensilsCrossed, hoverIcon: ChefHat },
  { name: 'Familiar',    desc: 'Parques y planes para todos',       icon: Users,           hoverIcon: Heart },
  { name: 'Aventura',    desc: 'Caminatas y deporte al aire libre', icon: Mountain,        hoverIcon: MountainSnow },
]

/** Tarjetas de "¿Qué quieres descubrir?": enlazan a Explorar filtrado por categoría. */
export function CategoryCards({ counts }: { counts: Record<Category, number> }) {
  const [active, setActive] = useState<Category | null>(null)

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
      {categories.map(cat => {
        const on = active === cat.name
        const n = counts[cat.name] ?? 0
        return (
          <Link
            key={cat.name}
            href={`${routes.explore}?${exploreParams.category}=${slugify(cat.name)}`}
            className={`ui-card ui-card-link ${styles.card}`}
            onMouseEnter={() => setActive(cat.name)}
            onMouseLeave={() => setActive(null)}
            onFocus={() => setActive(cat.name)}
            onBlur={() => setActive(null)}
          >
            <span className="ui-icon-circle">
              <MorphIcon icon={on ? cat.hoverIcon : cat.icon} size={24} strokeWidth={1.75} spring="snappy" />
            </span>
            <span style={{ fontFamily: font.heading, fontWeight: 600, fontSize: '16px', color: '#142749', marginTop: '14px' }}>{cat.name}</span>
            <span style={{ fontFamily: font.body, fontSize: '13px', color: '#4B5563', lineHeight: 1.45, marginTop: '4px' }}>{cat.desc}</span>
            <span style={{ fontFamily: font.body, fontSize: '13px', fontWeight: 600, color: n > 0 ? '#007934' : '#4B5563', marginTop: 'auto', paddingTop: '12px' }}>
              {n > 0 ? `${n} destino${n !== 1 ? 's' : ''}` : 'Próximamente'}
            </span>
          </Link>
        )
      })}
    </div>
  )
}
