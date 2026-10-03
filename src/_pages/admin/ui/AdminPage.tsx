'use client'
/* eslint-disable @next/next/no-img-element -- Vistas previas de IDs de Unsplash que escribe el
   administrador: se muestran tal cual con <img>. La página /admin no se indexa. */

import { useState, type CSSProperties } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Play, Search } from 'lucide-react'
import { CATEGORIES, type Category, type Destination, type Video } from '@/shared/api'
import { routes } from '@/shared/config'
import { slugify } from '@/shared/lib'
import { font, policeShieldImage } from '@/shared/ui'

// Panel de administración (réplica del prototipo). Por ahora los cambios viven solo en memoria del
// navegador: se pierden al recargar. Fase 5: guardar en Supabase y proteger con login.

const UNSPLASH_BASE = 'https://images.unsplash.com/photo-'

/** Vista previa de una imagen escrita a mano: ruta del sitio, URL completa o (por compatibilidad) ID de Unsplash. */
const previewSrc = (value: string) => (value.startsWith('/') || value.startsWith('http') ? value : `${UNSPLASH_BASE}${value}`)

// El formulario trabaja con una portada (imageId) y una categoría principal, como el prototipo.
// Se convierte al modelo de datos (images[], categories[]) al cargar y al guardar.
type AdminDestination = Destination & { imageId: string; category: Category }

const toAdmin = (d: Destination): AdminDestination => ({ ...d, imageId: d.images[0] ?? '', category: d.categories[0] ?? 'Naturaleza' })

const fromAdmin = ({ imageId, category, ...d }: AdminDestination): AdminDestination => {
  const images = imageId ? Array.from(new Set([imageId, ...d.images])) : d.images
  const categories = [category, ...d.categories.filter(c => c !== category)]
  return toAdmin({ ...d, images, categories, slug: d.slug || slugify(d.name) })
}

type SaveState = 'idle' | 'saving' | 'saved' | 'error'

export function AdminPage({
  initialDestinations, initialVideos, municipalities,
}: {
  initialDestinations: Destination[]
  initialVideos: Video[]
  municipalities: string[]
}) {
  const [destinations, setDestinations] = useState<AdminDestination[]>(() => initialDestinations.map(toAdmin))
  const [videos, setVideos] = useState<Video[]>(initialVideos)

  const onAddDest    = (d: AdminDestination) => setDestinations(prev => [...prev, d])
  const onEditDest   = (d: AdminDestination) => setDestinations(prev => prev.map(x => x.id === d.id ? d : x))
  const onDeleteDest = (id: string)     => setDestinations(prev => prev.filter(x => x.id !== id))

  const onAddVideo    = (v: Video) => setVideos(prev => [...prev, v])
  const onEditVideo   = (v: Video) => setVideos(prev => prev.map(x => x.id === v.id ? v : x))
  const onDeleteVideo = (id: string) => setVideos(prev => prev.filter(x => x.id !== id))

  // ── State ──
  const [tab, setTab] = useState<'destinos' | 'videos'>('destinos')
  const [selectedDest, setSelectedDest] = useState<AdminDestination | null>(destinations[0] ?? null)
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(videos[0] ?? null)
  const [search, setSearch] = useState('')
  const [confirmDelete, setConfirmDelete] = useState<{ id: string; type: 'dest' | 'video' } | null>(null)
  const [saveState, setSaveState] = useState<SaveState>('idle')
  const [destForm, setDestForm] = useState<AdminDestination | null>(null)
  const [videoForm, setVideoForm] = useState<Video | null>(null)

  // ── Helpers ──
  const emptyDest = (): AdminDestination => ({
    id: Date.now().toString(), slug: '', name: '', municipality: municipalities[0],
    category: 'Naturaleza', categories: ['Naturaleza'], description: '', longDescription: '',
    // El formulario aún no edita la ubicación (Fase 5): centro de la Sabana, marcado como aproximado
    location: { lat: 4.86, lon: -74.06, approximate: 'sin ubicar' },
    imageId: '', images: [],
    address: '', hours: '', tips: ['', '', ''],
  })
  const emptyVideo = (): Video => ({
    id: Date.now().toString(), title: '', subtitle: '', img: '', duration: '', featured: false, url: '',
  })

  const simulateSave = (fn: () => void) => {
    setSaveState('saving')
    setTimeout(() => { fn(); setSaveState('saved'); setTimeout(() => setSaveState('idle'), 1800) }, 600)
  }

  const saveDest = () => {
    if (!destForm) return
    const d = fromAdmin(destForm)
    simulateSave(() => {
      const isNew = !destinations.find(x => x.id === d.id)
      if (isNew) onAddDest(d)
      else onEditDest(d)
      setSelectedDest(d)
      setDestForm(null)
    })
  }
  const saveVideo = () => {
    if (!videoForm) return
    simulateSave(() => {
      const isNew = !videos.find(x => x.id === videoForm.id)
      if (isNew) onAddVideo(videoForm)
      else onEditVideo(videoForm)
      setSelectedVideo(videoForm)
      setVideoForm(null)
    })
  }
  const doDelete = () => {
    if (!confirmDelete) return
    simulateSave(() => {
      if (confirmDelete.type === 'dest') {
        onDeleteDest(confirmDelete.id)
        setSelectedDest(destinations.find(d => d.id !== confirmDelete.id) ?? null)
        setDestForm(null)
      } else {
        onDeleteVideo(confirmDelete.id)
        setSelectedVideo(videos.find(v => v.id !== confirmDelete.id) ?? null)
        setVideoForm(null)
      }
      setConfirmDelete(null)
    })
  }

  const filteredDests = destinations.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.municipality.toLowerCase().includes(search.toLowerCase())
  )
  const filteredVideos = videos.filter(v =>
    v.title.toLowerCase().includes(search.toLowerCase()) ||
    v.subtitle.toLowerCase().includes(search.toLowerCase())
  )

  // ── Styles ──
  const D: Record<string, CSSProperties> = {
    panel: { backgroundColor: '#F7F7F5', color: '#233530', height: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column' },
    inp: { width: '100%', padding: '8px 10px', backgroundColor: 'white', border: '1.5px solid #E5E5E5', borderRadius: '5px', fontFamily: font.jost, fontSize: '13px', color: '#333', outline: 'none' },
    lbl: { fontFamily: font.jost, fontSize: '10px', fontWeight: 600, color: '#76777A', letterSpacing: '0.1em', display: 'block', marginBottom: '4px' },
    sec: { borderTop: '1px solid #EBEBEB', padding: '20px 24px' },
    secTitle: { fontFamily: font.jost, fontSize: '11px', fontWeight: 600, color: '#76777A', letterSpacing: '0.1em', marginBottom: '12px' },
    btn: { fontFamily: font.jost, fontWeight: 600, fontSize: '12px', padding: '5px 12px', borderRadius: '4px', border: '1.5px solid #D1D1D1', color: '#555', backgroundColor: 'white', cursor: 'pointer' },
    btnGreen: { fontFamily: font.jost, fontWeight: 600, fontSize: '12px', padding: '6px 14px', borderRadius: '4px', border: 'none', backgroundColor: '#007934', color: 'white', cursor: 'pointer' },
    btnDanger: { fontFamily: font.jost, fontWeight: 600, fontSize: '12px', padding: '5px 12px', borderRadius: '4px', border: '1px solid rgba(180,30,30,0.35)', color: '#b91c1c', backgroundColor: 'transparent', cursor: 'pointer' },
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F7F7F5', display: 'flex', flexDirection: 'column' }}>

      {/* ── Top bar ── */}
      <div style={{ backgroundColor: '#233530', borderBottom: '1px solid rgba(0,0,0,0.12)', padding: '0 24px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Image src={policeShieldImage} alt="Policía Nacional" width={32} height={32} style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
          <div>
            <span style={{ fontFamily: font.barlow, fontWeight: 700, fontSize: '16px', color: '#C2D500', letterSpacing: '0.04em' }}>E-TurismoSeguro</span>
            <span style={{ fontFamily: font.jost, fontSize: '11px', color: 'rgba(255,255,255,0.45)', marginLeft: '10px' }}>Panel de administración</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {saveState === 'saving' && <span style={{ fontFamily: font.jost, fontSize: '12px', color: '#C2D500', display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#C2D500', display: 'inline-block' }} />Guardando...</span>}
          {saveState === 'saved'  && <span style={{ fontFamily: font.jost, fontSize: '12px', color: '#C2D500', display: 'flex', alignItems: 'center', gap: '6px' }}>✓ Guardado</span>}
          {saveState === 'error'  && <span style={{ fontFamily: font.jost, fontSize: '12px', color: '#fca5a5', display: 'flex', alignItems: 'center', gap: '6px' }}>✕ Error al guardar</span>}
          <Link href={routes.home} style={{ fontFamily: font.jost, fontWeight: 600, fontSize: '12px', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.2)', padding: '6px 14px', borderRadius: '5px', backgroundColor: 'transparent' }}>
            ← Volver al sitio
          </Link>
        </div>
      </div>

      {/* ── Main split ── */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', height: 'calc(100vh - 56px)' }}>

        {/* ══ LEFT: list panel ══ */}
        <div style={{ width: '300px', flexShrink: 0, backgroundColor: 'white', borderRight: '1px solid #EBEBEB', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid #EBEBEB', flexShrink: 0 }}>
            {(['destinos', 'videos'] as const).map(t => (
              <button key={t} onClick={() => { setTab(t); setSearch('') }} style={{
                flex: 1, padding: '12px 0', fontFamily: font.jost, fontWeight: 600, fontSize: '12px', letterSpacing: '0.06em',
                color: tab === t ? '#007934' : '#76777A',
                borderBottom: tab === t ? '2px solid #007934' : '2px solid transparent',
                backgroundColor: 'transparent',
              }}>
                {t === 'destinos' ? `DESTINOS (${destinations.length})` : `VIDEOS (${videos.length})`}
              </button>
            ))}
          </div>

          {/* Search */}
          <div style={{ padding: '12px', borderBottom: '1px solid #EBEBEB', flexShrink: 0, position: 'relative' }}>
            <Search size={14} color="#C8C8C8" strokeWidth={2} style={{ position: 'absolute', left: '22px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Buscar..."
              style={{ ...D.inp, paddingLeft: '32px', fontSize: '12px' }}
            />
          </div>

          {/* Add button */}
          <div style={{ padding: '10px 12px', borderBottom: '1px solid #EBEBEB', flexShrink: 0 }}>
            <button
              onClick={() => {
                if (tab === 'destinos') { setDestForm(emptyDest()); setSelectedDest(null) }
                else { setVideoForm(emptyVideo()); setSelectedVideo(null) }
              }}
              style={{ width: '100%', padding: '8px', border: '1px dashed rgba(194,213,0,0.4)', borderRadius: '5px', backgroundColor: 'rgba(194,213,0,0.04)', color: '#C2D500', fontFamily: font.jost, fontWeight: 600, fontSize: '12px', cursor: 'pointer' }}
            >
              + Agregar {tab === 'destinos' ? 'destino' : 'video'}
            </button>
          </div>

          {/* List */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {tab === 'destinos' && filteredDests.map(d => {
              const sel = selectedDest?.id === d.id
              return (
                <button key={d.id} onClick={() => { setSelectedDest(d); setDestForm(null) }} style={{
                  display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 12px',
                  borderLeft: sel ? '3px solid #007934' : '3px solid transparent',
                  backgroundColor: sel ? 'rgba(0,121,52,0.06)' : 'transparent',
                  borderBottom: '1px solid #F2F2F2',
                  textAlign: 'left',
                }}>
                  <div style={{ width: '44px', height: '34px', borderRadius: '4px', overflow: 'hidden', backgroundColor: '#e8f0e8', flexShrink: 0 }}>
                    {d.imageId && <img src={previewSrc(d.imageId)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontFamily: font.jost, fontWeight: 600, fontSize: '13px', color: sel ? '#007934' : '#233530', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.name || <em style={{ opacity: 0.4 }}>Sin nombre</em>}</div>
                    <div style={{ fontFamily: font.jost, fontSize: '11px', color: '#76777A', marginTop: '2px' }}>{d.municipality} · {d.category}</div>
                  </div>
                </button>
              )
            })}
            {tab === 'videos' && filteredVideos.map(v => {
              const sel = selectedVideo?.id === v.id
              return (
                <button key={v.id} onClick={() => { setSelectedVideo(v); setVideoForm(null) }} style={{
                  display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 12px',
                  borderLeft: sel ? '3px solid #007934' : '3px solid transparent',
                  backgroundColor: sel ? 'rgba(0,121,52,0.06)' : 'transparent',
                  borderBottom: '1px solid #F2F2F2',
                  textAlign: 'left',
                }}>
                  <div style={{ position: 'relative', width: '44px', height: '34px', borderRadius: '4px', overflow: 'hidden', backgroundColor: '#e8f0e8', flexShrink: 0 }}>
                    {v.img && <img src={previewSrc(v.img)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }} />}
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Play size={10} fill="white" color="white" strokeWidth={0} style={{ marginLeft: '1px' }} />
                    </div>
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontFamily: font.jost, fontWeight: 600, fontSize: '12px', color: sel ? '#007934' : '#233530', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{v.title || <em style={{ opacity: 0.4 }}>Sin título</em>}</div>
                    <div style={{ fontFamily: font.jost, fontSize: '11px', color: '#76777A', marginTop: '2px', display: 'flex', gap: '6px' }}>
                      <span>{v.duration}</span>
                      {v.featured && <span style={{ color: '#007934' }}>★ Destacado</span>}
                    </div>
                  </div>
                </button>
              )
            })}
            {tab === 'destinos' && filteredDests.length === 0 && (
              <div style={{ padding: '32px 16px', textAlign: 'center', fontFamily: font.jost, fontSize: '13px', color: '#C8C8C8' }}>Sin resultados</div>
            )}
          </div>
        </div>

        {/* ══ RIGHT: detail / edit panel ══ */}
        <div style={{ flex: 1, overflowY: 'auto', backgroundColor: '#F7F7F5' }}>

          {/* ── DESTINATION detail / form ── */}
          {tab === 'destinos' && (() => {
            const form = destForm
            const view = selectedDest
            if (!form && !view) return (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontFamily: font.jost, fontSize: '14px', color: '#C8C8C8' }}>
                Selecciona un destino o agrega uno nuevo
              </div>
            )

            if (form) {
              // ── EDIT / CREATE FORM ──
              return (
                <div style={{ maxWidth: '680px', padding: '32px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
                    <h2 style={{ fontFamily: font.barlow, fontSize: '26px', fontWeight: 700, color: '#233530' }}>
                      {destinations.find(d => d.id === form.id) ? 'Editar destino' : 'Nuevo destino'}
                    </h2>
                    <button onClick={() => setDestForm(null)} style={{ ...D.btn, fontSize: '20px', border: 'none', color: '#76777A', padding: '0 4px' }}>×</button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div style={{ gridColumn: '1/-1' }}>
                      <label style={D.lbl}>NOMBRE DEL DESTINO</label>
                      <input style={D.inp} value={form.name} onChange={e => setDestForm(f => f && ({ ...f, name: e.target.value }))} placeholder="Ej: Catedral de Sal" />
                    </div>
                    <div>
                      <label style={D.lbl}>MUNICIPIO</label>
                      <select style={D.inp} value={form.municipality} onChange={e => setDestForm(f => f && ({ ...f, municipality: e.target.value }))}>
                        {municipalities.map(m => <option key={m}>{m}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={D.lbl}>CATEGORÍA</label>
                      <select style={D.inp} value={form.category} onChange={e => setDestForm(f => f && ({ ...f, category: e.target.value as Category }))}>
                        {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                    <div style={{ gridColumn: '1/-1' }}>
                      <label style={D.lbl}>DESCRIPCIÓN CORTA</label>
                      <input style={D.inp} value={form.description} onChange={e => setDestForm(f => f && ({ ...f, description: e.target.value }))} placeholder="Una frase descriptiva" />
                    </div>
                    <div style={{ gridColumn: '1/-1' }}>
                      <label style={D.lbl}>DESCRIPCIÓN COMPLETA</label>
                      <textarea style={{ ...D.inp, minHeight: '80px', resize: 'vertical' }} value={form.longDescription} onChange={e => setDestForm(f => f && ({ ...f, longDescription: e.target.value }))} placeholder="Descripción detallada..." />
                    </div>

                    {/* Image */}
                    <div style={{ gridColumn: '1/-1' }}>
                      <label style={D.lbl}>IMAGEN PRINCIPAL — ruta o URL</label>
                      <input style={D.inp} value={form.imageId} onChange={e => setDestForm(f => f && ({ ...f, imageId: e.target.value }))} placeholder="Ej: /destinos/catedral-de-sal/1.jpg" />
                      {form.imageId ? (
                        <img src={previewSrc(form.imageId)} alt="preview" style={{ marginTop: '8px', width: '100%', height: '130px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #E5E5E5' }} />
                      ) : (
                        <div style={{ marginTop: '8px', width: '100%', height: '80px', border: '1px dashed #D1D1D1', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: font.jost, fontSize: '11px', color: '#C8C8C8' }}>
                          IMAGEN PRINCIPAL
                        </div>
                      )}
                    </div>

                    {/* Imágenes de galería */}
                    <div style={{ gridColumn: '1/-1' }}>
                      <label style={D.lbl}>IMÁGENES DE GALERÍA — rutas o URLs separadas por coma</label>
                      <input style={D.inp} value={form.images.filter(i => i !== form.imageId).join(', ')} onChange={e => setDestForm(f => f && ({ ...f, images: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))} placeholder="id1, id2, id3" />
                      <div style={{ fontFamily: font.jost, fontSize: '11px', color: '#76777A', marginTop: '4px' }}>{form.images.length} imagen{form.images.length !== 1 ? 'es' : ''} en galería</div>
                    </div>

                    <div>
                      <label style={D.lbl}>DIRECCIÓN</label>
                      <input style={D.inp} value={form.address} onChange={e => setDestForm(f => f && ({ ...f, address: e.target.value }))} placeholder="Dirección o referencia" />
                    </div>
                    <div>
                      <label style={D.lbl}>HORARIO</label>
                      <input style={D.inp} value={form.hours} onChange={e => setDestForm(f => f && ({ ...f, hours: e.target.value }))} placeholder="Lun–Dom 9:00am – 5:00pm" />
                    </div>

                    <div style={{ gridColumn: '1/-1' }}>
                      <label style={D.lbl}>RECOMENDACIONES DE SEGURIDAD</label>
                      {[0, 1, 2].map(i => (
                        <input key={i} style={{ ...D.inp, marginBottom: '6px' }} value={form.tips[i] || ''} onChange={e => setDestForm(f => { if (!f) return f; const t = [...f.tips]; t[i] = e.target.value; return { ...f, tips: t } })} placeholder={`Recomendación ${i + 1}`} />
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #EBEBEB' }}>
                    {destinations.find(d => d.id === form.id) && (
                      <button onClick={() => setConfirmDelete({ id: form.id, type: 'dest' })} style={D.btnDanger}>Eliminar destino</button>
                    )}
                    <div style={{ display: 'flex', gap: '10px', marginLeft: 'auto' }}>
                      <button onClick={() => setDestForm(null)} style={D.btn}>Cancelar</button>
                      <button onClick={saveDest} disabled={saveState === 'saving'} style={{ ...D.btnGreen, opacity: saveState === 'saving' ? 0.6 : 1 }}>
                        {saveState === 'saving' ? 'Guardando...' : 'Guardar cambios'}
                      </button>
                    </div>
                  </div>
                </div>
              )
            }

            // ── VIEW (contextual sections) ──
            if (view) return (
              <div>
                {/* Header */}
                <div style={{ padding: '28px 28px 0' }}>
                  <div style={{ fontFamily: font.jost, fontSize: '11px', color: '#76777A', letterSpacing: '0.08em', marginBottom: '4px' }}>{view.municipality} · {view.category}</div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                    <h2 style={{ fontFamily: font.barlow, fontSize: '28px', fontWeight: 700, color: '#233530' }}>{view.name}</h2>
                    <button onClick={() => setDestForm({ ...view })} style={{ ...D.btnGreen, flexShrink: 0 }}>Editar información</button>
                  </div>
                </div>

                {/* Imagen principal */}
                <div style={D.sec}>
                  <div style={D.secTitle}>IMAGEN PRINCIPAL</div>
                  {view.imageId ? (
                    <img src={previewSrc(view.imageId)} alt={view.name} style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px', display: 'block', border: '1px solid #E5E5E5' }} />
                  ) : (
                    <div style={{ height: '100px', border: '1px dashed #D1D1D1', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: font.jost, fontSize: '12px', color: '#C8C8C8' }}>
                      IMAGEN PRINCIPAL — sin asignar
                    </div>
                  )}
                </div>

                {/* Galería */}
                <div style={D.sec}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={D.secTitle as CSSProperties}>IMÁGENES DE GALERÍA</span>
                    <button onClick={() => setDestForm({ ...view })} style={D.btn}>+ Agregar</button>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {view.images.length > 0 ? view.images.map((img, i) => (
                      <div key={i} style={{ width: '80px', height: '56px', borderRadius: '5px', overflow: 'hidden', backgroundColor: '#e8f0e8', border: '1px solid #E5E5E5' }}>
                        <img src={previewSrc(img)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    )) : <span style={{ fontFamily: font.jost, fontSize: '12px', color: '#C8C8C8' }}>Sin imágenes en galería</span>}
                    <div style={{ fontFamily: font.jost, fontSize: '11px', color: '#76777A', display: 'flex', alignItems: 'center' }}>{view.images.length} imagen{view.images.length !== 1 ? 'es' : ''}</div>
                  </div>
                </div>

                {/* Videos del destino */}
                <div style={D.sec}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={D.secTitle as CSSProperties}>VIDEOS RELACIONADOS</span>
                    <button onClick={() => { setTab('videos') }} style={D.btn}>+ Agregar</button>
                  </div>
                  {(() => {
                    const related = videos.filter(v => v.subtitle.toLowerCase().includes(view.municipality.toLowerCase()))
                    return related.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {related.map(v => (
                          <div key={v.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px', backgroundColor: '#F2F2F2', borderRadius: '6px' }}>
                            <div style={{ position: 'relative', width: '52px', height: '36px', borderRadius: '4px', overflow: 'hidden', backgroundColor: '#e8f0e8', flexShrink: 0 }}>
                              {v.img && <img src={previewSrc(v.img)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }} />}
                              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Play size={10} fill="white" color="white" strokeWidth={0} style={{ marginLeft: '1px' }} />
                              </div>
                            </div>
                            <div>
                              <div style={{ fontFamily: font.jost, fontSize: '12px', color: '#233530', fontWeight: 500 }}>{v.title}</div>
                              <div style={{ fontFamily: font.jost, fontSize: '11px', color: '#76777A' }}>{v.duration}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : <span style={{ fontFamily: font.jost, fontSize: '12px', color: '#76777A' }}>{videos.length} videos · {videos.filter(v => v.subtitle.toLowerCase().includes(view.municipality.toLowerCase())).length} relacionados con {view.municipality}</span>
                  })()}
                </div>

                {/* Información */}
                <div style={{ ...D.sec, color: 'var(--color-brand-deep)' }}>
                  <div style={{ ...D.secTitle, color: 'var(--color-brand-dark)' }}>INFORMACIÓN DEL DESTINO</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                    {[
                      { label: 'Dirección', value: view.address },
                      { label: 'Horario',   value: view.hours },
                    ].map(item => (
                      <div key={item.label} style={{ backgroundColor: 'white', borderRadius: '6px', padding: '10px 12px', border: '1px solid #EBEBEB' }}>
                        <div style={{ fontFamily: font.jost, fontSize: '10px', color: 'var(--color-brand-dark)', letterSpacing: '0.08em', marginBottom: '3px' }}>{item.label.toUpperCase()}</div>
                        <div style={{ fontFamily: font.jost, fontSize: '13px', color: item.value ? 'var(--color-brand-deep)' : 'var(--color-brand-gray-dark)' }}>{item.value || 'Sin datos'}</div>
                      </div>
                    ))}
                  </div>
                  {view.tips.filter(Boolean).length > 0 && (
                    <div style={{ backgroundColor: 'white', borderRadius: '6px', padding: '10px 12px', border: '1px solid #EBEBEB' }}>
                      <div style={{ fontFamily: font.jost, fontSize: '10px', color: 'var(--color-brand-dark)', letterSpacing: '0.08em', marginBottom: '8px' }}>RECOMENDACIONES</div>
                      {view.tips.filter(Boolean).map((t, i) => (
                        <div key={i} style={{ fontFamily: font.jost, fontSize: '12px', color: 'var(--color-brand-deep)', marginBottom: '4px', display: 'flex', gap: '6px' }}>
                          <span style={{ color: 'var(--color-brand-primary)', flexShrink: 0 }}>›</span>{t}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Danger zone */}
                <div style={{ ...D.sec, borderTop: '1px solid rgba(200,50,50,0.2)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontFamily: font.jost, fontWeight: 600, fontSize: '13px', color: '#b91c1c' }}>Eliminar destino</div>
                      <div style={{ fontFamily: font.jost, fontSize: '12px', color: 'var(--color-brand-deep)', marginTop: '2px' }}>Esta acción no se puede deshacer</div>
                    </div>
                    <button onClick={() => setConfirmDelete({ id: view.id, type: 'dest' })} style={D.btnDanger}>Eliminar</button>
                  </div>
                </div>
              </div>
            )
            return null
          })()}

          {/* ── VIDEO detail / form ── */}
          {tab === 'videos' && (() => {
            const form = videoForm
            const view = selectedVideo
            if (!form && !view) return (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontFamily: font.jost, fontSize: '14px', color: '#C8C8C8' }}>
                Selecciona un video o agrega uno nuevo
              </div>
            )

            if (form) {
              return (
                <div style={{ maxWidth: '560px', padding: '32px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                    <h2 style={{ fontFamily: font.barlow, fontSize: '26px', fontWeight: 700, color: '#233530' }}>
                      {videos.find(v => v.id === form.id) ? 'Editar video' : 'Nuevo video'}
                    </h2>
                    <button onClick={() => setVideoForm(null)} style={{ ...D.btn, fontSize: '20px', border: 'none', color: '#76777A', padding: '0 4px' }}>×</button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div>
                      <label style={D.lbl}>TÍTULO</label>
                      <input style={D.inp} value={form.title} onChange={e => setVideoForm(f => f && ({ ...f, title: e.target.value }))} placeholder="Título del video" />
                    </div>
                    <div>
                      <label style={D.lbl}>SUBTÍTULO / CATEGORÍA</label>
                      <input style={D.inp} value={form.subtitle} onChange={e => setVideoForm(f => f && ({ ...f, subtitle: e.target.value }))} placeholder="Ej: Zipaquirá · Patrimonio" />
                    </div>
                    <div>
                      <label style={D.lbl}>MINIATURA — URL</label>
                      <input style={D.inp} value={form.img} onChange={e => setVideoForm(f => f && ({ ...f, img: e.target.value }))} placeholder="Ej: 1724027212141-7244bc12678a" />
                      {form.img ? (
                        <div style={{ position: 'relative', marginTop: '8px', borderRadius: '6px', overflow: 'hidden', height: '110px', backgroundColor: '#233530', border: '1px solid #E5E5E5' }}>
                          <img src={previewSrc(form.img)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }} />
                          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: 'rgba(0,121,52,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Play size={18} fill="white" color="white" strokeWidth={0} style={{ marginLeft: '3px' }} />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div style={{ marginTop: '8px', height: '70px', border: '1px dashed #D1D1D1', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: font.jost, fontSize: '11px', color: '#C8C8C8' }}>MINIATURA</div>
                      )}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', alignItems: 'end' }}>
                      <div>
                        <label style={D.lbl}>DURACIÓN</label>
                        <input style={D.inp} value={form.duration} onChange={e => setVideoForm(f => f && ({ ...f, duration: e.target.value }))} placeholder="Ej: 4:32" />
                      </div>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', paddingBottom: '2px' }}>
                        <input type="checkbox" checked={form.featured} onChange={e => setVideoForm(f => f && ({ ...f, featured: e.target.checked }))} style={{ accentColor: '#C2D500', width: '15px', height: '15px' }} />
                        <span style={{ fontFamily: font.jost, fontSize: '13px', color: '#555' }}>Marcar como destacado</span>
                      </label>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #EBEBEB' }}>
                    {videos.find(v => v.id === form.id) && (
                      <button onClick={() => setConfirmDelete({ id: form.id, type: 'video' })} style={D.btnDanger}>Eliminar video</button>
                    )}
                    <div style={{ display: 'flex', gap: '10px', marginLeft: 'auto' }}>
                      <button onClick={() => setVideoForm(null)} style={D.btn}>Cancelar</button>
                      <button onClick={saveVideo} disabled={saveState === 'saving'} style={{ ...D.btnGreen, opacity: saveState === 'saving' ? 0.6 : 1 }}>
                        {saveState === 'saving' ? 'Guardando...' : 'Guardar cambios'}
                      </button>
                    </div>
                  </div>
                </div>
              )
            }

            if (view) return (
              <div>
                <div style={{ padding: '28px 28px 0' }}>
                  <div style={{ fontFamily: font.jost, fontSize: '11px', color: '#76777A', letterSpacing: '0.08em', marginBottom: '4px' }}>{view.subtitle}</div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                    <h2 style={{ fontFamily: font.barlow, fontSize: '26px', fontWeight: 700, color: '#233530', flex: 1 }}>{view.title}</h2>
                    <button onClick={() => setVideoForm({ ...view })} style={{ ...D.btnGreen, flexShrink: 0 }}>Editar video</button>
                  </div>
                </div>

                <div style={D.sec}>
                  <div style={D.secTitle}>MINIATURA</div>
                  {view.img ? (
                    <div style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', height: '200px', backgroundColor: '#233530' }}>
                      <img src={previewSrc(view.img)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.65, display: 'block' }} />
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'rgba(0,121,52,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Play size={24} fill="white" color="white" strokeWidth={0} style={{ marginLeft: '4px' }} />
                        </div>
                      </div>
                      <div style={{ position: 'absolute', bottom: '12px', left: '12px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span style={{ backgroundColor: 'rgba(0,0,0,0.7)', color: 'white', fontFamily: font.jost, fontSize: '12px', padding: '3px 8px', borderRadius: '3px' }}>{view.duration}</span>
                        {view.featured && <span style={{ backgroundColor: '#C2D500', color: '#233530', fontFamily: font.jost, fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '3px' }}>★ DESTACADO</span>}
                      </div>
                    </div>
                  ) : (
                    <div style={{ height: '100px', border: '1px dashed #D1D1D1', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: font.jost, fontSize: '12px', color: '#C8C8C8' }}>Sin miniatura</div>
                  )}
                </div>

                <div style={D.sec}>
                  <div style={D.secTitle}>DETALLES</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    {[{ label: 'Subtítulo', value: view.subtitle }, { label: 'Duración', value: view.duration }].map(item => (
                      <div key={item.label} style={{ backgroundColor: 'white', borderRadius: '6px', padding: '10px 12px', border: '1px solid #EBEBEB' }}>
                        <div style={{ fontFamily: font.jost, fontSize: '10px', color: '#76777A', letterSpacing: '0.08em', marginBottom: '3px' }}>{item.label.toUpperCase()}</div>
                        <div style={{ fontFamily: font.jost, fontSize: '13px', color: '#233530' }}>{item.value || '—'}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ ...D.sec, borderTop: '1px solid rgba(200,50,50,0.2)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontFamily: font.jost, fontWeight: 600, fontSize: '13px', color: '#b91c1c' }}>Eliminar video</div>
                      <div style={{ fontFamily: font.jost, fontSize: '12px', color: '#76777A', marginTop: '2px' }}>Esta acción no se puede deshacer</div>
                    </div>
                    <button onClick={() => setConfirmDelete({ id: view.id, type: 'video' })} style={D.btnDanger}>Eliminar</button>
                  </div>
                </div>
              </div>
            )
            return null
          })()}
        </div>
      </div>

      {/* Confirm delete */}
      {confirmDelete && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '10px', padding: '28px 32px', maxWidth: '380px', width: '100%', border: '1px solid #E5E5E5', boxShadow: '0 8px 32px rgba(0,0,0,0.14)' }}>
            <div style={{ fontFamily: font.jost, fontSize: '11px', fontWeight: 600, color: '#b91c1c', letterSpacing: '0.1em', marginBottom: '8px' }}>CONFIRMAR ELIMINACIÓN</div>
            <h3 style={{ fontFamily: font.barlow, fontSize: '22px', fontWeight: 700, color: '#233530', marginBottom: '10px' }}>¿Eliminar este elemento?</h3>
            <p style={{ fontFamily: font.jost, fontSize: '13px', color: '#76777A', marginBottom: '24px', lineHeight: 1.6 }}>
              Esta acción eliminará el contenido del prototipo. Si el recurso está siendo usado en otras secciones, dejará de aparecer.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button onClick={() => setConfirmDelete(null)} style={D.btn}>Cancelar</button>
              <button onClick={doDelete} style={{ ...D.btnDanger, backgroundColor: 'rgba(200,50,50,0.15)', border: '1px solid rgba(200,50,50,0.5)' }}>
                Sí, eliminar definitivamente
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
