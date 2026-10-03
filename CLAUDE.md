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
src/_app/seo/             ← sitemap.ts y robots.ts (app/sitemap.ts y app/robots.ts los re-exportan)
src/shared/               ← api/ (datos locales → Supabase), config/ (routes, site), lib/ (unsplash, slugify,
                            seo → pageMetadata, image-loader), ui/ (font, PoliceShield, Breadcrumb, JsonLd)
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

### ✅ Fase 1 — Base del proyecto (hecha)
Next 16.3.8, OpenNext 1.20.8, wrangler 4.147.0, lucide-react, fuentes Jost y Barlow Condensed, paleta
`brand-*` en Tailwind. Build de OpenNext y `wrangler dev` verificados en local (home 200, 404 correcto).

### ✅ Fase 2 — Réplica del prototipo con rutas reales (hecha)
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

### ✅ Fase 3 — SEO e imágenes (hecha, sin commit)
- **Metadata:** título con plantilla `%s · E-TurismoSeguro` (el inicio usa `title.absolute`), descripción,
  canonical, Open Graph y Twitter por página con `pageMetadata()` de `@/shared/lib`. Cada slice de `_pages`
  exporta `metadata` (o `generateMetadata` en destino) y la ruta de `app/` lo re-exporta.
  `/explorar` tiene canonical sin filtros. `/admin` es `noindex, nofollow`.
- **JSON-LD:** `WebSite` en el inicio; `TouristAttraction` + `BreadcrumbList` en cada destino (`<JsonLd>` escapa `<`).
- **`/sitemap.xml` y `/robots.txt`** (robots bloquea `/admin`).
- **Imágenes:** `next/image` con loader propio (`src/shared/lib/image-loader.ts`, `images.loaderFile` en
  `next.config.ts`): Unsplash redimensiona con `?w=&auto=format`, sin `sharp` ni Cloudflare Images. Las fotos usan
  `unsplashSrc(id)` + `fill`/`sizes`; los héroes llevan `loading="eager"` + `fetchPriority="high"` (en Next 16
  `priority` está obsoleto). Solo el admin conserva `<img>` (vistas previas de IDs escritos a mano; eslint-disable en ese archivo).
- Verificado: build, lint, typecheck; misma altura que el prototipo en todas las páginas (las fotos ahora se ven
  algo más nítidas por el srcset); y en Workers (OpenNext + populateCache + wrangler dev) rutas, sitemap, robots y flujos OK.

**Pendiente al desplegar:** definir `NEXT_PUBLIC_SITE_URL` (dominio público, sin barra final) como variable de
**build** en Cloudflare. Sin ella, canonical, Open Graph, sitemap y robots apuntan a `http://localhost:3000`.
Después: dar de alta el sitio en Google Search Console y enviar el sitemap.

### ⏳ Fase 4 — Despliegue
1. Crear el repo en GitHub (sugerido `MateoLLanosT/E-TurismoSeguro`; **preguntar** si privado o público).
2. Conectarlo en Cloudflare → Workers & Pages → Import repository. Build command: `npx opennextjs-cloudflare build`.
   Deploy command: `npx opennextjs-cloudflare deploy`. Si hace falta, variable `NODE_VERSION=22`.
3. Variable de build `NEXT_PUBLIC_SITE_URL` con el dominio público (ver Fase 3).
4. El usuario aún **no ha hecho login** en Cloudflare ni dado un account ID. Nada se ha desplegado.

### ⏳ Fase 5 — Supabase (después)
Tablas (destinos, videos, municipios, galería), RLS, Storage para imágenes, Auth para `/admin`.
Sustituir el cuerpo de los getters de `src/shared/api/`. Cambiar la caché incremental a R2 (ver abajo).

## Pendientes conocidos

- **Git:** Fases 1 y 2 en el commit `2726378` (rama `main`). **No hacer commits ni push:** el usuario crea el repo
  en GitHub y hace los commits a mano. Dejar los cambios sin commit y avisarle qué quedó pendiente.
- **Caché incremental:** `staticAssetsIncrementalCache` (solo lectura, sirve lo pre-renderizado). Hay que
  **poblarla** después del build (`populateCache`; `preview` y `deploy` lo hacen solos). Sin poblarla, las páginas
  de `/destinos/[slug]` dan 404 (`NoFallbackError`) y cada request deja `ERROR ... Failed to set to read-only cache`.
  Pasar a `r2IncrementalCache` cuando haya revalidación (ISR) con Supabase.
- **Imágenes:** las fotos de Unsplash son temporales. Con fotos propias (Supabase Storage) hay que añadir su rama
  en `image-loader.ts` (transformaciones de Supabase o Cloudflare Images).
- **Componentes:** hechos a mano (réplica del prototipo). Plan acordado: usar **shadcn/ui** (en `src/shared/ui`,
  con el estilo del prototipo) para el admin real en la Fase 5; las páginas públicas se quedan como están.
- **Estilos inline** copiados del prototipo: funcionan, pero cuestan de mantener. Migrarlos a Tailwind es una mejora aparte.
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
