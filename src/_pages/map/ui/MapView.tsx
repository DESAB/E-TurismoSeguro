'use client'

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronDown, MapPin, X } from 'lucide-react'
import { CategoryBadge } from '@/entities/destination'
import type { Destination, Municipality } from '@/shared/api'
import { routes } from '@/shared/config'
import { font } from '@/shared/ui'
import { municipalityColor } from '../model/municipality-colors'
import { SabanaMap } from './SabanaMap'

const legendDot: CSSProperties = { width: '10px', height: '10px', borderRadius: '50%', border: '2px solid white', boxShadow: '0 1px 3px rgba(0,0,0,0.25)', flexShrink: 0 }
const legendCluster: CSSProperties = { width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#007934', color: 'white', fontSize: '9px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }

export function MapView({ destinations, municipalityList }: { destinations: Destination[]; municipalityList: Municipality[] }) {
  const [selectedMunicipality, setSelectedMunicipality] = useState<string | null>(null)
  const [selectedDest, setSelectedDest] = useState<Destination | null>(null)
  const [muniSearch, setMuniSearch] = useState('')
  const [listOpen, setListOpen] = useState(false)
  const selectedCardRef = useRef<HTMLDivElement>(null)

  // En móvil el borde inferior del mapa (donde flota la tarjeta) puede quedar fuera de la pantalla: llevarla a la vista.
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
      <div className="order-2 md:order-none w-full md:w-[280px] shrink-0 flex flex-col md:overflow-hidden md:border-r border-[#E8EEF2]" style={{ backgroundColor: '#F7F7F5' }}>
        {/* Leyenda compacta (en móvil la del mapa no cabe) */}
        <div className="md:hidden flex flex-wrap items-center gap-x-4 gap-y-1" style={{ padding: '10px 16px', backgroundColor: 'white', borderBottom: '1px solid #E8EEF2', fontFamily: font.body, fontSize: '12px', color: '#4B5563' }}>
          <span className="flex items-center gap-1.5"><span style={{ ...legendDot, backgroundColor: '#007934' }} />Destino</span>
          <span className="flex items-center gap-1.5"><span style={{ ...legendDot, backgroundColor: '#BAFF00' }} />Seleccionado</span>
          <span className="flex items-center gap-1.5"><span style={legendCluster}>3</span>Grupo: toca para acercar</span>
        </div>

        {/* En móvil la lista va plegada tras este botón para no empujar la página */}
        <button
          type="button"
          onClick={() => setListOpen(o => !o)}
          aria-expanded={listOpen}
          aria-controls="map-municipalities"
          className="md:hidden flex items-center gap-2 w-full text-left"
          style={{ padding: '14px 16px', borderBottom: '1px solid #E8EEF2', fontFamily: font.body, fontSize: '14px', color: '#142749' }}
        >
          <MapPin size={16} color="#007934" strokeWidth={2} />
          <span style={{ fontWeight: 600 }}>Municipios</span>
          <span style={{ color: selectedMunicipality ? '#007934' : '#4B5563', fontWeight: selectedMunicipality ? 600 : 400 }}>· {selectedMunicipality ?? `Todos (${municipalityList.length})`}</span>
          <ChevronDown size={18} strokeWidth={2} style={{ marginLeft: 'auto', transform: listOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
        </button>

        <div id="map-municipalities" className={`${listOpen ? 'flex' : 'hidden'} md:flex flex-col flex-1 md:overflow-hidden`}>
        <div style={{ padding: '16px', borderBottom: '1px solid #E8EEF2' }}>
          <h3 className="hidden md:block" style={{ fontFamily: font.body, fontWeight: 600, fontSize: '13px', color: '#142749', marginBottom: '10px', letterSpacing: '0.06em' }}>MUNICIPIOS</h3>
          <input
            value={muniSearch}
            onChange={e => setMuniSearch(e.target.value)}
            placeholder="Buscar municipio..."
            aria-label="Buscar municipio"
            style={{ width: '100%', padding: '8px 12px', border: '1px solid #E8EEF2', borderRadius: '6px', fontFamily: font.body, fontSize: '13px', backgroundColor: 'white' }}
          />
        </div>
        <div style={{ overflowY: 'auto', flex: 1 }}>
          {filteredMunis.length === 0 && (
            <div style={{ padding: '20px 16px', fontFamily: font.body, fontSize: '13px', color: '#4B5563' }}>
              Ningún municipio coincide con «{muniSearch}».{' '}
              <button type="button" onClick={() => setMuniSearch('')} className="hover:underline" style={{ color: '#007934', fontWeight: 600 }}>Ver todos</button>
            </div>
          )}
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
                    borderBottom: '1px solid #E8EEF2',
                  }}
                >
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: municipalityColor(municipalityList.indexOf(muni)), flexShrink: 0 }} />
                  <span style={{ fontFamily: font.body, fontWeight: isSelected ? 600 : 400, fontSize: '14px', color: isSelected ? '#007934' : '#333' }}>{muni.name}</span>
                  <span style={{ marginLeft: 'auto', fontFamily: font.body, fontSize: '12px', color: '#4B5563' }}>{muniDests.length}</span>
                </button>
                {/* Sitios del municipio elegido: también permiten usar el mapa sin tocar los puntos */}
                {isSelected && muniDests.map(d => (
                  <button
                    key={d.id}
                    onClick={() => setSelectedDest(d)}
                    aria-pressed={selectedDest?.id === d.id}
                    style={{
                      display: 'block', width: '100%', textAlign: 'left', padding: '10px 16px 10px 39px',
                      borderLeft: '3px solid #007934', borderBottom: '1px solid #E8EEF2',
                      backgroundColor: selectedDest?.id === d.id ? 'rgba(186,255,0,0.18)' : 'white',
                      fontFamily: font.body, fontSize: '13px', fontWeight: selectedDest?.id === d.id ? 600 : 400, color: '#142749',
                    }}
                  >
                    {d.name}
                  </button>
                ))}
              </div>
            )
          })}
        </div>
        </div>
      </div>

      {/* Map */}
      <div className="order-1 md:order-none relative overflow-hidden h-[420px] md:h-auto md:flex-1" style={{ backgroundColor: '#e8f0e8' }}>
        <SabanaMap
          destinations={destsByMuni}
          fallbackCenter={fallbackCenter}
          selectedId={selectedDest?.id ?? null}
          onSelect={selectDestination}
        />

        {/* Destino elegido: tarjeta flotante junto a donde el usuario está mirando (no en la barra lateral) */}
        {selectedDest && (
          <div
            ref={selectedCardRef}
            className="flex md:flex-col gap-3 md:gap-0 left-3 right-3 md:right-auto md:left-4 md:w-[300px]"
            style={{ position: 'absolute', bottom: '32px', zIndex: 30, backgroundColor: 'white', borderRadius: '10px', padding: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.18)' }}
          >
            <button
              type="button"
              onClick={() => setSelectedDest(null)}
              aria-label="Cerrar"
              className="flex items-center justify-center"
              style={{ position: 'absolute', top: '8px', right: '8px', zIndex: 1, width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.92)', boxShadow: '0 1px 4px rgba(0,0,0,0.15)', color: '#142749' }}
            >
              <X size={16} strokeWidth={2.25} />
            </button>
            <Image
              src={selectedDest.images[0]}
              alt={selectedDest.name}
              width={276}
              height={140}
              sizes="(min-width: 768px) 276px, 96px"
              className="w-24 h-24 md:w-full md:h-[140px] md:mb-2.5 shrink-0"
              style={{ objectFit: 'cover', borderRadius: '6px' }}
            />
            <div className="flex flex-col min-w-0 flex-1">
              <div><CategoryBadge category={selectedDest.categories[0]} /></div>
              <h4 style={{ fontFamily: font.heading, fontWeight: 600, fontSize: '18px', lineHeight: 1.15, color: '#142749', margin: '6px 28px 2px 0' }}>{selectedDest.name}</h4>
              <p style={{ fontFamily: font.body, fontSize: '12px', color: '#4B5563', marginBottom: '10px' }}>{selectedDest.municipality}</p>
              <Link
                href={routes.destination(selectedDest.slug)}
                className="block text-center mt-auto"
                style={{ width: '100%', padding: '9px', backgroundColor: '#007934', color: 'white', borderRadius: '6px', fontFamily: font.body, fontWeight: 600, fontSize: '13px' }}
              >
                Explorar destino
              </Link>
            </div>
          </div>
        )}

        {/* Map legend */}
        <div className={`hidden ${selectedDest ? 'xl:block' : 'md:block'}`} style={{ position: 'absolute', bottom: '32px', right: '16px', backgroundColor: 'rgba(255,255,255,0.94)', borderRadius: '8px', padding: '12px 16px', boxShadow: '0 2px 12px rgba(0,0,0,0.1)' }}>
          <div style={{ fontFamily: font.body, fontSize: '12px', fontWeight: 600, color: '#333', marginBottom: '8px' }}>LEYENDA</div>
          <div className="flex items-center gap-2 mb-2">
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#007934', border: '2px solid white', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
            <span style={{ fontFamily: font.body, fontSize: '12px', color: '#4B5563' }}>Destino turístico</span>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#BAFF00', border: '2px solid white', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
            <span style={{ fontFamily: font.body, fontSize: '12px', color: '#4B5563' }}>Seleccionado</span>
          </div>
          <div className="flex items-center gap-2">
            <div style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: '#007934', border: '2px solid white', boxShadow: '0 1px 4px rgba(0,0,0,0.2)', color: 'white', fontFamily: font.body, fontSize: '9px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '-3px', marginRight: '-3px' }}>3</div>
            <span style={{ fontFamily: font.body, fontSize: '12px', color: '#4B5563' }}>Grupo de destinos (toca para acercar)</span>
          </div>
        </div>

        {/* Instruction */}
        {!selectedMunicipality && !selectedDest && (
          <div style={{ position: 'absolute', top: '16px', left: '50%', transform: 'translateX(-50%)', width: 'max-content', maxWidth: 'calc(100% - 120px)', textAlign: 'center', backgroundColor: 'rgba(255,255,255,0.92)', borderRadius: '8px', padding: '10px 20px', boxShadow: '0 2px 12px rgba(0,0,0,0.1)', pointerEvents: 'none' }}>
            <span style={{ fontFamily: font.body, fontSize: '13px', color: '#4B5563' }}>Selecciona un municipio o destino para explorar</span>
          </div>
        )}

        {/* Volver a ver todos los municipios */}
        {selectedMunicipality && (
          <button
            onClick={() => { setSelectedMunicipality(null); setSelectedDest(null) }}
            style={{ position: 'absolute', top: '16px', left: '16px', zIndex: 30, backgroundColor: 'rgba(255,255,255,0.94)', borderRadius: '8px', padding: '10px 14px', boxShadow: '0 2px 12px rgba(0,0,0,0.1)', fontFamily: font.body, fontSize: '13px', fontWeight: 600, color: '#007934' }}
          >
            ← Todos los municipios
          </button>
        )}
      </div>
    </div>
  )
}
