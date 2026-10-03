import type { MetadataRoute } from 'next'
import { routes, site } from '@/shared/config'

/** /robots.txt — todo indexable menos el panel de administración. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: routes.admin },
    sitemap: `${site.url}/sitemap.xml`,
  }
}
