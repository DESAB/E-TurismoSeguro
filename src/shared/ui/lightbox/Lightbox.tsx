'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import { font } from '../typography'

export interface LightboxPhoto {
  src: string
  alt: string
  caption?: string
}

interface LightboxProps {
  photos: LightboxPhoto[]
  index: number
  onIndexChange: (index: number) => void
  onClose: () => void
  /** Nombre accesible del diálogo, p. ej. "Galería de Catedral de Sal" */
  label: string
}

/** Foto ampliada a pantalla completa. Esc cierra; ← y → navegan. */
export function Lightbox({ photos, index, onIndexChange, onClose, label }: LightboxProps) {
  const prev = () => onIndexChange((index - 1 + photos.length) % photos.length)
  const next = () => onIndexChange((index + 1) % photos.length)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowLeft') onIndexChange((index - 1 + photos.length) % photos.length)
      else if (e.key === 'ArrowRight') onIndexChange((index + 1) % photos.length)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [index, photos.length, onClose, onIndexChange])

  const photo = photos[index]

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={label}
      style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.92)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={onClose}
    >
      <button
        aria-label="Cerrar"
        style={{ position: 'absolute', top: '20px', right: '20px', color: 'white', fontSize: '32px', background: 'none', lineHeight: 1 }}
        onClick={onClose}
      >×</button>
      <button
        aria-label="Anterior"
        style={{ position: 'absolute', left: '20px', color: 'white', fontSize: '32px', background: 'none' }}
        onClick={e => { e.stopPropagation(); prev() }}
      >‹</button>
      <figure style={{ margin: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }} onClick={e => e.stopPropagation()}>
        <Image
          src={photo.src}
          alt={photo.alt}
          width={1200}
          height={800}
          sizes="90vw"
          style={{ maxWidth: '90vw', maxHeight: photo.caption ? '78vh' : '85vh', width: 'auto', height: 'auto', objectFit: 'contain', borderRadius: '4px' }}
        />
        {photo.caption && (
          <figcaption style={{ maxWidth: '80vw', textAlign: 'center', color: 'rgba(255,255,255,0.85)', fontFamily: font.body, fontSize: '14px' }}>{photo.caption}</figcaption>
        )}
      </figure>
      <button
        aria-label="Siguiente"
        style={{ position: 'absolute', right: '20px', color: 'white', fontSize: '32px', background: 'none' }}
        onClick={e => { e.stopPropagation(); next() }}
      >›</button>
      <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', color: 'rgba(255,255,255,0.6)', fontFamily: font.body, fontSize: '13px' }}>
        {index + 1} / {photos.length}
      </div>
    </div>
  )
}
