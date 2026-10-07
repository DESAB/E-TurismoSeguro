'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { font } from '@/shared/ui'
import styles from './territory-carousel.module.css'

export interface TerritorySlide {
  src: string
  name: string
  municipality: string
  href: string
}

const AUTOPLAY_MS = 5000

/**
 * Carrusel de fotos de destinos para "Explora el territorio". Desliza con el dedo (scroll-snap nativo),
 * avanza solo cada 5 s y se pausa al pasar el mouse, al enfocarlo o si el usuario pidió reducir el movimiento.
 */
export function TerritoryCarousel({ slides, stats }: { slides: TerritorySlide[]; stats: string }) {
  const track = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  const goTo = useCallback((i: number) => {
    const el = track.current
    if (el) el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' })
  }, [])

  // El punto activo sigue al scroll (sirve también cuando se desliza con el dedo)
  const onScroll = () => {
    const el = track.current
    if (el) setIndex(Math.round(el.scrollLeft / el.clientWidth))
  }

  useEffect(() => {
    if (paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setTimeout(() => goTo((index + 1) % slides.length), AUTOPLAY_MS)
    return () => window.clearTimeout(id)
  }, [index, paused, slides.length, goTo])

  return (
    <div
      role="region"
      aria-roledescription="carrusel"
      aria-label="Fotos de destinos de La Sabana"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
    >
      <div className={styles.frame}>
        <div ref={track} className={styles.track} onScroll={onScroll}>
          {slides.map((slide, i) => (
            <Link
              key={slide.href}
              href={slide.href}
              className={styles.slide}
              aria-roledescription="diapositiva"
              aria-label={`${i + 1} de ${slides.length}: ${slide.name}, ${slide.municipality}`}
            >
              <Image
                src={slide.src}
                alt={`${slide.name}, ${slide.municipality}`}
                fill
                sizes="(min-width: 1280px) 616px, (min-width: 768px) 50vw, 100vw"
                style={{ objectFit: 'cover' }}
              />
              <span className={styles.caption} style={{ fontFamily: font.body }}>
                {slide.name} · {slide.municipality}
              </span>
            </Link>
          ))}
        </div>

        <div className={styles.stats}>
          <div style={{ fontFamily: font.heading, fontWeight: 600, fontSize: '16px', color: '#142749' }}>La Sabana</div>
          <div style={{ fontFamily: font.body, fontSize: '12px', color: '#4B5563' }}>{stats}</div>
        </div>
      </div>

      <div className={styles.dots}>
        {slides.map((slide, i) => (
          <button
            key={slide.href}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Ver foto ${i + 1}: ${slide.name}`}
            aria-current={i === index}
            className={styles.dot}
            data-active={i === index}
          />
        ))}
      </div>
    </div>
  )
}
