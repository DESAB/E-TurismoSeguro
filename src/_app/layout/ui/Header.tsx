'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { routes } from '@/shared/config'
import { font, PoliceShield } from '@/shared/ui'

const navItems = [
  { label: 'Inicio', href: routes.home },
  { label: 'Explorar', href: routes.explore },
  { label: 'Mapa', href: routes.map },
  { label: 'Seguridad', href: routes.security },
  { label: 'Videos', href: routes.videos },
  { label: 'Contacto', href: routes.contact },
  { label: 'Administrar', href: routes.admin },
]

export function Header() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const isActive = (href: string) => (href === routes.home ? pathname === href : pathname.startsWith(href))

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: scrolled || menuOpen ? '#006937' : '#007934',
        boxShadow: scrolled ? '0 2px 16px rgba(0,0,0,0.18)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link
          href={routes.home}
          onClick={() => setMenuOpen(false)}
          className="flex items-center gap-3 group"
        >
          <PoliceShield size={36} />
          <div className="text-left">
            <div style={{ fontFamily: font.jost, fontWeight: 700, fontSize: '13px', color: '#C2D500', letterSpacing: '0.08em', lineHeight: 1 }}>
              E-TurismoSeguro
            </div>
            <div style={{ fontFamily: font.jost, fontWeight: 400, fontSize: '10px', color: 'rgba(255,255,255,0.75)', letterSpacing: '0.04em', lineHeight: 1.2, marginTop: 2 }}>
              Dep. Policía La Sabana
            </div>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map(item => {
            const isAdmin = item.href === routes.admin
            const active = isActive(item.href)
            if (isAdmin) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="ml-2 px-3 py-1.5 rounded text-sm font-medium transition-all flex items-center gap-1.5"
                  style={{
                    fontFamily: font.jost,
                    fontSize: '12px',
                    fontWeight: 600,
                    color: active ? '#233530' : '#C2D500',
                    backgroundColor: active ? '#C2D500' : 'rgba(194,213,0,0.15)',
                    border: '1.5px solid rgba(194,213,0,0.5)',
                    letterSpacing: '0.04em',
                  }}
                >
                  ⚙ {item.label}
                </Link>
              )
            }
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className="px-3 py-2 rounded text-sm font-medium transition-all"
                style={{
                  fontFamily: font.jost,
                  color: active ? '#C2D500' : 'rgba(255,255,255,0.88)',
                  backgroundColor: active ? 'rgba(194,213,0,0.12)' : 'transparent',
                  borderBottom: active ? '2px solid #C2D500' : '2px solid transparent',
                }}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Abrir menú"
          aria-expanded={menuOpen}
        >
          <span className="block w-6 h-0.5 bg-white transition-all" style={{ transform: menuOpen ? 'rotate(45deg) translateY(8px)' : 'none' }} />
          <span className="block w-6 h-0.5 bg-white transition-all" style={{ opacity: menuOpen ? 0 : 1 }} />
          <span className="block w-6 h-0.5 bg-white transition-all" style={{ transform: menuOpen ? 'rotate(-45deg) translateY(-8px)' : 'none' }} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ backgroundColor: '#005a2b', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          {navItems.map(item => {
            const isAdmin = item.href === routes.admin
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="block w-full text-left px-6 py-3 text-sm font-medium"
                style={{
                  fontFamily: font.jost,
                  color: isAdmin ? '#C2D500' : (active ? '#C2D500' : 'rgba(255,255,255,0.88)'),
                  borderLeft: active ? '3px solid #C2D500' : '3px solid transparent',
                  backgroundColor: isAdmin ? 'rgba(194,213,0,0.06)' : 'transparent',
                  fontWeight: isAdmin ? 600 : 400,
                }}
              >
                {isAdmin ? '⚙ ' : ''}{item.label}
              </Link>
            )
          })}
        </div>
      )}
    </header>
  )
}
