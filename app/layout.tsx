import type { Metadata } from 'next'
import { barlowCondensed, jost } from '@/_app/styles/fonts'
import { site } from '@/shared/config'
import '@/_app/styles/globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="es-CO" className={`${jost.variable} ${barlowCondensed.variable}`}>
      <body>{children}</body>
    </html>
  )
}
