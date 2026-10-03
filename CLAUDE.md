@AGENTS.md

# E-TurismoSeguro — contexto del proyecto

Guía turística digital de la Sabana de Bogotá para el Departamento de Policía La Sabana
(Policía Nacional de Colombia). Es un **proyecto real** que debe quedar **indexado en Google**.

El usuario escribe en español: responder en español.

## Referencia de diseño (seguir al pie de la letra)

El prototipo de Figma Make en `D:\E-TurismoPrototype` es la **especificación visual**. Replicar
fielmente: colores, tipografías, espaciados, textos, secciones y el panel de administración.
No rediseñar ni "mejorar" por cuenta propia.

- Todo el prototipo está en `D:\E-TurismoPrototype\src\App.tsx` (~2.000 líneas, estilos inline).
  Componentes: `Header` (l.204), `PoliceShield` (334), `Footer` (347), `Breadcrumb` (399),
  `CategoryBadge` (417), `DestinationCard` (435), `HomePage` (476), `ExplorePage` (706),
  `MapPage` (824), `DestinationPage` (1020), `SecurityPage` (1208), `VideosPage` (1283),
  `ContactPage` (1345), `AdminPage` (1431), datos iniciales y `App` (2012).
- Paleta y fuentes: `D:\E-TurismoPrototype\src\index.css` (ya portadas a `src/_app/styles/globals.css`).
- Fotos de destinos: URLs de `images.unsplash.com` (requiere `images.remotePatterns` si se usa `next/image`).
- Para verlo: `pnpm dev` en esa carpeta → http://localhost:8443.

Fuentes: vienen de `next/font` con nombres internos. En estilos inline usar `font.jost` / `font.barlow`
de `@/shared/ui`, o las clases `font-jost` / `font-barlow`. Nunca el nombre literal ('Jost', 'Barlow Condensed').

## Arquitectura: Feature-Sliced Design (FSD v2.1)

Skill instalada en `.claude/skills/feature-sliced-design` (leer su `SKILL.md` antes de mover o crear código).
Reglas clave: importar solo de capas inferiores (`app → _pages → entities → shared`), cada slice expone
su API en `index.ts`, "en caso de duda, en la página". Sin capa `widgets` (desaconsejada) ni `features` (aún no hace falta).

```
app/                      ← rutas de Next, SOLO re-exportan (layout.tsx, icon.png, (site)/…, admin/)
src/_app/                 ← capa app: styles/ (globals.css, fonts.ts), layout/ (SiteLayout, Header, Footer)
src/_pages/<slice>/       ← home, explore, map, destination, security, videos, contact, admin (ui/, model/)
src/entities/destination/ ← DestinationCard, CategoryBadge (usados en varias páginas)
src/shared/               ← api/ (datos locales → Supabase), config/ (routes), lib/ (unsplash, slugify),
                            ui/ (font, PoliceShield, Breadcrumb)
```
- Las carpetas FSD llevan `_` (`_app`, `_pages`) para no chocar con `app/` y `pages/` de Next.
- Opciones de segmento de Next (`dynamicParams`, `revalidate`…) van **en el archivo de `app/`**: Next las
  lee estáticamente y no las ve si vienen re-exportadas.
- Hover del prototipo (hecho con `onMouseEnter` + estado) → CSS Modules junto al componente (`*.module.css`).
  La propiedad que cambia en hover NO debe ir también inline (el estilo inline gana).
- Client Components solo donde hay estado: `Header`, `ExploreResults`, `MapView`, `DestinationGallery`, `AdminPage`.

## Decisiones tomadas

- **Stack:** Next.js 16 (App Router) + TypeScript + Tailwind v4, desplegado en **Cloudflare Workers con
  `@opennextjs/cloudflare`**. Se eligió Next (y no Vite) por SEO: páginas con URL propia renderizadas en servidor.
- **Figma Make ya no es la fuente del código.** Este repo se edita en código. El prototipo solo es referencia.
- **Datos:** por ahora en `src/shared/api/` (destinos, videos, municipios, recomendaciones de seguridad).
  Las páginas usan solo los getters (`getDestinations()`, …), así que se pueden cambiar por **Supabase** sin tocarlas.
- **Backend (después):** Supabase (Postgres + RLS + Storage). El acceso a datos aún no está decidido
  (supabase-js o Prisma): preguntar al usuario cuando llegue el momento.
- **Login del admin (después):** Supabase Auth con email y contraseña.

## Plan y estado

### ✅ Fase 1 — Base del proyecto (hecha, sin commit)
Next 16.3.8, OpenNext 1.20.8, wrangler 4.147.0, lucide-react, fuentes Jost y Barlow Condensed, paleta
`brand-*` en Tailwind. Build de OpenNext y `wrangler dev` verificados en local (home 200, 404 correcto).

### ✅ Fase 2 — Réplica del prototipo con rutas reales (hecha, sin commit)
| Prototipo (`Page`) | Ruta |
|---|---|
| `home` | `/` |
| `explore` | `/explorar` (filtros en la URL: `?categoria=naturaleza&municipio=cogua&q=…`) |
| `destination` | `/destinos/[slug]` (pre-renderizadas; slug desconocido → 404) |
| `map` | `/mapa` |
| `security` | `/seguridad` |
| `videos` | `/videos` |
| `contact` | `/contacto` |
| `admin` | `/admin` (sin Header/Footer; los cambios viven solo en memoria) |

Verificado contra el prototipo con capturas a 1440 px: misma altura en todas las páginas y < 0,2 % de
píxeles distintos (antialiasing, la flecha "→" que cae en la fuente de respaldo de next/font, y los arreglos
intencionales). Probados: filtros en URL, búsqueda, mapa → destino, lightbox, breadcrumb, admin
(editar/guardar, pestaña videos) y menú móvil. Sin errores de consola. `next build` y `pnpm lint` limpios.

Verificado también en el runtime de Workers (OpenNext + `wrangler dev`): todas las rutas 200, slugs
desconocidos 404, los mismos flujos interactivos sin errores y sin avisos de caché.

Diferencias deliberadas con el prototipo (aprobadas):
1. Breadcrumb: el enlace "Inicio" usaba `#007934` sobre el fondo `#007934` (invisible) → tonos claros.
2. Cabecera de Mapa: estaba ~24 px corrida (`padding: 32px 24px` sin `px-6`) → alineada con el resto.
3. Favicon con el escudo de la policía (`app/icon.png`).
4. Las categorías del inicio enlazan a `/explorar?categoria=…` (el prototipo iba a Explorar sin filtro).
5. Los destinos nuevos creados en el admin reciben un slug (`slugify(nombre)`).

Cualquier **otro** problema de diseño o responsive: **no tocarlo**. El usuario quiere revisarlo aparte, después.

### ⏳ Fase 3 — SEO
`metadata` por página (título, descripción, Open Graph), `sitemap.ts`, `robots.ts`, JSON-LD
`TouristAttraction` por destino, revisar los `alt` de las imágenes. Ya están: `lang="es-CO"` y `generateStaticParams`.
Antes de escribir código, leer las guías en `node_modules/next/dist/docs/`
(p. ej. `01-app/02-guides/json-ld.md` y `01-app/01-getting-started/14-metadata-and-og-images.md`).

### ⏳ Fase 4 — Despliegue
1. Crear el repo en GitHub (sugerido `MateoLLanosT/E-TurismoSeguro`; **preguntar** si privado o público).
2. Conectarlo en Cloudflare → Workers & Pages → Import repository. Build command: `npx opennextjs-cloudflare build`.
   Deploy command: `npx opennextjs-cloudflare deploy`. Si hace falta, variable `NODE_VERSION=22`.
3. El usuario aún **no ha hecho login** en Cloudflare ni dado un account ID. Nada se ha desplegado.

### ⏳ Fase 5 — Supabase (después)
Tablas (destinos, videos, municipios, galería), RLS, Storage para imágenes, Auth para `/admin`.
Sustituir el cuerpo de los getters de `src/shared/api/`. Cambiar la caché incremental a R2 (ver abajo).

## Pendientes conocidos

- **Git:** solo existe el commit inicial de create-next-app. Los cambios de las Fases 1 y 2 **no tienen commit**
  y no hay remoto. Hacer commit o push **solo cuando el usuario lo pida**.
- **Caché incremental:** `staticAssetsIncrementalCache` (solo lectura, sirve lo pre-renderizado). Hay que
  **poblarla** después del build (`populateCache`; `preview` y `deploy` lo hacen solos). Sin poblarla, las páginas
  de `/destinos/[slug]` dan 404 (`NoFallbackError`) y cada request deja `ERROR ... Failed to set to read-only cache`.
  Pasar a `r2IncrementalCache` cuando haya revalidación (ISR) con Supabase.
- **Imágenes:** se usa `<img>` (regla `@next/next/no-img-element` desactivada en `eslint.config.mjs`).
  `next/image` no tiene `sharp`: decidir entre el binding `IMAGES` de Cloudflare Images o `images.unoptimized`.
  Las fotos de Unsplash son temporales: reemplazarlas por fotos propias cuando el usuario las tenga.
- **Revisión de diseño y responsive** del prototipo: pendiente, el usuario quiere hacerla aparte.
  Ejemplo conocido: en móvil el Mapa mantiene la barra lateral de 280 px (igual que el prototipo).

## Particularidades del entorno (Windows)

- `.npmrc` → `node-linker=hoisted`. **No quitarlo.** Con los symlinks de pnpm, OpenNext empaqueta en Windows
  copias de Next sin parchear y el Worker responde 500 (`Dynamic require of "/.next/server/middleware-manifest.json"`).
  Tras cambiarlo hay que reinstalar desde cero (`rm -rf node_modules` + `pnpm install`).
- `pnpm-workspace.yaml` → `overrides: sharp: "-"`. `sharp` no corre en Workers y rompe el bundle de OpenNext.
- Si borrar `.open-next` falla ("Device or resource busy" / EPERM), hay un `wrangler dev` o un `next dev` corriendo:
  `initOpenNextCloudflareForDev` levanta un `workerd` que bloquea `.open-next/assets`. Hay que detenerlo antes
  del build de OpenNext; si es el del usuario, **preguntar** primero.
- Comandos: `pnpm dev` (Next, puerto 3000), `pnpm preview` (OpenNext + workerd), `pnpm deploy`, `pnpm cf-typegen`.
  Vista previa manual: `npx opennextjs-cloudflare build`, luego `npx opennextjs-cloudflare populateCache local`
  y `npx wrangler dev --port 8787`. **No saltarse `populateCache`** (ver "Caché incremental").
- Para verificar visualmente: Chrome headless con `playwright-core` (`chromium.launch({ channel: 'chrome' })`).
