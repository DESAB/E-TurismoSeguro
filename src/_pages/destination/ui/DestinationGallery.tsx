'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Lightbox } from '@/shared/ui'
import styles from './destination-gallery.module.css'

export function DestinationGallery({ name, images }: { name: string; images: string[] }) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  return (
    <>
      <div className="grid grid-cols-3 gap-3 mb-10">
        {images.map((imgId, i) => (
          <button
            key={i}
            onClick={() => { setLightboxOpen(true); setLightboxIndex(i) }}
            aria-label={`Ampliar fotografía ${i + 1} de ${name}`}
            style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', aspectRatio: '4/3', backgroundColor: '#e8f0e8' }}
          >
            <Image
              src={imgId}
              alt={`Fotografía ${i + 1} de ${name}`}
              fill
              sizes="(min-width: 1280px) 260px, (min-width: 768px) 22vw, 33vw"
              style={{ objectFit: 'cover', transition: 'transform 0.2s' }}
            />
            <div className={styles.overlay} style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white" style={{ opacity: 0 }} aria-hidden="true">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="white" strokeWidth="2" fill="none" />
              </svg>
            </div>
          </button>
        ))}
      </div>

      {lightboxOpen && (
        <Lightbox
          photos={images.map((src, i) => ({ src, alt: `Fotografía ${i + 1} de ${name}` }))}
          index={lightboxIndex}
          onIndexChange={setLightboxIndex}
          onClose={() => setLightboxOpen(false)}
          label={`Galería de ${name}`}
        />
      )}
    </>
  )
}
