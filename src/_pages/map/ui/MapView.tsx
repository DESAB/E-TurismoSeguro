'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MapPin } from 'lucide-react'
import { CategoryBadge } from '@/entities/destination'
import type { Destination } from '@/shared/api'
import { routes } from '@/shared/config'
import { unsplashUrl } from '@/shared/lib'
import { font } from '@/shared/ui'

const municipalityColors: Record<string, string> = {
  Zipaquirá: '#007934',
  Cogua: '#61A60E',
  Nemocón: '#3E9B55',
  Tocancipá: '#56AF89',
  Guasca: '#00665F',
  Chía: '#316649',
}

// Municipality positions on the map canvas (percentage of container)
const muniPositions: Record<string, { x: number; y: number }> = {
  Zipaquirá: { x: 30, y: 28 },
  Cogua: { x: 26, y: 20 },
  Nemocón: { x: 42, y: 17 },
  Tocancipá: { x: 55, y: 42 },
  Guasca: { x: 72, y: 37 },
  Chía: { x: 58, y: 58 },
}

export function MapView({ destinations, municipalities }: { destinations: Destination[]; municipalities: string[] }) {
  const [selectedMunicipality, setSelectedMunicipality] = useState<string | null>(null)
  const [selectedDest, setSelectedDest] = useState<Destination | null>(null)
  const [muniSearch, setMuniSearch] = useState('')

  const filteredMunis = municipalities.filter(m => m.toLowerCase().includes(muniSearch.toLowerCase()))

  const destsByMuni = selectedMunicipality
    ? destinations.filter(d => d.municipality === selectedMunicipality)
    : destinations

  return (
    <div style={{ display: 'flex', flex: 1, overflow: 'hidden', maxHeight: 'calc(100vh - 160px)' }}>
      {/* Sidebar */}
      <div style={{ width: '280px', flexShrink: 0, backgroundColor: '#F7F7F5', borderRight: '1px solid #E5E5E5', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
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
          {filteredMunis.map(muni => (
            <button
              key={muni}
              onClick={() => setSelectedMunicipality(selectedMunicipality === muni ? null : muni)}
              aria-pressed={selectedMunicipality === muni}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                width: '100%',
                padding: '12px 16px',
                textAlign: 'left',
                borderLeft: `3px solid ${selectedMunicipality === muni ? '#007934' : 'transparent'}`,
                backgroundColor: selectedMunicipality === muni ? 'rgba(0,121,52,0.06)' : 'transparent',
                borderBottom: '1px solid #E5E5E5',
              }}
            >
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: municipalityColors[muni], flexShrink: 0 }} />
              <span style={{ fontFamily: font.jost, fontWeight: selectedMunicipality === muni ? 600 : 400, fontSize: '14px', color: selectedMunicipality === muni ? '#007934' : '#333' }}>{muni}</span>
              <span style={{ marginLeft: 'auto', fontFamily: font.jost, fontSize: '11px', color: '#76777A' }}>
                {destinations.filter(d => d.municipality === muni).length}
              </span>
            </button>
          ))}
        </div>
        {selectedDest && (
          <div style={{ borderTop: '1px solid #E5E5E5', padding: '16px', backgroundColor: 'white' }}>
            <img src={unsplashUrl(selectedDest.imageId, 280, 140)} alt={selectedDest.name} style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '6px', marginBottom: '10px' }} />
            <CategoryBadge category={selectedDest.category} />
            <h4 style={{ fontFamily: font.barlow, fontWeight: 600, fontSize: '18px', color: '#233530', margin: '6px 0 4px' }}>{selectedDest.name}</h4>
            <p style={{ fontFamily: font.jost, fontSize: '12px', color: '#76777A', marginBottom: '10px' }}>{selectedDest.municipality}</p>
            <Link
              href={routes.destination(selectedDest.slug)}
              className="block text-center"
              style={{ width: '100%', padding: '8px', backgroundColor: '#007934', color: 'white', borderRadius: '6px', fontFamily: font.jost, fontWeight: 600, fontSize: '12px' }}
            >
              Explorar destino →
            </Link>
          </div>
        )}
      </div>

      {/* Map */}
      <div style={{ flex: 1, position: 'relative', backgroundColor: '#e8f0e8', overflow: 'hidden' }}>
        <img
          src={unsplashUrl('1487203007409-91f19b5b4f62', 1200, 700)}
          alt="Vista aérea Sabana de Bogotá"
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.35 }}
        />
        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(232,240,232,0.4)' }} />

        {/* Municipality markers */}
        {Object.entries(muniPositions).map(([muni, pos]) => {
          const isSelected = selectedMunicipality === muni
          const muniDests = destinations.filter(d => d.municipality === muni)
          return (
            <button
              key={muni}
              onClick={() => setSelectedMunicipality(isSelected ? null : muni)}
              aria-pressed={isSelected}
              style={{
                position: 'absolute',
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                transform: 'translate(-50%, -50%)',
                zIndex: 10,
              }}
            >
              <div style={{
                backgroundColor: isSelected ? '#C2D500' : municipalityColors[muni],
                color: isSelected ? '#233530' : 'white',
                borderRadius: '100px',
                padding: '6px 12px',
                fontFamily: font.jost,
                fontWeight: 600,
                fontSize: '12px',
                whiteSpace: 'nowrap',
                boxShadow: isSelected ? '0 4px 20px rgba(194,213,0,0.5)' : '0 2px 10px rgba(0,0,0,0.2)',
                transition: 'all 0.2s',
                border: isSelected ? '2px solid #C2D500' : '2px solid white',
              }}>
                {muni} ({muniDests.length})
              </div>
            </button>
          )
        })}

        {/* Destination markers */}
        {destsByMuni.map(dest => {
          const isSelected = selectedDest?.id === dest.id
          return (
            <button
              key={dest.id}
              onClick={() => setSelectedDest(isSelected ? null : dest)}
              aria-label={dest.name}
              aria-pressed={isSelected}
              style={{
                position: 'absolute',
                left: `${dest.coordinates.x}%`,
                top: `${dest.coordinates.y + 10}%`,
                transform: 'translate(-50%, -50%)',
                zIndex: 20,
              }}
            >
              <div style={{
                width: '28px',
                height: '28px',
                backgroundColor: isSelected ? '#C2D500' : '#007934',
                borderRadius: '50% 50% 50% 0',
                transform: 'rotate(-45deg)',
                boxShadow: `0 2px 8px rgba(0,0,0,0.3)`,
                border: '2px solid white',
                transition: 'all 0.2s',
              }}>
                <div style={{ transform: 'rotate(45deg)', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                  <MapPin size={11} color="white" fill="white" strokeWidth={0} style={{ transform: 'rotate(-45deg)' }} />
                </div>
              </div>
            </button>
          )
        })}

        {/* Map legend */}
        <div style={{ position: 'absolute', bottom: '16px', right: '16px', backgroundColor: 'rgba(255,255,255,0.94)', borderRadius: '8px', padding: '12px 16px', boxShadow: '0 2px 12px rgba(0,0,0,0.1)' }}>
          <div style={{ fontFamily: font.jost, fontSize: '11px', fontWeight: 600, color: '#333', marginBottom: '8px' }}>LEYENDA</div>
          <div className="flex items-center gap-2 mb-2">
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#007934', border: '2px solid white', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
            <span style={{ fontFamily: font.jost, fontSize: '11px', color: '#76777A' }}>Destino turístico</span>
          </div>
          <div className="flex items-center gap-2">
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#C2D500', border: '2px solid white', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
            <span style={{ fontFamily: font.jost, fontSize: '11px', color: '#76777A' }}>Seleccionado</span>
          </div>
        </div>

        {/* Instruction */}
        {!selectedMunicipality && !selectedDest && (
          <div style={{ position: 'absolute', top: '16px', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'rgba(255,255,255,0.92)', borderRadius: '8px', padding: '10px 20px', boxShadow: '0 2px 12px rgba(0,0,0,0.1)' }}>
            <span style={{ fontFamily: font.jost, fontSize: '13px', color: '#76777A' }}>Selecciona un municipio o destino para explorar</span>
          </div>
        )}
      </div>
    </div>
  )
}
