import type { Metadata } from 'next'
import { barlowCondensed, jost } from '@/_app/styles/fonts'
import '@/_app/styles/globals.css'

export const metadata: Metadata = {
  title: 'E-TurismoSeguro · Sabana de Bogotá',
  description:
    'Guía turística digital interactiva de la Sabana de Bogotá. Explora destinos, patrimonio y naturaleza de manera segura.',
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="es-CO" className={`${jost.variable} ${barlowCondensed.variable}`}>
      <body>{children}</body>
    </html>
  )
}
