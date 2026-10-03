import type { MetadataRoute } from 'next'
import { getDestinations } from '@/shared/api'
import { routes, site } from '@/shared/config'

/** /sitemap.xml — páginas públicas y una entrada por destino. /admin queda fuera. */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  const pages: { path: string; priority: number; changeFrequency: 'weekly' | 'monthly' }[] = [
    { path: routes.home, priority: 1, changeFrequency: 'weekly' },
    { path: routes.explore, priority: 0.9, changeFrequency: 'weekly' },
    { path: routes.map, priority: 0.7, changeFrequency: 'monthly' },
    { path: routes.security, priority: 0.7, changeFrequency: 'monthly' },
    { path: routes.videos, priority: 0.6, changeFrequency: 'monthly' },
    { path: routes.contact, priority: 0.5, changeFrequency: 'monthly' },
  ]

  return [
    ...pages.map(p => ({ url: `${site.url}${p.path}`, lastModified, changeFrequency: p.changeFrequency, priority: p.priority })),
    ...getDestinations().map(d => ({
      url: `${site.url}${routes.destination(d.slug)}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ]
}
