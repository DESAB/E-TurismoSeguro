'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import { font } from '../typography'

const KEY = 'ets:navegacion-interna'

/**
 * Registra que el usuario ya navegó dentro del sitio (sessionStorage). Va una sola vez en el layout público.
 * Con eso <BackButton> sabe si puede volver a la página anterior del sitio o si debe ir a la página de respaldo
 * (por ejemplo, si se entró directo desde Google).
 */
export function NavigationTracker() {
  const pathname = usePathname()
  const first = useRef(pathname)
  useEffect(() => {
    if (pathname !== first.current) {
      try { sessionStorage.setItem(KEY, '1') } catch { /* sin almacenamiento: se usa la página de respaldo */ }
    }
  }, [pathname])
  return null
}

/** Botón "Volver" para quien no usa la ruta de navegación: regresa a la página anterior del sitio o a `fallbackHref`. */
export function BackButton({ fallbackHref, label = 'Volver' }: { fallbackHref: string; label?: string }) {
  const router = useRouter()
  const onClick = (e: React.MouseEvent) => {
    let internal = false
    try { internal = sessionStorage.getItem(KEY) === '1' } catch { /* ignore */ }
    if (internal && window.history.length > 1) {
      e.preventDefault()
      router.back()
    }
  }
  return (
    <Link
      href={fallbackHref}
      onClick={onClick}
      className="inline-flex items-center gap-1.5 hover:bg-white/20 transition-colors"
      style={{ fontFamily: font.body, fontSize: '14px', fontWeight: 600, color: 'white', backgroundColor: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: '8px', padding: '8px 14px 8px 10px' }}
    >
      <ChevronLeft size={18} strokeWidth={2.25} />
      {label}
    </Link>
  )
}
