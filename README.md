# E-TurismoSeguro

Guía turística digital de la Sabana de Bogotá — Departamento de Policía La Sabana.

Next.js (App Router) desplegado en **Cloudflare Workers** con [OpenNext](https://opennext.js.org/cloudflare).
El diseño replica el prototipo de Figma Make (`E-TurismoPrototype`).

## Scripts

| Comando | Qué hace |
|---|---|
| `pnpm dev` | Servidor de desarrollo de Next.js (http://localhost:3000) |
| `pnpm preview` | Build de OpenNext + vista previa en el runtime de Workers (`workerd`) |
| `pnpm deploy` | Build + despliegue a Cloudflare (requiere `wrangler login`) |
| `pnpm cf-typegen` | Genera `cloudflare-env.d.ts` con los tipos de los bindings |

## Variables de entorno

| Variable | Dónde | Para qué |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Variable de **build** en Cloudflare (y `.env.local` si hace falta) | Dominio público sin barra final. Se usa en canonical, Open Graph, `sitemap.xml` y `robots.txt`. Por defecto: `http://localhost:3000`. |

## Notas

- `.npmrc` usa `node-linker=hoisted`: con los symlinks de pnpm, OpenNext empaqueta en Windows
  copias de Next sin parchear y el Worker falla (`Dynamic require of ... middleware-manifest.json`).
- `sharp` está deshabilitado con un override en `pnpm-workspace.yaml`: no corre en Workers y rompe el bundle.
- Caché incremental: `staticAssetsIncrementalCache` (solo contenido pre-renderizado). Hay que poblarla tras el build
  (`populateCache`; `pnpm preview` y `pnpm deploy` lo hacen solos). Cambiar a R2
  cuando haya revalidación (ISR) con Supabase.
