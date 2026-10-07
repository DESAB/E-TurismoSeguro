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
- Fuentes: `D:\E-TurismoPrototype\src\index.css` (portadas a `src/_app/styles/globals.css`).
- **Colores: paleta institucional de la Policía Nacional** (entregada por el cliente; reemplaza la del prototipo):
  primarios `#007934` (356C), `#142749` (2769C, azul oscuro), `#BAFF00` (389C, solo sobre fondos oscuros o verdes);
  complementarios `#135657`, `#134159`, `#132753`, `#56AF89`, `#A8D42E`, `#E1E640`, `#FFE82C`.
  Nota: el manual dice "HTML 007954" para el 356C, pero su RGB (0,121,52) es `#007934`.
- **Nombre del territorio:** "Departamento de Policía La Sabana", nunca "Sabana de Bogotá" (pedido del cliente).
- Para verlo: `pnpm dev` en esa carpeta → http://localhost:8443.

**Guía de diseño institucional (reemplaza al prototipo en colores, tipografía y componentes):**
- **Tipografía: Inter** en todo (`next/font`, variable `--font-inter`). En estilos inline usar `font.heading` /
  `font.body` de `@/shared/ui` (hoy ambas son Inter). Nunca el nombre literal. Escala: H1 48 · H2 32 · H3 24 · P 16 · small 14.
- **Papel de cada color:** azul `#142749` = estructura (header, footer, bandas de título, secciones y recuadros oscuros)
  y títulos; verde `#007934` = acciones (botón principal, íconos, enlaces); lima `#BAFF00` = acentos **solo sobre azul
  o verde** (menú activo como línea, cifras, etiquetas); amarillo `#FFE82C` = **solo** el botón "Administrar"
  (el usuario no lo quiere en otros botones: los llamados a la acción van en verde); texto secundario `#4B5563`; bordes `#E8EEF2`.
- **Botones sin flechas** (decisión del usuario).
- **Tarjetas: todas iguales** con las clases globales de `globals.css`: `.ui-card` (blanca, borde `#E8EEF2`, radio 12),
  `.ui-card-link` (tocables: borde verde, sombra y elevación al hover), `.ui-card-img` (zoom de la foto) y
  `.ui-icon-circle` (ícono verde en círculo verde claro; se rellena al hover). No poner border/borderRadius inline en ellas.
  Fotos sueltas y recuadros oscuros también con radio 12.
- **Íconos animados:** `morphicons` (`MorphIcon` de `morphicons/react`) con datos del paquete `lucide` (misma versión
  que `lucide-react`). Se usa en las tarjetas de categoría del inicio (`_pages/home/ui/CategoryCards.tsx`).

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

### ✅ Revisión de diseño y responsive (hecha, sin commit ni deploy)
Revisadas las 8 páginas a 375/768/1024/1440 px. Corregido (aprobado por el usuario; se aparta del prototipo):
1. **Mapa en móvil:** el mapa va arriba (420 px) y la lista de municipios debajo; desde `md`, barra lateral de 280 px
   como el prototipo. En móvil se ocultan las etiquetas de municipio del mapa (se solapan) y, al tocar un pin, la
   tarjeta del destino se desplaza a la vista.
2. **Teléfonos, correo y web como enlaces** (`tel:`, `mailto:`) en Footer, Destino, Seguridad y Contacto.
3. **Header:** menú hamburguesa hasta 1024 px (`lg`); a 768 px el menú completo no cabía.
4. **Zonas táctiles:** enlaces del footer de 36 px en móvil, breadcrumb de 44 px (padding + margen negativo),
   filtros de Explorar más altos y pines del mapa con botón de 44 px (el pin se ve igual).
5. **Texto mínimo de 12 px** en las páginas públicas (antes había etiquetas de 10–11 px). El admin no se tocó.
6. **Año del footer** automático (`new Date().getFullYear()`, se fija en cada build).
7. **"Recomendaciones para tu visita":** el escudo se alinea arriba en móvil.

Pendiente de esa revisión (depende del contenido o de la Fase 5):
- **Admin inutilizable en móvil:** se rehace en la Fase 5 con shadcn.
- **Dato inconsistente:** 018000910600 aparece como "Denuncia" en el Footer y como "Línea anticorrupción" en Contacto.
- Los canales "Denuncia en línea", "App MI POLICÍA" y "CICRI" de Contacto no enlazan a nada (faltan las URLs oficiales).

### ✅ Contenido oficial cargado (hecho, sin commit ni deploy)
Fuente: carpeta `Sitios/` del proyecto (Excel organizado por el usuario + 3 Word entregados por la Policía, con
permiso para publicar textos, fotos y teléfonos). **Solo se usan datos de esos documentos**: no inventar horarios,
direcciones ni datos; si un campo no está, se omite (el diseño ya oculta horario/teléfono cuando faltan).
- **20 municipios** (`src/shared/api/municipalities.ts`) con enlaces de turismo tal cual los entregaron y lat/lon
  **aproximada** del centro urbano (solo para el mapa ilustrativo). Los 6 sin sitios (Cajicá, Cota, Gachancipá, Tenjo,
  El Rosal, Funza) se quedan: se les agregarán sitios después. **No cambiar el diseño por ellos.**
- **30 destinos** (`destinations.ts`): textos del Word, fotos en `public/destinos/<slug>/<n>.jpg` (optimizadas a
  máx. 1600 px). Modelo: `categories: Category[]` (tipología del usuario; la primera se muestra en tarjetas, todas en la
  ficha), `images: string[]` (rutas), `address/hours/phone/website` opcionales, `tips` (3 recomendaciones).
  Zipaquirá agrupada en 8 fichas (Centro Histórico incluye Plaza de los Comuneros, Catedral Diocesana, Casa de los
  Virreyes, balcones, Plaza de la Independencia y Plaza de los Mártires). Chicaque va en **Bojacá** (decisión del usuario).
  6 sitios con **tipología propuesta** (comentario en el código): Estación del Tren, Casa Museo Quevedo, Plaza
  Villaveces, Parque La Esmeralda, Iglesia San Francisco de Asís y Catedral del Rosario → el usuario debe confirmarla.
- **Actualización (2026-10-06):** nuevo Word `SITIOS TURÍSTICOS DEL DEPARTAMENTO DE LA SABANA.docx` (mismos sitios + 9 nuevos).
  Agregados los 8 (38 destinos): Estación del Tren y Museo Campesino (Gachancipá), Mirador Las Cuevas y Museo de Ovnilogía
  (Tenjo), Bioparque La Reserva (Cota), Monasterio Benedictino de San Benito (El Rosal), Caminos Reales de Zipacón y
  Parroquia Santiago Apóstol (Funza); tipología propuesta. Las fotos del Word del Museo Campesino y de Funza traían marca de
  agua (Dreamstime): se usaron fotos que mandó el usuario. El texto de El Rosal traía "Conversación en el Modo IA…": se quitó.
  Fotos de baja resolución: Bioparque La Reserva (474 px) y Parroquia Santiago Apóstol (678 px). Municipio sin destinos: Cajicá.
  Museo Campesino es el primer sitio de Gastronomía.
- **Retirados mientras se verifican "uno a uno":** Lagunas de Siecha y Parque y Templo de Chía (redirección 302 a
  Explorar filtrado). Renombrados con 301: laguna-de-neusa → embalse-del-neusa, mina-de-sal-nemocon → mina-de-sal-de-nemocon.
- **33 estaciones/subestaciones/CAI** (`police-stations.ts`): se muestran en la ficha de cada destino ("Policía en
  <municipio>", con `tel:`). El Word trae más que el Excel (p. ej. Subestación Neusa, 4 CAI de Facatativá).
- **Videos:** los 2 reales de YouTube del Word (Zipaquirá, Termales El Zipa); enlazan a YouTube; sin duración.
- **Fotos:** hero del inicio = foto del equipo de Policía de Turismo (`public/policia/equipo-de-turismo.jpg`, mitad derecha en escritorio, debajo del texto en móvil); teaser del mapa = Piedras de Chivonegro; fondo del mapa = Embalse del Neusa.
  Baja resolución (se ven borrosas en grande): Chingaza (300 px), Pionono (358 px), una de Centro Histórico (471 px).
- **Mapa real e interactivo** (aprobado por el usuario): `_pages/map/ui/SabanaMap.tsx` con **MapLibre GL 5** y el
  estilo `positron` de **OpenFreeMap** (teselas vectoriales de OSM, gratis, sin clave). MapLibre se importa dinámicamente,
  solo en /mapa. Destinos agrupados (cluster) con su número; clic en grupo = acercar; clic en sitio = tarjeta en la barra
  lateral; nombres de los sitios desde zoom 11. Al elegir un municipio se encuadran sus sitios y se listan en la barra
  lateral (también sirve para usar el mapa con teclado); municipio sin sitios → se centra en él. En móvil:
  `cooperativeGestures` (dos dedos para mover) y leyenda oculta. Textos de los controles en español.
- **Ubicaciones** (`location` en cada destino): de OpenStreetMap (Nominatim/Overpass), revisadas a mano. Ubicaciones
  reales que pueden sorprender: Embalse del Neusa (límite Cogua-Tausa), Chingaza (centro del parque, en Guasca),
  Chicaque (corredor de Soacha; en los datos sigue en Bojacá por decisión del usuario), Cerro El Tablazo (cumbre,
  límite Subachoque-Supatá). **Aproximadas, a verificar con la Policía:** Sendero de los Zipas, Casa Museo Quevedo
  Zornoza (por dirección) y Parque La Esmeralda (barrio).
- **Admin:** adaptado con un formato interno (portada + categoría principal) que se convierte al modelo al cargar/guardar.
- Verificado: build (42 páginas), lint, tipos, flujos interactivos y Workers (OpenNext + populateCache + wrangler dev).

### ✅ Fase 3 — SEO e imágenes (hecha, sin commit)
- **Metadata:** título con plantilla `%s · E-TurismoSeguro` (el inicio usa `title.absolute`), descripción,
  canonical, Open Graph y Twitter por página con `pageMetadata()` de `@/shared/lib`. Cada slice de `_pages`
  exporta `metadata` (o `generateMetadata` en destino) y la ruta de `app/` lo re-exporta.
  `/explorar` tiene canonical sin filtros. `/admin` es `noindex, nofollow`.
- **JSON-LD:** `WebSite` en el inicio; `TouristAttraction` + `BreadcrumbList` en cada destino (`<JsonLd>` escapa `<`).
- **`/sitemap.xml` y `/robots.txt`** (robots bloquea `/admin`).
- **Imágenes:** `next/image` con loader propio (`src/shared/lib/image-loader.ts`, `images.loaderFile` en
  `next.config.ts`), sin `sharp` ni Cloudflare Images. Hoy las fotos son locales y ya optimizadas, así que se sirven
  tal cual (ver "Contenido oficial cargado"). Usan `fill`/`sizes`; los héroes llevan `loading="eager"` + `fetchPriority="high"` (en Next 16
  `priority` está obsoleto). Solo el admin conserva `<img>` (vistas previas de IDs escritos a mano; eslint-disable en ese archivo).
- Verificado: build, lint, typecheck; misma altura que el prototipo en todas las páginas (las fotos ahora se ven
  algo más nítidas por el srcset); y en Workers (OpenNext + populateCache + wrangler dev) rutas, sitemap, robots y flujos OK.

**Al desplegar** se definió `NEXT_PUBLIC_SITE_URL` (dominio público, sin barra final) como variable de
**build** en Cloudflare. Sin ella, canonical, Open Graph, sitemap y robots apuntan a `http://localhost:3000`.
Después: dar de alta el sitio en Google Search Console y enviar el sitemap.

### ✅ Fase 4 — Despliegue (hecha, 2026-10-03)
- Repo: **`DESAB/E-TurismoSeguro`** en GitHub, conectado a Cloudflare Workers Builds (rama `main` → producción).
- URL: **https://e-turismo-seguro.desab2026.workers.dev** (Worker `e-turismo-seguro`, cuenta `desab2026`). Sin dominio propio aún.
- Build `npx opennextjs-cloudflare build` · Deploy `npx opennextjs-cloudflare deploy` (puebla la caché solo) ·
  Preview `npx opennextjs-cloudflare upload` (no usar `wrangler preview`: no existe en wrangler 4).
- Variable de **build** `NEXT_PUBLIC_SITE_URL=https://e-turismo-seguro.desab2026.workers.dev`. Al conectar un
  dominio propio: cambiarla y volver a desplegar (se lee en el build).
- Verificado en producción: todas las rutas 200, destino inexistente 404, robots/sitemap/canonical/OG/JSON-LD con la URL real.
- El nombre del proyecto en Cloudflare debe coincidir con `name` de `wrangler.jsonc` (`e-turismo-seguro`).
- Pendiente: dar de alta el sitio en Google Search Console y enviar `/sitemap.xml`.
- ⚠️ `/admin` es público hasta la Fase 5 (sin login; los cambios no se guardan). No difundir la URL como oficial antes.

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
- **Imágenes:** con fotos en Supabase Storage o Cloudflare Images, devolver en `image-loader.ts` la URL con el ancho
  pedido (hoy las fotos locales no se redimensionan: el móvil descarga la de 1600 px).
- **Componentes:** hechos a mano (réplica del prototipo). Plan acordado: usar **shadcn/ui** (en `src/shared/ui`,
  con el estilo del prototipo) para el admin real en la Fase 5; las páginas públicas se quedan como están.
- **Estilos inline** copiados del prototipo: funcionan, pero cuestan de mantener. Migrarlos a Tailwind es una mejora aparte.
- **Secciones nuevas** (pendiente de definir con el usuario): p. ej. directorio de estaciones de Policía por municipio
  (los datos ya están en `police-stations.ts`) o páginas por municipio con sus enlaces de turismo.

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
