// Datos generales del sitio para SEO.
// NEXT_PUBLIC_SITE_URL debe apuntar al dominio público (sin barra final) en el build de Cloudflare;
// se usa en canonical, Open Graph, sitemap.xml y robots.txt.
export const site = {
  name: 'E-TurismoSeguro',
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, ''),
  title: 'E-TurismoSeguro · Guía turística de la Sabana de Bogotá',
  description:
    'Descubre la Sabana de Bogotá de manera segura: destinos, patrimonio, naturaleza y recomendaciones de la Policía Nacional en los municipios de la Regional Metropolitana de la Sabana.',
  locale: 'es_CO',
  /** Foto por defecto para compartir en redes (la del hero del inicio: Policía de Turismo en el Parque Jaime Duque) */
  defaultImage: '/policia/jaime-duque.jpg',
} as const
