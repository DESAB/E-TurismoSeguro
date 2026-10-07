// Datos generales del sitio para SEO.
// NEXT_PUBLIC_SITE_URL debe apuntar al dominio público (sin barra final) en el build de Cloudflare;
// se usa en canonical, Open Graph, sitemap.xml y robots.txt.
export const site = {
  name: 'E-TurismoSeguro',
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, ''),
  title: 'E-TurismoSeguro · Guía turística del Departamento de Policía La Sabana',
  description:
    'Descubre de manera segura los municipios del Departamento de Policía La Sabana: destinos, patrimonio, naturaleza y recomendaciones de la Policía Nacional.',
  locale: 'es_CO',
  /** Foto por defecto para compartir en redes (la del hero del inicio: el Grupo de Protección al Turismo) */
  defaultImage: '/policia/equipo-de-turismo.jpg',
} as const
