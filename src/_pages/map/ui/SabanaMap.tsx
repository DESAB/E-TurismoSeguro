'use client'

import { useEffect, useRef, useState } from 'react'
import type { GeoJSONSource, LngLatBoundsLike, Map as MapLibreMap } from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import type { Destination } from '@/shared/api'
import { font } from '@/shared/ui'

// Mapa real e interactivo: MapLibre GL + teselas vectoriales de OpenFreeMap (datos de OpenStreetMap,
// gratis, sin clave ni límite de uso). Los destinos cercanos se agrupan en círculos con su número.
const MAP_STYLE = 'https://tiles.openfreemap.org/styles/positron'
const SOURCE = 'destinos'

const COLORS = { primary: '#007934', accent: '#C2D500', deep: '#233530' }

const LOCALE_ES = {
  'NavigationControl.ZoomIn': 'Acercar',
  'NavigationControl.ZoomOut': 'Alejar',
  'NavigationControl.ResetBearing': 'Restablecer orientación',
  'AttributionControl.ToggleAttribution': 'Mostrar créditos del mapa',
  'CooperativeGesturesHandler.WindowsHelpText': 'Usa Ctrl + rueda del mouse para acercar el mapa',
  'CooperativeGesturesHandler.MacHelpText': 'Usa ⌘ + rueda del mouse para acercar el mapa',
  'CooperativeGesturesHandler.MobileHelpText': 'Usa dos dedos para mover el mapa',
}

function toGeoJSON(destinations: Destination[]): GeoJSON.FeatureCollection<GeoJSON.Point> {
  return {
    type: 'FeatureCollection',
    features: destinations.map(d => ({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [d.location.lon, d.location.lat] },
      properties: { id: d.id, name: d.name },
    })),
  }
}

function boundsOf(points: { lat: number; lon: number }[]): LngLatBoundsLike {
  const lats = points.map(p => p.lat)
  const lons = points.map(p => p.lon)
  return [[Math.min(...lons), Math.min(...lats)], [Math.max(...lons), Math.max(...lats)]]
}

interface SabanaMapProps {
  /** Destinos visibles (todos, o los del municipio elegido) */
  destinations: Destination[]
  /** Centro al que ir cuando no hay destinos visibles (municipio sin sitios) */
  fallbackCenter?: { lat: number; lon: number }
  selectedId: string | null
  onSelect: (destination: Destination) => void
}

export function SabanaMap({ destinations, fallbackCenter, selectedId, onSelect }: SabanaMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<MapLibreMap | null>(null)
  const [ready, setReady] = useState(false)

  // Últimos valores para los manejadores de eventos del mapa (se registran una sola vez)
  const latest = useRef({ destinations, onSelect })
  useEffect(() => { latest.current = { destinations, onSelect } }, [destinations, onSelect])

  // Crear el mapa una vez (MapLibre solo se descarga en esta página)
  useEffect(() => {
    let cancelled = false
    let map: MapLibreMap | undefined

    import('maplibre-gl').then(({ default: maplibregl }) => {
      if (cancelled || !containerRef.current) return
      const initial = latest.current.destinations.map(d => d.location)
      map = new maplibregl.Map({
        container: containerRef.current,
        style: MAP_STYLE,
        bounds: boundsOf(initial),
        fitBoundsOptions: { padding: 48 },
        maxZoom: 17,
        attributionControl: { compact: true },
        // En móvil el mapa está dentro de una página que se desplaza: mover el mapa requiere dos dedos
        cooperativeGestures: window.matchMedia('(max-width: 767px)').matches,
        locale: LOCALE_ES,
      })
      map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right')
      mapRef.current = map

      map.on('load', () => {
        if (!map) return
        map.addSource(SOURCE, { type: 'geojson', data: toGeoJSON(latest.current.destinations), cluster: true, clusterRadius: 40, clusterMaxZoom: 14 })

        // Grupos de destinos
        map.addLayer({
          id: 'grupos', type: 'circle', source: SOURCE, filter: ['has', 'point_count'],
          paint: {
            'circle-color': COLORS.primary,
            'circle-radius': ['step', ['get', 'point_count'], 16, 4, 20, 8, 24],
            'circle-stroke-color': '#ffffff',
            'circle-stroke-width': 2,
          },
        })
        map.addLayer({
          id: 'grupos-numero', type: 'symbol', source: SOURCE, filter: ['has', 'point_count'],
          layout: { 'text-field': ['get', 'point_count_abbreviated'], 'text-font': ['Noto Sans Bold'], 'text-size': 13, 'text-allow-overlap': true },
          paint: { 'text-color': '#ffffff' },
        })
        // Destinos individuales
        map.addLayer({
          id: 'destino', type: 'circle', source: SOURCE, filter: ['!', ['has', 'point_count']],
          paint: { 'circle-color': COLORS.primary, 'circle-radius': 9, 'circle-stroke-color': '#ffffff', 'circle-stroke-width': 2.5 },
        })
        map.addLayer({
          id: 'destino-seleccionado', type: 'circle', source: SOURCE, filter: ['==', ['get', 'id'], ''],
          paint: { 'circle-color': COLORS.accent, 'circle-radius': 11, 'circle-stroke-color': '#ffffff', 'circle-stroke-width': 3 },
        })
        map.addLayer({
          id: 'destino-nombre', type: 'symbol', source: SOURCE, filter: ['!', ['has', 'point_count']], minzoom: 11,
          layout: { 'text-field': ['get', 'name'], 'text-font': ['Noto Sans Regular'], 'text-size': 12, 'text-offset': [0, 1.3], 'text-anchor': 'top', 'text-max-width': 10 },
          paint: { 'text-color': COLORS.deep, 'text-halo-color': '#ffffff', 'text-halo-width': 1.5 },
        })

        // Clic en un grupo: acercar hasta separarlo
        map.on('click', 'grupos', async e => {
          const feature = e.features?.[0]
          if (!map || !feature) return
          const source = map.getSource(SOURCE) as GeoJSONSource
          const zoom = await source.getClusterExpansionZoom(feature.properties.cluster_id as number)
          map.easeTo({ center: (feature.geometry as GeoJSON.Point).coordinates as [number, number], zoom })
        })
        // Clic en un destino: seleccionarlo
        map.on('click', 'destino', e => {
          const id = e.features?.[0]?.properties.id
          const dest = latest.current.destinations.find(d => d.id === id)
          if (dest) latest.current.onSelect(dest)
        })
        for (const layer of ['grupos', 'destino']) {
          map.on('mouseenter', layer, () => { if (map) map.getCanvas().style.cursor = 'pointer' })
          map.on('mouseleave', layer, () => { if (map) map.getCanvas().style.cursor = '' })
        }
        setReady(true)
      })
    })

    return () => {
      cancelled = true
      map?.remove()
      mapRef.current = null
    }
  }, [])

  // Cambió el conjunto visible (municipio elegido o "todos"): actualizar datos y encuadre
  useEffect(() => {
    const map = mapRef.current
    if (!ready || !map) return
    ;(map.getSource(SOURCE) as GeoJSONSource).setData(toGeoJSON(destinations))
    if (destinations.length > 0) {
      map.fitBounds(boundsOf(destinations.map(d => d.location)), { padding: 60, maxZoom: 14, duration: 800 })
    } else if (fallbackCenter) {
      map.flyTo({ center: [fallbackCenter.lon, fallbackCenter.lat], zoom: 12, duration: 800 })
    }
  }, [ready, destinations, fallbackCenter])

  // Destino seleccionado: resaltarlo y llevarlo a la vista (con zoom suficiente para separarlo de su grupo)
  useEffect(() => {
    const map = mapRef.current
    if (!ready || !map) return
    map.setFilter('destino-seleccionado', ['==', ['get', 'id'], selectedId ?? ''])
    const dest = latest.current.destinations.find(d => d.id === selectedId)
    if (dest) map.easeTo({ center: [dest.location.lon, dest.location.lat], zoom: Math.max(map.getZoom(), 15), duration: 600 })
  }, [ready, selectedId])

  return (
    <>
      {/* MapLibre controla el contenido de este div: no poner hijos de React dentro */}
      <div ref={containerRef} role="region" aria-label="Mapa de destinos turísticos de la Sabana" style={{ position: 'absolute', inset: 0 }} />
      {!ready && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: font.jost, fontSize: '13px', color: '#76777A', pointerEvents: 'none' }}>
          Cargando mapa…
        </div>
      )}
    </>
  )
}
