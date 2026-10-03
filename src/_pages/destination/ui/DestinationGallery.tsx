'use client'

import { useState } from 'react'
import { unsplashUrl } from '@/shared/lib'
import { font } from '@/shared/ui'
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
            style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', aspectRatio: '4/3', backgroundColor: '#e8f0e8' }}
          >
            <img
              src={unsplashUrl(imgId, 400, 280)}
              alt={`Fotografía ${i + 1} de ${name}`}
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.2s' }}
            />
            <div className={styles.overlay} style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white" style={{ opacity: 0 }} aria-hidden="true">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="white" strokeWidth="2" fill="none" />
              </svg>
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Galería de ${name}`}
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.92)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={() => setLightboxOpen(false)}
        >
          <button
            aria-label="Cerrar"
            style={{ position: 'absolute', top: '20px', right: '20px', color: 'white', fontSize: '32px', background: 'none', lineHeight: 1 }}
            onClick={() => setLightboxOpen(false)}
          >×</button>
          <button
            aria-label="Anterior"
            style={{ position: 'absolute', left: '20px', color: 'white', fontSize: '32px', background: 'none' }}
            onClick={e => { e.stopPropagation(); setLightboxIndex((lightboxIndex - 1 + images.length) % images.length) }}
          >‹</button>
          <img
            src={unsplashUrl(images[lightboxIndex], 1200, 800)}
            alt={`Fotografía ${lightboxIndex + 1}`}
            style={{ maxWidth: '90vw', maxHeight: '85vh', objectFit: 'contain', borderRadius: '4px' }}
            onClick={e => e.stopPropagation()}
          />
          <button
            aria-label="Siguiente"
            style={{ position: 'absolute', right: '20px', color: 'white', fontSize: '32px', background: 'none' }}
            onClick={e => { e.stopPropagation(); setLightboxIndex((lightboxIndex + 1) % images.length) }}
          >›</button>
          <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', color: 'rgba(255,255,255,0.6)', fontFamily: font.jost, fontSize: '13px' }}>
            {lightboxIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  )
}
