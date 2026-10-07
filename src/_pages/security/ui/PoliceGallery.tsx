'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { PolicePhoto } from '@/shared/api'
import { font, Lightbox } from '@/shared/ui'

/** Cuadrícula de fotos del acompañamiento policial; al tocar una se amplía con su pie de foto. */
export function PoliceGallery({ photos }: { photos: PolicePhoto[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <>
      <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {photos.map((photo, i) => (
          <li key={photo.src}>
            <button type="button" onClick={() => setOpenIndex(i)} className="block w-full text-left group" aria-label={`Ampliar: ${photo.caption}`}>
              <div style={{ position: 'relative', aspectRatio: '4/3', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#e8f0e8' }}>
                <Image
                  src={photo.src}
                  alt={photo.caption}
                  fill
                  sizes="(min-width: 1024px) 300px, (min-width: 768px) 33vw, 50vw"
                  className="transition-transform duration-200 group-hover:scale-105"
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <p style={{ fontFamily: font.body, fontSize: '12px', color: '#4B5563', lineHeight: 1.45, marginTop: '8px' }}>{photo.caption}</p>
            </button>
          </li>
        ))}
      </ul>

      {openIndex !== null && (
        <Lightbox
          photos={photos.map(ph => ({ src: ph.src, alt: ph.caption, caption: ph.caption }))}
          index={openIndex}
          onIndexChange={setOpenIndex}
          onClose={() => setOpenIndex(null)}
          label="Galería del acompañamiento policial"
        />
      )}
    </>
  )
}
