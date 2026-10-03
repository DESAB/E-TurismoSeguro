import type { ReactNode } from 'react'
import { Footer } from './Footer'
import { Header } from './Header'

/** Layout de las páginas públicas. El panel /admin queda fuera (sin Header ni Footer), igual que en el prototipo. */
export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <main style={{ flex: 1 }}>{children}</main>
      <Footer />
    </div>
  )
}
