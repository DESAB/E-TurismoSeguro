'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { CategoryBadge } from '@/entities/destination'
import type { Destination, Municipality } from '@/shared/api'
import { routes } from '@/shared/config'
import { font } from '@/shared/ui'
import { municipalityColor } from '../model/municipality-colors'
import { SabanaMap } from './SabanaMap'

export function MapView({ destinations, municipalityList }: { destinations: Destination[]; municipalityList: Municipality[] }) {
  const [selectedMunicipality, setSelectedMunicipality] = useState<string | null>(null)
  const [selectedDest, setSelectedDest] = useState<Destination | null>(null)
  const [muniSearch, setMuniSearch] = useState('')
  const selectedCardRef = useRef<HTMLDivElement>(null)

  // En móvil la tarjeta del destino queda debajo del mapa, fuera de la pantalla: llevarla a la vista al elegir un sitio.
  useEffect(() => {
    if (selectedDest && window.matchMedia('(max-width: 767px)').matches) {
      selectedCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [selectedDest])

  const filteredMunis = municipalityList.filter(m => m.name.toLowerCase().includes(muniSearch.toLowerCase()))

  // Memorizados: el mapa reencuadra cuando cambia este conjunto
  const destsByMuni = useMemo(
    () => (selectedMunicipality ? destinations.filter(d => d.municipality === selectedMunicipality) : destinations),
    [destinations, selectedMunicipality],
  )
  const fallbackCenter = useMemo(
    () => municipalityList.find(m => m.name === selectedMunicipality),
    [municipalityList, selectedMunicipality],
  )

  const toggleMunicipality = (name: string) => {
    setSelectedMunicipality(selectedMunicipality === name ? null : name)
    setSelectedDest(null)
  }
  const selectDestination = useCallback((dest: Destination) => setSelectedDest(dest), [])

  return (
    <div className="flex flex-col md:flex-row flex-1 md:overflow-hidden md:max-h-[calc(100vh-160px)]">
      {/* Sidebar (en móvil, debajo del mapa) */}
      <div className="order-2 md:order-none w-full md:w-[280px] shrink-0 flex flex-col md:overflow-hidden md:border-r border-[#E5E5E5]" style={{ backgroundColor: '#F7F7F5' }}>
        <div style={{ padding: '16px', borderBottom: '1px solid #E5E5E5' }}>
          <h3 style={{ fontFamily: font.jost, fontWeight: 600, fontSize: '13px', color: '#233530', marginBottom: '10px', letterSpacing: '0.06em' }}>MUNICIPIOS</h3>
          <input
            value={muniSearch}
            onChange={e => setMuniSearch(e.target.value)}
            placeholder="Buscar municipio..."
            aria-label="Buscar municipio"
            style={{ width: '100%', padding: '8px 12px', border: '1px solid #E5E5E5', borderRadius: '6px', fontFamily: font.jost, fontSize: '13px', backgroundColor: 'white' }}
          />
        </div>
        <div style={{ overflowY: 'auto', flex: 1 }}>
          {filteredMunis.map(muni => {
            const isSelected = selectedMunicipality === muni.name
            const muniDests = destinations.filter(d => d.municipality === muni.name)
            return (
              <div key={muni.name}>
                <button
                  onClick={() => toggleMunicipality(muni.name)}
                  aria-pressed={isSelected}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    width: '100%',
                    padding: '12px 16px',
                    textAlign: 'left',
                    borderLeft: `3px solid ${isSelected ? '#007934' : 'transparent'}`,
                    backgroundColor: isSelected ? 'rgba(0,121,52,0.06)' : 'transparent',
                    borderBottom: '1px solid #E5E5E5',
                  }}
                >
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: municipalityColor(municipalityList.indexOf(muni)), flexShrink: 0 }} />
                  <span style={{ fontFamily: font.jost, fontWeight: isSelected ? 600 : 400, fontSize: '14px', color: isSelected ? '#007934' : '#333' }}>{muni.name}</span>
                  <span style={{ marginLeft: 'auto', fontFamily: font.jost, fontSize: '12px', color: '#76777A' }}>{muniDests.length}</span>
                </button>
                {/* Sitios del municipio elegido: también permiten usar el mapa sin tocar los puntos */}
                {isSelected && muniDests.map(d => (
                  <button
                    key={d.id}
                    onClick={() => setSelectedDest(d)}
                    aria-pressed={selectedDest?.id === d.id}
                    style={{
                      display: 'block', width: '100%', textAlign: 'left', padding: '10px 16px 10px 39px',
                      borderLeft: '3px solid #007934', borderBottom: '1px solid #E5E5E5',
                      backgroundColor: selectedDest?.id === d.id ? 'rgba(194,213,0,0.18)' : 'white',
                      fontFamily: font.jost, fontSize: '13px', fontWeight: selectedDest?.id === d.id ? 600 : 400, color: '#233530',
                    }}
                  >
                    {d.name}
                  </button>
                ))}
              </div>
            )
          })}
        </div>
        {selectedDest && (
          <div ref={selectedCardRef} className="order-first md:order-none border-b md:border-b-0 md:border-t border-[#E5E5E5]" style={{ padding: '16px', backgroundColor: 'white' }}>
            <Image src={selectedDest.images[0]} alt={selectedDest.name} width={248} height={120} sizes="248px" style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '6px', marginBottom: '10px' }} />
            <CategoryBadge category={selectedDest.categories[0]} />
            <h4 style={{ fontFamily: font.barlow, fontWeight: 600, fontSize: '18px', color: '#233530', margin: '6px 0 4px' }}>{selectedDest.name}</h4>
            <p style={{ fontFamily: font.jost, fontSize: '12px', color: '#76777A', marginBottom: '10px' }}>{selectedDest.municipality}</p>
            <Link
              href={routes.destination(selectedDest.slug)}
              className="block text-center"
              style={{ width: '100%', padding: '8px', backgroundColor: '#007934', color: 'white', borderRadius: '6px', fontFamily: font.jost, fontWeight: 600, fontSize: '12px' }}
            >
              Explorar destino
            </Link>
          </div>
        )}
      </div>

      {/* Map */}
      <div className="order-1 md:order-none relative overflow-hidden h-[420px] md:h-auto md:flex-1" style={{ backgroundColor: '#e8f0e8' }}>
        <SabanaMap
          destinations={destsByMuni}
          fallbackCenter={fallbackCenter}
          selectedId={selectedDest?.id ?? null}
          onSelect={selectDestination}
        />

        {/* Map legend */}
        <div className="hidden md:block" style={{ position: 'absolute', bottom: '32px', right: '16px', backgroundColor: 'rgba(255,255,255,0.94)', borderRadius: '8px', padding: '12px 16px', boxShadow: '0 2px 12px rgba(0,0,0,0.1)' }}>
          <div style={{ fontFamily: font.jost, fontSize: '12px', fontWeight: 600, color: '#333', marginBottom: '8px' }}>LEYENDA</div>
          <div className="flex items-center gap-2 mb-2">
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#007934', border: '2px solid white', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
            <span style={{ fontFamily: font.jost, fontSize: '12px', color: '#76777A' }}>Destino turístico</span>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#C2D500', border: '2px solid white', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
            <span style={{ fontFamily: font.jost, fontSize: '12px', color: '#76777A' }}>Seleccionado</span>
          </div>
          <div className="flex items-center gap-2">
            <div style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: '#007934', border: '2px solid white', boxShadow: '0 1px 4px rgba(0,0,0,0.2)', color: 'white', fontFamily: font.jost, fontSize: '9px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '-3px', marginRight: '-3px' }}>3</div>
            <span style={{ fontFamily: font.jost, fontSize: '12px', color: '#76777A' }}>Grupo de destinos (toca para acercar)</span>
          </div>
        </div>

        {/* Instruction */}
        {!selectedMunicipality && !selectedDest && (
          <div style={{ position: 'absolute', top: '16px', left: '50%', transform: 'translateX(-50%)', width: 'max-content', maxWidth: 'calc(100% - 120px)', textAlign: 'center', backgroundColor: 'rgba(255,255,255,0.92)', borderRadius: '8px', padding: '10px 20px', boxShadow: '0 2px 12px rgba(0,0,0,0.1)', pointerEvents: 'none' }}>
            <span style={{ fontFamily: font.jost, fontSize: '13px', color: '#76777A' }}>Selecciona un municipio o destino para explorar</span>
          </div>
        )}

        {/* Volver a ver todos los municipios */}
        {selectedMunicipality && (
          <button
            onClick={() => { setSelectedMunicipality(null); setSelectedDest(null) }}
            style={{ position: 'absolute', top: '16px', left: '16px', zIndex: 30, backgroundColor: 'rgba(255,255,255,0.94)', borderRadius: '8px', padding: '10px 14px', boxShadow: '0 2px 12px rgba(0,0,0,0.1)', fontFamily: font.jost, fontSize: '13px', fontWeight: 600, color: '#007934' }}
          >
            ← Todos los municipios
          </button>
        )}
      </div>
    </div>
  )
}
