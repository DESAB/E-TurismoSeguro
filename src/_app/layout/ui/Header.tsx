'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide'
import { UserRound } from 'lucide-react'
import { MorphIcon } from 'morphicons/react'
import { routes } from '@/shared/config'
import { font, PoliceShield } from '@/shared/ui'

const navItems = [
  { label: 'Inicio', href: routes.home },
  { label: 'Explorar', href: routes.explore },
  { label: 'Mapa', href: routes.map },
  { label: 'Seguridad', href: routes.security },
  { label: 'Videos', href: routes.videos },
  { label: 'Contacto', href: routes.contact },
  { label: 'Ingresar', href: routes.admin },
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
        backgroundColor: scrolled || menuOpen ? '#132753' : '#142749',
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
          <PoliceShield size={52} />
          <div className="text-left">
            <div style={{ fontFamily: font.body, fontWeight: 700, fontSize: '13px', color: '#BAFF00', letterSpacing: '0.08em', lineHeight: 1 }}>
              E-TurismoSeguro
            </div>
            <div style={{ fontFamily: font.body, fontWeight: 400, fontSize: '12px', color: 'rgba(255,255,255,0.75)', letterSpacing: '0.04em', lineHeight: 1.2, marginTop: 2 }}>
              Departamento de Policía La Sabana
            </div>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
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
                    fontFamily: font.body,
                    fontSize: '12px',
                    fontWeight: 600,
                    color: active ? '#142749' : '#FFE82C',
                    backgroundColor: active ? '#FFE82C' : 'transparent',
                    border: '1.5px solid #FFE82C',
                    letterSpacing: '0.04em',
                  }}
                >
                  <UserRound size={15} strokeWidth={2} />
                  {item.label}
                </Link>
              )
            }
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className="px-3 py-2 text-sm font-medium transition-colors hover:text-white"
                style={{
                  fontFamily: font.body,
                  color: active ? '#BAFF00' : 'rgba(255,255,255,0.88)',
                  borderBottom: active ? '2px solid #BAFF00' : '2px solid transparent',
                }}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Mobile: Menu ↔ X con morphicons */}
        <button
          className="lg:hidden flex items-center justify-center w-11 h-11 -mr-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          style={{ color: 'white' }}
        >
          <MorphIcon icon={menuOpen ? X : Menu} size={26} strokeWidth={2} spring="snappy" />
        </button>
      </div>

      {/* Mobile menu: se despliega animando la altura; cerrado queda inert (sin foco ni lectores de pantalla) */}
      <div
        id="mobile-menu"
        className="lg:hidden grid"
        style={{ gridTemplateRows: menuOpen ? '1fr' : '0fr', transition: 'grid-template-rows 0.3s ease-out' }}
        inert={!menuOpen}
      >
        <div className="overflow-hidden">
          <div
            style={{ backgroundColor: '#132753', borderTop: '1px solid rgba(255,255,255,0.1)', opacity: menuOpen ? 1 : 0, transition: 'opacity 0.3s' }}
          >
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
                    fontFamily: font.body,
                    color: isAdmin ? '#FFE82C' : (active ? '#BAFF00' : 'rgba(255,255,255,0.88)'),
                    borderLeft: active ? `3px solid ${isAdmin ? '#FFE82C' : '#BAFF00'}` : '3px solid transparent',
                    backgroundColor: 'transparent',
                    fontWeight: isAdmin ? 600 : 400,
                  }}
                >
                  <span className="inline-flex items-center gap-2">
                    {isAdmin && <UserRound size={16} strokeWidth={2} />}
                    {item.label}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </header>
  )
}
